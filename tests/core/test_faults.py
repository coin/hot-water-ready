"""The fault guard (spec 4.8): four checks, what each does and how each clears."""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.faults import (
    Fault,
    FaultGuard,
    FaultSettings,
    FaultState,
)

LISBON = ZoneInfo("Europe/Lisbon")
T0 = datetime(2026, 11, 2, 6, 0, tzinfo=LISBON)


class Run:
    """Feed the guard one reading per 30 s, the Home Assistant tick."""

    def __init__(self, *, power_sensor: bool = False, target: float = 42.0) -> None:
        self.guard = FaultGuard(FaultSettings())
        self.now = T0
        self.power_sensor = power_sensor
        self.target = target
        self.raised: list[Fault] = []
        self.cleared: list[Fault] = []

    def tick(
        self,
        minutes: float,
        *,
        temperature: float | None,
        relay_on: bool,
        power: float | None = None,
        rise_per_minute: float = 0.0,
    ) -> None:
        steps = round(minutes * 2)
        for _ in range(steps):
            self.now += timedelta(seconds=30)
            report = self.guard.step(
                now=self.now,
                temperature=temperature,
                relay_on=relay_on,
                power=power if self.power_sensor else None,
                target=self.target,
            )
            self.raised += report.raised
            self.cleared += report.cleared
            if temperature is not None:
                temperature = round(temperature + rise_per_minute / 2, 2)

    @property
    def active(self) -> set[Fault]:
        return set(self.guard.state.active)


# --------------------------------------------------------------------------- sensor unavailable


def test_sensor_silent_for_five_minutes_is_a_fault() -> None:
    run = Run()
    run.tick(1, temperature=40.0, relay_on=True)
    run.tick(4.5, temperature=None, relay_on=True)
    assert Fault.SENSOR_UNAVAILABLE not in run.active
    run.tick(0.5, temperature=None, relay_on=True)

    assert run.active == {Fault.SENSOR_UNAVAILABLE}
    assert run.guard.blocks_heating


def test_sensor_fault_clears_after_a_minute_back() -> None:
    run = Run()
    run.tick(1, temperature=40.0, relay_on=False)
    run.tick(6, temperature=None, relay_on=False)
    run.tick(0.5, temperature=40.0, relay_on=False)  # back: the first reading
    assert Fault.SENSOR_UNAVAILABLE in run.active
    run.tick(1, temperature=40.0, relay_on=False)  # a minute of readings after it

    assert run.active == set()
    assert run.cleared == [Fault.SENSOR_UNAVAILABLE]


def test_sensor_never_seen_since_start_counts_from_start() -> None:
    run = Run()
    run.tick(5.5, temperature=None, relay_on=False)  # counted from the first step, at 0.5 min

    assert run.active == {Fault.SENSOR_UNAVAILABLE}


# --------------------------------------------------------------------------- not rising


def test_heating_thirty_minutes_without_a_degree_is_not_rising() -> None:
    run = Run()
    # The run is first seen at the first step (0.5 min), so 30 min of it end at 30.5 min.
    run.tick(30, temperature=35.0, relay_on=True, rise_per_minute=0.03)  # 0.87 C so far
    assert Fault.NOT_RISING not in run.active
    run.tick(0.5, temperature=35.9, relay_on=True)

    assert run.active == {Fault.NOT_RISING}
    assert run.raised == [Fault.NOT_RISING]
    assert run.guard.blocks_heating


def test_a_normal_heating_is_not_a_fault() -> None:
    run = Run()
    run.tick(40, temperature=30.0, relay_on=True, rise_per_minute=0.17)

    assert run.active == set()


def test_a_shower_during_heating_restarts_the_count() -> None:
    # 20 min of slow heating, then a shower drops the water, then 15 min of slow rise: the count
    # restarted at the drop, so 30 min have not passed without rising.
    run = Run()
    run.tick(20, temperature=38.0, relay_on=True, rise_per_minute=0.02)
    run.tick(2, temperature=36.0, relay_on=True, rise_per_minute=-0.5)
    run.tick(15, temperature=35.0, relay_on=True, rise_per_minute=0.02)

    assert Fault.NOT_RISING not in run.active


def test_at_the_target_the_water_need_not_rise() -> None:
    run = Run()
    run.tick(40, temperature=42.5, relay_on=True)

    assert run.active == set()


def test_not_rising_is_cleared_by_resolving_it() -> None:
    run = Run()
    run.tick(31, temperature=35.0, relay_on=True)
    assert run.guard.resolve(Fault.NOT_RISING)

    assert run.active == set()


def test_not_rising_is_cleared_by_a_later_heating_that_rises() -> None:
    run = Run()
    run.tick(31, temperature=35.0, relay_on=True)
    run.tick(10, temperature=35.0, relay_on=False)
    assert Fault.NOT_RISING in run.active
    run.tick(10, temperature=35.0, relay_on=True, rise_per_minute=0.17)  # heated by hand

    assert Fault.NOT_RISING not in run.active
    assert run.cleared == [Fault.NOT_RISING]


def test_not_rising_does_not_clear_by_itself() -> None:
    run = Run()
    run.tick(31, temperature=35.0, relay_on=True)
    run.tick(120, temperature=35.0, relay_on=False)

    assert Fault.NOT_RISING in run.active


# --------------------------------------------------------------------------- power checks


def test_no_consumption_with_a_power_sensor() -> None:
    run = Run(power_sensor=True)
    run.tick(5, temperature=35.0, relay_on=True, power=3.0)  # first seen at 0.5 min
    assert Fault.NO_CONSUMPTION not in run.active
    run.tick(0.5, temperature=35.0, relay_on=True, power=3.0)

    assert run.active == {Fault.NO_CONSUMPTION}
    assert run.guard.blocks_heating


def test_no_consumption_needs_a_power_sensor() -> None:
    run = Run(power_sensor=False)
    run.tick(10, temperature=35.0, relay_on=True, power=0.0, rise_per_minute=0.17)

    assert run.active == set()


def test_relay_stuck_is_reported_only_and_clears_by_itself() -> None:
    run = Run(power_sensor=True)
    run.tick(5.5, temperature=45.0, relay_on=False, power=2700.0)
    assert run.active == {Fault.RELAY_STUCK}
    assert not run.guard.blocks_heating
    run.tick(1.5, temperature=45.0, relay_on=False, power=0.0)  # a minute seen without power

    assert run.active == set()


def test_drawing_power_while_on_is_fine() -> None:
    run = Run(power_sensor=True)
    run.tick(20, temperature=30.0, relay_on=True, power=2700.0, rise_per_minute=0.17)

    assert run.active == set()


# --------------------------------------------------------------------------- settings and state


def test_thresholds_are_settings() -> None:
    run = Run()
    run.guard.settings = FaultSettings(sensor_timeout_minutes=2)
    run.tick(1, temperature=40.0, relay_on=False)
    run.tick(2, temperature=None, relay_on=False)

    assert run.active == {Fault.SENSOR_UNAVAILABLE}


def test_state_round_trips_and_refuses_corrupt_data() -> None:
    import pytest  # noqa: PLC0415

    run = Run(power_sensor=True)
    run.tick(31, temperature=35.0, relay_on=True, power=2700.0)
    state = run.guard.state
    assert FaultState.from_dict(state.to_dict()) == state

    for bad in ({"active": ["melted"]}, {"active": "not_rising"}, {"run_start": "yesterday"}):
        with pytest.raises(ValueError, match="fault state"):
            FaultState.from_dict(bad)


def test_a_dead_heater_letting_the_water_cool_is_not_rising() -> None:
    # The relay is on but nothing heats; the water cools slowly. Small steady falls are not a
    # shower, so the count does not restart and the fault comes at 30 min.
    run = Run()
    run.tick(31, temperature=38.0, relay_on=True, rise_per_minute=-0.01)

    assert run.active == {Fault.NOT_RISING}


def test_a_shower_after_some_rising_restarts_the_count() -> None:
    # Rising slowly for 25 min (0.75 C), then a shower takes 0.35 C in two minutes: the count
    # starts again there, so no fault at minute 32.
    run = Run()
    run.tick(25, temperature=35.0, relay_on=True, rise_per_minute=0.03)
    run.tick(2, temperature=35.75, relay_on=True, rise_per_minute=-0.175)
    run.tick(5, temperature=35.4, relay_on=True, rise_per_minute=0.03)

    assert run.active == set()


def test_a_restart_gives_the_sensor_time_to_come_back() -> None:
    # Saved state from 20 min ago; Home Assistant starts and the sensor has no state yet.
    run = Run()
    run.tick(1, temperature=40.0, relay_on=False)
    saved = FaultState.from_dict(run.guard.state.to_dict())
    run.guard = FaultGuard(FaultSettings(), saved)
    run.now += timedelta(minutes=20)
    run.tick(4.5, temperature=None, relay_on=False)

    assert run.active == set()


def test_relay_stuck_clears_after_a_minute_of_no_power_not_one_reading() -> None:
    run = Run(power_sensor=True)
    run.tick(5.5, temperature=45.0, relay_on=False, power=2700.0)
    run.tick(0.5, temperature=45.0, relay_on=False, power=0.0)
    assert Fault.RELAY_STUCK in run.active
    run.tick(1, temperature=45.0, relay_on=False, power=0.0)

    assert run.active == set()


def test_relay_stuck_clears_when_the_power_sensor_goes() -> None:
    run = Run(power_sensor=True)
    run.tick(5.5, temperature=45.0, relay_on=False, power=2700.0)
    run.power_sensor = False
    run.tick(0.5, temperature=45.0, relay_on=False)

    assert run.active == set()


# --------------------------------------------------------------------------- random heaters


def _dead_or_healthy(seed: int) -> tuple[bool, set[Fault]]:
    """A random heater for 40 min with the relay on: True if it is dead, and the faults raised."""
    import random  # noqa: PLC0415

    rng = random.Random(seed)
    dead = rng.random() < 0.5
    # Dead: flat or cooling slowly. Healthy: at least 0.05 C/min, as slow as a big tank in winter.
    rate = rng.uniform(-0.03, 0.02) if dead else rng.uniform(0.05, 0.3)
    run = Run()
    run.tick(40, temperature=rng.uniform(20, 38), relay_on=True, rise_per_minute=rate)
    return dead, run.active


@pytest.mark.parametrize("seed", range(100))
def test_dead_heaters_are_caught_and_healthy_ones_are_not(seed: int) -> None:
    dead, active = _dead_or_healthy(seed)

    assert (Fault.NOT_RISING in active) == dead, f"seed {seed}"


def test_the_dead_heater_check_can_fail() -> None:
    # Restart the count at every fall, as the spec's words read literally: cooling heaters slip
    # through, and the random check above must notice.
    from unittest.mock import patch  # noqa: PLC0415

    with patch("custom_components.hot_water_ready.core.faults.SHOWER_DROP", 0.0):
        missed = [
            seed
            for seed in range(100)
            if _dead_or_healthy(seed)[0] and not _dead_or_healthy(seed)[1]
        ]
    assert missed


def test_relay_stuck_is_judged_by_the_element_being_told_off() -> None:
    # A thermostat without a heating indication: whether it heats is unknown, but in mode off it
    # must not draw power, so a stuck relay behind it is still reported.
    run = Run(power_sensor=True)
    for _ in range(11):
        run.now += timedelta(seconds=30)
        report = run.guard.step(
            now=run.now,
            temperature=45.0,
            relay_on=None,
            element_off=True,
            power=2700.0,
            target=42.0,
        )
        run.raised += report.raised

    assert run.raised == [Fault.RELAY_STUCK]


def test_no_consumption_needs_to_know_the_element_heats() -> None:
    run = Run(power_sensor=True)
    for _ in range(20):
        run.now += timedelta(seconds=30)
        run.guard.step(
            now=run.now, temperature=35.0, relay_on=None, element_off=False, power=0.0, target=42.0
        )

    assert run.active == set()
