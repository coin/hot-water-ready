"""The heating windows as planned for the week view and the calendar (spec 5, 6)."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.controller import (
    Occurrence,
    Settings,
    planned_windows,
)

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
SEVEN = datetime(2026, 11, 2, 7, 0, tzinfo=LISBON)
TIAGO, MARIA = frozenset({"tiago"}), frozenset({"maria"})


def _at(minutes_after_seven: int, who: frozenset[str] = TIAGO) -> Occurrence:
    return Occurrence(at=SEVEN + timedelta(minutes=minutes_after_seven), members=who)


def test_one_ready_time_is_one_window_from_its_lead_to_its_grace() -> None:
    # Water at 30: (42 - 30) x 7 + 15 = 99 min of lead; 15 min of grace.
    (window,) = planned_windows(Settings(), [_at(0)], 30.0)

    assert window.start == SEVEN - timedelta(minutes=99)
    assert window.end == SEVEN + timedelta(minutes=15)
    assert window.ready_times == (_at(0),)


def test_ready_times_close_together_share_a_window() -> None:
    # Maria at 07:30: her own window would start 15 min before (lead at the target), which is
    # 0 min after Tiago's ends at 07:15, inside the 40 min gap.
    (window,) = planned_windows(Settings(), [_at(30, MARIA), _at(0)], 30.0)

    assert window.end == SEVEN + timedelta(minutes=45)
    assert [o.members for o in window.ready_times] == [TIAGO, MARIA]


def test_ready_times_far_apart_make_two_windows() -> None:
    windows = planned_windows(Settings(), [_at(0), _at(180, MARIA)], 30.0)

    assert [w.ready_times[0].members for w in windows] == [TIAGO, MARIA]


def test_without_a_reading_the_lead_is_from_the_restart_point() -> None:
    # 41 C: (42 - 41) x 7 + 15 = 22 min.
    (window,) = planned_windows(Settings(), [_at(0)], None)

    assert window.start == SEVEN - timedelta(minutes=22)


@pytest.mark.parametrize("second", [30, 75, 180])
def test_the_plan_starts_and_groups_as_the_controller_does(second: int) -> None:
    """Same first start, and the same ready times in the first window, as the controller."""
    occurrences = [_at(0), _at(second, MARIA)]
    plan = planned_windows(Settings(), occurrences, 30.0)
    cylinder = Cylinder(now=SEVEN - timedelta(hours=3), water=30.0)
    cylinder.occurrences = occurrences
    cylinder.run_until(SEVEN)

    assert cylinder.toggles[0].at == plan[0].start
    window = cylinder.controller.state.window
    assert window is not None
    assert window.last_ready_at == plan[0].ready_times[-1].at
