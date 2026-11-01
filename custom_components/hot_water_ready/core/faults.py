"""The fault guard (spec 4.8): four checks that stop heating or report a problem.

- Sensor unavailable: no reading for 5 min. Stops heating; clears by itself 1 min after
  readings are back.
- Not rising: on 30 min, up less than 1 C, below the target; the count restarts at any drop (a
  shower). Stops heating; cleared by "Resolvido" in Repairs or a heating that rises normally.
- No consumption (with a power sensor): on, under 100 W for 5 min. Stops heating; cleared by
  "Resolvido" or by the heater drawing power again.
- Relay stuck (with a power sensor): off, 100 W or more for 5 min. Reported only; clears by
  itself.

The guard is stepped with what Home Assistant sees (the relay's real state, not what was asked
of it) and keeps its state as plain data so a restart resumes it.
"""

from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
from enum import StrEnum
from typing import Any

_EPSILON = 1e-6


class Fault(StrEnum):
    """What can be wrong."""

    SENSOR_UNAVAILABLE = "sensor_unavailable"
    NOT_RISING = "not_rising"
    NO_CONSUMPTION = "no_consumption"
    RELAY_STUCK = "relay_stuck"


BLOCKING = frozenset({Fault.SENSOR_UNAVAILABLE, Fault.NOT_RISING, Fault.NO_CONSUMPTION})
RESOLVABLE = frozenset({Fault.NOT_RISING, Fault.NO_CONSUMPTION})


@dataclass(frozen=True)
class FaultSettings:
    """The thresholds, editable in the advanced options."""

    sensor_timeout_minutes: float = 5.0
    sensor_recovery_minutes: float = 1.0
    not_rising_minutes: float = 30.0
    not_rising_degrees: float = 1.0
    power_watts: float = 100.0
    power_minutes: float = 5.0


@dataclass
class FaultState:
    """What the guard remembers between steps and across restarts."""

    active: frozenset[Fault] = frozenset()
    last_reading: datetime | None = None
    reading_since: datetime | None = None  # when readings came back after a silence
    run_start: datetime | None = None  # when the current heating run (or its count) began
    run_lowest: float | None = None  # the lowest reading since then; rise is measured from it
    low_power_since: datetime | None = None
    high_power_since: datetime | None = None
    started: datetime | None = None  # the guard's first step; a sensor never seen counts from it

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage."""

        def moment(value: datetime | None) -> str | None:
            return None if value is None else value.isoformat()

        return {
            "active": sorted(self.active),
            "last_reading": moment(self.last_reading),
            "reading_since": moment(self.reading_since),
            "run_start": moment(self.run_start),
            "run_lowest": self.run_lowest,
            "low_power_since": moment(self.low_power_since),
            "high_power_since": moment(self.high_power_since),
            "started": moment(self.started),
        }

    @classmethod
    def from_dict(cls, data: object) -> FaultState:
        """Rebuild from `to_dict`'s output; ValueError when it is not that."""
        try:
            if not isinstance(data, dict):
                raise TypeError(type(data).__name__)
            active = data.get("active", [])
            if not isinstance(active, list):
                raise TypeError("active")
            lowest = data.get("run_lowest")
            if lowest is not None and not isinstance(lowest, int | float):
                raise TypeError("run_lowest")
            return cls(
                active=frozenset(Fault(item) for item in active),
                last_reading=_moment(data.get("last_reading")),
                reading_since=_moment(data.get("reading_since")),
                run_start=_moment(data.get("run_start")),
                run_lowest=None if lowest is None else float(lowest),
                low_power_since=_moment(data.get("low_power_since")),
                high_power_since=_moment(data.get("high_power_since")),
                started=_moment(data.get("started")),
            )
        except (TypeError, ValueError) as err:
            msg = f"Unreadable fault state: {err!r}"
            raise ValueError(msg) from err


def _moment(raw: object) -> datetime | None:
    if raw is None:
        return None
    if not isinstance(raw, str):
        raise TypeError("datetime")
    moment = datetime.fromisoformat(raw)
    if moment.tzinfo is None:
        raise ValueError("naive datetime")
    return moment


@dataclass(frozen=True)
class FaultReport:
    """What changed on this step."""

    raised: tuple[Fault, ...] = field(default=())
    cleared: tuple[Fault, ...] = field(default=())


class FaultGuard:
    """Watches one heater."""

    def __init__(self, settings: FaultSettings, state: FaultState | None = None) -> None:
        """Start from saved state, or from nothing."""
        self.settings = settings
        self.state = state or FaultState()

    @property
    def blocks_heating(self) -> bool:
        """Whether a fault that stops heating is active."""
        return bool(self.state.active & BLOCKING)

    def resolve(self, fault: Fault) -> bool:
        """Someone confirmed in Repairs that a fault is fixed ("Resolvido"); True if it was on."""
        if fault not in self.state.active or fault not in RESOLVABLE:
            return False
        self.state.active -= {fault}
        self.state.run_start = None
        self.state.low_power_since = None
        return True

    def step(
        self,
        *,
        now: datetime,
        temperature: float | None,
        relay_on: bool | None,
        power: float | None,
        target: float,
    ) -> FaultReport:
        """Look at the readings now. `power` is None without a power sensor or a reading."""
        now = now.astimezone(UTC)
        before = self.state.active
        if self.state.started is None:
            self.state.started = now
        self._sensor(now, temperature)
        self._rising(now, temperature, relay_on, target)
        self._power(now, relay_on, power)
        after = self.state.active
        return FaultReport(
            raised=tuple(sorted(after - before)), cleared=tuple(sorted(before - after))
        )

    def _set(self, fault: Fault, on: bool) -> None:
        self.state.active = self.state.active | {fault} if on else self.state.active - {fault}

    def _sensor(self, now: datetime, temperature: float | None) -> None:
        state, settings = self.state, self.settings
        if temperature is None:
            state.reading_since = None
            silent_since = state.last_reading or state.started or now
            if now - silent_since >= timedelta(minutes=settings.sensor_timeout_minutes - 1e-9):
                self._set(Fault.SENSOR_UNAVAILABLE, True)
            return
        state.last_reading = now
        if state.reading_since is None:
            state.reading_since = now
        recovered = now - state.reading_since >= timedelta(
            minutes=settings.sensor_recovery_minutes - 1e-9
        )
        if Fault.SENSOR_UNAVAILABLE in state.active and recovered:
            self._set(Fault.SENSOR_UNAVAILABLE, False)

    def _rising(
        self, now: datetime, temperature: float | None, relay_on: bool | None, target: float
    ) -> None:
        state, settings = self.state, self.settings
        if not relay_on or temperature is None:
            state.run_start = None
            state.run_lowest = None
            return
        if state.run_start is None or state.run_lowest is None:
            state.run_start, state.run_lowest = now, temperature
            return
        if temperature < state.run_lowest - _EPSILON:
            # The water dropped (a shower): the count starts again from here.
            state.run_start, state.run_lowest = now, temperature
            return
        rise = temperature - state.run_lowest
        if rise >= settings.not_rising_degrees - _EPSILON:
            self._set(Fault.NOT_RISING, False)  # heating that rises normally clears it
            state.run_start, state.run_lowest = now, temperature
            return
        long_enough = now - state.run_start >= timedelta(minutes=settings.not_rising_minutes - 1e-9)
        if long_enough and temperature < target - _EPSILON:
            self._set(Fault.NOT_RISING, True)

    def _power(self, now: datetime, relay_on: bool | None, power: float | None) -> None:
        state, settings = self.state, self.settings
        if power is None or relay_on is None:
            state.low_power_since = state.high_power_since = None
            return
        wait = timedelta(minutes=settings.power_minutes - 1e-9)
        drawing = power >= settings.power_watts
        if relay_on and not drawing:
            state.low_power_since = state.low_power_since or now
            if now - state.low_power_since >= wait:
                self._set(Fault.NO_CONSUMPTION, True)
        else:
            state.low_power_since = None
            if relay_on and drawing:
                self._set(Fault.NO_CONSUMPTION, False)
        if not relay_on and drawing:
            state.high_power_since = state.high_power_since or now
            if now - state.high_power_since >= wait:
                self._set(Fault.RELAY_STUCK, True)
        else:
            state.high_power_since = None
            self._set(Fault.RELAY_STUCK, False)
