"""The whole household: several members and showers, merging, away, daylight saving (ticket 03)."""

from dataclasses import replace
from datetime import UTC, date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from custom_components.hot_water_ready.core.controller import ControllerState, Occurrence, Settings
from custom_components.hot_water_ready.core.household import Away, MemberPlan, household_occurrences
from custom_components.hot_water_ready.core.ready_times import ReadyTime

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
EVERY_DAY = frozenset(range(7))


def _at(*args: int) -> datetime:
    return datetime(*args, tzinfo=LISBON)


def _ready(ready_id: str, hour: int, minute: int = 0) -> ReadyTime:
    return ReadyTime(ready_id, time(hour, minute), EVERY_DAY)


# --------------------------------------------------------------------------- occurrences


def test_several_showers_a_day_for_one_member() -> None:
    maria = MemberPlan("maria", (_ready("m1", 7, 30), _ready("m2", 20, 0)))
    found = household_occurrences([maria], start=_at(2026, 11, 2, 0, 0), end=_at(2026, 11, 3, 0, 0))

    assert [o.at for o in found] == [_at(2026, 11, 2, 7, 30), _at(2026, 11, 2, 20, 0)]


def test_people_at_the_same_time_share_one_occurrence() -> None:
    tiago = MemberPlan("tiago", (_ready("t", 7, 0),))
    maria = MemberPlan("maria", (_ready("m", 7, 0),))
    found = household_occurrences(
        [tiago, maria], start=_at(2026, 11, 2, 0, 0), end=_at(2026, 11, 3, 0, 0)
    )

    assert found == [Occurrence(_at(2026, 11, 2, 7, 0), frozenset({"tiago", "maria"}))]


def test_away_pauses_a_members_ready_times() -> None:
    tiago = MemberPlan("tiago", (_ready("t", 7, 0),), Away(on=True))
    maria = MemberPlan("maria", (_ready("m", 7, 30),))
    found = household_occurrences(
        [tiago, maria], start=_at(2026, 11, 2, 0, 0), end=_at(2026, 11, 4, 0, 0)
    )

    assert {m for o in found for m in o.members} == {"maria"}


def test_away_with_an_end_date_counts_from_the_day_after() -> None:
    # Away until Wednesday 4 November: Wednesday is still away, Thursday is back.
    tiago = MemberPlan("tiago", (_ready("t", 7, 0),), Away(on=True, until=date(2026, 11, 4)))
    found = household_occurrences([tiago], start=_at(2026, 11, 2, 0, 0), end=_at(2026, 11, 7, 0, 0))

    assert [o.at for o in found] == [_at(2026, 11, 5, 7, 0), _at(2026, 11, 6, 7, 0)]


def test_away_ends_by_itself_after_its_date() -> None:
    away = Away(on=True, until=date(2026, 11, 4))
    assert away.active_on(date(2026, 11, 4))
    assert not away.active_on(date(2026, 11, 5))
    assert away.expired(date(2026, 11, 5))
    assert not away.expired(date(2026, 11, 4))
    assert not Away(on=True).expired(date(2030, 1, 1))


# --------------------------------------------------------------------------- daylight saving


def test_seven_o_clock_stays_seven_across_both_daylight_saving_days() -> None:
    seven = MemberPlan("tiago", (_ready("t", 7, 0),))
    spring = household_occurrences(
        [seven], start=_at(2026, 3, 28, 0, 0), end=_at(2026, 3, 31, 0, 0)
    )
    autumn = household_occurrences(
        [seven], start=_at(2026, 10, 24, 0, 0), end=_at(2026, 10, 27, 0, 0)
    )

    assert [(o.at.hour, o.at.minute) for o in spring + autumn] == [(7, 0)] * 6
    # The real time between the two 07:00s across a change is 23 h in spring and 25 h in
    # autumn (in UTC: Python subtracts datetimes sharing a tzinfo as wall-clock times).
    assert spring[1].at.astimezone(UTC) - spring[0].at.astimezone(UTC) == timedelta(hours=23)
    assert autumn[1].at.astimezone(UTC) - autumn[0].at.astimezone(UTC) == timedelta(hours=25)


def test_a_time_skipped_by_the_spring_change_moves_past_the_gap() -> None:
    # Lisbon, Sunday 29 March 2026: 01:00 becomes 02:00, so 01:30 does not exist that night.
    night = MemberPlan("tiago", (_ready("t", 1, 30),))
    found = household_occurrences(
        [night], start=_at(2026, 3, 29, 0, 0), end=_at(2026, 3, 29, 12, 0)
    )

    (only,) = found
    assert (only.at.hour, only.at.minute) == (2, 30)


def test_a_time_repeated_by_the_autumn_change_happens_once() -> None:
    # Lisbon, Sunday 25 October 2026: 02:00 goes back to 01:00, so 01:30 happens twice.
    night = MemberPlan("tiago", (_ready("t", 1, 30),))
    found = household_occurrences(
        [night], start=_at(2026, 10, 25, 0, 0), end=_at(2026, 10, 25, 12, 0)
    )

    assert len(found) == 1


def _cylinder(
    water: float, now: datetime, occurrences: list[Occurrence], **settings: float
) -> Cylinder:
    cylinder = Cylinder(now=now, water=water, settings=replace(Settings(), **settings))
    cylinder.occurrences = occurrences
    return cylinder


def test_window_crossing_midnight_into_the_morning() -> None:
    # 00:30 ready time from 30 C: the lead (99 min) starts it at 22:51 the evening before.
    half_past = _at(2026, 11, 3, 0, 30)
    cylinder = _cylinder(30.0, _at(2026, 11, 2, 22, 0), [Occurrence(half_past, frozenset({"t"}))])
    cylinder.run_until(half_past)

    assert cylinder.toggles[0].at == _at(2026, 11, 2, 22, 51)
    assert len(cylinder.ready_events()) == 1


def test_window_crossing_midnight_out_of_the_evening() -> None:
    # 23:55 ready time: the grace runs past midnight and the band still works there.
    late = _at(2026, 11, 2, 23, 55)
    cylinder = _cylinder(41.5, _at(2026, 11, 2, 23, 30), [Occurrence(late, frozenset({"t"}))])
    cylinder.cool_per_minute = 0.4
    cylinder.run_until(_at(2026, 11, 3, 0, 9))

    after_midnight = [t for t in cylinder.toggles if t.at >= _at(2026, 11, 3, 0, 0)]
    assert after_midnight  # still switching inside the part of the window after midnight


def test_ready_on_the_spring_morning() -> None:
    seven = _at(2026, 3, 29, 7, 0)
    cylinder = _cylinder(35.0, _at(2026, 3, 29, 0, 0), [Occurrence(seven, frozenset({"t"}))])
    cylinder.run_until(seven)

    ((ready_at, _),) = cylinder.ready_events()
    assert ready_at <= seven


# --------------------------------------------------------------------------- merging


def test_close_showers_share_one_window_and_heat_through() -> None:
    # 07:00 and 07:40: the first window ends 07:15, the second (from 42) starts 07:25. A 10-min
    # gap is under 40, so one window from the first lead to 07:55, and one heating start.
    first, second = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 7, 40)
    cylinder = _cylinder(
        40.0,
        _at(2026, 11, 2, 6, 0),
        [Occurrence(first, frozenset({"tiago"})), Occurrence(second, frozenset({"maria"}))],
    )
    cylinder.run_until(_at(2026, 11, 2, 7, 20))
    cylinder.run(12, draw_per_minute=0.4)  # Tiago's shower cools it below 41
    cylinder.run_until(_at(2026, 11, 2, 7, 56))

    # One window: Tiago is told it is heating when it opens, Maria when her time joins it.
    assert [sorted(e.members) for _, e in cylinder.heating_events()] == [["tiago"], ["maria"]]
    window = cylinder.controller.state.window
    assert window is None or window.members == frozenset({"tiago", "maria"})
    # It restarted at 41 between the two showers: the window stayed open through the gap.
    assert any(t.on and t.probe == 41.0 for t in cylinder.toggles)


def test_far_apart_showers_get_their_own_windows() -> None:
    morning, evening = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 20, 0)
    cylinder = _cylinder(
        40.0,
        _at(2026, 11, 2, 6, 0),
        [Occurrence(morning, frozenset({"tiago"})), Occurrence(evening, frozenset({"maria"}))],
    )
    cylinder.cool_per_minute = 0.02
    cylinder.run_until(_at(2026, 11, 2, 20, 0))

    assert [e.members for _, e in cylinder.heating_events()] == [
        frozenset({"tiago"}),
        frozenset({"maria"}),
    ]


def test_merge_gap_is_a_setting() -> None:
    # 07:00 and 08:00: from 43 the second lead is 8 min, so a 37-min gap after 07:15. Under the
    # default 40 they merge; with 5 they do not.
    first, second = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 8, 0)
    cylinder = _cylinder(
        40.0,
        _at(2026, 11, 2, 6, 0),
        [Occurrence(first, frozenset({"tiago"})), Occurrence(second, frozenset({"maria"}))],
        keep_heating_gap_minutes=5.0,
    )
    cylinder.run_until(_at(2026, 11, 2, 7, 16))
    assert cylinder.controller.state.window is None


def test_merge_gap_default_keeps_the_window_open() -> None:
    first, second = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 8, 0)
    cylinder = _cylinder(
        40.0,
        _at(2026, 11, 2, 6, 0),
        [Occurrence(first, frozenset({"tiago"})), Occurrence(second, frozenset({"maria"}))],
    )
    cylinder.run_until(_at(2026, 11, 2, 7, 16))
    window = cylinder.controller.state.window
    assert window is not None
    assert window.end == _at(2026, 11, 2, 8, 15)


def test_lead_across_the_spring_change_is_real_minutes() -> None:
    # 02:30 on Sunday 29 March 2026 (01:30 UTC). From 30 C the lead is 99 real minutes, so the
    # heater starts at 23:51 UTC on Saturday; wall-clock arithmetic would start it an hour late.
    half_two = _at(2026, 3, 29, 2, 30)
    cylinder = _cylinder(30.0, _at(2026, 3, 28, 23, 0), [Occurrence(half_two, frozenset({"t"}))])
    cylinder.run_until(half_two)

    assert cylinder.toggles[0].at.astimezone(UTC) == datetime(2026, 3, 28, 23, 51, tzinfo=UTC)


def test_grace_across_the_autumn_change_is_real_minutes() -> None:
    # 01:50 on Sunday 25 October 2026, the first time (00:50 UTC): the window ends 15 real
    # minutes later, at 01:05 UTC, even though the clock then reads 01:05 for the second time.
    first_ten_to_two = datetime(2026, 10, 25, 1, 50, tzinfo=LISBON, fold=0)
    cylinder = _cylinder(
        41.5,
        first_ten_to_two - timedelta(minutes=10),
        [Occurrence(first_ten_to_two, frozenset({"t"}))],
    )
    cylinder.run(5)
    window = cylinder.controller.state.window
    assert window is not None
    assert window.end.astimezone(UTC) == datetime(2026, 10, 25, 1, 5, tzinfo=UTC)


def test_window_closes_when_its_ready_times_are_withdrawn() -> None:
    # Tiago goes away (or switches the time off) while his window is heating: it stops.
    seven = _at(2026, 11, 2, 7, 0)
    cylinder = _cylinder(38.0, _at(2026, 11, 2, 6, 20), [Occurrence(seven, frozenset({"tiago"}))])
    cylinder.run(5)
    assert cylinder.relay

    cylinder.occurrences = []
    cylinder.run(1)
    assert not cylinder.relay
    assert cylinder.controller.state.window is None


def test_window_drops_a_member_who_withdraws_and_keeps_the_rest() -> None:
    first, second = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 7, 30)
    cylinder = _cylinder(
        38.0,
        _at(2026, 11, 2, 6, 20),
        [Occurrence(first, frozenset({"tiago"})), Occurrence(second, frozenset({"maria"}))],
    )
    cylinder.run(5)
    cylinder.occurrences = [Occurrence(second, frozenset({"maria"}))]
    cylinder.run(1)

    assert cylinder.relay
    window = cylinder.controller.state.window
    assert window is not None
    assert window.members == frozenset({"maria"})


def test_joining_does_not_depend_on_how_cold_the_water_is_now() -> None:
    # 07:00 and 09:50 are far apart. Cold water at 04:20 gives a long lead, but whether the
    # next window joins is judged with the water at target (where it will be), not as it is.
    first, later = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 9, 50)
    cylinder = _cylinder(
        20.0,
        _at(2026, 11, 2, 4, 20),
        [Occurrence(first, frozenset({"tiago"})), Occurrence(later, frozenset({"maria"}))],
    )
    cylinder.run(1)
    window = cylinder.controller.state.window
    assert window is not None
    assert window.end == _at(2026, 11, 2, 7, 15)


def test_someone_joining_is_told_ready_for_their_own_time() -> None:
    first, second = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 7, 30)
    cylinder = _cylinder(
        44.0,
        _at(2026, 11, 2, 6, 59),
        [Occurrence(first, frozenset({"a"})), Occurrence(second, frozenset({"b"}))],
    )
    cylinder.run(2)

    readies = sorted((e.ready_at, sorted(e.members)) for _, e in cylinder.ready_events())
    assert readies == [(first, ["a"]), (second, ["b"])]


def test_moving_a_ready_time_earlier_inside_its_window_does_not_chatter() -> None:
    seven = _at(2026, 11, 2, 7, 0)
    cylinder = _cylinder(41.5, _at(2026, 11, 2, 6, 50), [Occurrence(seven, frozenset({"t"}))])
    cylinder.run(1)
    assert cylinder.relay
    cylinder.occurrences = [Occurrence(_at(2026, 11, 2, 6, 55), frozenset({"t"}))]
    cylinder.run(2)

    assert [t.on for t in cylinder.toggles] == [True]


def test_withdrawing_the_first_time_gives_back_the_later_start() -> None:
    # Tiago 07:00 and Maria 07:40 share a window opened by Tiago's lead. Tiago withdraws before
    # it heats: Maria's time alone starts later, so the window closes and reopens when due.
    first, second = _at(2026, 11, 2, 7, 0), _at(2026, 11, 2, 7, 40)
    cylinder = _cylinder(
        42.5,
        _at(2026, 11, 2, 6, 40),
        [Occurrence(first, frozenset({"tiago"})), Occurrence(second, frozenset({"maria"}))],
    )
    cylinder.run(10)  # Tiago's window (lead 11.5 min from 42.5) opened at 06:48:30
    assert cylinder.controller.state.window is not None
    cylinder.occurrences = [Occurrence(second, frozenset({"maria"}))]
    cylinder.run(1)

    assert cylinder.controller.state.window is None


def test_state_saved_before_per_member_reports_keeps_ready_sent() -> None:
    old = {
        "heating": False,
        "window": {
            "ready_at": "2026-11-02T07:00:00+00:00",
            "end": "2026-11-02T07:15:00+00:00",
            "members": ["tiago"],
            "target": 42.0,
            "ready_reported": True,
        },
    }
    state = ControllerState.from_dict(old)
    assert state.window is not None
    assert state.all_told(state.window)


def test_a_window_that_closes_and_reopens_does_not_say_heating_twice() -> None:
    seven = _at(2026, 11, 2, 7, 0)
    cylinder = _cylinder(38.0, _at(2026, 11, 2, 6, 20), [Occurrence(seven, frozenset({"t"}))])
    cylinder.run(2)
    cylinder.occurrences = []  # switched off: the window closes
    cylinder.run(2)
    cylinder.occurrences = [Occurrence(seven, frozenset({"t"}))]  # and on again
    cylinder.run(2)

    assert cylinder.relay
    assert len(cylinder.heating_events()) == 1


def test_told_heating_from_corrupt_data_is_refused() -> None:
    import pytest  # noqa: PLC0415

    for bad in (["tiago"], [["tiago"]], [["tiago", "2026-11-02T07:00:00"]], [[1, "x"]]):
        with pytest.raises(ValueError, match="controller state"):
            ControllerState.from_dict({"heating": False, "told_heating": bad})


def test_told_heating_survives_a_restart() -> None:
    seven = _at(2026, 11, 2, 7, 0)
    cylinder = _cylinder(38.0, _at(2026, 11, 2, 6, 20), [Occurrence(seven, frozenset({"t"}))])
    cylinder.run(2)
    cylinder.restart()
    cylinder.occurrences = []
    cylinder.run(2)
    cylinder.occurrences = [Occurrence(seven, frozenset({"t"}))]
    cylinder.run(2)

    assert len(cylinder.heating_events()) == 1
