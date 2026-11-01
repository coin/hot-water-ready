"""A heater at runtime: reads its entities, runs the core controller and switches the relay."""

from collections.abc import Callable
from dataclasses import dataclass, replace
from datetime import date, datetime, time, timedelta
import logging
from typing import Any
import uuid

from homeassistant.auth.models import User
from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from .const import (
    COLOURS,
    CONF_COLOUR,
    CONF_KEEP_HEATING_GAP,
    CONF_PERSON,
    CONF_RECIPIENTS,
    CONF_SWITCH,
    CONF_TEMPERATURE_SENSOR,
    SUBENTRY_MEMBER,
    signal_heater_updated,
)
from .core.controller import Controller, Occurrence, Settings, minutes_to_ready
from .core.household import Away, MemberPlan, household_occurrences
from .core.ready_times import ReadyTime
from .core.status import Status, heater_status
from .storage import HeaterData, HeaterStore, away_to_dict, ready_time_to_dict

_LOGGER = logging.getLogger(__name__)

TICK = timedelta(seconds=30)
HORIZON = timedelta(days=8)  # far enough to find next week's ready time

type Listener = Callable[[], None]


class MemberNotFoundError(LookupError):
    """No member with that id on this heater."""


class ReadyTimeNotFoundError(LookupError):
    """No ready time with that id for this member."""


class AwayDateInThePastError(ValueError):
    """An away's last day cannot be before today."""


@dataclass(frozen=True)
class Member:
    """Someone the heater makes water ready for, from a config subentry."""

    id: str
    name: str
    colour: str
    person: str | None
    recipients: tuple[str, ...] = ()

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
        )


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
        self._controller = Controller(self._settings(), data.controller)

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
    def _switch(self) -> str:
        return str(self.entry.data[CONF_SWITCH])

    @property
    def members(self) -> list[Member]:
        """The heater's members, in the order they were added."""
        return [
            Member.from_subentry(subentry)
            for subentry in self.entry.subentries.values()
            if subentry.subentry_type == SUBENTRY_MEMBER
        ]

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

    def _settings(self) -> Settings:
        options = self.entry.options
        return replace(
            Settings(),
            target=self._data.target,
            margin=self._data.margin,
            keep_heating_gap_minutes=float(
                options.get(CONF_KEEP_HEATING_GAP, Settings().keep_heating_gap_minutes)
            ),
        )

    @property
    def temperature(self) -> float | None:
        """The water temperature now, or None when the sensor has no number."""
        state = self.hass.states.get(self._sensor)
        if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return None
        try:
            return float(state.state)
        except ValueError:
            return None

    @property
    def heating(self) -> bool:
        """Whether the controller wants the element on."""
        return self._controller.state.heating

    @property
    def status(self) -> Status:
        """What the status sensor shows."""
        return heater_status(temperature=self.temperature, target=self.target, heating=self.heating)

    # ------------------------------------------------------------------ ready times

    def ready_times(self, member_id: str) -> list[ReadyTime]:
        """A member's ready times."""
        return list(self._data.ready_times.get(member_id, []))

    def away(self, member_id: str) -> Away:
        """A member's away."""
        return self._data.away.get(member_id, Away())

    def occurrences(self, start: datetime, end: datetime) -> list[Occurrence]:
        """Every member's ready times in [start, end), away skipped, same times together."""
        plans = [
            MemberPlan(member.id, tuple(self.ready_times(member.id)), self.away(member.id))
            for member in self.members
        ]
        return household_occurrences(plans, start=start, end=end)

    def today(self) -> list[Occurrence]:
        """Everyone's ready times today, from midnight to midnight in the house's time zone."""
        midnight = dt_util.start_of_local_day()
        tomorrow = dt_util.start_of_local_day(midnight.date() + timedelta(days=1))
        return self.occurrences(midnight, tomorrow)

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
        """The next ready time from now, of one member or of anyone."""
        now = dt_util.now()
        for occurrence in self.occurrences(now, now + HORIZON):
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

    async def _async_save(self) -> None:
        self._data.controller = self._controller.state
        await self._store.async_save(self._data)

    # ------------------------------------------------------------------ permissions

    def user_member_id(self, user: User) -> str | None:
        """The member whose person belongs to this user, if any."""
        for member in self.members:
            if member.person is None:
                continue
            person = self.hass.states.get(member.person)
            if person is not None and person.attributes.get("user_id") == user.id:
                return member.id
        return None

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

    # ------------------------------------------------------------------ running

    @callback
    def async_start(self) -> None:
        """Follow the sensor and the relay, step every tick, until the entry unloads."""
        self.entry.async_on_unload(
            async_track_state_change_event(
                self.hass, [self._sensor, self._switch], self._on_state_change
            )
        )
        self.entry.async_on_unload(async_track_time_interval(self.hass, self._on_tick, TICK))
        self._step()

    async def async_stop(self) -> None:
        """Before the entry unloads: switch off what this heater switched on, and save.

        Nothing watches the relay once unloaded; a reload picks the saved state up again and
        switches it back on if the window still wants it. (Stopping Home Assistant does not
        unload entries, so a restart does not pass through here.)
        """
        relay = self.hass.states.get(self._switch)
        if self.heating and relay is not None and relay.state == STATE_ON:
            await self.hass.services.async_call(
                "switch", "turn_off", {"entity_id": self._switch}, blocking=True
            )
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
        decision = self._controller.step(
            now=now,
            temperature=self.temperature,
            # From a day back, so the open window's own ready times are always in the list.
            occurrences=self.occurrences(now - timedelta(days=1), now + HORIZON),
        )
        self._apply(decision.relay_on)
        if self._controller.state.to_dict() != before:
            self._data.controller = self._controller.state
            self._store.async_delay_save(self._data)
        self._notify()

    @callback
    def _apply(self, relay_on: bool) -> None:
        """Switch the relay when it differs; a relay that is unavailable is switched when back."""
        state = self.hass.states.get(self._switch)
        if state is None or state.state not in (STATE_ON, STATE_OFF):
            return
        if (state.state == STATE_ON) == relay_on:
            return
        self.hass.async_create_task(
            self.hass.services.async_call(
                "switch",
                "turn_on" if relay_on else "turn_off",
                {"entity_id": self._switch},
                blocking=False,
            ),
            eager_start=True,
        )

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

    def snapshot(self, user: User) -> dict[str, Any]:
        """Everything the card needs, as plain data, for this viewer."""
        temperature = self.temperature
        next_ready = self.next_ready()
        ready_in = None
        if self.heating:  # 0 means it is past the target and finishing: no estimate to show
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
            "next_ready": None
            if next_ready is None
            else {"at": next_ready.at.isoformat(), "members": sorted(next_ready.members)},
            "is_admin": user.is_admin,
            "me": me,
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
