"""The solar comparison: the per-window record and the 30-day verdict (spec 7, issue 12)."""

from dataclasses import replace
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.comparison import (
    ComparisonState,
    Recorder,
    WindowRecord,
    replay,
    verdict,
)
from custom_components.hot_water_ready.core.controller import Occurrence, Settings

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
SIX = datetime(2026, 7, 2, 6, 0, tzinfo=LISBON)
SEVEN = SIX + timedelta(hours=1)


def _at(hour: int, minute: int) -> datetime:
    return SIX.replace(hour=hour, minute=minute)


# Three windows checked by hand, 5 min per degree (0.2 C/min from the heater), target 42, a lead
# margin of 5 min (15 by default; 5 keeps the sums short).
#
# 1. Version 1 applied, started 06:00 at 30 C, reached 42 at 06:48 after 48 heater minutes.
#    Sun = (42 - 30 - 48/5) / 48 = 0.05 C/min. The solar rule, looking each minute k: the sun
#    alone never makes it (12 / 0.05 = 240 min); by heater plus sun (0.25 C/min) its lead is
#    (12 - 0.05 k) / 0.25 + 5 = 53 - 0.2 k, reaching the 60 - k minutes left at k = 9. From
#    06:09 at 30.45 C: 11.55 / 0.25 = 46.2 min, ready 06:55, on time; 1.8 minutes less.
# 2. Solar rule applied, sun alone: no heating, the water reached 42 at 06:50, on time.
#    Sun = 12 / 50 = 0.24 C/min. Version 1 would have heated from 06:00: 12 C at 0.44 C/min is
#    27.27 min, all of it saved.
# 3. Solar rule applied, started 06:30, reached 42 at 07:05 after 35 minutes: late.
#    Sun = (12 - 35/5) / 65 = 0.0769 C/min. Version 1: 12 C at 0.2769 C/min is 43.33 min,
#    8.33 minutes more than the solar rule used.
#
# Verdict: on time in 2 of 3 (the rule applied in 2, on time in 1), 1.8 + 27.27 + 8.33 = 37.4
# min less, at 3 kW about 1.87 kWh.
WINDOW_1 = WindowRecord(
    ready_at=SEVEN,
    members=("tiago",),
    rule="version_1",
    target=42.0,
    rate=5.0,
    lead_margin=5.0,
    lead_cap=240.0,
    start=SIX,
    start_temperature=30.0,
    rise=0.05,
    solar_start=None,
    heater_minutes=48.0,
    energy_kwh=None,
    reached_at=_at(6, 48),
    end=_at(6, 48),
    end_temperature=42.0,
)
WINDOW_2 = replace(
    WINDOW_1,
    rule="solar",
    rise=0.24,
    heater_minutes=0.0,
    reached_at=_at(6, 50),
    end=_at(6, 50),
)
WINDOW_3 = replace(
    WINDOW_1,
    rule="solar",
    rise=0.03,
    solar_start=_at(6, 30),
    heater_minutes=35.0,
    reached_at=_at(7, 5),
    end=_at(7, 5),
)


def _version_1_run(heater_minutes: float) -> WindowRecord:
    """Version 1 from 06:00 at 30 C, reaching 42 after `heater_minutes` of heating."""
    reached = SIX + timedelta(minutes=heater_minutes)
    return replace(WINDOW_1, heater_minutes=heater_minutes, reached_at=reached, end=reached)


def test_replaying_the_solar_rule_a_minute_at_a_time() -> None:
    solar = replay(WINDOW_1, "solar")
    assert solar.on_time
    assert solar.heater_minutes == pytest.approx(46.2)


def test_a_sun_faster_than_the_heater_needs_no_heating_in_the_replay() -> None:
    # Reached in 24 min at 0.5 C/min: 0.2 from the heater, so 0.3 from the sun, which alone
    # needs 40 min of the 60.
    replayed = replay(_version_1_run(24.0), "solar")

    assert replayed.on_time
    assert replayed.heater_minutes == 0.0


def test_with_the_water_losing_heat_the_solar_rule_is_version_1() -> None:
    # 66.67 min at 0.18 C/min: the water loses 0.02 C/min, so there is no sun to count on.
    replayed = replay(_version_1_run(12 / 0.18), "solar")

    assert not replayed.on_time  # 06:00 plus 66.67 min is after 07:00, as it was for version 1
    assert replayed.heater_minutes == pytest.approx(12 / 0.18)


def test_replaying_version_1_on_a_solar_window() -> None:
    assert replay(WINDOW_2, "version_1").heater_minutes == pytest.approx(12 / 0.44)
    assert replay(WINDOW_3, "version_1").heater_minutes == pytest.approx(12 / (0.2 + 5 / 65))


def test_the_rule_applied_is_what_happened() -> None:
    assert replay(WINDOW_1, "version_1").heater_minutes == 48.0
    assert replay(WINDOW_2, "solar").on_time
    assert not replay(WINDOW_3, "solar").on_time
    assert not replay(replace(WINDOW_3, reached_at=None), "solar").on_time


def test_the_verdict_over_hand_checked_windows() -> None:
    result = verdict([WINDOW_1, WINDOW_2, WINDOW_3], now=_at(9, 0), element_power_w=3000.0)

    assert (result.on_time, result.windows) == (2, 3)
    assert (result.solar_windows, result.solar_on_time) == (2, 1)
    assert result.minutes_saved == pytest.approx(1.8 + 12 / 0.44 + 12 / (0.2 + 5 / 65) - 35)
    assert result.kwh == pytest.approx(result.minutes_saved / 60 * 3.0)


def test_measured_energy_beats_the_element_power() -> None:
    measured = replace(WINDOW_1, energy_kwh=2.4)  # 48 min at 3 kW: 0.05 kWh a minute

    result = verdict([measured], now=_at(9, 0), element_power_w=1000.0)

    assert result.kwh == pytest.approx(1.8 * 0.05)


def test_without_energy_or_power_only_minutes_are_given() -> None:
    result = verdict([WINDOW_1], now=_at(9, 0), element_power_w=None)

    assert result.kwh is None
    assert result.minutes_saved == pytest.approx(1.8)


def test_kwh_need_every_window_measured_or_none_at_all() -> None:
    nothing_saved = _version_1_run(60.0)  # no sun: both rules start at once and run alike
    measured = replace(WINDOW_1, energy_kwh=2.4)

    assert verdict([nothing_saved], now=_at(9, 0), element_power_w=None).kwh is None
    assert verdict([measured, WINDOW_3], now=_at(9, 0), element_power_w=None).kwh is None
    assert verdict([], now=_at(9, 0), element_power_w=3000.0).kwh is None


def test_only_the_last_30_days_without_faults_or_draws_count() -> None:
    old = replace(WINDOW_1, ready_at=SEVEN - timedelta(days=31))
    faulty = replace(WINDOW_2, fault=True)
    drawn = replace(WINDOW_1, drawn=True)

    result = verdict([old, faulty, drawn, WINDOW_3], now=_at(9, 0), element_power_w=None)

    assert result.windows == 1


# ---------------------------------------------------------------- recording what happened


def _recorded(*, solar_aware: bool, sun: float, also: datetime | None = None) -> list[WindowRecord]:
    """Run a morning minute by minute, recording; `also` adds Maria's ready time."""
    cylinder = Cylinder(
        now=SEVEN - timedelta(minutes=180),
        water=30.0,
        settings=Settings(solar_aware=solar_aware, rate_minutes_per_degree=5.9),
        sun_per_minute=sun,
    )
    cylinder.occurrences = [Occurrence(at=SEVEN, members=frozenset({"tiago"}))]
    if also is not None:
        cylinder.occurrences.append(Occurrence(at=also, members=frozenset({"maria"})))
    recorder = Recorder()
    recorder.step(  # a first look before anything opens, as after a start-up
        now=cylinder.now,
        settings=cylinder.settings,
        temperature=None,
        rise=None,
        next_ready=None,
        window_open=False,
        element_on=False,
        power_w=None,
        fault=False,
    )
    end = (also or SEVEN) + timedelta(minutes=30)
    while cylinder.now < end:
        cylinder.run(1)
        state = cylinder.controller.state
        coming = [o for o in cylinder.occurrences if o.at + timedelta(minutes=15) > cylinder.now]
        recorder.step(
            now=cylinder.now,
            settings=cylinder.settings,
            temperature=cylinder.probe,
            rise=cylinder.trend.rise_per_minute(cylinder.now),
            next_ready=coming[0] if coming else None,
            window_open=state.window is not None,
            element_on=cylinder.relay,
            power_w=None,
            fault=False,
        )
    return recorder.state.records


def test_a_window_under_version_1_is_recorded() -> None:
    (record,) = _recorded(solar_aware=False, sun=0.03)

    assert record.rule == "version_1"
    assert record.ready_at == SEVEN
    assert record.members == ("tiago",)
    assert record.solar_start is None
    assert not record.drawn
    assert record.reached_at is not None
    assert record.reached_at <= SEVEN
    assert record.heater_minutes == pytest.approx(
        (record.reached_at - record.start).total_seconds() / 60, abs=1.5
    )


def test_a_window_under_the_solar_rule_starts_where_version_1_would_have() -> None:
    (record,) = _recorded(solar_aware=True, sun=0.03)

    assert record.rule == "solar"
    assert record.solar_start is not None
    assert record.start < record.solar_start
    assert replay(record, "solar").on_time


def test_the_replay_of_a_recorded_window_matches_the_other_run() -> None:
    """Replaying the solar rule on version 1's record comes close to really running it."""
    (under_1,) = _recorded(solar_aware=False, sun=0.03)
    (under_solar,) = _recorded(solar_aware=True, sun=0.03)

    replayed = replay(under_1, "solar")

    assert replayed.on_time
    assert replayed.heater_minutes == pytest.approx(under_solar.heater_minutes, abs=3)


def test_water_drawn_while_heating_marks_the_record() -> None:
    recorder = Recorder()
    ready = Occurrence(at=SEVEN, members=frozenset({"tiago"}))
    for minute, water in enumerate([30.0, 31.0, 32.0, 30.8, 33.0, 42.0]):
        recorder.step(
            now=SIX + timedelta(minutes=minute),
            settings=Settings(),
            temperature=water,
            rise=None,
            next_ready=ready,
            window_open=minute > 0,
            element_on=True,
            power_w=None,
            fault=False,
        )
    recorder.step(
        now=SEVEN,
        settings=Settings(),
        temperature=42.0,
        rise=None,
        next_ready=None,
        window_open=False,
        element_on=False,
        power_w=None,
        fault=False,
    )

    (record,) = recorder.state.records
    assert record.drawn  # 30.8 after 32.0: more than a degree down while heating


def test_ready_times_sharing_a_window_make_one_record() -> None:
    (record,) = _recorded(solar_aware=False, sun=0.0, also=SEVEN + timedelta(minutes=30))

    assert record.ready_at == SEVEN


def test_ready_times_far_apart_make_two_records() -> None:
    records = _recorded(solar_aware=False, sun=0.0, also=SEVEN + timedelta(hours=4))

    assert [r.ready_at for r in records] == [SEVEN, SEVEN + timedelta(hours=4)]


def test_state_round_trips_and_refuses_corrupt_data() -> None:
    state = ComparisonState(records=[WINDOW_1, replace(WINDOW_3, reached_at=None)])
    assert ComparisonState.from_dict(state.to_dict()) == state

    good = WINDOW_1.to_dict()
    for changes in (
        {"ready_at": "2026-07-02T07:00:00"},  # naive: read in the wrong zone
        {"fault": "yes"},
        {"rate": True},
        {"rule": "guess"},
    ):
        with pytest.raises(ValueError, match="comparison state"):
            ComparisonState.from_dict({"records": [{**good, **changes}]})
    with pytest.raises(ValueError, match="comparison state"):
        ComparisonState.from_dict({"records": "x"})


def test_records_older_than_a_year_are_dropped() -> None:
    recorder = Recorder(ComparisonState(records=[replace(WINDOW_1, ready_at=SEVEN)]))
    recorder.step(
        now=SEVEN + timedelta(days=366),
        settings=Settings(),
        temperature=40.0,
        rise=None,
        next_ready=None,
        window_open=False,
        element_on=False,
        power_w=None,
        fault=False,
    )

    assert recorder.state.records == []
