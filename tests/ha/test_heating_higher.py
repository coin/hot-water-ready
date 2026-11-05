"""Heating higher for small tanks: options, the card's warning, the thermostat (ticket 10)."""

from datetime import time, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import MARIA, SENSOR, TIAGO, local, member
from .fakes import FakeThermostat

SMALL_TANK = {"tank_litres": 80, "element_watts": 1500}
MONDAY = frozenset({0})


async def _three_showers(entry: MockConfigEntry) -> None:
    """Tiago at 07:00 and 07:30, Maria at 07:15: three winter showers in 30 minutes."""
    heater = entry.runtime_data
    await heater.async_add_ready_time(TIAGO, time(7, 0), MONDAY, True)
    await heater.async_add_ready_time(MARIA, time(7, 15), MONDAY, True)
    await heater.async_add_ready_time(TIAGO, time(7, 30), MONDAY, True)


async def _warning(
    hass: HomeAssistant, ws: WebSocketGenerator, entry: MockConfigEntry
) -> dict[str, Any] | None:
    client = await ws(hass)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": entry.entry_id}
    )
    assert (await client.receive_json())["success"]
    warning: dict[str, Any] | None = (await client.receive_json())["event"]["cluster_warning"]
    return warning


async def test_the_options_take_the_tank(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    flow = await hass.config_entries.options.async_init(heater.entry_id)
    result = await hass.config_entries.options.async_configure(flow["flow_id"], SMALL_TANK)
    await hass.async_block_till_done()

    assert result["type"] == "create_entry"
    assert heater.options["tank_litres"] == 80
    assert heater.options["max_temperature"] == 50  # the default, the scald limit


async def test_without_tank_values_there_is_no_warning(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    await _three_showers(heater)

    assert await _warning(hass, hass_ws_client, heater) is None


async def test_a_small_tank_warns_when_even_the_cap_is_not_enough(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    hass.config_entries.async_update_entry(heater, options=SMALL_TANK)
    await hass.async_block_till_done()
    await _three_showers(heater)

    # 3 x 1.7 - 1.5 x 0.5 = 4.35 kWh: 72 C needed, 50 C allowed.
    assert await _warning(hass, hass_ws_client, heater) == {
        "at": local("07:00").isoformat(),
        "needed": 72,
        "cap": 50.0,
    }


async def test_a_thermostat_is_set_to_the_raised_stop_point_and_starts_earlier(
    hass: HomeAssistant, maria_user: MockUser, freezer: FrozenDateTimeFactory
) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Boiler",
        data={"heater_type": "climate", "climate": "climate.boiler", "temperature_sensor": SENSOR},
        options=SMALL_TANK,
        subentries_data=[
            member(TIAGO, "Tiago", "person.tiago", "blue"),
            member(MARIA, "Maria", "person.maria", "green"),
        ],
    )
    entry.add_to_hass(hass)
    hass.states.async_set(SENSOR, "40.0", {"unit_of_measurement": "°C"})
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    thermostat = FakeThermostat(hass, "climate.boiler").install()

    await _three_showers(entry)
    # From 40 C to 50 C: (50 - 40) x 7 + 15 = 85 min before 07:00, so 05:35 (at the normal
    # target it would be 06:31).
    freezer.tick(timedelta(minutes=30))  # 05:30
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert thermostat.commands == []
    freezer.tick(timedelta(minutes=6))  # 05:36
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert thermostat.commands == [("mode", "heat"), ("setpoint", 51.0)]  # the cap plus margin
    # "Ready" is told at the normal target (ticket 10), so the card says when that is:
    # (42 - 40) x 7 = 14 min, not the 70 min to the raised 50.
    assert entry.runtime_data.snapshot(maria_user)["ready_in_minutes"] == 14
