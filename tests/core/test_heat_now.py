"""Heat now (spec 4.6), with version 1's ticket 12 heat-now cases (T 42, D 1)."""

from dataclasses import replace
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from custom_components.hot_water_ready.core.controller import Occurrence, Settings

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
NOON = datetime(2026, 11, 2, 12, 0, tzinfo=LISBON)


def _cylinder(water: float, **settings: float) -> Cylinder:
    return Cylinder(now=NOON, water=water, settings=replace(Settings(), **settings))


def _kinds(cylinder: Cylinder) -> list[tuple[str, list[str]]]:
    return [(e.kind, sorted(e.members)) for _, e in cylinder.events]


def test_pressed_at_41_5_heats_tells_at_42_and_stops_at_43() -> None:
    cylinder = _cylinder(41.5, keep_hot_minutes=30)
    cylinder.heat_now("tiago")
    cylinder.run(15)

    assert [(t.on, t.probe) for t in cylinder.toggles] == [(True, 41.5), (False, 43.0)]
    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]
    ((_, ready),) = [(at, e) for at, e in cylinder.events if e.kind == "heat_now_ready"]
    assert ready.temperature == 42.0


def test_pressed_at_42_says_ready_without_heating() -> None:
    cylinder = _cylinder(42.0)
    cylinder.heat_now("tiago")
    cylinder.run(6)

    assert cylinder.toggles == []
    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]
    assert cylinder.controller.state.heat_now is None


def _told_at(cylinder: Cylinder) -> datetime:
    return next(at for at, e in cylinder.events if e.kind == "heat_now_ready")


def _off_at(cylinder: Cylinder) -> datetime:
    return [t.at for t in cylinder.toggles if not t.on][-1]


def test_after_ready_it_keeps_heating_for_five_minutes_then_stops() -> None:
    # Today's case: a shower draws the water down faster than the element heats, so it never
    # reaches 43. The request ends five minutes after the message, still heating.
    cylinder = _cylinder(41.5)
    cylinder.heat_now("tiago")
    cylinder.run(3.5)
    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]
    cylinder.run(4, draw_per_minute=0.4)
    assert cylinder.relay
    cylinder.run(1, draw_per_minute=0.4)

    assert not cylinder.relay
    assert cylinder.controller.state.heat_now is None
    assert abs((_off_at(cylinder) - _told_at(cylinder)) - timedelta(minutes=5)) <= timedelta(
        minutes=0.2
    )


def test_inside_the_time_it_heats_again_when_the_water_falls_to_41() -> None:
    cylinder = _cylinder(41.5)
    cylinder.cool_per_minute = 0.3
    cylinder.heat_now("tiago", keep_minutes=30)
    cylinder.run(25)

    assert [t.on for t in cylinder.toggles][:3] == [True, False, True]
    assert cylinder.controller.state.heat_now is not None
    cylinder.run(10)
    assert cylinder.controller.state.heat_now is None
    assert not cylinder.relay


def test_the_time_chosen_on_the_card_replaces_the_default() -> None:
    cylinder = _cylinder(42.0)
    cylinder.heat_now("tiago", keep_minutes=15)
    cylinder.run(14)
    assert cylinder.controller.state.heat_now is not None
    cylinder.run(1.5)

    assert cylinder.controller.state.heat_now is None


def test_no_time_ends_the_request_with_the_message() -> None:
    cylinder = _cylinder(41.5)
    cylinder.heat_now("tiago", keep_minutes=0)
    cylinder.run(3.5)

    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]
    assert not cylinder.relay
    assert cylinder.controller.state.heat_now is None


def test_each_keeps_their_own_time_and_the_longest_holds_the_request() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago", keep_minutes=30)
    cylinder.heat_now("maria", keep_minutes=5)
    cylinder.run(60)

    told = _told_at(cylinder)
    heat_now = cylinder.controller.state.heat_now
    assert heat_now is not None
    assert heat_now.keep_until == told + timedelta(minutes=30)
    assert heat_now.until == {"tiago": told + timedelta(minutes=30)}  # Maria's 5 min are up


def test_someone_asking_inside_the_time_starts_it_again() -> None:
    cylinder = _cylinder(42.0)
    cylinder.heat_now("tiago")
    cylinder.run(4)
    cylinder.heat_now("maria")
    cylinder.run(4)
    assert cylinder.controller.state.heat_now is not None
    cylinder.run(1.5)

    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"]), ("heat_now_ready", ["maria"])]
    assert cylinder.controller.state.heat_now is None


def test_the_time_is_capped_at_two_hours() -> None:
    cylinder = _cylinder(42.0)
    cylinder.heat_now("tiago", keep_minutes=500)

    heat_now = cylinder.controller.state.heat_now
    assert heat_now is not None
    assert heat_now.keep_until == NOON + timedelta(minutes=120)


def test_a_long_heat_and_a_long_time_are_not_cut_by_the_time_limit() -> None:
    # From 20 C at 0.1 C a minute the water is ready after 220 min; two hours on top pass the
    # 255-minute limit, which only applies while nobody has been told yet.
    cylinder = _cylinder(20.0)
    cylinder.heat_per_minute = 0.1
    cylinder.heat_now("tiago", keep_minutes=120)
    cylinder.run(300)

    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]
    assert cylinder.controller.state.heat_now is not None


def test_pressed_at_41_9_heats_because_ready_means_the_target() -> None:
    cylinder = _cylinder(41.9)
    cylinder.heat_now("tiago")
    cylinder.run(15)

    assert cylinder.toggles[0].on
    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]


def test_several_people_ask_and_each_is_told() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.run(5)
    cylinder.heat_now("maria")  # "Avisar-me também"
    cylinder.run(60)

    assert _kinds(cylinder) == [("heat_now_ready", ["maria", "tiago"])]
    assert len([t for t in cylinder.toggles if t.on]) == 1


def test_asking_after_it_is_ready_tells_at_once() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.run(45)  # ready at 42 about 41 min in, still heating towards 43
    cylinder.heat_now("maria")
    cylinder.run(0.1)

    assert _kinds(cylinder)[-1] == ("heat_now_ready", ["maria"])


def test_cancelling_stops_the_heater() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.run(5)
    cylinder.cancel_heat_now()
    cylinder.run(1)

    assert not cylinder.relay
    assert cylinder.controller.state.heat_now is None
    assert all(e.kind != "heat_now_ready" for _, e in cylinder.events)


def test_one_person_withdrawing_keeps_heating_for_the_others() -> None:
    # Mockup A: a member's "Cancelar" removes only their own request (spec 4.6: each is told).
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.heat_now("maria")
    cylinder.run(5)
    cylinder.controller.withdraw_heat_now("maria")
    cylinder.run(60)

    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]


def test_the_last_person_withdrawing_ends_the_request() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.run(5)
    cylinder.controller.withdraw_heat_now("tiago")
    cylinder.run(1)

    assert not cylinder.relay
    assert cylinder.controller.state.heat_now is None


def test_withdrawing_someone_who_did_not_ask_changes_nothing() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.run(1)
    cylinder.controller.withdraw_heat_now("maria")
    cylinder.run(1)

    assert cylinder.relay
    assert cylinder.controller.state.heat_now is not None
    assert cylinder.controller.state.heat_now.requesters == {"tiago"}


def test_cancelling_leaves_an_open_window_heating() -> None:
    cylinder = _cylinder(35.0)
    cylinder.occurrences = [Occurrence(NOON + timedelta(minutes=30), frozenset({"maria"}))]
    cylinder.heat_now("tiago")
    cylinder.run(2)
    cylinder.cancel_heat_now()
    cylinder.run(1)

    assert cylinder.relay  # Maria's window (lead from 35 C is 64 min) is open and wants it


def test_a_request_past_its_time_limit_ends_with_a_message() -> None:
    # The element is dead: the water never rises. After the cap plus the margin (255 min) the
    # request ends and the people who asked are told.
    cylinder = _cylinder(30.0)
    cylinder.heat_per_minute = 0.0
    cylinder.heat_now("tiago")
    cylinder.run(254)
    assert cylinder.relay
    cylinder.run(2)

    assert not cylinder.relay
    assert _kinds(cylinder) == [("heat_now_timeout", ["tiago"])]


def test_heat_now_survives_a_restart() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.run(5)
    cylinder.restart()
    cylinder.run(60)

    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]


def test_heat_now_state_round_trips() -> None:
    cylinder = _cylinder(35.0)
    cylinder.heat_now("tiago")
    cylinder.run(1)
    state = cylinder.controller.state

    assert type(state).from_dict(state.to_dict()) == state


def test_heat_now_state_round_trips_while_keeping_hot() -> None:
    cylinder = _cylinder(42.0)
    cylinder.heat_now("tiago", keep_minutes=15)
    cylinder.run(1)
    state = cylinder.controller.state
    assert state.heat_now is not None
    assert state.heat_now.keep_until is not None

    assert type(state).from_dict(state.to_dict()) == state


def test_a_request_saved_before_the_time_existed_still_loads() -> None:
    from custom_components.hot_water_ready.core.controller import ControllerState  # noqa: PLC0415

    saved = {
        "started_at": "2026-11-02T12:00:00+00:00",
        "deadline": "2026-11-02T16:15:00+00:00",
        "target": 42.0,
        "requesters": ["tiago"],
        "told": [],
        "starting": False,
    }
    state = ControllerState.from_dict({"heating": True, "heat_now": saved})

    assert state.heat_now is not None
    assert state.heat_now.keeps == {"tiago": Settings().keep_hot_minutes}
    assert state.heat_now.keep_until is None
    assert state.heat_now.targets == {}


def test_a_request_saved_with_one_time_for_everyone_still_loads() -> None:
    from custom_components.hot_water_ready.core.controller import ControllerState  # noqa: PLC0415

    saved = {
        "started_at": "2026-11-02T12:00:00+00:00",
        "deadline": "2026-11-02T16:15:00+00:00",
        "target": 42.0,
        "requesters": ["maria", "tiago"],
        "told": ["tiago"],
        "starting": False,
        "keep_minutes": 30.0,
        "keep_until": "2026-11-02T12:40:00+00:00",
    }
    state = ControllerState.from_dict({"heating": True, "heat_now": saved})

    assert state.heat_now is not None
    assert state.heat_now.keeps == {"maria": 30.0, "tiago": 30.0}
    assert state.heat_now.until == {"tiago": datetime.fromisoformat("2026-11-02T12:40:00+00:00")}


def test_cancelling_inside_a_window_that_is_not_heating_switches_off() -> None:
    # The window is open with the water inside the band (41.5, not heating). Heat now heats
    # it; cancelling hands the relay back to the window, which does not want it.
    cylinder = _cylinder(42.5)
    cylinder.occurrences = [Occurrence(NOON + timedelta(minutes=10), frozenset({"maria"}))]
    cylinder.run(1)  # the window opens with the water ready, so it does not heat
    assert cylinder.controller.state.window is not None
    cylinder.water = 41.5  # cools inside the band: above the 41 restart point
    cylinder.run(1)
    assert not cylinder.relay
    cylinder.heat_now("tiago")
    assert cylinder.relay
    cylinder.cancel_heat_now()

    assert not cylinder.relay


def test_heat_now_state_from_corrupt_data_is_refused() -> None:
    import pytest  # noqa: PLC0415

    from custom_components.hot_water_ready.core.controller import ControllerState  # noqa: PLC0415

    good = {
        "started_at": "2026-11-02T12:00:00+00:00",
        "deadline": "2026-11-02T16:15:00+00:00",
        "target": 42.0,
        "requesters": ["tiago"],
        "told": [],
        "starting": False,
    }
    for bad in (
        {**good, "starting": "false"},
        {**good, "requesters": "tiago"},
        {**good, "deadline": "2026-11-02T16:15:00"},
        {k: v for k, v in good.items() if k != "target"},
    ):
        with pytest.raises(ValueError, match="controller state"):
            ControllerState.from_dict({"heating": True, "heat_now": bad})


def test_a_timeout_carries_no_temperature() -> None:
    cylinder = _cylinder(30.0)
    cylinder.heat_per_minute = 0.0
    cylinder.heat_now("tiago")
    cylinder.run(256)

    ((_, timeout),) = [(at, e) for at, e in cylinder.events if e.kind == "heat_now_timeout"]
    assert timeout.temperature is None
