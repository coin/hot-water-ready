"""The fault guard (spec 4.8): four checks that stop heating or report a problem.

- Sensor unavailable: no reading for 5 min. Stops heating; clears by itself 1 min after
  readings are back.
- Not rising: on 30 min, up less than 1 C, below the target. The count restarts when a shower
  drops the water (0.3 C within 10 min of its last high), but not for a slow fall, which is how a
  dead heater looks. Stops heating; cleared by "Resolvido" in Repairs or a heating that rises
  normally.
- No consumption (with a power sensor): on, under 100 W for 5 min. Stops heating; cleared by
  "Resolvido" or by the heater drawing power again.
- Relay stuck (with a power sensor): off, 100 W or more for 5 min. Reported only; clears after a
  minute without power, or when the power sensor goes away.

The guard is stepped with what Home Assistant sees (the relay's real state, not what was asked
of it) and keeps its state as plain data so a restart resumes it.
"""

from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
from enum import StrEnum
from typing import Any

# Readings come in 0.1 C steps; compare with a little slack so 1.0 C counts as a degree.
_EPSILON = 1e-6
# A shower: the water falls this much within this long of its last high. Slower falls are the
# water cooling, which must not restart the not-rising count.
SHOWER_DROP = 0.3
SHOWER_WINDOW = timedelta(minutes=10)


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
    """What the guard remembers between steps and across restarts.

    The sensor's own timing is not saved: a restart gives the sensor a fresh grace, because its
    readings may take a while to arrive and the time Home Assistant was down is not the sensor's
    silence.
    """

    active: frozenset[Fault] = frozenset()
    run_start: datetime | None = None  # when the current heating run (or its count) began
    run_lowest: float | None = None  # the lowest reading since then; rise is measured from it
    run_peak: float | None = None  # the highest reading since then, and when it was last seen
    run_peak_at: datetime | None = None
    low_power_since: datetime | None = None
    high_power_since: datetime | None = None
    stuck_clear_since: datetime | None = None  # no power while off, since
    # Not saved:
    last_reading: datetime | None = field(default=None, compare=False)
    reading_since: datetime | None = field(default=None, compare=False)  # back after a silence
    started: datetime | None = field(default=None, compare=False)  # the first step since start

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage."""

        def moment(value: datetime | None) -> str | None:
            return None if value is None else value.isoformat()

        return {
            "active": sorted(self.active),
            "run_start": moment(self.run_start),
            "run_lowest": self.run_lowest,
            "run_peak": self.run_peak,
            "run_peak_at": moment(self.run_peak_at),
            "low_power_since": moment(self.low_power_since),
            "high_power_since": moment(self.high_power_since),
            "stuck_clear_since": moment(self.stuck_clear_since),
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
            return cls(
                active=frozenset(Fault(item) for item in active),
                run_start=_moment(data.get("run_start")),
                run_lowest=_reading(data.get("run_lowest")),
                run_peak=_reading(data.get("run_peak")),
                run_peak_at=_moment(data.get("run_peak_at")),
                low_power_since=_moment(data.get("low_power_since")),
                high_power_since=_moment(data.get("high_power_since")),
                stuck_clear_since=_moment(data.get("stuck_clear_since")),
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


def _reading(raw: object) -> float | None:
    if raw is None:
        return None
    if not isinstance(raw, int | float) or isinstance(raw, bool):
        raise TypeError("reading")
    return float(raw)


@dataclass(frozen=True)
class FaultReport:
    """What changed on this step."""

    raised: tuple[Fault, ...] = field(default=())
    cleared: tuple[Fault, ...] = field(default=())


class FaultGuard:
    """Watches one heater."""

    def __init__(self, settings: FaultSettings, state: FaultState | None = None) -> None:
        """Start from saved state, or from nothing; the sensor's grace starts now either way."""
        self.settings = settings
        self.state = state or FaultState()
        self.state.last_reading = self.state.reading_since = self.state.started = None

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
            if now - silent_since >= timedelta(minutes=settings.sensor_timeout_minutes):
                self._set(Fault.SENSOR_UNAVAILABLE, True)
            return
        state.last_reading = now
        if state.reading_since is None:
            state.reading_since = now
        recovered = now - state.reading_since >= timedelta(minutes=settings.sensor_recovery_minutes)
        if Fault.SENSOR_UNAVAILABLE in state.active and recovered:
            self._set(Fault.SENSOR_UNAVAILABLE, False)

    def _rising(
        self, now: datetime, temperature: float | None, relay_on: bool | None, target: float
    ) -> None:
        state, settings = self.state, self.settings
        if not relay_on or temperature is None:
            state.run_start = state.run_lowest = state.run_peak = state.run_peak_at = None
            return
        if (
            state.run_start is None
            or state.run_lowest is None
            or state.run_peak is None
            or state.run_peak_at is None
        ):
            self._restart_count(now, temperature)
            return
        if temperature >= state.run_peak - _EPSILON:
            state.run_peak, state.run_peak_at = temperature, now
        elif (
            temperature <= state.run_peak - SHOWER_DROP + _EPSILON
            and now - state.run_peak_at <= SHOWER_WINDOW
        ):
            self._restart_count(now, temperature)  # a shower: the count starts again
            return
        state.run_lowest = min(state.run_lowest, temperature)
        if temperature - state.run_lowest >= settings.not_rising_degrees - _EPSILON:
            self._set(Fault.NOT_RISING, False)  # heating that rises normally clears it
            self._restart_count(now, temperature)
            return
        long_enough = now - state.run_start >= timedelta(minutes=settings.not_rising_minutes)
        if long_enough and temperature < target - _EPSILON:
            self._set(Fault.NOT_RISING, True)

    def _restart_count(self, now: datetime, temperature: float) -> None:
        state = self.state
        state.run_start, state.run_lowest = now, temperature
        state.run_peak, state.run_peak_at = temperature, now

    def _power(self, now: datetime, relay_on: bool | None, power: float | None) -> None:
        state, settings = self.state, self.settings
        if power is None or relay_on is None:
            # No power reading (or the sensor was removed): nothing to judge a stuck relay by.
            state.low_power_since = state.high_power_since = state.stuck_clear_since = None
            self._set(Fault.RELAY_STUCK, False)
            return
        wait = timedelta(minutes=settings.power_minutes)
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
            state.stuck_clear_since = None
            state.high_power_since = state.high_power_since or now
            if now - state.high_power_since >= wait:
                self._set(Fault.RELAY_STUCK, True)
        elif not relay_on:
            state.high_power_since = None
            state.stuck_clear_since = state.stuck_clear_since or now
            calm = timedelta(minutes=settings.sensor_recovery_minutes)
            if now - state.stuck_clear_since >= calm:
                self._set(Fault.RELAY_STUCK, False)
        else:
            # Switched on: drawing power is expected, so a stuck relay can be neither seen nor
            # ruled out; the report stays as it was until the relay is off again.
            state.high_power_since = state.stuck_clear_since = None
