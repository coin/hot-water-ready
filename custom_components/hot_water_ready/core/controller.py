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
class ControllerEvent:
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
        raw = data.get("window")
        window = None
        if raw is not None:
            ready_at = datetime.fromisoformat(raw["ready_at"])
            end = datetime.fromisoformat(raw["end"])
            if ready_at.tzinfo is None or end.tzinfo is None:
                raise ValueError("naive datetime")
            members = raw["members"]
            if not isinstance(members, list) or not all(isinstance(m, str) for m in members):
                raise TypeError("members")
            window = Window(
                ready_at=ready_at,
                end=end,
                members=frozenset(members),
                target=float(raw["target"]),
                ready_reported=bool(raw["ready_reported"]),
            )
        return cls(window=window, heating=bool(data.get("heating", False)))


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

    def step(
        self, *, now: datetime, temperature: float | None, occurrences: Iterable[Occurrence]
    ) -> Decision:
        """Look at the house now and decide."""
        state = self.state
        self._close_if_done(now)
        if temperature is None:
            # No reading: hold what is happening; the fault guard decides when that ends.
            return Decision(relay_on=state.heating and state.window is not None)

        events: list[ControllerEvent] = []
        if state.window is None:
            self._open_window(now, temperature, occurrences, events)
        if state.window is not None:
            self._band(state.window, temperature, events)
            self._close_if_done(now)  # a late window closes the moment it is ready
        else:
            state.heating = False
        return Decision(relay_on=state.heating, events=tuple(events))

    def _close_if_done(self, now: datetime) -> None:
        """Close a window past its end, unless it is still heating towards ready (spec 4.2)."""
        state = self.state
        window = state.window
        if window is None or now < window.end:
            return
        if window.ready_reported or not state.heating:
            state.window = None
            state.heating = False

    def _open_window(
        self,
        now: datetime,
        temperature: float,
        occurrences: Iterable[Occurrence],
        events: list[ControllerEvent],
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
                ControllerEvent(
                    "heating", first.at, first.members, temperature, minutes=round(lead)
                )
            )

    def _band(self, window: Window, temperature: float, events: list[ControllerEvent]) -> None:
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
            events.append(ControllerEvent("ready", window.ready_at, window.members, temperature))
