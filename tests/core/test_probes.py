"""Whether each probe still measures the water: a loose or half-loose probe is noticed."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.probes import (
    Probe,
    ProbeState,
    ProbeWatch,
)

LISBON = ZoneInfo("Europe/Lisbon")
NIGHT = datetime(2026, 11, 2, 4, 0, tzinfo=LISBON)


def _heat(
    watch: ProbeWatch,
    start: datetime,
    *,
    top: float = 25.0,
    middle: float | None = 24.0,
    minutes: int = 60,
    top_rise: float = 12.0,
    middle_rise: float | None = 12.0,
    clean: bool = True,
    physics_slow: float | None = None,
) -> tuple[datetime, list[tuple[tuple[Probe, ...], tuple[Probe, ...]]]]:
    """One heat, a reading a minute, then off; the reports that changed something."""
    reports = []
    now = start
    for minute in range(minutes + 1):
        share = minute / minutes
        report = watch.step(
            now=now,
            top=top + top_rise * share,
            middle=None if middle is None else middle + (middle_rise or 0.0) * share,
            heating=True,
            run_kept=None,
            physics_slow=physics_slow,
        )
        if report.raised or report.cleared:
            reports.append((report.raised, report.cleared))
        now += timedelta(minutes=1)
    report = watch.step(
        now=now,
        top=top + top_rise,
        middle=None if middle is None else middle + (middle_rise or 0.0),
        heating=False,
        run_kept=clean,
        physics_slow=physics_slow,
    )
    if report.raised or report.cleared:
        reports.append((report.raised, report.cleared))
    return now + timedelta(hours=8), reports


def _normal_heats(watch: ProbeWatch, count: int = 3) -> datetime:
    start = NIGHT
    for _ in range(count):
        start, reports = _heat(watch, start)  # 5 min per degree on both
        assert reports == []
    return start


def test_normal_heats_raise_nothing() -> None:
    watch = ProbeWatch()
    _normal_heats(watch, 5)

    assert watch.state.suspect == frozenset()
    assert watch.state.rates[Probe.TOP] == pytest.approx([61 / 12] * 5)  # off a minute later


def test_a_probe_slower_than_its_own_normal_twice_running_is_suspect() -> None:
    """Half off its pocket, it still rises, but slower: 12 C in 60 min becomes 7 C (8.6 min/C)."""
    watch = ProbeWatch()
    start = _normal_heats(watch)

    start, reports = _heat(watch, start, top_rise=7.0)
    assert reports == []  # once can be a shower or the sun
    _, reports = _heat(watch, start, top_rise=7.0)

    assert reports == [((Probe.TOP,), ())]


def test_a_normal_heat_between_two_slow_ones_starts_the_count_again() -> None:
    watch = ProbeWatch()
    start = _normal_heats(watch)

    start, _ = _heat(watch, start, top_rise=7.0, middle_rise=12.0)
    start, _ = _heat(watch, start)
    _heat(watch, start, top_rise=7.0, middle_rise=12.0)

    assert watch.state.suspect == frozenset()


def test_from_a_mixed_tank_the_probe_that_falls_behind_is_suspect() -> None:
    """Starting within 2 C, both rise together; the middle rising 4 C less is not touching."""
    watch = ProbeWatch()
    start = _normal_heats(watch)

    start, _ = _heat(watch, start, middle_rise=8.0)
    _, reports = _heat(watch, start, middle_rise=8.0)

    assert reports == [((Probe.MIDDLE,), ())]


def test_a_top_up_where_the_middle_catches_up_is_normal() -> None:
    """4 Nov 19:30: top 39.4 to 42.8, middle 33.3 to 40.9. Not a mixed start: no comparison."""
    watch = ProbeWatch()
    start = _normal_heats(watch)
    for _ in range(3):
        start, _ = _heat(
            watch, start, top=39.4, middle=33.3, minutes=30, top_rise=3.4, middle_rise=7.6
        )
        assert watch.state.suspect == frozenset()  # top-ups are slow on the top: not judged


def test_a_heat_that_is_not_clean_is_not_judged() -> None:
    """Water drawn or the sun up: the learner drops the run, and so does the check."""
    watch = ProbeWatch()
    start = _normal_heats(watch)
    for _ in range(3):
        start, reports = _heat(watch, start, top_rise=4.0, middle_rise=4.0, clean=False)
        assert reports == []


def test_without_history_physics_still_catches_a_gross_failure() -> None:
    """A probe at 20 min per degree is outside any tank this heater could be."""
    watch = ProbeWatch()
    start, _ = _heat(watch, NIGHT, top_rise=3.0, middle=None, physics_slow=7.6)
    _, reports = _heat(watch, start, top_rise=3.0, middle=None, physics_slow=7.6)

    assert reports == [((Probe.TOP,), ())]


def test_a_suspect_probe_clears_after_a_normal_heat() -> None:
    watch = ProbeWatch()
    start = _normal_heats(watch)
    start, _ = _heat(watch, start, middle_rise=8.0)
    start, _ = _heat(watch, start, middle_rise=8.0)
    assert Probe.MIDDLE in watch.state.suspect

    _, reports = _heat(watch, start)

    assert reports == [((), (Probe.MIDDLE,))]
    assert watch.state.suspect == frozenset()


def test_the_top_colder_than_the_middle_for_half_an_hour_is_a_disagreement() -> None:
    """Hot water rises: cold above warm means one of them is not reading the water."""
    watch = ProbeWatch()
    now = NIGHT
    raised: list[Probe] = []
    for _ in range(31):
        report = watch.step(
            now=now, top=30.0, middle=34.0, heating=False, run_kept=None, physics_slow=None
        )
        raised += report.raised
        now += timedelta(minutes=1)

    assert raised == [Probe.BOTH]
    report = watch.step(
        now=now, top=34.0, middle=33.0, heating=False, run_kept=None, physics_slow=None
    )
    assert report.cleared == (Probe.BOTH,)


def test_a_short_inversion_is_not_a_disagreement() -> None:
    watch = ProbeWatch()
    now = NIGHT
    for _ in range(20):
        assert not watch.step(
            now=now, top=30.0, middle=34.0, heating=False, run_kept=None, physics_slow=None
        ).raised
        now += timedelta(minutes=1)
    watch.step(now=now, top=34.0, middle=33.0, heating=False, run_kept=None, physics_slow=None)

    assert watch.state.suspect == frozenset()


def test_the_state_survives_a_restart() -> None:
    watch = ProbeWatch()
    start = _normal_heats(watch)
    _heat(watch, start, middle_rise=8.0)

    again = ProbeState.from_dict(watch.state.to_dict())

    assert again.rates == watch.state.rates
    assert again.strikes == watch.state.strikes
    assert again.suspect == watch.state.suspect
