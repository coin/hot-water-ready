"""Each actuator gets one command per change it has to make, no more (relay and thermostat).

Run over a whole window with fakes that answer like real devices: the window opens, the water
heats to the stop point, a shower brings it down, it heats again, the window closes.
"""

from datetime import time, timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
)

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import SENSOR, SWITCH, TIAGO, member
from .fakes import FakeRelay, FakeThermostat

PROFILE = [40.0] * 4 + [41.5, 42.5, 43.0, 43.0, 42.0, 41.0, 41.0, 42.0, 43.0] + [43.0] * 40


async def _run_window(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
    shift: float = 0.0,
) -> None:
    await entry.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    for water in PROFILE:
        hass.states.async_set(SENSOR, str(water + shift), {"unit_of_measurement": "°C"})
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()


async def test_a_relay_is_switched_once_per_change(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    relay = FakeRelay(hass, SWITCH).install()
    await _run_window(hass, heater, freezer)

    # On at the window, off at 43, on again at 41, off at 43: nothing repeated.
    assert relay.commands == ["turn_on", "turn_off", "turn_on", "turn_off"]


async def test_a_thermostat_is_set_once_per_change(
    hass: HomeAssistant, maria_user: MockUser, freezer: FrozenDateTimeFactory
) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Boiler",
        data={"heater_type": "climate", "climate": "climate.boiler", "temperature_sensor": SENSOR},
        subentries_data=[member(TIAGO, "Tiago", "person.tiago", "blue")],
    )
    entry.add_to_hass(hass)
    hass.states.async_set(SENSOR, "40.0", {"unit_of_measurement": "°C"})
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    thermostat = FakeThermostat(hass, "climate.boiler").install()
    await entry.runtime_data.async_set_band(target=42.5)  # stop point 43.5, kept as 44 or 43
    await _run_window(hass, entry, freezer, shift=0.5)  # the band is half a degree higher

    modes = [value for kind, value in thermostat.commands if kind == "mode"]
    setpoints = [value for kind, value in thermostat.commands if kind == "setpoint"]
    assert modes == ["heat", "off", "heat", "off"]
    assert setpoints == [43.5]  # set once; the thermostat's rounding is not argued with
