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
    cylinder = _cylinder(41.5)
    cylinder.heat_now("tiago")
    cylinder.run(15)

    assert [(t.on, t.probe) for t in cylinder.toggles] == [(True, 41.5), (False, 43.0)]
    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]
    ((_, ready),) = [(at, e) for at, e in cylinder.events if e.kind == "heat_now_ready"]
    assert ready.temperature == 42.0
    assert cylinder.controller.state.heat_now is None


def test_pressed_at_42_says_ready_without_heating() -> None:
    cylinder = _cylinder(42.0)
    cylinder.heat_now("tiago")
    cylinder.run(5)

    assert cylinder.toggles == []
    assert _kinds(cylinder) == [("heat_now_ready", ["tiago"])]
    assert cylinder.controller.state.heat_now is None


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
