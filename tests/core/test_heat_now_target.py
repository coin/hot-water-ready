"""Heat now to a temperature of one's own (decision 16): T 42, D 1, the higher wins."""

from dataclasses import replace
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from custom_components.hot_water_ready.core.controller import (
    ControllerState,
    Occurrence,
    Settings,
)

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
NOON = datetime(2026, 11, 2, 12, 0, tzinfo=LISBON)


def _cylinder(water: float, **settings: float) -> Cylinder:
    return Cylinder(now=NOON, water=water, settings=replace(Settings(), **settings))


def _told(cylinder: Cylinder) -> list[tuple[list[str], float | None]]:
    return [
        (sorted(e.members), e.temperature) for _, e in cylinder.events if e.kind == "heat_now_ready"
    ]


def _switches(cylinder: Cylinder) -> list[tuple[bool, float]]:
    return [(t.on, t.probe) for t in cylinder.toggles]


def test_a_higher_temperature_is_told_at_it_and_stops_a_margin_above() -> None:
    cylinder = _cylinder(40.0, keep_hot_minutes=0)
    cylinder.heat_now("tiago", target=45)
    cylinder.run(60)

    assert _told(cylinder) == [(["tiago"], 45.0)]
    assert _switches(cylinder) == [(True, 40.0), (False, 45.0)]  # keep time 0: ends at the message


def test_with_time_to_keep_it_the_band_is_around_the_chosen_temperature() -> None:
    cylinder = _cylinder(40.0)
    cylinder.heat_now("tiago", keep_minutes=30, target=45)
    cylinder.run(60)

    assert _switches(cylinder)[:2] == [(True, 40.0), (False, 46.0)]


def test_a_lower_temperature_heats_only_to_it() -> None:
    cylinder = _cylinder(36.0, keep_hot_minutes=0)
    cylinder.heat_now("tiago", target=38)
    cylinder.run(60)

    assert _told(cylinder) == [(["tiago"], 38.0)]
    assert _switches(cylinder) == [(True, 36.0), (False, 38.0)]
    assert cylinder.controller.state.heat_now is None


def test_water_already_at_a_lower_temperature_is_told_at_once() -> None:
    cylinder = _cylinder(40.0)
    cylinder.heat_now("tiago", target=38)

    assert _told(cylinder) == [(["tiago"], 40.0)]
    assert cylinder.toggles == []


def test_the_higher_wins_and_each_is_told_at_their_own() -> None:
    cylinder = _cylinder(40.0, keep_hot_minutes=0)
    cylinder.heat_now("maria")
    cylinder.heat_now("tiago", target=45)
    cylinder.run(60)

    assert _told(cylinder) == [(["maria"], 42.0), (["tiago"], 45.0)]
    assert _switches(cylinder) == [(True, 40.0), (False, 45.0)]


def test_a_lower_temperature_does_not_cut_someone_elses() -> None:
    cylinder = _cylinder(36.0, keep_hot_minutes=0)
    cylinder.heat_now("tiago", target=38)
    cylinder.heat_now("maria")
    cylinder.run(60)

    assert _told(cylinder) == [(["tiago"], 38.0), (["maria"], 42.0)]
    assert _switches(cylinder) == [(True, 36.0), (False, 42.0)]


def test_when_the_higher_ones_time_is_up_the_band_falls_to_the_others() -> None:
    cylinder = _cylinder(40.0)
    cylinder.heat_now("maria", keep_minutes=30)
    cylinder.heat_now("tiago", keep_minutes=5, target=45)
    cylinder.run(40)
    heat_now = cylinder.controller.state.heat_now

    assert heat_now is not None
    assert heat_now.requesters == frozenset({"maria"})
    assert cylinder.controller.target_now() == 42.0


def test_withdrawing_the_higher_request_stops_heating_above_the_others() -> None:
    cylinder = _cylinder(40.0, keep_hot_minutes=30)
    cylinder.heat_now("maria")
    cylinder.heat_now("tiago", target=45)
    cylinder.run(20)  # about 43.4: Maria told, still heating for Tiago
    assert cylinder.relay
    cylinder.controller.withdraw_heat_now("tiago")
    cylinder.step()  # Home Assistant steps at once

    assert not cylinder.relay
    assert cylinder.controller.state.heat_now is not None  # Maria's time goes on


def test_a_temperature_outside_30_to_45_is_brought_inside() -> None:
    high = _cylinder(30.0)
    high.heat_now("tiago", target=60)
    low = _cylinder(25.0)
    low.heat_now("tiago", target=20)

    assert high.controller.heat_now_target("tiago") == 45.0
    assert low.controller.heat_now_target("tiago") == 30.0


def test_asking_again_for_another_temperature_is_told_again() -> None:
    cylinder = _cylinder(40.0, keep_hot_minutes=30)
    cylinder.heat_now("tiago", target=38)
    cylinder.heat_now("tiago", target=44)
    cylinder.run(60)

    assert _told(cylinder) == [(["tiago"], 40.0), (["tiago"], 44.0)]


def test_asking_again_for_the_heaters_target_drops_ones_own() -> None:
    cylinder = _cylinder(40.0)
    cylinder.heat_now("tiago", target=45)
    cylinder.heat_now("tiago")

    assert cylinder.controller.heat_now_target("tiago") == 42.0


def test_an_open_window_above_a_lower_request_keeps_its_target() -> None:
    cylinder = _cylinder(39.0, keep_hot_minutes=0)
    cylinder.occurrences = [Occurrence(NOON + timedelta(minutes=30), frozenset({"maria"}))]
    cylinder.heat_now("tiago", target=36)
    cylinder.run(40)

    assert _told(cylinder) == [(["tiago"], 39.0)]
    assert (False, 43.0) in _switches(cylinder)


def test_the_time_limit_still_ends_a_request_nobody_was_told_about() -> None:
    cylinder = _cylinder(30.0)
    cylinder.heat_per_minute = 0.0  # an element that does nothing
    cylinder.heat_now("tiago", target=45)
    cylinder.run(256)

    kinds = [e.kind for _, e in cylinder.events]
    assert kinds == ["heat_now_timeout"]
    assert cylinder.controller.state.heat_now is None


def test_own_temperatures_survive_a_restart() -> None:
    cylinder = _cylinder(40.0)
    cylinder.heat_now("tiago", keep_minutes=15, target=44)
    cylinder.heat_now("maria")
    cylinder.run(20)
    state = cylinder.controller.state

    assert ControllerState.from_dict(state.to_dict()) == state
    cylinder.restart()
    assert cylinder.controller.heat_now_target("tiago") == 44.0


def test_joining_higher_with_the_water_inside_the_new_band_heats_at_once() -> None:
    # 44.5 is above 45 - 1, so only a raised target starts the element, not the band's restart.
    cylinder = _cylinder(44.5, keep_hot_minutes=30)
    cylinder.heat_now("maria")  # told at once
    assert not cylinder.relay
    cylinder.heat_now("tiago", target=45)

    assert cylinder.relay
