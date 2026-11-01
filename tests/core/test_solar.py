"""The solar rise and the solar-aware lead (spec 4.3)."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.controller import (
    Occurrence,
    Settings,
    lead_minutes,
    solar_lead_minutes,
)
from custom_components.hot_water_ready.core.solar import SolarTrend

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
NOON = datetime(2026, 7, 2, 12, 0, tzinfo=LISBON)
SETTINGS = Settings(target=42.0, rate_minutes_per_degree=5.0, lead_margin_minutes=15.0)


def _feed(trend: SolarTrend, minutes: int, start: float, per_minute: float) -> datetime:
    now = NOON
    for minute in range(minutes + 1):
        now = NOON + timedelta(minutes=minute)
        trend.step(now=now, temperature=start + per_minute * minute, heating=False)
    return now


def test_the_rise_is_the_slope_while_the_heater_is_off() -> None:
    trend = SolarTrend()
    now = _feed(trend, 20, 30.0, 0.05)

    assert trend.rise_per_minute(now) == pytest.approx(0.05)


def test_less_than_15_minutes_of_readings_gives_no_rise() -> None:
    trend = SolarTrend()
    now = _feed(trend, 10, 30.0, 0.05)

    assert trend.rise_per_minute(now) is None


def test_only_the_last_30_minutes_count() -> None:
    trend = SolarTrend()
    now = NOON
    for minute in range(61):  # flat for 30 min, then rising
        temperature = 30.0 if minute <= 30 else 30.0 + 0.1 * (minute - 30)
        now = NOON + timedelta(minutes=minute)
        trend.step(now=now, temperature=temperature, heating=False)

    assert trend.rise_per_minute(now) == pytest.approx(0.1)


def test_heating_restarts_the_measure() -> None:
    trend = SolarTrend()
    now = _feed(trend, 20, 30.0, 0.05)
    trend.step(now=now, temperature=31.0, heating=True)

    assert trend.rise_per_minute(now) is None


def test_a_missing_reading_is_skipped() -> None:
    trend = SolarTrend()
    now = _feed(trend, 20, 30.0, 0.05)
    trend.step(now=now + timedelta(minutes=1), temperature=None, heating=False)

    assert trend.rise_per_minute(now + timedelta(minutes=1)) == pytest.approx(0.05)


@pytest.mark.parametrize("rise", [None, 0.0, -0.02])
def test_flat_falling_or_unknown_trend_uses_the_heater_rate_alone(rise: float | None) -> None:
    assert solar_lead_minutes(SETTINGS, 32.0, rise, 120.0) == lead_minutes(SETTINGS, 32.0)


def test_the_sun_alone_in_time_keeps_the_heater_off() -> None:
    # 10 C to go at 0.1 C/min is 100 min; plus the 15 min margin fits in 120 min.
    assert solar_lead_minutes(SETTINGS, 32.0, 0.1, 120.0) == 0.0


def test_otherwise_the_start_is_by_the_combined_rate() -> None:
    # 10 C to go at 0.2 (heater) + 0.05 (sun) C/min is 40 min, plus the 15 min margin.
    assert solar_lead_minutes(SETTINGS, 32.0, 0.05, 60.0) == pytest.approx(55.0)
    assert lead_minutes(SETTINGS, 32.0) == pytest.approx(65.0)  # the heater alone: 50 + 15


def test_the_solar_lead_keeps_the_cap() -> None:
    cold = Settings(target=42.0, rate_minutes_per_degree=20.0, lead_cap_minutes=240.0)

    assert solar_lead_minutes(cold, 10.0, 0.01, 30.0) == 240.0


# ---------------------------------------------------------------- the rule in the controller

SEVEN = datetime(2026, 7, 2, 13, 0, tzinfo=LISBON)


def _sunny_cylinder(*, solar_aware: bool, sun: float) -> Cylinder:
    cylinder = Cylinder(
        now=SEVEN - timedelta(minutes=240),
        water=30.0,
        settings=Settings(solar_aware=solar_aware),
        sun_per_minute=sun,
    )
    cylinder.occurrences = [Occurrence(at=SEVEN, members=frozenset({"tiago"}))]
    return cylinder


def test_with_the_rule_off_the_rise_is_ignored() -> None:
    measured = _sunny_cylinder(solar_aware=False, sun=0.03)
    blind = _sunny_cylinder(solar_aware=False, sun=0.03)
    blind.trend.rise_per_minute = lambda _now: None  # type: ignore[method-assign]
    measured.run_until(SEVEN)
    blind.run_until(SEVEN)

    assert measured.toggles  # version 1 heated...
    assert measured.toggles == blind.toggles  # ...exactly as if no rise had been measured
    assert measured.events == blind.events


@pytest.mark.parametrize(("solar_aware", "heated"), [(False, True), (True, False)])
def test_a_sun_faster_than_the_heater_keeps_it_off_only_with_the_rule_on(
    solar_aware: bool, heated: bool
) -> None:
    # The trend is measured for 20 min before the ready time is added, 90 min ahead with the
    # water at 30: version 1's lead is 99 min, so it starts at once; at 0.2 C/min the sun
    # alone needs 60 min plus the 15 min margin.
    cylinder = _sunny_cylinder(solar_aware=solar_aware, sun=0.2)
    cylinder.now, cylinder.water = SEVEN - timedelta(minutes=110), 26.0
    occurrences, cylinder.occurrences = cylinder.occurrences, []
    cylinder.run(20)
    cylinder.occurrences = occurrences
    cylinder.run_until(SEVEN)

    assert bool(cylinder.toggles) is heated
    ((ready_at, _),) = cylinder.ready_events()
    assert ready_at <= SEVEN


def test_with_the_rule_on_a_weak_sun_starts_later_and_is_still_on_time() -> None:
    off = _sunny_cylinder(solar_aware=False, sun=0.02)
    on = _sunny_cylinder(solar_aware=True, sun=0.02)
    off.run_until(SEVEN)
    on.run_until(SEVEN)

    assert on.toggles[0].at > off.toggles[0].at
    ((ready_at, _),) = on.ready_events()
    assert ready_at <= SEVEN
