"""When the heater runs: windows, the lead and the temperature band (spec 4.1, 4.2, 4.4).

The controller is stepped with the time, the water temperature and the coming ready times, and
answers whether the relay should be on, plus what happened (a window started heating, the water
became ready). Its state is plain data so it survives a restart.
"""

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
from typing import Any, Literal

# The probe reads in 0.1 C steps; compare with a little slack so 43.0 counts as reaching 43.
_EPSILON = 1e-6


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


@dataclass(frozen=True)
class Occurrence:
    """One coming ready time and whose it is."""

    at: datetime
    members: frozenset[str]


@dataclass(frozen=True)
class ControllerEvent:
    """Something the household may be told about."""

    kind: Literal["heating", "ready", "heat_now_ready", "heat_now_timeout"]
    ready_at: datetime
    members: frozenset[str]
    temperature: float
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


@dataclass
class ControllerState:
    """What the controller must remember across steps and restarts."""

    window: Window | None = None
    heating: bool = False
    heat_now: HeatNow | None = None
    # (member, ready time) pairs already told the water is ready. Kept apart from the window,
    # which can close and open again, so nobody is told twice (spec 4.9, 4.10).
    told: frozenset[tuple[str, datetime]] = frozenset()

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
            },
            "told": sorted([member, at.isoformat()] for member, at in self.told),
            "window": None
            if window is None
            else {
                "ready_at": window.ready_at.isoformat(),
                "last_ready_at": window.last_ready_at.isoformat(),
                "end": window.end.isoformat(),
                "members": sorted(window.members),
                "target": window.target,
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
        told: set[tuple[str, datetime]] = set()
        for pair in data.get("told", []):
            if not isinstance(pair, list) or len(pair) != 2 or not isinstance(pair[0], str):
                raise TypeError("told")
            told.add((pair[0], _parse_aware_datetime(pair[1])))
        raw = data.get("window")
        window = None
        if raw is not None:
            ready_at = _parse_aware_datetime(raw["ready_at"])
            members = _parse_name_list(raw["members"])
            # Saved by earlier versions, before "told" was kept apart from the window.
            if "reported" in raw:
                told |= {(member, ready_at) for member in _parse_name_list(raw["reported"])}
            elif raw.get("ready_reported") is True:
                told |= {(member, ready_at) for member in members}
            last = raw.get("last_ready_at")
            window = Window(
                ready_at=ready_at,
                last_ready_at=ready_at if last is None else _parse_aware_datetime(last),
                end=_parse_aware_datetime(raw["end"]),
                members=members,
                target=float(raw["target"]),
            )
        raw_now = data.get("heat_now")
        heat_now = None
        if raw_now is not None:
            heat_now = HeatNow(
                started_at=_parse_aware_datetime(raw_now["started_at"]),
                deadline=_parse_aware_datetime(raw_now["deadline"]),
                target=float(raw_now["target"]),
                requesters=_parse_name_list(raw_now["requesters"]),
                told=_parse_name_list(raw_now["told"]),
                starting=bool(raw_now["starting"]),
            )
        return cls(
            window=window,
            heating=bool(data.get("heating", False)),
            heat_now=heat_now,
            told=frozenset(told),
        )


def _parse_aware_datetime(raw: object) -> datetime:
    if not isinstance(raw, str):
        raise TypeError("datetime")
    moment = datetime.fromisoformat(raw)
    if moment.tzinfo is None:
        raise ValueError("naive datetime")
    return moment


def _parse_name_list(raw: object) -> frozenset[str]:
    if not isinstance(raw, list) or not all(isinstance(item, str) for item in raw):
        raise TypeError("list of names")
    return frozenset(raw)


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

    def request_heat_now(self, now: datetime, requester: str) -> None:
        """Someone asks for hot water now, or joins a request already running.

        The request ends when everyone who asked has been told and the band has finished, when
        it is cancelled, or after the lead cap plus the lead margin, like version 1.
        """
        now = now.astimezone(UTC)
        settings = self.settings
        heat_now = self.state.heat_now
        if heat_now is None:
            limit = timedelta(minutes=settings.lead_cap_minutes + settings.lead_margin_minutes)
            self.state.heat_now = HeatNow(
                started_at=now,
                deadline=now + limit,
                target=settings.target,
                requesters=frozenset({requester}),
            )
        else:
            heat_now.requesters |= {requester}

    def cancel_heat_now(self) -> None:
        """Drop the heat-now request; a window that wants the heater keeps it."""
        self.state.heat_now = None
        if self.state.window is None:
            self.state.heating = False

    def step(
        self, *, now: datetime, temperature: float | None, occurrences: Iterable[Occurrence]
    ) -> Decision:
        """Look at the house now and decide.

        `occurrences` must reach back to the open window's first ready time. Everything is worked
        in UTC: adding minutes to a local time is wall-clock arithmetic in Python, which is an
        hour out across a daylight-saving change.
        """
        now = now.astimezone(UTC)
        ready_times = sorted(
            (Occurrence(o.at.astimezone(UTC), o.members) for o in occurrences),
            key=lambda o: o.at,
        )
        state = self.state
        state.told = frozenset((m, at) for m, at in state.told if at > now - timedelta(days=1))
        self._close_if_done(now)
        events: list[ControllerEvent] = []
        self._time_out_heat_now(now, events)
        if temperature is None:
            # No reading: hold what is happening; the fault guard decides when that ends.
            return Decision(relay_on=state.heating and self._requested(), events=tuple(events))

        if state.window is not None:
            self._follow_ready_times(state.window, now, temperature, ready_times)
        if state.window is None:
            self._open_window(now, temperature, ready_times, events)
        if state.window is not None:
            self._join_close_ones(state.window, ready_times)
        self._start_heat_now(temperature)
        if self._requested():
            self._band(temperature)
            if state.window is not None:
                self._tell_window(state.window, temperature, events)
                self._close_if_done(now)  # a window past its end closes the moment it is ready
            self._tell_heat_now(temperature, events)
        else:
            state.heating = False
        return Decision(relay_on=state.heating, events=tuple(events))

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

    def _tell_heat_now(self, temperature: float, events: list[ControllerEvent]) -> None:
        heat_now = self.state.heat_now
        if heat_now is None:
            return
        waiting = heat_now.requesters - heat_now.told
        if waiting and temperature >= self.settings.target - _EPSILON:
            heat_now.told |= waiting
            events.append(
                ControllerEvent("heat_now_ready", heat_now.started_at, waiting, temperature)
            )
        if heat_now.told >= heat_now.requesters and not self.state.heating:
            self.state.heat_now = None  # everyone told and the band has finished

    def _time_out_heat_now(self, now: datetime, events: list[ControllerEvent]) -> None:
        heat_now = self.state.heat_now
        if heat_now is None or now < heat_now.deadline:
            return
        waiting = heat_now.requesters - heat_now.told
        if waiting:
            events.append(
                ControllerEvent("heat_now_timeout", heat_now.started_at, waiting, float("nan"))
            )
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
    ) -> None:
        settings = self.settings
        first = next((o for o in ready_times if o.at + self._grace() > now), None)
        if first is None:
            return
        lead = lead_minutes(settings, temperature)
        if now < first.at - timedelta(minutes=lead):
            return
        self.state.window = Window(
            ready_at=first.at,
            last_ready_at=first.at,
            end=first.at + self._grace(),
            members=first.members,
            target=settings.target,
            member_times=dict.fromkeys(first.members, first.at),
        )
        if temperature < settings.target - _EPSILON:
            self.state.heating = True
            events.append(
                ControllerEvent(
                    "heating", first.at, first.members, temperature, minutes=round(lead)
                )
            )

    def _follow_ready_times(
        self, window: Window, now: datetime, temperature: float, ready_times: list[Occurrence]
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
        not_due_yet = now < first - timedelta(minutes=lead_minutes(self.settings, temperature))
        if later_start and not self.state.heating and not_due_yet:
            self._close()

    def _join_close_ones(self, window: Window, ready_times: list[Occurrence]) -> None:
        """Take in the next ready times that keep the heater heating through (spec 4.1).

        One joins when its own window would start less than the keep-heating-through gap after
        this one ends. Its start is judged with the water at the target, where it will be by
        then, so the answer does not depend on how cold the water happens to be now.
        """
        settings = self.settings
        lead = timedelta(minutes=lead_minutes(settings, settings.target))
        gap = timedelta(minutes=settings.keep_heating_gap_minutes)
        for occurrence in ready_times:
            if occurrence.at <= window.last_ready_at:
                continue
            if occurrence.at - lead - window.end >= gap:
                break
            for member in occurrence.members:
                window.member_times.setdefault(member, occurrence.at)
            window.members |= occurrence.members
            window.last_ready_at = occurrence.at
            window.end = occurrence.at + self._grace()

    # ------------------------------------------------------------------ band

    def _band(self, temperature: float) -> None:
        """Stop at target + margin; restart at target - margin.

        A request that starts below the target (a window opening, heat now pressed, or the target
        raised while one is running) heats straight to target + margin, even from inside the band.
        """
        settings = self.settings
        state = self.state
        target, margin = settings.target, settings.margin
        for request in (state.window, state.heat_now):
            if request is not None and request.target != target:
                request.target = target
                if temperature < target - _EPSILON:
                    state.heating = True
        if state.heating and temperature >= target + margin - _EPSILON:
            state.heating = False
        elif (
            not state.heating
            and temperature <= target - margin + _EPSILON
            and temperature < target - _EPSILON
        ):
            state.heating = True

    def _tell_window(
        self, window: Window, temperature: float, events: list[ControllerEvent]
    ) -> None:
        """Ready at the target: tell each member of the window, once per ready time."""
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
