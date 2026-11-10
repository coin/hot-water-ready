"""Learning the heating rate from clean heating runs (spec 4.2).

A run counts (version 1's recorder filter) when it lasted more than 15 min, the water rose more
than 3 C, the sun was down at its start (no solar help), no fault happened, and no water was
drawn (the water never fell more than 1 C below where it started). Its rate is minutes per
degree. The learned rate is the median of the runs of the last 7 days, once there are three.
"""

from collections.abc import Callable, Iterable
from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
import math
from statistics import median
from typing import Any, Literal

from .parsing import aware_datetime, number

MIN_MINUTES = 15.0
MIN_RISE = 3.0
MAX_DIP = 1.0
WINDOW = timedelta(days=7)
MIN_RUNS = 3
JOULES_PER_LITRE_DEGREE = 4186.0
MIN_MANUAL_RATE = 0.5  # minutes per degree a fixed rate may be set to, as in the settings page
MAX_MANUAL_RATE = 60.0

type RateSource = Literal["manual", "learned", "default"]
type TankOrientation = Literal["vertical", "horizontal"]
type ElementHeight = Literal["bottom", "lower_third", "middle"]
ELEMENT_HEIGHTS: dict[ElementHeight, float] = {"bottom": 0.0, "lower_third": 1 / 3, "middle": 0.5}


@dataclass
class Run:
    """The heating run in progress."""

    started: datetime
    start_temperature: float
    lowest: float
    last_temperature: float
    clean: bool  # the sun was down at the start and no fault so far


@dataclass
class RateState:
    """Recent clean runs, as (when it ended, minutes per degree)."""

    runs: list[tuple[datetime, float]] = field(default_factory=list)
    current: Run | None = field(default=None, compare=False)  # not saved: a restart ends a run

    def to_dict(self) -> dict[str, Any]:
        """Plain data for storage."""
        return {"runs": [[at.isoformat(), rate] for at, rate in self.runs]}

    @classmethod
    def from_dict(cls, data: object) -> RateState:
        """Rebuild from `to_dict`'s output; ValueError when it is not that."""
        try:
            if not isinstance(data, dict) or not isinstance(data.get("runs", []), list):
                raise TypeError("runs")
            runs: list[tuple[datetime, float]] = []
            for item in data.get("runs", []):
                if not isinstance(item, list) or len(item) != 2:
                    raise TypeError("run")
                at, rate = item
                runs.append((aware_datetime(at), number(rate)))
            return cls(runs=runs)
        except (TypeError, ValueError) as err:
            msg = f"Unreadable rate state: {err!r}"
            raise ValueError(msg) from err


class RateLearner:
    """Watches heating runs and keeps the clean ones."""

    def __init__(self, state: RateState | None = None) -> None:
        """Start from saved runs, or none."""
        self.state = state or RateState()

    def step(
        self,
        *,
        now: datetime,
        temperature: float | None,
        heating: bool | None,
        sun_up: bool | None,
        fault: bool,
    ) -> bool | None:
        """One look at the element and the water; at the end of a run, whether it was kept."""
        now = now.astimezone(UTC)
        run = self.state.current
        if heating and temperature is not None:
            if run is None:
                self.state.current = Run(
                    started=now,
                    start_temperature=temperature,
                    lowest=temperature,
                    last_temperature=temperature,
                    clean=sun_up is False and not fault,  # an unknown sun is not a sun known down
                )
                return None
            run.lowest = min(run.lowest, temperature)
            run.last_temperature = temperature
            run.clean = run.clean and not fault
            return None
        if run is None:
            return None
        self.state.current = None
        end_temperature = run.last_temperature if temperature is None else temperature
        minutes = (now - run.started).total_seconds() / 60
        rise = end_temperature - run.start_temperature
        kept = (
            run.clean
            and minutes > MIN_MINUTES
            and rise > MIN_RISE
            and run.lowest >= run.start_temperature - MAX_DIP
        )
        if kept:
            self.state.runs.append((now, minutes / rise))
        self.state.runs = [(at, rate) for at, rate in self.state.runs if at > now - WINDOW]
        return kept

    def learned(self, now: datetime) -> float | None:
        """Minutes per degree: the median of the last week's runs, once there are three."""
        recent = [rate for at, rate in self.state.runs if at > now.astimezone(UTC) - WINDOW]
        return median(recent) if len(recent) >= MIN_RUNS else None


def rate_in_use(*, manual: float | None, learned: float | None, default: float) -> float:
    """The rate the lead is worked out with: set by hand, else learned, else the default."""
    if manual:
        return manual
    return learned or default


def rate_source(*, manual: float | None, learned: float | None) -> RateSource:
    """Where `rate_in_use` takes its value from."""
    if manual:
        return "manual"
    return "learned" if learned else "default"


def physics_rate(*, litres: float, element_watts: float) -> float:
    """Minutes per degree to heat the whole tank with the element, nothing lost.

    A check on the learned rate, not a replacement: a probe high in the tank sees the hot layer
    first, so the learned rate is usually lower.
    """
    return litres * JOULES_PER_LITRE_DEGREE / element_watts / 60


def replay(
    samples: Iterable[tuple[datetime, float | None, bool | None]],
    *,
    sun_up: Callable[[datetime], bool | None],
) -> RateState:
    """The clean runs found again in history: (when, water temperature, heating) in time order.

    The same learner and rules as live, except that history keeps no faults, so none is
    assumed; a restart does not end a run here, which is why this can find runs live learning
    lost.
    """
    learner = RateLearner()
    last: datetime | None = None
    for at, temperature, heating in samples:
        learner.step(
            now=at, temperature=temperature, heating=heating, sun_up=sun_up(at), fault=False
        )
        last = at
    if last is not None and learner.state.current is None:
        learner.state.runs = [(at, r) for at, r in learner.state.runs if at > last - WINDOW]
    learner.state.current = None
    return learner.state


def share_above(orientation: TankOrientation, height: float) -> float:
    """The share of the tank's water above `height` (0 the bottom, 1 the top).

    A standing tank's is a straight cut; a lying one's is the part of a circle above a chord.
    """
    height = min(1.0, max(0.0, height))
    if orientation == "vertical":
        return 1 - height
    chord = 2 * height - 1  # the chord's distance from the centre, radius 1, negative below it
    below = math.acos(-chord) + chord * math.sqrt(1 - chord * chord)
    return 1 - below / math.pi


def heated_fraction(orientation: TankOrientation, element: ElementHeight) -> float:
    """The share of the tank above the element: what heats when only that water mixes.

    Heat rises, so the water below the element barely warms.
    """
    return share_above(orientation, ELEMENT_HEIGHTS[element])


def probe_weights(
    orientation: TankOrientation,
    element: ElementHeight,
    *,
    top: float | None,
    middle: float | None,
) -> tuple[float, float]:
    """How much of the heated water each probe stands for: (top, middle), adding to 1.

    The heated water (above the element) splits halfway between the probes: the top probe
    reads the part above, the middle one the part below. Without both heights, half each.
    """
    if top is None or middle is None or top <= middle:
        return 0.5, 0.5
    split = (top + middle) / 2
    heated = share_above(orientation, ELEMENT_HEIGHTS[element])
    upper = share_above(orientation, split)
    if heated <= 0 or upper >= heated:
        return 0.5, 0.5
    return upper / heated, 1 - upper / heated
