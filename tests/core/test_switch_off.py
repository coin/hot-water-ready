"""Switching the heater off now: the heat-now request ends and the open window is skipped."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from custom_components.hot_water_ready.core.controller import Occurrence

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
SIX = datetime(2026, 11, 4, 6, 0, tzinfo=LISBON)
SEVEN = SIX + timedelta(hours=1)


def _morning() -> Cylinder:
    # Water at 35: Maria's 07:00 has a lead of (42 - 35) x 7 + 15 = 64 min, so heating is on at
    # 06:00. Rui's 07:30 is close enough to join her window.
    cylinder = Cylinder(now=SIX, water=35.0)
    cylinder.occurrences = [
        Occurrence(SEVEN, frozenset({"maria"})),
        Occurrence(SEVEN + timedelta(minutes=30), frozenset({"rui"})),
    ]
    cylinder.step()
    return cylinder


def _switch_off(cylinder: Cylinder) -> frozenset[str]:
    lost = cylinder.controller.switch_off(cylinder.now)
    cylinder.step()
    return lost


def test_switching_off_stops_heating_and_says_who_loses_out() -> None:
    cylinder = _morning()
    cylinder.heat_now("ana")
    cylinder.run(30)
    assert cylinder.relay

    lost = _switch_off(cylinder)

    assert lost == {"maria", "rui", "ana"}
    assert not cylinder.relay
    assert cylinder.controller.state.heat_now is None


def test_it_stays_off_until_the_skipped_window_would_have_ended() -> None:
    cylinder = _morning()
    cylinder.run(35)
    _switch_off(cylinder)  # 06:35, in the window for 07:00 and 07:30

    cylinder.run_until(SEVEN + timedelta(minutes=44))
    assert not any(t.on for t in cylinder.toggles if t.at > SIX + timedelta(minutes=35))
    assert cylinder.ready_events() == []  # nobody is told "ready" for a skipped time


def test_after_the_skipped_window_it_works_normally_again() -> None:
    cylinder = _morning()
    cylinder.occurrences.append(Occurrence(SEVEN + timedelta(hours=3), frozenset({"maria"})))
    cylinder.run(35)
    _switch_off(cylinder)

    cylinder.run_until(SEVEN + timedelta(hours=3))

    assert [at for at, _ in cylinder.ready_events()] != []
    first_on = next(t.at for t in cylinder.toggles if t.on and t.at > SIX + timedelta(minutes=35))
    assert first_on >= SEVEN + timedelta(minutes=45)  # the end of the skipped window


def test_whoever_switches_off_is_not_among_those_told() -> None:
    cylinder = _morning()
    cylinder.heat_now("tiago")
    cylinder.run(5)

    lost = cylinder.controller.switch_off(cylinder.now, by={"tiago", "person.tiago"})

    assert lost == {"maria", "rui"}


def test_heat_now_still_works_while_switched_off() -> None:
    cylinder = _morning()
    cylinder.run(35)
    _switch_off(cylinder)

    cylinder.heat_now("ana")

    assert cylinder.relay


def test_switching_off_with_nothing_to_skip_only_ends_the_request() -> None:
    cylinder = Cylinder(now=SIX, water=35.0)
    cylinder.heat_now("tiago")

    assert _switch_off(cylinder) == {"tiago"}
    assert not cylinder.relay
    cylinder.heat_now("tiago")
    assert cylinder.relay  # nothing was skipped, so nothing holds it off


def test_a_restart_keeps_it_off() -> None:
    cylinder = _morning()
    cylinder.run(35)
    _switch_off(cylinder)

    cylinder.restart()
    cylinder.run(10)

    assert not cylinder.relay
