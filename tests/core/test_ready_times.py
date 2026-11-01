"""When a ready time next happens, in real local dates and times."""

from datetime import datetime, time
from zoneinfo import ZoneInfo

from custom_components.hot_water_ready.core.ready_times import ReadyTime, occurrences

LISBON = ZoneInfo("Europe/Lisbon")
EVERY_DAY = frozenset(range(7))


def _at(*args: int) -> datetime:
    return datetime(*args, tzinfo=LISBON)


def test_next_occurrence_today_when_still_ahead() -> None:
    seven = ReadyTime(id="a", time=time(7, 0), weekdays=EVERY_DAY)
    found = occurrences([seven], start=_at(2026, 11, 2, 5, 0), end=_at(2026, 11, 3, 5, 0))
    assert found == [(_at(2026, 11, 2, 7, 0), seven)]


def test_only_on_its_weekdays() -> None:
    weekdays = ReadyTime(id="a", time=time(7, 0), weekdays=frozenset({0, 1, 2, 3, 4}))
    # Saturday 7 November 2026 to Tuesday 10 November
    found = occurrences([weekdays], start=_at(2026, 11, 7, 0, 0), end=_at(2026, 11, 10, 23, 0))
    assert [when for when, _ in found] == [_at(2026, 11, 9, 7, 0), _at(2026, 11, 10, 7, 0)]


def test_switched_off_ready_time_never_happens() -> None:
    off = ReadyTime(id="a", time=time(7, 0), weekdays=EVERY_DAY, enabled=False)
    assert occurrences([off], start=_at(2026, 11, 2, 0, 0), end=_at(2026, 11, 9, 0, 0)) == []


def test_sorted_across_several_ready_times() -> None:
    morning = ReadyTime(id="m", time=time(7, 30), weekdays=EVERY_DAY)
    evening = ReadyTime(id="e", time=time(20, 0), weekdays=EVERY_DAY)
    found = occurrences(
        [evening, morning], start=_at(2026, 11, 2, 8, 0), end=_at(2026, 11, 3, 8, 0)
    )
    assert found == [(_at(2026, 11, 2, 20, 0), evening), (_at(2026, 11, 3, 7, 30), morning)]


def test_start_is_inclusive_end_exclusive() -> None:
    seven = ReadyTime(id="a", time=time(7, 0), weekdays=EVERY_DAY)
    found = occurrences([seven], start=_at(2026, 11, 2, 7, 0), end=_at(2026, 11, 3, 7, 0))
    assert [when for when, _ in found] == [_at(2026, 11, 2, 7, 0)]
