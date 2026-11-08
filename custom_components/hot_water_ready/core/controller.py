"""When the heater runs: windows, the lead and the temperature band (spec 4.1, 4.2, 4.4).

The controller is stepped with the time, the water temperature and the coming ready times, and
answers whether the relay should be on, plus what happened (a window started heating, the water
became ready). Its state is plain data so it survives a restart.
"""

from collections.abc import Iterable, Sequence
from dataclasses import dataclass, field, replace
from datetime import UTC, datetime, timedelta
from typing import Any, Literal

from .cluster import ClusterTarget, Tank, cluster_target
from .parsing import aware_datetime, flag, name_list, number, optional_aware_datetime

# The probe reads in 0.1 C steps; compare with a little slack so 43.0 counts as reaching 43.
_EPSILON = 1e-6
MAX_KEEP_HOT_MINUTES = 120.0  # the longest heat now keeps the water hot after the message


@dataclass(frozen=True)
class Settings:
    """The heater's tunable numbers. Defaults follow version 1's seed values."""

    target: float = 42.0
    margin: float = 1.0
    rate_minutes_per_degree: float = 7.0
    lead_margin_minutes: float = 15.0
    lead_cap_minutes: float = 240.0
    grace_minutes: float = 15.0
    keep_heating_gap_minutes: float = 40.0
    keep_hot_minutes: float = 5.0  # heat now keeps the band this long after the message
    solar_aware: bool = False  # apply the solar-aware lead (spec 4.3); off, it is only recorded
    tank: Tank | None = None  # with it, a cluster the store cannot carry heats higher (spec 4.5)

    def with_target(self, target: float) -> Settings:
        """The same settings aiming at another target, such as a raised cluster's."""
        return replace(self, target=target)


@dataclass(frozen=True)
class Occurrence:
    """One coming ready time and whose it is."""

    at: datetime
    members: frozenset[str]


@dataclass(frozen=True)
class ControllerEvent:
    """Something the household may be told about."""

    kind: Literal["heating", "ready", "heat_now_ready", "heat_now_timeout"]
    ready_at: datetime  # the ready time it is about; for heat now, when it was asked
    members: frozenset[str]
    temperature: float | None  # None when there is no reading to report (a timeout)
    minutes: int = 0


@dataclass
class Window:
    """The window being served: from when it opened to a grace after its last ready time.

    Ready times close together share one window (spec 4.1), so it can hold several.
    """

    ready_at: datetime
    last_ready_at: datetime
    end: datetime
    members: frozenset[str]
    target: float
    # Whether the window itself wants the element on, apart from any heat-now request, so a
    # cancelled request hands the relay back to what the window wants.
    wants_heat: bool = False
    # Each member's own ready time in the window; rebuilt from the ready times every step.
    member_times: dict[str, datetime] = field(default_factory=dict, compare=False)

    def ready_for(self, member: str) -> tuple[str, datetime]:
        """The (member, ready time) pair a "ready" message is about."""
        return member, self.member_times.get(member, self.ready_at)


@dataclass
class HeatNow:
    """A request for hot water as soon as possible (spec 4.6), from one or more people."""

    started_at: datetime
    deadline: datetime
    target: float
    requesters: frozenset[str]
    told: frozenset[str] = frozenset()
    starting: bool = True  # pressed, not yet looked at by a step
    # How long to keep the water hot after the message: the longest anyone asked for.
    keep_minutes: float = 0.0
    # Until when; set when someone is told, and moved on when someone else is told later.
    keep_until: datetime | None = None


@dataclass
class ControllerState:
    """What the controller must remember across steps and restarts."""

    window: Window | None = None
    heating: bool = False
    heat_now: HeatNow | None = None
    # (member, ready time) pairs already told the water is ready. Kept apart from the window,
    # which can close and open again, so nobody is told twice (spec 4.9, 4.10).
    told: frozenset[tuple[str, datetime]] = frozenset()
    # (member, ready time) pairs already told the water is heating, for the same reason.
    told_heating: frozenset[tuple[str, datetime]] = frozenset()
    # Switched off now: no window opens before this, the end of the window that was skipped.
    off_until: datetime | None = None

    def all_told(self, window: Window) -> bool:
        """Whether every member of the window has been told the water is ready."""
        return all(window.ready_for(member) in self.told for member in window.members)

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage."""
        window = self.window
        heat_now = self.heat_now
        return {
            "heating": self.heating,
            "heat_now": None
            if heat_now is None
            else {
                "started_at": heat_now.started_at.isoformat(),
                "deadline": heat_now.deadline.isoformat(),
                "target": heat_now.target,
                "requesters": sorted(heat_now.requesters),
                "told": sorted(heat_now.told),
                "starting": heat_now.starting,
                "keep_minutes": heat_now.keep_minutes,
                "keep_until": None
                if heat_now.keep_until is None
                else heat_now.keep_until.isoformat(),
            },
            "told": sorted([member, at.isoformat()] for member, at in self.told),
            "told_heating": sorted([member, at.isoformat()] for member, at in self.told_heating),
            "off_until": None if self.off_until is None else self.off_until.isoformat(),
            "window": None
            if window is None
            else {
                "ready_at": window.ready_at.isoformat(),
                "last_ready_at": window.last_ready_at.isoformat(),
                "end": window.end.isoformat(),
                "members": sorted(window.members),
                "target": window.target,
                "wants_heat": window.wants_heat,
            },
        }

    @classmethod
    def from_dict(cls, data: object) -> ControllerState:
        """Rebuild from `to_dict`'s output; ValueError when it is not that."""
        try:
            return cls._parse(data)
        except (AttributeError, KeyError, TypeError, ValueError) as err:
            msg = f"Unreadable controller state: {err!r}"
            raise ValueError(msg) from err

    @classmethod
    def _parse(cls, data: object) -> ControllerState:
        if not isinstance(data, dict):
            raise TypeError(type(data).__name__)
        told = _parse_pairs(data.get("told", []))
        told_heating = _parse_pairs(data.get("told_heating", []))
        raw = data.get("window")
        window = None
        if raw is not None:
            ready_at = aware_datetime(raw["ready_at"])
            members = name_list(raw["members"])
            # Saved by earlier versions, before "told" was kept apart from the window.
            if "reported" in raw:
                told |= {(member, ready_at) for member in name_list(raw["reported"])}
            elif raw.get("ready_reported") is True:
                told |= {(member, ready_at) for member in members}
            last = raw.get("last_ready_at")
            window = Window(
                ready_at=ready_at,
                last_ready_at=ready_at if last is None else aware_datetime(last),
                end=aware_datetime(raw["end"]),
                members=members,
                target=number(raw["target"]),
                wants_heat=flag(raw.get("wants_heat", data.get("heating", False))),
            )
        raw_now = data.get("heat_now")
        heat_now = None
        if raw_now is not None:
            heat_now = HeatNow(
                started_at=aware_datetime(raw_now["started_at"]),
                deadline=aware_datetime(raw_now["deadline"]),
                target=number(raw_now["target"]),
                requesters=name_list(raw_now["requesters"]),
                told=name_list(raw_now["told"]),
                starting=flag(raw_now["starting"]),
                # Saved by earlier versions, before the time to keep it hot existed.
                keep_minutes=number(raw_now.get("keep_minutes", Settings.keep_hot_minutes)),
                keep_until=optional_aware_datetime(raw_now.get("keep_until")),
            )
        return cls(
            window=window,
            heating=flag(data.get("heating", False)),
            heat_now=heat_now,
            off_until=optional_aware_datetime(data.get("off_until")),
            told=frozenset(told),
            told_heating=frozenset(told_heating),
        )


def _parse_pairs(raw: object) -> set[tuple[str, datetime]]:
    if not isinstance(raw, list):
        raise TypeError("pairs")
    pairs: set[tuple[str, datetime]] = set()
    for pair in raw:
        if not isinstance(pair, list) or len(pair) != 2 or not isinstance(pair[0], str):
            raise TypeError("pair")
        pairs.add((pair[0], aware_datetime(pair[1])))
    return pairs


@dataclass(frozen=True)
class Decision:
    """The relay as the controller wants it, and what happened on this step."""

    relay_on: bool
    events: tuple[ControllerEvent, ...] = field(default=())


def lead_minutes(settings: Settings, temperature: float) -> float:
    """Minutes before a ready time to start heating (spec 4.2).

    (target - water) x rate + margin, never below nothing and never above the cap, so warm water
    shortens the lead to nothing.
    """
    lead = (settings.target - temperature) * settings.rate_minutes_per_degree
    return min(settings.lead_cap_minutes, max(0.0, lead + settings.lead_margin_minutes))


def solar_lead_minutes(
    settings: Settings, temperature: float, rise: float | None, minutes_to_ready: float
) -> float:
    """The lead with the sun's help counted (spec 4.3).

    Nothing when the sun alone gets the water to the target in time, with the lead margin to
    spare; otherwise the lead by the combined rate, heater plus sun; the heater's lead alone when
    the trend (`rise`, degrees per minute) is flat, falling or unknown.
    """
    if rise is None or rise <= 0:
        return lead_minutes(settings, temperature)
    to_go = settings.target - temperature
    if to_go / rise + settings.lead_margin_minutes <= minutes_to_ready:
        return 0.0
    combined = 1 / settings.rate_minutes_per_degree + rise  # degrees per minute
    return lead_minutes(replace(settings, rate_minutes_per_degree=1 / combined), temperature)


def joins(settings: Settings, window_end: datetime, ready_at: datetime) -> bool:
    """Whether a ready time joins a window ending at `window_end` (spec 4.1).

    It joins when its own window would start less than the keep-heating-through gap after this
    one ends. Its start is judged with the water at the target, where it will be by then, so the
    answer does not depend on how cold the water happens to be now. Both moments in UTC.
    """
    lead = timedelta(minutes=lead_minutes(settings, settings.target))
    return ready_at - lead - window_end < timedelta(minutes=settings.keep_heating_gap_minutes)


def window_target(settings: Settings, ready_times: Sequence[Occurrence]) -> ClusterTarget:
    """The target for a window serving these ready times: raised for a cluster (spec 4.5)."""
    return cluster_target(
        settings.tank,
        settings.target,
        showers=sum(len(o.members) for o in ready_times),
        span_minutes=(ready_times[-1].at - ready_times[0].at).total_seconds() / 60,
        month=ready_times[0].at.month,
    )


@dataclass(frozen=True)
class PlannedWindow:
    """A heating window as the coming ready times make it, in UTC (spec 5, 6)."""

    start: datetime  # the first ready time less the lead
    end: datetime  # the last ready time plus the grace
    ready_times: tuple[Occurrence, ...]
    target: float  # raised for a cluster the store cannot carry (spec 4.5)
    needed: float  # what the store would have to be at
    short: bool  # even the maximum temperature cannot carry it: the card warns


def planned_windows(
    settings: Settings, occurrences: Iterable[Occurrence], temperature: float | None
) -> list[PlannedWindow]:
    """The windows the controller would open for these ready times, joined as it joins them.

    The lead is worked out from `temperature`, the water now, or from the restart point when
    there is no reading: how cold the water will be days ahead is not known, so a start is an
    estimate, and the heater may start later when the water is warmer.
    """
    water = settings.target - settings.margin if temperature is None else temperature
    grace = timedelta(minutes=settings.grace_minutes)
    windows: list[list[Occurrence]] = []
    for occurrence in sorted(
        (Occurrence(o.at.astimezone(UTC), o.members) for o in occurrences), key=lambda o: o.at
    ):
        if windows and joins(settings, windows[-1][-1].at + grace, occurrence.at):
            windows[-1].append(occurrence)
        else:
            windows.append([occurrence])
    planned: list[PlannedWindow] = []
    for group in windows:
        cluster = window_target(settings, group)
        lead = lead_minutes(settings.with_target(cluster.target), water)
        planned.append(
            PlannedWindow(
                start=group[0].at - timedelta(minutes=lead),
                end=group[-1].at + grace,
                ready_times=tuple(group),
                target=cluster.target,
                needed=cluster.needed,
                short=cluster.short,
            )
        )
    return planned


WARNING_AHEAD = timedelta(days=1)


def next_warning(windows: Iterable[PlannedWindow], now: datetime) -> PlannedWindow | None:
    """The first window not over yet, within a day, that even the cap cannot carry (spec 4.5)."""
    for window in windows:
        if window.end > now and window.short and window.end <= now + WARNING_AHEAD:
            return window
    return None


def next_heat_start(windows: Iterable[PlannedWindow], now: datetime) -> datetime | None:
    """When heating is planned to start next: the earliest window start after now (mockup A)."""
    return min((window.start for window in windows if window.start > now), default=None)


def minutes_to_ready(settings: Settings, temperature: float | None) -> int | None:
    """About how long heating from `temperature` to the target takes, by the rate."""
    if temperature is None:
        return None
    return max(0, round((settings.target - temperature) * settings.rate_minutes_per_degree))


class Controller:
    """Decides the relay for one heater."""

    def __init__(self, settings: Settings, state: ControllerState | None = None) -> None:
        """Start from saved state, or from nothing."""
        self.settings = settings
        self.state = state or ControllerState()

    def request_heat_now(
        self, now: datetime, requester: str, keep_minutes: float | None = None
    ) -> None:
        """Someone asks for hot water now, or joins a request already running.

        After the message the band keeps the water hot for `keep_minutes` (the settings' time
        when None, at most two hours); with several people the longest wins. The request ends
        when everyone who asked has been told and that time is up, when it is cancelled, or,
        while nobody has been told yet, after the lead cap plus the lead margin, like version 1.
        """
        now = now.astimezone(UTC)
        settings = self.settings
        keep = settings.keep_hot_minutes if keep_minutes is None else keep_minutes
        keep = min(max(keep, 0.0), MAX_KEEP_HOT_MINUTES)
        heat_now = self.state.heat_now
        if heat_now is None:
            limit = timedelta(minutes=settings.lead_cap_minutes + settings.lead_margin_minutes)
            self.state.heat_now = HeatNow(
                started_at=now,
                deadline=now + limit,
                target=settings.target,
                requesters=frozenset({requester}),
                keep_minutes=keep,
            )
        else:
            heat_now.requesters |= {requester}
            heat_now.keep_minutes = max(heat_now.keep_minutes, keep)

    def withdraw_heat_now(self, requester: str) -> None:
        """One person no longer wants heat now; the request ends when nobody is left."""
        heat_now = self.state.heat_now
        if heat_now is None or requester not in heat_now.requesters:
            return
        heat_now.requesters -= {requester}
        if not heat_now.requesters:
            self.cancel_heat_now()

    def switch_off(self, now: datetime, by: Iterable[str] = ()) -> frozenset[str]:
        """Switch the heater off now: the heat-now request ends and the open window is skipped.

        No window opens until the skipped one would have ended; heat now still works. Returns
        who loses out and is to be told: the people who asked and the members of the skipped
        window, but not whoever switched it off (`by`, under every name they go by).
        """
        state = self.state
        lost: frozenset[str] = frozenset()
        if state.heat_now is not None:
            lost |= state.heat_now.requesters
        window = state.window
        if window is not None:
            lost |= window.members
            state.off_until = max(window.end, now.astimezone(UTC))
        state.heat_now = None
        state.window = None
        state.heating = False
        return lost - frozenset(by)

    def cancel_heat_now(self) -> None:
        """Drop the heat-now request; the relay goes back to what an open window wants."""
        self.state.heat_now = None
        window = self.state.window
        self.state.heating = window is not None and window.wants_heat

    def step(
        self,
        *,
        now: datetime,
        temperature: float | None,
        occurrences: Iterable[Occurrence],
        solar_rise: float | None = None,
    ) -> Decision:
        """Look at the house now and decide.

        `occurrences` must reach back to the open window's first ready time. `solar_rise` is the
        water's trend with the heater off, used only when the solar-aware rule is on. Everything
        is worked in UTC: adding minutes to a local time is wall-clock arithmetic in Python, which
        is an hour out across a daylight-saving change.
        """
        now = now.astimezone(UTC)
        ready_times = sorted(
            (Occurrence(o.at.astimezone(UTC), o.members) for o in occurrences),
            key=lambda o: o.at,
        )
        state = self.state
        recent = now - timedelta(days=1)
        state.told = frozenset((m, at) for m, at in state.told if at > recent)
        state.told_heating = frozenset((m, at) for m, at in state.told_heating if at > recent)
        self._close_if_done(now)
        events: list[ControllerEvent] = []
        self._time_out_heat_now(now, events)
        if temperature is None:
            # No reading: hold what is happening; the fault guard decides when that ends.
            return Decision(relay_on=state.heating and self._requested(), events=tuple(events))

        if state.off_until is not None and now >= state.off_until:
            state.off_until = None
        before = None if state.window is None else state.window.members
        if state.window is not None:
            self._follow_ready_times(state.window, now, temperature, ready_times, solar_rise)
        if state.window is None and state.off_until is None:
            self._open_window(now, temperature, ready_times, events, solar_rise)
            before = None if state.window is None else state.window.members
        if state.window is not None:
            self._join_close_ones(state.window, ready_times)
            if before is not None:
                self._tell_joiners(state.window, before, temperature, events)
        self._start_heat_now(temperature)
        if self._requested():
            self._band(temperature, self._served_target(ready_times))
            if state.window is not None:
                self._tell_window(state.window, temperature, events)
                self._close_if_done(now)  # a window past its end closes the moment it is ready
            self._tell_heat_now(now, temperature, events)
        else:
            state.heating = False
        return Decision(relay_on=state.heating, events=self._once(events))

    def _once(self, events: list[ControllerEvent]) -> tuple[ControllerEvent, ...]:
        """Drop "heating" messages for anyone already told it about the same ready time."""
        kept: list[ControllerEvent] = []
        for event in events:
            if event.kind != "heating":
                kept.append(event)
                continue
            members = frozenset(
                m for m in event.members if (m, event.ready_at) not in self.state.told_heating
            )
            self.state.told_heating |= {(m, event.ready_at) for m in members}
            if members:
                kept.append(replace(event, members=members))
        return tuple(kept)

    def _lead(
        self,
        temperature: float,
        ready_at: datetime,
        now: datetime,
        rise: float | None,
        target: float,
    ) -> float:
        """The lead the rule in use gives to `target`: version 1's, or the solar-aware one."""
        settings = self.settings.with_target(target)
        if not settings.solar_aware:
            return lead_minutes(settings, temperature)
        until = (ready_at - now).total_seconds() / 60
        return solar_lead_minutes(settings, temperature, rise, until)

    def _ready_in(self, temperature: float) -> int:
        """Minutes until the water is ready: to the normal target, which is when "ready" is told
        even in a raised window (ticket 10), so the phone and the card give the same figure."""
        return minutes_to_ready(self.settings, temperature) or 0

    def target_now(self) -> float:
        """The highest target asked for now: a raised cluster's, else the normal one."""
        window = self.state.window
        if window is None:
            return self.settings.target
        if self.state.heat_now is None:
            return window.target
        return max(window.target, self.settings.target)

    def stop_point_now(self) -> float:
        """Where heating stops now: the target asked for, plus the margin (spec 4.4, 4.5)."""
        return self.target_now() + self.settings.margin

    def _served_target(self, ready_times: list[Occurrence]) -> float | None:
        """The open window's cluster target, from the ready times it serves now; None without."""
        window = self.state.window
        if window is None:
            return None
        served = [o for o in ready_times if window.ready_at <= o.at <= window.last_ready_at]
        return window_target(self.settings, served).target if served else None

    def _cluster(self, first: Occurrence, ready_times: list[Occurrence]) -> list[Occurrence]:
        """`first` and the ready times after it that will join its window (spec 4.1)."""
        grace = self._grace()
        group = [first]
        for occurrence in ready_times:
            if occurrence.at <= group[-1].at:
                continue
            if not joins(self.settings, group[-1].at + grace, occurrence.at):
                break
            group.append(occurrence)
        return group

    def _requested(self) -> bool:
        """Whether anything asks for hot water now: an open window or a heat-now request."""
        return self.state.window is not None or self.state.heat_now is not None

    # ------------------------------------------------------------------ heat now

    def _start_heat_now(self, temperature: float) -> None:
        heat_now = self.state.heat_now
        if heat_now is None or not heat_now.starting:
            return
        heat_now.starting = False
        if temperature < self.settings.target - _EPSILON:
            self.state.heating = True  # a request below the target heats to target + margin

    def _tell_heat_now(
        self, now: datetime, temperature: float, events: list[ControllerEvent]
    ) -> None:
        heat_now = self.state.heat_now
        if heat_now is None:
            return
        waiting = heat_now.requesters - heat_now.told
        if waiting and temperature >= self.settings.target - _EPSILON:
            heat_now.told |= waiting
            # The time starts at the message, and starts again for whoever is told later.
            restart = now + timedelta(minutes=heat_now.keep_minutes)
            if heat_now.keep_until is None or restart > heat_now.keep_until:
                heat_now.keep_until = restart
            events.append(
                ControllerEvent("heat_now_ready", heat_now.started_at, waiting, temperature)
            )
        keep_until = heat_now.keep_until
        if heat_now.told >= heat_now.requesters and keep_until is not None and now >= keep_until:
            self.cancel_heat_now()  # everyone told and the time is up, even mid-band

    def _time_out_heat_now(self, now: datetime, events: list[ControllerEvent]) -> None:
        heat_now = self.state.heat_now
        # Once someone is told, the time to keep it hot ends the request instead.
        if heat_now is None or now < heat_now.deadline or heat_now.keep_until is not None:
            return
        waiting = heat_now.requesters - heat_now.told
        if waiting:
            events.append(ControllerEvent("heat_now_timeout", heat_now.started_at, waiting, None))
        self.cancel_heat_now()

    # ------------------------------------------------------------------ windows

    def _grace(self) -> timedelta:
        return timedelta(minutes=self.settings.grace_minutes)

    def _close(self) -> None:
        """Close the window; the heater stops unless a heat-now request still wants it."""
        self.state.window = None
        if self.state.heat_now is None:
            self.state.heating = False

    def _close_if_done(self, now: datetime) -> None:
        """Close a window past its end, unless it is still heating towards ready (spec 4.2)."""
        window = self.state.window
        if window is None or now < window.end:
            return
        if self.state.all_told(window) or not self.state.heating:
            self._close()

    def _open_window(
        self,
        now: datetime,
        temperature: float,
        ready_times: list[Occurrence],
        events: list[ControllerEvent],
        rise: float | None,
    ) -> None:
        first = next((o for o in ready_times if o.at + self._grace() > now), None)
        if first is None:
            return
        target = window_target(self.settings, self._cluster(first, ready_times)).target
        lead = self._lead(temperature, first.at, now, rise, target)
        if now < first.at - timedelta(minutes=lead):
            return
        self.state.window = Window(
            ready_at=first.at,
            last_ready_at=first.at,
            end=first.at + self._grace(),
            members=first.members,
            target=target,
            member_times=dict.fromkeys(first.members, first.at),
        )
        if temperature < target - _EPSILON:
            self.state.heating = self.state.window.wants_heat = True
            minutes = self._ready_in(temperature)
            events.append(
                ControllerEvent("heating", first.at, first.members, temperature, minutes=minutes)
            )

    def _tell_joiners(
        self,
        window: Window,
        before: frozenset[str],
        temperature: float,
        events: list[ControllerEvent],
    ) -> None:
        """Members whose ready times join a window already heating are told it is heating."""
        joined = window.members - before
        if not joined or not window.wants_heat:
            return
        minutes = self._ready_in(temperature)
        by_time: dict[datetime, set[str]] = {}
        for member in joined:
            by_time.setdefault(window.member_times.get(member, window.ready_at), set()).add(member)
        for at, members in sorted(by_time.items()):
            events.append(
                ControllerEvent("heating", at, frozenset(members), temperature, minutes=minutes)
            )

    def _follow_ready_times(
        self,
        window: Window,
        now: datetime,
        temperature: float,
        ready_times: list[Occurrence],
        rise: float | None,
    ) -> None:
        """Bring the window in line with the ready times as they are now.

        A ready time can be switched off, removed or moved, or its member go away. The window
        keeps the ones still wanted: those between its first and last ready time, plus any moved
        earlier but not yet past. With none left it closes. When the first one goes and the next
        would not have started yet, it closes too, and opens again when that one's lead says so.
        """
        grace = self._grace()
        wanted = [
            o
            for o in ready_times
            if o.at <= window.last_ready_at and (o.at >= window.ready_at or o.at + grace > now)
        ]
        if not wanted:
            self._close()
            return
        window.member_times = {}
        for occurrence in wanted:
            for member in occurrence.members:
                window.member_times.setdefault(member, occurrence.at)
        window.members = frozenset(window.member_times)
        first, last = wanted[0].at, wanted[-1].at
        later_start = first > window.ready_at
        window.ready_at, window.last_ready_at, window.end = first, last, last + grace
        lead = self._lead(temperature, first, now, rise, window.target)
        not_due_yet = now < first - timedelta(minutes=lead)
        if later_start and not self.state.heating and not_due_yet:
            self._close()

    def _join_close_ones(self, window: Window, ready_times: list[Occurrence]) -> None:
        """Take in the next ready times that keep the heater heating through (spec 4.1)."""
        for occurrence in ready_times:
            if occurrence.at <= window.last_ready_at:
                continue
            if not joins(self.settings, window.end, occurrence.at):
                break
            for member in occurrence.members:
                window.member_times.setdefault(member, occurrence.at)
            window.members |= occurrence.members
            window.last_ready_at = occurrence.at
            window.end = occurrence.at + self._grace()

    # ------------------------------------------------------------------ band

    def _band(self, temperature: float, cluster_target: float | None) -> None:
        """Stop at target + margin; restart at target - margin.

        The window's target is its cluster's (spec 4.5), heat now's the normal one, and the band
        follows the higher of those asked for. A request that starts below its target (a window
        opening, heat now pressed, or a target raised while one is running) heats straight to
        target + margin, even from inside the band.
        """
        settings = self.settings
        state = self.state
        margin = settings.margin
        window = state.window
        heat_now = state.heat_now
        requests: list[tuple[Window | HeatNow | None, float]] = [
            (window, settings.target if cluster_target is None else cluster_target),
            (heat_now, settings.target),
        ]
        for request, wanted in requests:
            if request is not None and request.target != wanted:
                request.target = wanted
                if temperature < wanted - _EPSILON:
                    state.heating = True
                    if request is window:
                        window.wants_heat = True
        target = self.target_now()
        if state.heating and temperature >= target + margin - _EPSILON:
            state.heating = False
            if window is not None:
                window.wants_heat = False
        elif (
            not state.heating
            and temperature <= target - margin + _EPSILON
            and temperature < target - _EPSILON
        ):
            state.heating = True
            if window is not None:
                window.wants_heat = True

    def _tell_window(
        self, window: Window, temperature: float, events: list[ControllerEvent]
    ) -> None:
        """Ready at the target: tell each member of the window, once per ready time.

        Ready is the normal target (spec 4.4), even while a raised cluster heats on above it.
        """
        state = self.state
        waiting = {window.ready_for(member) for member in window.members} - state.told
        if waiting and temperature >= self.settings.target - _EPSILON:
            state.told |= waiting
            # One event per ready time, so each member is told about their own.
            by_time: dict[datetime, set[str]] = {}
            for member, at in waiting:
                by_time.setdefault(at, set()).add(member)
            for at, members in sorted(by_time.items()):
                events.append(ControllerEvent("ready", at, frozenset(members), temperature))
