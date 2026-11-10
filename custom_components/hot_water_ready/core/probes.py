"""Whether each probe still measures the water (the probe check).

A probe can come loose from its pocket, or come unglued and half out of it: it still rises when the
water heats, only slower, and it cools towards the air. Its readings at rest are too noisy to tell
(the sun on the tank, water drawn, the layers mixing), but a heat is a known input, so each probe's
speed over a heat is compared with its own normal, and with physics.

Only comparable heats are judged: clean (the rate learner kept the run), at least 45 minutes long
(a top-up near the target is slow on the top probe by nature), and, with two probes, starting from a
mixed tank, where both rise together. A probe judged slow on two such heats running is suspect; a
normal heat clears it. Separately, the top colder than the middle for half an hour cannot be water
(hot water rises), so the two disagree.
"""

from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
from enum import StrEnum
from statistics import median
from typing import Any

from .parsing import number, optional_aware_datetime

SLOW_FACTOR = 1.25  # slower than its own normal, or than physics, by this much is slow
STRIKES = 2  # slow heats in a row before a probe is suspect
MIN_MINUTES = 45.0  # shorter heats are top-ups: not comparable
MIXED = 2.0  # the probes start within this of each other: the tank is mixed
APART = 3.0  # from a mixed start, one rising this much less than the other is slow
INVERTED = 3.0  # the top colder than the middle by this...
INVERTED_MINUTES = 30.0  # ...for this long: the probes disagree
AGREE = 1.0  # back within this of the middle (or warmer): they agree again
HISTORY = 10  # normal heats kept per probe
MIN_HISTORY = 3  # normal heats a probe needs before its own normal counts


class Probe(StrEnum):
    """Which probe is suspect; BOTH when they disagree and either could be wrong."""

    TOP = "top"
    MIDDLE = "middle"
    BOTH = "both"


@dataclass
class _Run:
    started: datetime
    top: float | None
    middle: float | None
    last_top: float | None
    last_middle: float | None


@dataclass
class ProbeState:
    """What the check remembers: each probe's normal heats, its slow streak, who is suspect."""

    rates: dict[Probe, list[float]] = field(
        default_factory=lambda: {Probe.TOP: [], Probe.MIDDLE: []}
    )
    strikes: dict[Probe, int] = field(default_factory=lambda: {Probe.TOP: 0, Probe.MIDDLE: 0})
    suspect: frozenset[Probe] = frozenset()
    inverted_since: datetime | None = None
    current: _Run | None = field(default=None, compare=False)  # not saved: a restart ends a run

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage."""
        return {
            "rates": {probe.value: list(rates) for probe, rates in self.rates.items()},
            "strikes": {probe.value: count for probe, count in self.strikes.items()},
            "suspect": sorted(self.suspect),
            "inverted_since": None
            if self.inverted_since is None
            else self.inverted_since.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: object) -> ProbeState:
        """Rebuild from `to_dict`'s output; ValueError when it is not that."""
        try:
            if not isinstance(data, dict):
                raise TypeError(type(data).__name__)
            state = cls()
            for probe in (Probe.TOP, Probe.MIDDLE):
                rates = data.get("rates", {}).get(probe.value, [])
                if not isinstance(rates, list):
                    raise TypeError("rates")
                state.rates[probe] = [number(rate) for rate in rates]
                state.strikes[probe] = int(data.get("strikes", {}).get(probe.value, 0))
            suspect = data.get("suspect", [])
            if not isinstance(suspect, list):
                raise TypeError("suspect")
            state.suspect = frozenset(Probe(item) for item in suspect)
            state.inverted_since = optional_aware_datetime(data.get("inverted_since"))
            return state
        except (AttributeError, TypeError, ValueError) as err:
            msg = f"Unreadable probe state: {err!r}"
            raise ValueError(msg) from err


@dataclass(frozen=True)
class ProbeReport:
    """What changed on this step."""

    raised: tuple[Probe, ...] = ()
    cleared: tuple[Probe, ...] = ()


class ProbeWatch:
    """Watches one heater's probes."""

    def __init__(self, state: ProbeState | None = None) -> None:
        """Start from saved state, or from nothing."""
        self.state = state or ProbeState()

    def resolve(self, probe: Probe) -> bool:
        """Someone confirmed in Repairs that the probe is fixed; True if it was suspect."""
        if probe not in self.state.suspect:
            return False
        self.state.suspect -= {probe}
        for each in (Probe.TOP, Probe.MIDDLE) if probe == Probe.BOTH else (probe,):
            self.state.strikes[each] = 0
        self.state.inverted_since = None
        return True

    def step(
        self,
        *,
        now: datetime,
        top: float | None,
        middle: float | None,
        heating: bool | None,
        run_kept: bool | None,
        physics_slow: float | None,
    ) -> ProbeReport:
        """One look at the probes; `run_kept` is the rate learner's verdict on a run that just
        ended (None while none did), and `physics_slow` the whole tank's minutes per degree."""
        now = now.astimezone(UTC)
        before = self.state.suspect
        self._watch_inversion(now, top, middle)
        run = self.state.current
        if heating and top is not None:
            if run is None:
                self.state.current = _Run(now, top, middle, top, middle)
            else:
                run.last_top = top
                run.last_middle = middle if middle is not None else run.last_middle
        elif run is not None:
            self.state.current = None
            if run_kept:
                self._judge(run, now, top, middle, physics_slow)
        after = self.state.suspect
        return ProbeReport(
            raised=tuple(p for p in Probe if p in after - before),
            cleared=tuple(p for p in Probe if p in before - after),
        )

    def _watch_inversion(self, now: datetime, top: float | None, middle: float | None) -> None:
        if top is None or middle is None:
            return
        if top < middle - INVERTED:
            since = self.state.inverted_since = self.state.inverted_since or now
            if now - since >= timedelta(minutes=INVERTED_MINUTES):
                self.state.suspect |= {Probe.BOTH}
        elif top >= middle - AGREE:
            self.state.inverted_since = None
            self.state.suspect -= {Probe.BOTH}

    def _judge(
        self,
        run: _Run,
        now: datetime,
        top: float | None,
        middle: float | None,
        physics_slow: float | None,
    ) -> None:
        minutes = (now - run.started).total_seconds() / 60
        if minutes < MIN_MINUTES:
            return
        two = run.middle is not None and (middle is not None or run.last_middle is not None)
        mixed = run.top is None or run.middle is None or abs(run.top - run.middle) <= MIXED
        if two and not mixed:
            return  # a stratified start: the probes do not rise together
        rises: dict[Probe, float] = {}
        ends = {Probe.TOP: top if top is not None else run.last_top}
        starts = {Probe.TOP: run.top}
        if two:
            ends[Probe.MIDDLE] = middle if middle is not None else run.last_middle
            starts[Probe.MIDDLE] = run.middle
        for probe, end in ends.items():
            start = starts[probe]
            if start is not None and end is not None:
                rises[probe] = end - start
        behind = None
        if len(rises) == 2:
            low = min(rises, key=lambda probe: rises[probe])
            high = Probe.MIDDLE if low == Probe.TOP else Probe.TOP
            if rises[high] - rises[low] > APART:
                behind = low
        for probe, rise in rises.items():
            rate = minutes / rise if rise > 0 else float("inf")
            normal = self.state.rates[probe]
            slow = (
                probe == behind
                or (len(normal) >= MIN_HISTORY and rate > median(normal) * SLOW_FACTOR)
                or (physics_slow is not None and rate > physics_slow * SLOW_FACTOR)
            )
            if slow:
                self.state.strikes[probe] += 1
                if self.state.strikes[probe] >= STRIKES:
                    self.state.suspect |= {probe}
                continue
            self.state.strikes[probe] = 0
            self.state.rates[probe] = [*normal, rate][-HISTORY:]
            self.state.suspect -= {probe}
