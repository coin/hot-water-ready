"""When the heater runs: windows, the lead and the temperature band (spec 4.1, 4.2, 4.4).

The controller is stepped with the time, the water temperature and the coming ready times, and
answers whether the relay should be on, plus what happened (a window started heating, the water
became ready). Its state is plain data so it survives a restart.
"""

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
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


@dataclass(frozen=True)
class Occurrence:
    """One coming ready time and whose it is."""

    at: datetime
    members: frozenset[str]


@dataclass(frozen=True)
class Event:
    """Something the household may be told about."""

    kind: Literal["heating", "ready"]
    ready_at: datetime
    members: frozenset[str]
    temperature: float
    minutes: int = 0


@dataclass
class Window:
    """The window being served: from when it opened to a grace after its ready time."""

    ready_at: datetime
    end: datetime
    members: frozenset[str]
    target: float
    ready_reported: bool = False


@dataclass
class ControllerState:
    """What the controller must remember across steps and restarts."""

    window: Window | None = None
    heating: bool = False

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage."""
        window = self.window
        return {
            "heating": self.heating,
            "window": None
            if window is None
            else {
                "ready_at": window.ready_at.isoformat(),
                "end": window.end.isoformat(),
                "members": sorted(window.members),
                "target": window.target,
                "ready_reported": window.ready_reported,
            },
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ControllerState:
        """Rebuild from `to_dict`'s output."""
        raw = data.get("window")
        window = (
            None
            if raw is None
            else Window(
                ready_at=datetime.fromisoformat(raw["ready_at"]),
                end=datetime.fromisoformat(raw["end"]),
                members=frozenset(raw["members"]),
                target=float(raw["target"]),
                ready_reported=bool(raw["ready_reported"]),
            )
        )
        return cls(window=window, heating=bool(data.get("heating", False)))


@dataclass(frozen=True)
class Decision:
    """The relay as the controller wants it, and what happened on this step."""

    relay_on: bool
    events: tuple[Event, ...] = field(default=())


def lead_minutes(settings: Settings, temperature: float) -> float:
    """Minutes before a ready time to start heating (spec 4.2).

    (target - water) x rate + margin, never below nothing and never above the cap, so warm water
    shortens the lead to nothing.
    """
    lead = (settings.target - temperature) * settings.rate_minutes_per_degree
    return min(settings.lead_cap_minutes, max(0.0, lead + settings.lead_margin_minutes))


class Controller:
    """Decides the relay for one heater."""

    def __init__(self, settings: Settings, state: ControllerState | None = None) -> None:
        """Start from saved state, or from nothing."""
        self.settings = settings
        self.state = state or ControllerState()

    def step(
        self, *, now: datetime, temperature: float | None, occurrences: Iterable[Occurrence]
    ) -> Decision:
        """Look at the house now and decide."""
        state = self.state
        if state.window is not None and now >= state.window.end:
            state.window = None
            state.heating = False
        if temperature is None:
            # No reading: hold what is happening; the fault guard decides when that ends.
            return Decision(relay_on=state.heating and state.window is not None)

        events: list[Event] = []
        if state.window is None:
            self._open_window(now, temperature, occurrences, events)
        if state.window is not None:
            self._band(state.window, temperature, events)
        else:
            state.heating = False
        return Decision(relay_on=state.heating, events=tuple(events))

    def _open_window(
        self,
        now: datetime,
        temperature: float,
        occurrences: Iterable[Occurrence],
        events: list[Event],
    ) -> None:
        settings = self.settings
        grace = timedelta(minutes=settings.grace_minutes)
        coming = sorted((o for o in occurrences if o.at + grace > now), key=lambda o: o.at)
        if not coming:
            return
        first = coming[0]
        lead = lead_minutes(settings, temperature)
        if now < first.at - timedelta(minutes=lead):
            return
        self.state.window = Window(
            ready_at=first.at, end=first.at + grace, members=first.members, target=settings.target
        )
        if temperature < settings.target - _EPSILON:
            self.state.heating = True
            events.append(
                Event("heating", first.at, first.members, temperature, minutes=round(lead))
            )

    def _band(self, window: Window, temperature: float, events: list[Event]) -> None:
        """Ready at the target; stop at target + margin; restart at target - margin.

        A request that starts below the target (the window opening, or the target raised while
        it is open) heats straight to target + margin, even from inside the band.
        """
        settings = self.settings
        state = self.state
        target, margin = settings.target, settings.margin
        if window.target != target:
            window.target = target
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
        if not window.ready_reported and temperature >= target - _EPSILON:
            window.ready_reported = True
            events.append(Event("ready", window.ready_at, window.members, temperature))
