"""The solar rise (spec 4.3): the water's trend while the heater is off.

It is the least-squares slope of the readings of the last 30 minutes, once they span 15. The
decision made from it is `controller.solar_lead_minutes`.
"""

from collections import deque
from datetime import UTC, datetime, timedelta

SPAN = timedelta(minutes=30)
MIN_SPAN = timedelta(minutes=15)


class SolarTrend:
    """Remembers the last half hour of readings taken with the heater off."""

    def __init__(self) -> None:
        """No readings yet; a restart measures again."""
        self._readings: deque[tuple[datetime, float]] = deque()

    def step(self, *, now: datetime, temperature: float | None, heating: bool | None) -> None:
        """One reading; the heater heating restarts the measure."""
        now = now.astimezone(UTC)
        if heating:
            self._readings.clear()
            return
        if temperature is not None:
            self._readings.append((now, temperature))
        while self._readings and self._readings[0][0] < now - SPAN:
            self._readings.popleft()

    def rise_per_minute(self, now: datetime) -> float | None:
        """Degrees per minute, or None with less than 15 minutes of readings."""
        recent = [(at, t) for at, t in self._readings if at >= now.astimezone(UTC) - SPAN]
        if not recent or recent[-1][0] - recent[0][0] < MIN_SPAN:
            return None
        xs = [(at - recent[0][0]).total_seconds() / 60 for at, _ in recent]
        ys = [t for _, t in recent]
        mean_x, mean_y = sum(xs) / len(xs), sum(ys) / len(ys)
        spread = sum((x - mean_x) ** 2 for x in xs)
        return sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys, strict=True)) / spread
