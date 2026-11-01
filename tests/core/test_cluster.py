"""Heating higher for clusters (spec 4.5), with the research's worked examples."""

from dataclasses import replace
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.cluster import Tank, cluster_target, needed_temperature
from custom_components.hot_water_ready.core.controller import (
    Occurrence,
    Settings,
    next_warning,
    planned_windows,
)

from .simulation import Cylinder

BIG = Tank(litres=300, element_watts=2750)
SMALL = Tank(litres=80, element_watts=1500)
JANUARY = 1


def test_three_winter_showers_in_30_minutes_on_the_big_tank_need_no_raise() -> None:
    # 3 x 1.7 - 2.75 x 0.5 = 3.725 kWh; 10 + 3.725 / (0.75 x 300 x 0.001163) = 24.2 C.
    assert needed_temperature(BIG, showers=3, span_minutes=30, month=JANUARY) == pytest.approx(
        24.23, abs=0.01
    )
    result = cluster_target(BIG, 42.0, showers=3, span_minutes=30, month=JANUARY)
    assert (result.target, result.short) == (42.0, False)


def test_the_same_on_the_small_tank_hits_the_cap_and_warns() -> None:
    # 3 x 1.7 - 1.5 x 0.5 = 4.35 kWh; 10 + 4.35 / (0.75 x 80 x 0.001163) = 72.3 C.
    result = cluster_target(SMALL, 42.0, showers=3, span_minutes=30, month=JANUARY)
    assert result.needed == pytest.approx(72.34, abs=0.01)
    assert (result.target, result.short) == (50.0, True)


def test_two_summer_showers_on_the_small_tank_raise_without_the_cap() -> None:
    # 2 x 1.0 - 1.5 x 0.25 = 1.625 kWh; 20 + 1.625 / 0.06978 = 43.3 C, rounded up to 44.
    result = cluster_target(SMALL, 42.0, showers=2, span_minutes=15, month=7)
    assert result.needed == pytest.approx(43.29, abs=0.01)
    assert (result.target, result.short) == (44, False)


def test_without_tank_values_nothing_changes() -> None:
    result = cluster_target(None, 42.0, showers=10, span_minutes=0, month=JANUARY)
    assert (result.target, result.short) == (42.0, False)


def test_a_target_above_the_cap_is_never_lowered() -> None:
    result = cluster_target(SMALL, 55.0, showers=1, span_minutes=0, month=JANUARY)
    assert result.target == 55.0


# ---------------------------------------------------------------- in the controller

LISBON = ZoneInfo("Europe/Lisbon")
SEVEN = datetime(2027, 1, 11, 7, 0, tzinfo=LISBON)  # a winter Monday


def _three_showers(tank: Tank | None) -> Cylinder:
    cylinder = Cylinder(
        now=SEVEN - timedelta(hours=4),
        water=30.0,
        settings=Settings(tank=tank),
        heat_per_minute=0.4,
    )
    cylinder.occurrences = [
        Occurrence(at=SEVEN + timedelta(minutes=15 * n), members=frozenset({f"m{n}"}))
        for n in range(3)
    ]
    return cylinder


def test_a_small_tank_heats_the_cluster_to_the_cap_and_back_to_normal_after() -> None:
    cylinder = _three_showers(SMALL)
    cylinder.run_until(SEVEN)

    off = [t for t in cylinder.toggles if not t.on]
    assert off[0].probe == pytest.approx(51.0, abs=0.1)  # the cap, 50, plus the margin
    (ready_at, ready), *_ = cylinder.ready_events()
    assert ready.temperature == pytest.approx(42.0, abs=0.1)  # ready means the normal target
    assert ready_at < off[0].at  # told on the way up; the heater carries on to 51

    # A later ready time on its own is back to the normal target.
    cylinder.occurrences = [Occurrence(at=SEVEN + timedelta(hours=10), members=frozenset({"x"}))]
    cylinder.water = 30.0
    cylinder.run_until(SEVEN + timedelta(hours=10))
    assert cylinder.toggles[-1].probe == pytest.approx(43.0, abs=0.1)


def test_without_tank_values_the_cluster_heats_to_the_normal_target() -> None:
    cylinder = _three_showers(None)
    cylinder.run_until(SEVEN)

    assert next(t.probe for t in cylinder.toggles if not t.on) == pytest.approx(43.0, abs=0.1)


def test_the_raised_cluster_starts_earlier_and_the_plan_says_so() -> None:
    normal = _three_showers(None)
    raised = _three_showers(SMALL)
    normal.run_until(SEVEN)
    raised.run_until(SEVEN)

    assert raised.toggles[0].at < normal.toggles[0].at
    (plan,) = planned_windows(replace(raised.settings), raised.occurrences, 30.0)
    assert plan.start == raised.toggles[0].at
    assert plan.target == 50.0
    assert plan.short


def test_the_warning_is_for_the_next_short_cluster_within_a_day() -> None:
    plans = planned_windows(
        Settings(tank=SMALL),
        [
            Occurrence(at=SEVEN, members=frozenset({"a"})),  # one shower: no warning
            *[
                Occurrence(at=SEVEN + timedelta(hours=12, minutes=15 * n), members=frozenset({"b"}))
                for n in range(3)
            ],
        ],
        30.0,
    )

    assert next_warning(plans, SEVEN - timedelta(hours=1)) is plans[1]
    assert next_warning(plans, SEVEN - timedelta(days=1)) is None  # more than a day ahead
