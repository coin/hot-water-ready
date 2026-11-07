"""A heater at runtime: reads its entities, runs the core controller and switches the relay."""

import asyncio
from collections.abc import Callable
from dataclasses import dataclass, replace
from datetime import date, datetime, time, timedelta
import logging
from typing import Any, NamedTuple
import uuid

from homeassistant.auth.models import User
from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN, UnitOfTemperature
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.sun import is_up
from homeassistant.util import dt as dt_util
from homeassistant.util.unit_conversion import TemperatureConverter

from .actuator import Actuator, ClimateActuator, SwitchActuator
from .const import (
    COLOURS,
    CONF_ADVANCED,
    CONF_CLIMATE,
    CONF_COLOUR,
    CONF_ELEMENT_WATTS,
    CONF_FAULT_RECIPIENTS,
    CONF_HEATER_TYPE,
    CONF_HEATING_RATE,
    CONF_KEEP_HEATING_GAP,
    CONF_MAX_TEMPERATURE,
    CONF_NOTIFY_TARGETS,
    CONF_PERSON,
    CONF_POWER_SENSOR,
    CONF_RECIPIENTS,
    CONF_RICH_NOTIFICATIONS,
    CONF_SOLAR_AWARE,
    CONF_SWITCH,
    CONF_SWITCH_OFF_PEOPLE,
    CONF_TANK_LITRES,
    CONF_TEMPERATURE_SENSOR,
    DEFAULT_MAX_TEMPERATURE,
    DOMAIN,
    HEATER_CLIMATE,
    SUBENTRY_MEMBER,
    signal_heater_updated,
)
from .core.cluster import Tank
from .core.comparison import Recorder, Verdict, verdict
from .core.controller import (
    Controller,
    ControllerEvent,
    Decision,
    Occurrence,
    PlannedWindow,
    Settings,
    lead_minutes,
    minutes_to_ready,
    next_heat_start,
    next_warning,
    planned_windows,
    solar_lead_minutes,
)
from .core.faults import BLOCKING, RESOLVABLE, Fault, FaultGuard, FaultSettings
from .core.household import Away, MemberPlan, household_occurrences
from .core.rate import RateLearner, rate_in_use
from .core.ready_times import ReadyTime
from .core.solar import SolarTrend
from .core.status import Status, heater_status
from .messages import (
    async_message,
    async_nobody_to_tell,
    async_send,
    format_temperature,
    person_targets,
)
from .storage import HeaterData, HeaterStore, away_to_dict, ready_time_to_dict

_LOGGER = logging.getLogger(__name__)

TICK = timedelta(seconds=30)
HORIZON = timedelta(days=8)  # far enough to find next week's ready time

type Listener = Callable[[], None]

NOBODY = ""  # a heat-now request from no one in particular (an automation, voice)


class MemberNotFoundError(LookupError):
    """No member with that id on this heater."""


class ReadyTimeNotFoundError(LookupError):
    """No ready time with that id for this member."""


class AwayDateInThePastError(ValueError):
    """An away's last day cannot be before today."""


class HeatNowRefusedError(RuntimeError):
    """Heat now is refused: a fault stops heating (spec 4.6), or the heater is run by hand."""

    def __init__(self, faults: frozenset[Fault]) -> None:
        """Keep the faults, which are the reason given; none means automatic control is off."""
        super().__init__(", ".join(sorted(faults)) or "manual")
        self.faults = faults


def issue_id(entry_id: str, fault: Fault) -> str:
    """The Repairs entry of one fault of one heater."""
    return f"{entry_id}_{fault.value}"


@dataclass(frozen=True)
class Member:
    """Someone the heater makes water ready for, from a config subentry."""

    id: str
    name: str
    colour: str
    person: str | None
    recipients: tuple[str, ...] = ()
    notify_targets: tuple[str, ...] = ()  # explicit notify entities; empty: find the phones

    @property
    def virtual(self) -> bool:
        """A member with no person behind it, such as Global or Guests."""
        return self.person is None

    @classmethod
    def from_subentry(cls, subentry: ConfigSubentry) -> Member:
        """Read the subentry's fields."""
        return cls(
            id=subentry.subentry_id,
            name=subentry.title,
            colour=str(subentry.data.get(CONF_COLOUR, COLOURS[0])),
            person=subentry.data.get(CONF_PERSON),
            recipients=tuple(subentry.data.get(CONF_RECIPIENTS, ())),
            notify_targets=tuple(subentry.data.get(CONF_NOTIFY_TARGETS, ())),
        )


class Leads(NamedTuple):
    """How long before the next ready time each rule would start heating (spec 4.2, 4.3)."""

    version_1: float
    solar: float
    solar_applied: bool

    @property
    def used(self) -> float:
        """The lead of the rule applied."""
        return self.solar if self.solar_applied else self.version_1


class Heater:
    """The Home Assistant side of one heater."""

    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, store: HeaterStore, data: HeaterData
    ) -> None:
        """Wrap the entry and its stored data; nothing runs until started."""
        self.hass = hass
        self.entry = entry
        self._store = store
        self._data = data
        self._listeners: list[Listener] = []
        self.device_id = ""  # set once the heater's device is registered
        self._unreachable: set[str] = set()  # warned about once, until a message gets through
        self._command_lock = asyncio.Lock()  # one batch of commands to the element at a time
        self._command_failing = False  # a refused command is warned about once
        self._heating_indication = True  # whether the element says when it heats; kept in outages
        self._learner = RateLearner(data.rate)
        self._trend = SolarTrend()
        self._rise: float | None = None  # the solar rise at the last step
        self._recorder = Recorder(data.comparison)
        self._controller = Controller(self._settings(), data.controller)
        self._guard = FaultGuard(self._fault_settings(), data.faults)

    # ------------------------------------------------------------------ what it is

    @property
    def entry_id(self) -> str:
        """The config entry's id, which identifies the heater."""
        return self.entry.entry_id

    @property
    def name(self) -> str:
        """The heater's name, which is the entry title."""
        return self.entry.title

    @property
    def _sensor(self) -> str:
        return str(self.entry.data[CONF_TEMPERATURE_SENSOR])

    @property
    def actuator(self) -> Actuator:
        """What switches the element: a relay, or a thermostat (spec 3.1)."""
        data = self.entry.data
        if data.get(CONF_HEATER_TYPE) == HEATER_CLIMATE:
            return ClimateActuator(str(data[CONF_CLIMATE]))
        return SwitchActuator(str(data[CONF_SWITCH]))

    @property
    def not_rising_checked(self) -> bool:
        """False for a thermostat that reports no heating indication: the check is skipped.

        A property of the device, not of the moment: while the element is unavailable the last
        answer stands, so an outage does not make the note come and go.
        """
        indication = self.actuator.has_heating_indication(self.hass)
        if indication is not None:
            self._heating_indication = indication
        return self._heating_indication

    @property
    def members(self) -> list[Member]:
        """The heater's members, in the order they were added."""
        return [
            Member.from_subentry(subentry)
            for subentry in self.entry.subentries.values()
            if subentry.subentry_type == SUBENTRY_MEMBER
        ]

    def member_names(self) -> dict[str, str]:
        """Each member's name by id."""
        return {member.id: member.name for member in self.members}

    def member(self, member_id: str) -> Member:
        """One member, or MemberNotFoundError."""
        for member in self.members:
            if member.id == member_id:
                return member
        raise MemberNotFoundError(member_id)

    @property
    def target(self) -> float:
        """Ready at or above this temperature."""
        return self._data.target

    @property
    def margin(self) -> float:
        """Stop at target plus this; restart at target minus it."""
        return self._data.margin

    @property
    def learned_rate(self) -> float | None:
        """Minutes per degree learned from the last week's clean runs; None until three."""
        return self._learner.learned(dt_util.now())

    @property
    def rate(self) -> float:
        """The rate the lead is worked out with: set by hand, else learned, else version 1's."""
        manual = self.entry.options.get(CONF_HEATING_RATE)
        return rate_in_use(
            manual=None if manual is None else float(manual),
            learned=self.learned_rate,
            default=Settings().rate_minutes_per_degree,
        )

    @property
    def solar_aware(self) -> bool:
        """Whether the solar-aware lead is applied; off, it is only recorded (spec 4.3)."""
        return bool(self.entry.options.get(CONF_SOLAR_AWARE, False))

    def _settings(self) -> Settings:
        options = self.entry.options
        return replace(
            Settings(),
            target=self._data.target,
            margin=self._data.margin,
            rate_minutes_per_degree=self.rate,
            keep_heating_gap_minutes=float(
                options.get(CONF_KEEP_HEATING_GAP, Settings().keep_heating_gap_minutes)
            ),
            solar_aware=self.solar_aware,
            tank=self._tank(),
        )

    def _tank(self) -> Tank | None:
        """The tank, when both its volume and its element's power are set (spec 3.1, 4.5)."""
        options = self.entry.options
        litres, watts = options.get(CONF_TANK_LITRES), options.get(CONF_ELEMENT_WATTS)
        if not litres or not watts:
            return None
        cap = options.get(CONF_MAX_TEMPERATURE, DEFAULT_MAX_TEMPERATURE)
        return Tank(litres=float(litres), element_watts=float(watts), max_temperature=float(cap))

    def leads(self) -> Leads | None:
        """For the next ready time, from the water now: both rules' leads.

        None without a reading or a ready time. Both are worked out whichever rule is applied.
        """
        temperature, coming = self.temperature, self.next_ready()
        if temperature is None or coming is None:
            return None
        settings = self._controller.settings
        # In UTC: both times share the house's zone, where subtraction is wall-clock time.
        until = (dt_util.as_utc(coming.at) - dt_util.utcnow()).total_seconds() / 60
        return Leads(
            version_1=lead_minutes(settings, temperature),
            solar=solar_lead_minutes(settings, temperature, self._rise, until),
            solar_applied=settings.solar_aware,
        )

    def solar_verdict(self) -> Verdict:
        """The solar comparison over the last 30 days (spec 7)."""
        watts = self.entry.options.get(CONF_ELEMENT_WATTS)
        return verdict(
            self._recorder.state.records,
            now=dt_util.now(),
            element_power_w=float(watts) if watts else None,
        )

    def cluster_warning(self) -> PlannedWindow | None:
        """The next cluster, within a day, that even the maximum temperature cannot carry."""
        now = dt_util.utcnow()
        return next_warning(self.windows_between(now - timedelta(hours=6), now + HORIZON), now)

    def comparison_records(self) -> list[dict[str, Any]]:
        """The per-window record of the last year, as plain data, for the diagnostics."""
        return [record.to_dict() for record in self._recorder.state.records]

    def _fault_settings(self) -> FaultSettings:
        advanced = self.entry.options.get(CONF_ADVANCED, {})
        defaults = FaultSettings()
        return FaultSettings(
            **{
                name: float(advanced.get(name, getattr(defaults, name)))
                for name in FaultSettings.__dataclass_fields__
            }
        )

    @property
    def _power_sensor(self) -> str | None:
        return self.entry.options.get(CONF_POWER_SENSOR) or None

    def _number(self, entity_id: str | None) -> float | None:
        state = None if entity_id is None else self.hass.states.get(entity_id)
        if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return None
        try:
            return float(state.state)
        except ValueError:
            return None

    @property
    def element_heating(self) -> bool | None:
        """Whether the element is heating, as Home Assistant sees it; None when unknown.

        `heating` is what the controller wants; this is what the relay or thermostat reports.
        """
        return self.actuator.heating(self.hass)

    @property
    def faults(self) -> frozenset[Fault]:
        """The faults active now."""
        return self._guard.state.active

    @property
    def automatic(self) -> bool:
        """On: the component runs the heater. Off: it is run by hand and left alone."""
        return self._data.automatic

    async def async_set_automatic(self, on: bool) -> None:
        """Hand the heater to the household, or take it back (spec 4.7)."""
        self._data.automatic = on
        await self._async_saved_and_stepped()

    async def async_resolve_fault(self, fault: Fault) -> None:
        """Someone confirmed in Repairs that the fault is fixed ("Resolvido")."""
        if self._guard.resolve(fault):
            ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(fault))
            await self._async_saved_and_stepped()

    def _issue_id(self, fault: Fault) -> str:
        return issue_id(self.entry_id, fault)

    @callback
    def _sync_issues(self) -> None:
        """Repairs shows exactly the active faults; called at start, after a restart."""
        for fault in Fault:
            if fault in self.faults:
                self._raise_issue(fault)
            else:
                ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(fault))

    @callback
    def _raise_issue(self, fault: Fault) -> None:
        ir.async_create_issue(
            self.hass,
            DOMAIN,
            self._issue_id(fault),
            is_fixable=fault in RESOLVABLE,
            severity=ir.IssueSeverity.ERROR if fault in BLOCKING else ir.IssueSeverity.WARNING,
            translation_key=fault.value,
            translation_placeholders={"heater": self.name},
            data={"entry_id": self.entry_id, "fault": fault.value},
        )

    @property
    def temperature(self) -> float | None:
        """The water temperature now, or None when the sensor has no number."""
        return self._number(self._sensor)

    @property
    def heating(self) -> bool:
        """Whether the controller wants the element on."""
        return self._controller.state.heating

    @property
    def status(self) -> Status:
        """What the status sensor shows: a fault first, then manual, then the water."""
        if self.faults:
            return Status.FAULT
        if not self.automatic:
            return Status.MANUAL
        return heater_status(temperature=self.temperature, target=self.target, heating=self.heating)

    # ------------------------------------------------------------------ ready times

    def ready_times(self, member_id: str) -> list[ReadyTime]:
        """A member's ready times."""
        return list(self._data.ready_times.get(member_id, []))

    def away(self, member_id: str) -> Away:
        """A member's away."""
        return self._data.away.get(member_id, Away())

    def occurrences(self, start: datetime, end: datetime) -> list[Occurrence]:
        """Every member's ready times in [start, end), away skipped, same times together.

        A ready time is a wall-clock time in the house's time zone (spec 4.1), and the core
        places it in the zone of `start`: so `start` goes over to house time first, whatever
        zone the caller used (UTC, or the calendar's).
        """
        start = dt_util.as_local(start)
        plans = [
            MemberPlan(member.id, tuple(self.ready_times(member.id)), self.away(member.id))
            for member in self.members
        ]
        return household_occurrences(plans, start=start, end=end)

    def windows_between(self, start: datetime, end: datetime) -> list[PlannedWindow]:
        """The heating windows of the ready times in [start, end), in UTC (spec 5, 6).

        Their starts are estimated from the water now; see `core.controller.planned_windows`.
        Ready times in a window that was switched off are left out: they get no hot water.
        """
        return planned_windows(
            self._controller.settings, self.planned_occurrences(start, end), self.temperature
        )

    def planned_occurrences(self, start: datetime, end: datetime) -> list[Occurrence]:
        """The ready times in [start, end) that will get hot water: those in a window that was
        switched off are left out. Everything that says what will happen reads these; only the
        controller reads all of them, to know which window was skipped."""
        off_until = self._controller.state.off_until
        return [o for o in self.occurrences(start, end) if off_until is None or o.at >= off_until]

    def _week(self) -> dict[str, Any]:
        """This week, Monday to Sunday in the house's time zone: when the heater may heat."""
        today = dt_util.now().date()
        monday = today - timedelta(days=today.weekday())
        start = dt_util.start_of_local_day(monday)
        end = dt_util.start_of_local_day(monday + timedelta(days=7))
        return {
            "monday": monday.isoformat(),
            "today": today.isoformat(),
            "windows": [
                {
                    "start": dt_util.as_local(window.start).isoformat(),
                    "end": dt_util.as_local(window.end).isoformat(),
                }
                for window in self.windows_between(start, end)
            ],
        }

    def today(self) -> list[Occurrence]:
        """Everyone's ready times today, midnight to midnight in house time; skipped ones out."""
        midnight = dt_util.start_of_local_day()
        tomorrow = dt_util.start_of_local_day(midnight.date() + timedelta(days=1))
        return self.planned_occurrences(midnight, tomorrow)

    async def async_set_away(self, member_id: str, on: bool, until: date | None) -> None:
        """Pause or resume a member's ready times; an end date ends the pause by itself.

        `until` is the last day away and may not be in the past.
        """
        self.member(member_id)
        if on and until is not None and until < dt_util.now().date():
            raise AwayDateInThePastError(until)
        self._data.away[member_id] = Away(on=on, until=until if on else None)
        await self._async_saved_and_stepped()

    @callback
    def _end_expired_aways(self) -> None:
        today = dt_util.now().date()
        expired = [m for m, away in self._data.away.items() if away.expired(today)]
        for member_id in expired:
            self._data.away[member_id] = Away()
        if expired:
            self._store.async_delay_save(self._data)

    def next_ready(self, member_id: str | None = None) -> Occurrence | None:
        """The next ready time from now, of one member or of anyone; skipped ones left out."""
        now = dt_util.now()
        for occurrence in self.planned_occurrences(now, now + HORIZON):
            if member_id is None or member_id in occurrence.members:
                return occurrence
        return None

    async def async_add_ready_time(
        self, member_id: str, at: time, weekdays: frozenset[int], enabled: bool
    ) -> ReadyTime:
        """Add a ready time for a member and act on it at once."""
        self.member(member_id)
        ready = ReadyTime(uuid.uuid4().hex, at, weekdays, enabled)
        self._data.ready_times.setdefault(member_id, []).append(ready)
        await self._async_saved_and_stepped()
        return ready

    async def async_update_ready_time(
        self,
        member_id: str,
        ready_id: str,
        *,
        at: time | None = None,
        weekdays: frozenset[int] | None = None,
        enabled: bool | None = None,
    ) -> ReadyTime:
        """Change a ready time's time, weekdays or on/off; None leaves a field as it is."""
        self.member(member_id)
        ready_times = self._data.ready_times.get(member_id, [])
        for index, ready in enumerate(ready_times):
            if ready.id == ready_id:
                ready_times[index] = ReadyTime(
                    ready.id,
                    ready.time if at is None else at,
                    ready.weekdays if weekdays is None else weekdays,
                    ready.enabled if enabled is None else enabled,
                )
                await self._async_saved_and_stepped()
                return ready_times[index]
        raise ReadyTimeNotFoundError(ready_id)

    async def async_remove_ready_times_at(self, member_id: str, at: time) -> int:
        """Remove a member's ready times at a time of day, whatever their days; how many."""
        found = [ready for ready in self.ready_times(member_id) if ready.time == at]
        for ready in found:
            await self.async_remove_ready_time(member_id, ready.id)
        return len(found)

    async def async_remove_ready_time(self, member_id: str, ready_id: str) -> None:
        """Remove a ready time."""
        self.member(member_id)
        ready_times = self._data.ready_times.get(member_id, [])
        kept = [ready for ready in ready_times if ready.id != ready_id]
        if len(kept) == len(ready_times):
            raise ReadyTimeNotFoundError(ready_id)
        self._data.ready_times[member_id] = kept
        await self._async_saved_and_stepped()

    async def async_set_band(
        self, *, target: float | None = None, margin: float | None = None
    ) -> None:
        """Change the target or the margin."""
        if target is not None:
            self._data.target = target
        if margin is not None:
            self._data.margin = margin
        self._controller.settings = self._settings()
        await self._async_saved_and_stepped()

    async def _async_saved_and_stepped(self) -> None:
        await self._async_save()
        self._step()

    def _collect_states(self) -> None:
        """Put the core states into the data the store saves."""
        self._data.controller = self._controller.state
        self._data.faults = self._guard.state
        self._data.rate = self._learner.state
        self._data.comparison = self._recorder.state

    async def _async_save(self) -> None:
        self._collect_states()
        await self._store.async_save(self._data)

    # ------------------------------------------------------------------ permissions

    def user_member_id(self, user: User) -> str | None:
        """The member whose person belongs to this user, if any."""
        person = self.person_of(user)
        if person is None:
            return None
        return next((m.id for m in self.members if m.person == person), None)

    def can_edit(self, user: User | None, member_id: str) -> bool:
        """Admins edit everyone; a linked member edits only their own (spec 2).

        No user means an automation or Home Assistant itself, which may do anything.
        """
        if user is None:
            return True
        return user.is_admin or self.user_member_id(user) == member_id

    def can_change_settings(self, user: User | None) -> bool:
        """Heater settings are for administrators, automations and Home Assistant (spec 2)."""
        return user is None or user.is_admin

    def person_of(self, user: User) -> str | None:
        """The person entity that belongs to this user, if any."""
        for person in self.hass.states.async_all("person"):
            if person.attributes.get("user_id") == user.id:
                return person.entity_id
        return None

    # ------------------------------------------------------------------ heat now

    def requester_key(self, user: User | None) -> str:
        """Who a heat-now request is from: their member, else their person, else nobody ("").

        From an automation or voice there is no user, and nobody is told (spec 4.6).
        """
        if user is None:
            return NOBODY
        return self.user_member_id(user) or self.person_of(user) or NOBODY

    @property
    def _rich(self) -> bool:
        """Whether mobile_app phones get rich options (a replacing tag); off by default."""
        return bool(self.entry.options.get(CONF_RICH_NOTIFICATIONS, False))

    @property
    def heat_now_requesters(self) -> frozenset[str]:
        """Who asked for heat now and will be told; empty when there is no request."""
        heat_now = self._controller.state.heat_now
        return frozenset() if heat_now is None else heat_now.requesters - {NOBODY}

    async def async_refusal_message(self, err: HeatNowRefusedError) -> str:
        """Why heat now was refused, in Home Assistant's language."""
        if not err.faults:
            return await async_message(self.hass, "heat_now_refused_manual")
        labels = [
            await async_message(self.hass, f"fault_label_{f.value}") for f in sorted(err.faults)
        ]
        return await async_message(self.hass, "heat_now_refused", {"faults": ", ".join(labels)})

    def can_ask_heat_now(self, user: User | None) -> bool:
        """Any member asks (spec 4.6); admins and automations may too."""
        return user is None or user.is_admin or self.user_member_id(user) is not None

    def can_switch_off(self, user: User | None) -> bool:
        """Who may switch the heater off for everyone: admins and the people the options list.

        Anyone who asked may still withdraw their own request.
        """
        if user is None or user.is_admin:
            return True
        return self.person_of(user) in self.entry.options.get(CONF_SWITCH_OFF_PEOPLE, [])

    @property
    def heat_now_running(self) -> bool:
        return self._controller.state.heat_now is not None

    def has_asked_heat_now(self, user: User | None) -> bool:
        return self.requester_key(user) in self.heat_now_requesters

    async def async_heat_now(self, requester: str) -> None:
        """Ask for hot water now, or join the request already running.

        Refused, with the reason, while a fault stops heating (spec 4.6).
        """
        if blocking := self.faults & BLOCKING:
            raise HeatNowRefusedError(blocking)
        if not self.automatic:
            raise HeatNowRefusedError(frozenset())  # nothing would switch the heater on
        self._controller.request_heat_now(dt_util.now(), requester)
        await self._async_saved_and_stepped()

    async def async_cancel_heat_now(self, requester: str | None = None) -> None:
        """Withdraw one person's request, or with no one named drop it for everyone.

        An open window keeps the heater if it wants it.
        """
        if requester is None:
            self._controller.cancel_heat_now()
        else:
            self._controller.withdraw_heat_now(requester)
        await self._async_saved_and_stepped()

    def name_of(self, user: User | None) -> str | None:
        """Who a user is to the household: their member's name, else their person's, else theirs."""
        if user is None:
            return None
        member_id = self.user_member_id(user)
        if member_id is not None:
            return self.member(member_id).name
        person = self.person_of(user)
        state = None if person is None else self.hass.states.get(person)
        return state.name if state is not None else user.name

    async def async_switch_off(self, user: User | None) -> None:
        """Switch the heater off now; everyone who loses out, but whoever did it, is told.

        While it heats, the request and the open window end. Otherwise (a fault, automatic
        control off, the water already hot) only a waiting heat-now request ends, so it cannot
        start heating later on its own; a window holding its water is left alone.
        """
        names = set() if user is None else {self.requester_key(user), self.person_of(user)}
        by = {name for name in names if name}
        heat_now = self._controller.state.heat_now
        if self.status is Status.HEATING:
            lost = self._controller.switch_off(dt_util.now(), by=by)
        elif heat_now is not None:
            lost = heat_now.requesters - by
            self._controller.cancel_heat_now()
        else:
            return
        lost -= {NOBODY}
        await self._async_saved_and_stepped()
        name = self.name_of(user)
        if name is None:
            message = await async_message(self.hass, "switched_off")
        else:
            message = await async_message(self.hass, "switched_off_by", {"name": name})
        for who in sorted(lost):
            await self._async_tell_one(who, message, f"{DOMAIN}_{self.entry_id}_{who}_off")

    def heating_for(self) -> list[tuple[str, datetime]]:
        """The members, and their ready times, the open window heats for; earliest first."""
        window = self._controller.state.window
        if window is None:
            return []
        return sorted(
            ((member, window.ready_for(member)[1]) for member in window.members),
            key=lambda pair: (pair[1], pair[0]),
        )

    # ------------------------------------------------------------------ telling people

    def recipients(self, who: str) -> tuple[str, list[str]] | None:
        """The name and the phones of someone to tell; None when nobody is meant to be told.

        A member: their explicit notify entities, else their person's phones. A virtual member:
        the phones of the people chosen for it, which may be nobody. A person: their phones.
        """
        try:
            member = self.member(who)
        except MemberNotFoundError:
            state = self.hass.states.get(who)
            name = state.name if state is not None else who
            return name, person_targets(self.hass, who)
        if member.notify_targets:
            return member.name, list(member.notify_targets)
        if member.person is not None:
            return member.name, person_targets(self.hass, member.person)
        if not member.recipients:
            return None
        targets = sorted(
            {t for person in member.recipients for t in person_targets(self.hass, person)}
        )
        return member.name, targets

    async def _async_save_then_tell(self, events: tuple[ControllerEvent, ...]) -> None:
        """Who was told is on disk before the messages go, so a restart never repeats one."""
        await self._async_save()
        await self._async_tell(events)

    async def async_fault_recipients(self) -> list[str]:
        """The people told about faults: those chosen in the options, else every admin."""
        chosen = self.entry.options.get(CONF_FAULT_RECIPIENTS) or []
        if chosen:
            return list(chosen)
        people: list[str] = []
        for person in self.hass.states.async_all("person"):
            user_id = person.attributes.get("user_id")
            user = None if user_id is None else await self.hass.auth.async_get_user(user_id)
            if user is not None and user.is_admin:
                people.append(person.entity_id)
        return sorted(people)

    async def _async_tell_fault(self, faults: tuple[Fault, ...]) -> None:
        for fault in faults:
            message = await async_message(self.hass, f"fault_{fault.value}", {"heater": self.name})
            for person in await self.async_fault_recipients():
                # One tag per kind: a second fault must not replace the first on the phone.
                tag = f"{DOMAIN}_{self.entry_id}_fault_{fault.value}"
                await self._async_tell_one(person, message, tag)

    async def _async_tell(self, events: tuple[ControllerEvent, ...]) -> None:
        """Turn what happened into messages for the people it concerns (spec 4.9)."""
        for event in events:
            key, placeholders = self._message_for(event)
            message = await async_message(self.hass, key, placeholders)
            # One tag per person and ready time: "Duche pronto" replaces "a aquecer" on the phone.
            for who in sorted(event.members - {NOBODY}):
                tag = f"{DOMAIN}_{self.entry_id}_{who}_{event.ready_at.timestamp():.0f}"
                await self._async_tell_one(who, message, tag)

    def _message_for(self, event: ControllerEvent) -> tuple[str, dict[str, str]]:
        match event.kind:
            case "heating":
                return "window_heating", {"heater": self.name, "minutes": str(event.minutes)}
            case "ready" | "heat_now_ready":
                # A ready event always carries the reading that made it ready.
                assert event.temperature is not None  # noqa: S101
                return "ready", {"temperature": format_temperature(self.hass, event.temperature)}
            case "heat_now_timeout":
                return "heat_now_timeout", {}

    async def _async_tell_one(self, who: str, message: str, tag: str) -> None:
        found = self.recipients(who)
        if found is None:
            return  # a virtual member with nobody chosen: not an error
        name, targets = found
        if not targets:
            reason = "no_target"
        elif await async_send(
            self.hass, targets, self.name, message, tag=tag if self._rich else None
        ):
            self._unreachable.discard(who)
            return
        else:
            reason = "send_failed"
        first_time = who not in self._unreachable
        self._unreachable.add(who)
        await async_nobody_to_tell(
            self.hass, who, name, self.name, message, reason=reason, log=first_time
        )

    # ------------------------------------------------------------------ running

    @callback
    def async_start(self) -> None:
        """Follow the sensor and the relay, step every tick, until the entry unloads."""
        watched = [self._sensor, self.actuator.entity_id]
        if self._power_sensor:
            watched.append(self._power_sensor)
        self.entry.async_on_unload(
            async_track_state_change_event(self.hass, watched, self._on_state_change)
        )
        self._sync_issues()
        self.entry.async_on_unload(async_track_time_interval(self.hass, self._on_tick, TICK))
        self._step()

    async def async_stop(self) -> None:
        """Before the entry unloads: switch off what this heater switched on, and save.

        Nothing watches the relay once unloaded; a reload picks the saved state up again and
        switches it back on if the window still wants it. (Stopping Home Assistant does not
        unload entries, so a restart does not pass through here.)
        """
        if self.automatic and self.heating:
            # Unloading must not fail because the element is gone or refuses: errors are logged.
            await self._async_bring_to(on=False)
        await self._async_save()

    @callback
    def _on_state_change(self, _event: Event[EventStateChangedData]) -> None:
        self._step()

    @callback
    def _on_tick(self, _now: datetime) -> None:
        self._step()

    @callback
    def _step(self) -> None:
        self._end_expired_aways()
        now = dt_util.now()
        before = self._controller.state.to_dict()
        temperature, element = self.temperature, self.element_heating
        self._trend.step(now=now, temperature=temperature, heating=element)
        self._rise = self._trend.rise_per_minute(now)
        self._controller.settings = self._settings()  # the learned rate moves with new runs
        if self.automatic:
            decision = self._controller.step(
                now=now,
                temperature=temperature,
                # From a day back, so the open window's own ready times are always in the list.
                occurrences=self.occurrences(now - timedelta(days=1), now + HORIZON),
                solar_rise=self._rise,
            )
        else:
            decision = Decision(relay_on=False)  # run by hand: no plans, nothing to tell
        report = self._guard.step(
            now=now,
            temperature=temperature,
            relay_on=element,
            element_off=self.actuator.told_off(self.hass),
            power=self._number(self._power_sensor),
            target=self._controller.target_now(),
        )
        if self.automatic:
            self._apply(decision.relay_on and not self._guard.blocks_heating)
        for fault in report.raised:
            self._raise_issue(fault)
        for fault in report.cleared:
            ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(fault))
        if report.raised:
            self.entry.async_create_task(self.hass, self._async_tell_fault(report.raised))
        learned = self._learn_and_record(now, temperature, element)
        if report.raised or report.cleared or learned:
            self._collect_states()
            self._store.async_delay_save(self._data)
        events = decision.events
        if self._guard.blocks_heating:
            # Nothing heats during a fault, so "a aquecer" would be untrue.
            events = tuple(e for e in events if e.kind != "heating")
        if events:
            self.entry.async_create_task(self.hass, self._async_save_then_tell(events))
        elif self._controller.state.to_dict() != before:
            self._data.controller = self._controller.state
            self._store.async_delay_save(self._data)
        self._notify()

    def _learn_and_record(
        self, now: datetime, temperature: float | None, element: bool | None
    ) -> bool:
        """Feed the rate learner and the solar record; True when either kept something new."""
        runs, records = len(self._learner.state.runs), len(self._recorder.state.records)
        # A thermostat with no heating indication: what the component asks of it stands in.
        heating = self.heating if element is None else element
        fault = bool(self.faults)
        self._learner.step(
            now=now,
            temperature=temperature,
            heating=heating,
            sun_up=is_up(self.hass, dt_util.as_utc(now)),
            fault=fault,
        )
        if self.automatic:
            self._recorder.step(
                now=now,
                settings=self._controller.settings,
                temperature=temperature,
                rise=self._rise,
                next_ready=self.next_ready(),
                window_open=self._controller.state.window is not None,
                element_on=heating,
                power_w=self._number(self._power_sensor),
                fault=fault,
            )
        else:
            self._recorder.abandon()
        return len(self._learner.state.runs) != runs or len(self._recorder.state.records) != records

    @callback
    def _apply(self, on: bool) -> None:
        """Bring the element to on or off when it differs; an unavailable one is set when back.

        The commands wait for this step to finish (no eager start): a switch that writes its new
        state at once would otherwise run the next step inside this one, half done.
        """
        if self.actuator.calls_for(self.hass, on, self._setpoint()):
            self.entry.async_create_task(self.hass, self._async_bring_to(on=on), eager_start=False)

    def _setpoint(self) -> float:
        """What a heating thermostat is set to: the stop point, in Home Assistant's unit."""
        stop = self._controller.stop_point_now()
        unit = self.hass.config.units.temperature_unit
        return TemperatureConverter.convert(stop, UnitOfTemperature.CELSIUS, unit)

    async def _async_bring_to(self, *, on: bool) -> None:
        """Send the element its commands, one batch at a time.

        The calls are worked out again inside the lock, so a second step that started while the
        first batch was still going sends nothing already sent. A refusal is logged once, until a
        whole batch gets through, and the next step tries again.
        """
        async with self._command_lock:
            failed = False
            for domain, service, data in self.actuator.calls_for(self.hass, on, self._setpoint()):
                try:
                    await self.hass.services.async_call(domain, service, data, blocking=True)
                except HomeAssistantError as err:
                    log = _LOGGER.debug if self._command_failing else _LOGGER.warning
                    log("%s.%s on %s failed: %s", domain, service, data["entity_id"], err)
                    self._command_failing = failed = True
            if not failed:
                self._command_failing = False

    @callback
    def async_add_listener(self, listener: Listener) -> Callable[[], None]:
        """Call `listener` whenever the snapshot may have changed."""
        self._listeners.append(listener)

        @callback
        def remove() -> None:
            self._listeners.remove(listener)

        return remove

    @callback
    def _notify(self) -> None:
        """Tell this heater's entities, and the card subscriptions of its entry, to refresh.

        Subscriptions follow the entry id rather than this object, so they outlive a reload.
        """
        for listener in list(self._listeners):
            listener()
        async_dispatcher_send(self.hass, signal_heater_updated(self.entry_id))

    # ------------------------------------------------------------------ for the card

    def _settings_snapshot(self) -> dict[str, Any]:
        """The settings sheet an administrator sees on the card (spec 6, 7)."""
        solar = self.solar_verdict()
        return {
            "switch_off_people": list(self.entry.options.get(CONF_SWITCH_OFF_PEOPLE, [])),
            "solar_aware": self.solar_aware,
            "solar": {
                "windows": solar.windows,
                "on_time": solar.on_time,
                "minutes_saved": round(solar.minutes_saved),
                "kwh": None if solar.kwh is None else round(solar.kwh, 1),
                "solar_windows": solar.solar_windows,
                "solar_on_time": solar.solar_on_time,
            },
        }

    async def async_set_switch_off_people(self, people: list[str]) -> None:
        """The people who may switch off for everyone, besides admins.

        An option, so the entry reloads (spec 3.1).
        """
        options = {**self.entry.options, CONF_SWITCH_OFF_PEOPLE: people}
        self.hass.config_entries.async_update_entry(self.entry, options=options)

    def next_heat_start(self) -> datetime | None:
        """When heating is planned to start next, for ready times in the coming two days."""
        now = dt_util.utcnow()
        start = next_heat_start(self.windows_between(now, now + timedelta(days=2)), now)
        off_until = self._controller.state.off_until
        if start is not None and off_until is not None and start < off_until:
            return off_until  # switched off: nothing heats before the skipped window would end
        return start

    def snapshot(self, user: User) -> dict[str, Any]:
        """Everything the card needs, as plain data, for this viewer."""
        temperature = self.temperature
        next_ready = self.next_ready()
        ready_in = None
        if self.heating:  # 0 means it is past the target and finishing: no estimate to show
            # To the normal target, as the phone's "heating" message: "ready" is told there.
            ready_in = minutes_to_ready(self._controller.settings, temperature) or None
        me = self.user_member_id(user)
        return {
            "entry_id": self.entry_id,
            "name": self.name,
            "temperature": temperature,
            "target": self.target,
            "margin": self.margin,
            "status": self.status.value,
            "ready_in_minutes": ready_in,
            "next_heat_start": None
            if (start := self.next_heat_start()) is None
            else dt_util.as_local(start).isoformat(),
            "solar_aware": self.solar_aware,
            "next_ready": None
            if next_ready is None
            else {"at": next_ready.at.isoformat(), "members": sorted(next_ready.members)},
            "is_admin": user.is_admin,
            "me": me,
            "can_ask_heat_now": self.can_ask_heat_now(user),
            "faults": sorted(self.faults),
            "not_rising_checked": self.not_rising_checked,
            "element_on": self.element_heating,
            "power_w": self._number(self._power_sensor),
            "heat_now_blocked": bool(self.faults & BLOCKING),
            "automatic": self.automatic,
            "heat_now": None
            if (heat_now := self._controller.state.heat_now) is None
            else {
                "requesters": sorted(self.heat_now_requesters),
                "asked": self.has_asked_heat_now(user),
                # An automation's request names nobody: it keeps heating after the last person.
                "unnamed": NOBODY in heat_now.requesters,
            },
            "viewer": self.requester_key(user) or None,
            "can_switch_off": self.can_switch_off(user),
            "heating_for": [
                {"member": member, "at": dt_util.as_local(at).isoformat()}
                for member, at in self.heating_for()
            ],
            "settings": self._settings_snapshot() if user.is_admin else None,
            "week": self._week() if user.is_admin else None,
            "cluster_warning": None
            if (warning := self.cluster_warning()) is None
            else {
                "at": dt_util.as_local(warning.ready_times[0].at).isoformat(),
                "needed": round(warning.needed),
                "cap": warning.target,
            },
            "today": [
                {"member": member_id, "at": occurrence.at.isoformat()}
                for occurrence in self.today()
                for member_id in sorted(occurrence.members)
            ],
            "members": [
                {
                    "id": member.id,
                    "name": member.name,
                    "colour": member.colour,
                    "can_edit": self.can_edit(user, member.id),
                    "virtual": member.virtual,
                    "away": away_to_dict(self.away(member.id)),
                    "ready_times": [ready_time_to_dict(r) for r in self.ready_times(member.id)],
                    "next_ready": None
                    if (mine := self.next_ready(member.id)) is None
                    else mine.at.isoformat(),
                }
                for member in self.members
            ],
        }
