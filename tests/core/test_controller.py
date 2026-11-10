"""The temperature band and windows (spec 4.1, 4.2, 4.4), with version 1's ticket 12 scenarios.

Target T 42 and margin D 1 unless a test says otherwise: ready at 42.0, stop at 43.0, restart at
41.0 while the window is still open.
"""

from dataclasses import replace
from datetime import datetime, timedelta
import itertools
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.controller import (
    Controller,
    ControllerState,
    Occurrence,
    Settings,
    minutes_to_ready,
)

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
SEVEN = datetime(2026, 11, 2, 7, 0, tzinfo=LISBON)
TIAGO = frozenset({"tiago"})


def _cylinder(water: float, *, minutes_before: float = 120, **settings: float) -> Cylinder:
    cylinder = Cylinder(
        now=SEVEN - timedelta(minutes=minutes_before),
        water=water,
        settings=replace(Settings(), **settings),
    )
    cylinder.occurrences = [Occurrence(at=SEVEN, members=TIAGO)]
    return cylinder


def _probe_at(cylinder: Cylinder, on: bool, nth: int = 0) -> float:
    return [t.probe for t in cylinder.toggles if t.on is on][nth]


def test_cold_water_is_hot_by_the_ready_time() -> None:
    cylinder = _cylinder(30.0, minutes_before=180)
    cylinder.run_until(SEVEN)

    ((ready_at, ready),) = cylinder.ready_events()
    assert ready_at <= SEVEN
    assert ready.temperature == 42.0
    assert ready.members == TIAGO


def test_window_opens_by_the_lead() -> None:
    # Lead = (42 - 30) x 7 min/C + 15 min = 99 min before 07:00, so 05:21.
    cylinder = _cylinder(30.0, minutes_before=180)
    cylinder.run_until(SEVEN)

    assert cylinder.toggles[0].on
    assert cylinder.toggles[0].at == SEVEN - timedelta(minutes=99)
    ((started_at, started),) = cylinder.heating_events()
    assert started_at == SEVEN - timedelta(minutes=99)
    # Told when the water reaches 42, without the margin: (42 - 30) x 7 = 84 min (ticket 10).
    assert started.minutes == 84


def test_lead_is_capped() -> None:
    cylinder = _cylinder(5.0, minutes_before=400, lead_cap_minutes=240)
    cylinder.run_until(SEVEN)

    assert cylinder.toggles[0].at == SEVEN - timedelta(minutes=240)


def test_warm_water_keeps_the_heater_off() -> None:
    cylinder = _cylinder(45.0)
    cylinder.run_until(SEVEN + timedelta(minutes=30))

    assert cylinder.toggles == []
    assert cylinder.heating_events() == []
    ((ready_at, _),) = cylinder.ready_events()
    assert ready_at == SEVEN  # warm water shortens the lead to nothing


def test_window_from_40_heats_at_once_and_is_ready_at_42() -> None:
    cylinder = _cylinder(40.0, minutes_before=60)
    cylinder.run_until(SEVEN)

    assert _probe_at(cylinder, True) == 40.0
    ((_, ready),) = cylinder.ready_events()
    assert ready.temperature == 42.0
    assert len(cylinder.heating_events()) == 1


def test_relay_off_at_43_not_43_1() -> None:
    cylinder = _cylinder(40.0, minutes_before=60)
    cylinder.run_until(SEVEN)

    assert _probe_at(cylinder, False) == 43.0


def test_restarts_at_41_while_the_window_is_open() -> None:
    cylinder = _cylinder(40.0, minutes_before=60)
    cylinder.run_until(SEVEN - timedelta(minutes=10))  # stopped at 43 around 06:49
    cylinder.run(4, draw_per_minute=0.6)  # a shower drawn

    assert _probe_at(cylinder, True, nth=1) == 41.0
    cylinder.run(20)
    assert _probe_at(cylinder, False, nth=1) == 43.0
    assert len(cylinder.ready_events()) == 1


def test_window_opening_at_42_is_ready_at_once_without_heating() -> None:
    cylinder = _cylinder(42.0, minutes_before=30)
    cylinder.run_until(SEVEN)

    assert cylinder.toggles == []
    assert cylinder.heating_events() == []
    ((_, ready),) = cylinder.ready_events()
    assert ready.temperature == 42.0


def test_window_opening_at_41_5_heats_to_43() -> None:
    cylinder = _cylinder(41.5, minutes_before=30)
    cylinder.run_until(SEVEN)

    assert _probe_at(cylinder, True) == 41.5
    assert _probe_at(cylinder, False) == 43.0
    ((_, ready),) = cylinder.ready_events()
    assert ready.temperature == 42.0


def test_margin_zero_stops_at_target_and_does_not_chatter() -> None:
    cylinder = _cylinder(41.5, minutes_before=30, margin=0.0)
    cylinder.cool_per_minute = 0.05
    cylinder.run_until(SEVEN + timedelta(minutes=14))

    assert _probe_at(cylinder, False) == 42.0
    assert _probe_at(cylinder, True, nth=1) == 41.9
    assert _probe_at(cylinder, False, nth=1) == 42.0
    probes = [t.probe for t in cylinder.toggles]
    assert all(a != b for a, b in itertools.pairwise(probes))
    assert len(cylinder.ready_events()) == 1


def test_window_closes_after_the_grace() -> None:
    cylinder = _cylinder(40.0, minutes_before=60)
    cylinder.run_until(SEVEN + timedelta(minutes=14))
    cylinder.run(30, draw_per_minute=0.5)

    last = cylinder.toggles[-1]
    assert not last.on
    assert last.at <= SEVEN + timedelta(minutes=15, seconds=60)
    assert not cylinder.relay


def test_heating_carries_on_until_ready_even_when_the_lead_shrinks() -> None:
    # Started 99 min early from 30 C; the water then warms far faster than expected (sun), so
    # a fresh lead would say "not yet". The window was committed: it heats on to 43.
    cylinder = _cylinder(30.0, minutes_before=100)
    cylinder.run(2)
    assert cylinder.relay
    cylinder.water = 38.0
    cylinder.run(1)
    assert cylinder.relay


def test_heating_carries_on_past_the_window_until_the_water_is_ready() -> None:
    # Spec 4.2: once started it carries on until the water is ready, even past the grace. A
    # heater that never gets there is the fault guard's business (not rising).
    cylinder = _cylinder(20.0, minutes_before=20)
    cylinder.heat_per_minute = 0.1
    cylinder.run_until(SEVEN + timedelta(minutes=16))
    assert cylinder.relay

    cylinder.run_until(SEVEN + timedelta(minutes=240))
    ((ready_at, ready),) = cylinder.ready_events()
    assert ready_at > SEVEN + timedelta(minutes=15)
    assert ready.temperature == 42.0
    assert not cylinder.relay  # past the window, it stops once ready
    assert _probe_at(cylinder, False) == 42.0


def test_held_at_41_1_the_relay_stays_off() -> None:
    cylinder = _cylinder(40.0, minutes_before=60)
    cylinder.run_until(SEVEN - timedelta(minutes=10))  # stopped at 43 around 06:49
    cylinder.water = 41.1
    cylinder.run(5)

    assert not cylinder.relay
    cylinder.water = 41.0
    cylinder.run(1)
    assert cylinder.relay


def test_minutes_to_ready_from_the_rate() -> None:
    assert minutes_to_ready(Settings(), 40.0) == 14  # (42 - 40) x 7
    assert minutes_to_ready(Settings(), 42.5) == 0
    assert minutes_to_ready(Settings(), None) is None


def test_target_raised_in_a_window_heats_to_the_new_band() -> None:
    cylinder = _cylinder(43.5, minutes_before=10)
    cylinder.run(6)  # the window opened at 06:55:30 with the water above 42
    assert not cylinder.relay
    assert len(cylinder.ready_events()) == 1

    cylinder.controller.settings = replace(cylinder.settings, target=44.0)
    cylinder.run(20)
    assert _probe_at(cylinder, True) == 43.5
    assert _probe_at(cylinder, False) == 45.0
    assert len(cylinder.ready_events()) == 1


def test_nothing_requested_nothing_heats() -> None:
    cylinder = _cylinder(35.0)
    cylinder.occurrences = []
    cylinder.run(180)

    assert cylinder.toggles == []


def test_restart_mid_heat_carries_on_and_reports_ready_once() -> None:
    cylinder = _cylinder(40.0, minutes_before=30)
    cylinder.run(5)
    assert cylinder.relay
    cylinder.restart()
    cylinder.run_until(SEVEN)

    assert len(cylinder.ready_events()) == 1
    assert _probe_at(cylinder, False) == 43.0


def test_restart_after_ready_does_not_report_ready_again() -> None:
    cylinder = _cylinder(40.0, minutes_before=60)
    cylinder.run(45)
    assert len(cylinder.ready_events()) == 1
    cylinder.restart()
    cylinder.run(10)

    assert len(cylinder.ready_events()) == 1


def test_restart_with_a_window_open_at_41_5_and_no_saved_state_heats_to_43() -> None:
    cylinder = _cylinder(41.5, minutes_before=10)
    cylinder.restart(keep_state=False)
    cylinder.run(20)

    assert _probe_at(cylinder, True) == 41.5
    assert _probe_at(cylinder, False) == 43.0
    assert len(cylinder.ready_events()) == 1


def test_late_probe_after_a_restart_waits_then_heats() -> None:
    cylinder = _cylinder(38.0, minutes_before=30)
    cylinder.probe_online = False
    cylinder.run(3)
    assert cylinder.toggles == []

    cylinder.probe_online = True
    cylinder.run(1)
    assert cylinder.relay
    assert _probe_at(cylinder, True) == 38.0


def test_probe_lost_while_heating_holds_the_relay() -> None:
    # The fault guard (ticket 06) decides when a silent probe stops heating; the band holds.
    cylinder = _cylinder(38.0, minutes_before=30)
    cylinder.run(2)
    cylinder.probe_online = False
    cylinder.run(2)

    assert cylinder.relay


def test_state_round_trips_through_plain_data() -> None:
    cylinder = _cylinder(40.0, minutes_before=60)
    cylinder.run(5)
    state = cylinder.controller.state

    assert type(state).from_dict(state.to_dict()) == state


def test_state_from_corrupt_data_is_refused() -> None:
    for bad in (
        [1],
        {"heating": True, "window": "nonsense"},
        {"heating": True, "window": {"ready_at": "2026-11-02T07:00:00"}},
        {
            "heating": True,
            "window": {
                "ready_at": "2026-11-02T07:00:00",  # naive: would break every comparison
                "end": "2026-11-02T07:15:00",
                "members": ["tiago"],
                "target": 42,
                "ready_reported": False,
            },
        },
        {"heating": False, "off_until": "2026-11-02T07:15:00"},  # naive
        {"heating": False, "off_until": 7},
    ):
        with pytest.raises(ValueError, match="controller state"):
            ControllerState.from_dict(bad)


@pytest.mark.parametrize(("lead_water", "heats"), [(None, False), (36.35, True)])
def test_a_colder_middle_brings_the_start_forward(lead_water: float | None, heats: bool) -> None:
    """4 Nov top-up: top 39.4, middle 33.3. From the top alone the lead is 33 min, so at 06:20
    nothing heats; from the two probes' mean (36.35) it is 55 min, and heating has begun."""
    controller = Controller(Settings())

    decision = controller.step(
        now=SEVEN - timedelta(minutes=40),
        temperature=39.4,
        lead_temperature=lead_water,
        occurrences=[Occurrence(at=SEVEN, members=TIAGO)],
    )

    assert decision.relay_on is heats


def test_ready_and_the_band_still_follow_the_top_probe() -> None:
    """The middle only moves the start: the top at the target is ready, whatever the middle."""
    controller = Controller(Settings())

    decision = controller.step(
        now=SEVEN - timedelta(minutes=10),
        temperature=42.0,
        lead_temperature=30.0,
        occurrences=[Occurrence(at=SEVEN, members=TIAGO)],
    )

    assert decision.relay_on is False
    assert [event.kind for event in decision.events] == ["ready"]
