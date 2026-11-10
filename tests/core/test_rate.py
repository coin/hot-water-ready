"""Learning the heating rate from clean heating runs (spec 4.2, version 1's recorder filter)."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.rate import (
    RateLearner,
    RateState,
    heated_fraction,
    physics_rate,
    rate_in_use,
    rate_source,
    replay,
)

LISBON = ZoneInfo("Europe/Lisbon")
NIGHT = datetime(2026, 11, 2, 4, 0, tzinfo=LISBON)


def _run(
    learner: RateLearner,
    start: datetime,
    *,
    minutes: int,
    start_temp: float,
    rise_per_minute: float,
    sun_up: bool = False,
    fault: bool = False,
    dip: float = 0.0,
) -> datetime:
    """Heat for `minutes`, one reading a minute, then switch off; `dip` is a draw at minute 1."""
    now = start
    temperature = start_temp
    for minute in range(minutes + 1):
        reading = temperature - (dip if minute == 1 else 0.0)
        learner.step(now=now, temperature=reading, heating=True, sun_up=sun_up, fault=fault)
        now += timedelta(minutes=1)
        temperature += rise_per_minute
    learner.step(now=now, temperature=temperature, heating=False, sun_up=sun_up, fault=False)
    return now


def test_a_clean_run_records_its_rate() -> None:
    learner = RateLearner()
    _run(learner, NIGHT, minutes=40, start_temp=30.0, rise_per_minute=0.2)  # 5 min per degree

    assert [round(rate, 2) for _, rate in learner.state.runs] == [5.0]


def test_the_learned_rate_needs_three_runs_and_is_their_median() -> None:
    learner = RateLearner()
    start = NIGHT
    for rise in (0.2, 0.25, 0.1):  # 5, 4 and 10 min per degree
        start = _run(learner, start, minutes=40, start_temp=30.0, rise_per_minute=rise)
        start += timedelta(hours=8)
        if rise != 0.1:
            assert learner.learned(start) is None

    assert learner.learned(start) == pytest.approx(5.0)


@pytest.mark.parametrize(
    ("kwargs", "why"),
    [
        ({"minutes": 12, "rise_per_minute": 0.5}, "too short: 15 min or more"),
        ({"minutes": 40, "rise_per_minute": 0.05}, "too little rise: more than 3 C"),
        ({"minutes": 40, "rise_per_minute": 0.2, "sun_up": True}, "the sun was up at the start"),
        ({"minutes": 40, "rise_per_minute": 0.2, "fault": True}, "a fault during the run"),
        ({"minutes": 40, "rise_per_minute": 0.2, "dip": 1.5}, "water drawn: a dip below start - 1"),
    ],
)
def test_unclean_runs_are_ignored(kwargs: dict[str, object], why: str) -> None:
    learner = RateLearner()
    _run(learner, NIGHT, start_temp=30.0, **kwargs)  # type: ignore[arg-type]

    assert learner.state.runs == [], why


def test_runs_older_than_a_week_are_forgotten() -> None:
    learner = RateLearner()
    start = NIGHT
    for _ in range(3):
        start = _run(learner, start, minutes=40, start_temp=30.0, rise_per_minute=0.2)
    assert learner.learned(start) is not None

    assert learner.learned(start + timedelta(days=8)) is None


def test_state_round_trips_and_refuses_corrupt_data() -> None:
    learner = RateLearner()
    _run(learner, NIGHT, minutes=40, start_temp=30.0, rise_per_minute=0.2)
    state = learner.state
    assert RateState.from_dict(state.to_dict()) == state

    for bad in (
        {"runs": "x"},
        {"runs": [["2026-11-02T04:00:00", 5.0]]},
        {"runs": [[1, 2]]},
        {"runs": [["2026-11-02T04:00:00+00:00", True]]},
    ):
        with pytest.raises(ValueError, match="rate state"):
            RateState.from_dict(bad)


def test_the_rate_set_by_hand_beats_the_learned_one_which_beats_the_default() -> None:
    assert rate_in_use(manual=8.0, learned=5.0, default=7.0) == 8.0
    assert rate_in_use(manual=None, learned=5.0, default=7.0) == 5.0
    assert rate_in_use(manual=None, learned=None, default=7.0) == 7.0


def test_replaying_history_finds_the_clean_runs_again() -> None:
    """The recalculation: readings and heater changes from history, in time order."""
    samples = []
    now, temperature = NIGHT, 30.0
    samples.append((now, temperature, True))
    for _ in range(40):  # 0.2 C a minute: 5 min per degree
        now += timedelta(minutes=1)
        temperature += 0.2
        samples.append((now, temperature, True))
    samples.append((now + timedelta(minutes=1), temperature + 0.2, False))

    state = replay(samples, sun_up=lambda _at: False)

    assert [round(rate, 2) for _, rate in state.runs] == [5.0]


def test_replaying_keeps_the_learners_rules() -> None:
    """A run that started in daylight is not clean, as when it is learned live."""
    samples = [(NIGHT, 30.0, True), (NIGHT + timedelta(minutes=40), 38.0, True)]
    samples.append((NIGHT + timedelta(minutes=41), 38.0, False))

    assert replay(samples, sun_up=lambda _at: True).runs == []
    assert len(replay(samples, sun_up=lambda _at: False).runs) == 1


def test_replaying_drops_runs_older_than_the_learning_window() -> None:
    old = NIGHT - timedelta(days=8)
    samples = [(old, 30.0, True), (old + timedelta(minutes=40), 38.0, True)]
    samples.append((old + timedelta(minutes=41), 38.0, False))
    samples.append((NIGHT, 38.0, False))

    assert replay(samples, sun_up=lambda _at: False).runs == []


def test_the_physics_rate_is_the_whole_tank_heated_by_the_element() -> None:
    """300 L and 2750 W: 300 x 4186 J / 2750 W = 457 s, about 7.6 min per degree."""
    assert physics_rate(litres=300, element_watts=2750) == pytest.approx(7.61, abs=0.01)


def test_the_rate_in_use_says_where_it_came_from() -> None:
    assert rate_source(manual=6.0, learned=5.3) == "manual"
    assert rate_source(manual=None, learned=5.3) == "learned"
    assert rate_source(manual=None, learned=None) == "default"


@pytest.mark.parametrize(
    ("orientation", "element", "fraction"),
    [
        ("vertical", "bottom", 1.0),
        ("vertical", "lower_third", 0.667),
        ("vertical", "middle", 0.5),
        ("horizontal", "bottom", 1.0),
        ("horizontal", "lower_third", 0.709),  # a circle's segment, not a third of it
        ("horizontal", "middle", 0.5),
    ],
)
def test_the_water_above_the_element_is_what_heats(
    orientation: str, element: str, fraction: float
) -> None:
    """Heat rises: the water below the element barely warms, so the fast end of the range."""
    assert heated_fraction(orientation, element) == pytest.approx(fraction, abs=0.002)
