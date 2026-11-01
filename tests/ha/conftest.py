"""Fixtures for the Home Assistant layer tests."""

from typing import Any

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.hot_water_ready.const import (
    CONF_SWITCH,
    CONF_TEMPERATURE_SENSOR,
    DOMAIN,
)

SWITCH = "switch.cylinder_relay"
SENSOR = "sensor.cylinder_temperature"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let Home Assistant load the integration from custom_components."""


@pytest.fixture
def heater_data() -> dict[str, Any]:
    """Entry data for a relay and a temperature sensor."""
    return {CONF_SWITCH: SWITCH, CONF_TEMPERATURE_SENSOR: SENSOR}


@pytest.fixture
def heater_entry(hass: HomeAssistant, heater_data: dict[str, Any]) -> MockConfigEntry:
    """A heater entry added to Home Assistant but not set up."""
    entry = MockConfigEntry(domain=DOMAIN, title="Cylinder", data=heater_data)
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
async def heater(hass: HomeAssistant, heater_entry: MockConfigEntry) -> MockConfigEntry:
    """A heater entry set up, its relay off and the water at 39.6 C."""
    hass.states.async_set(SWITCH, "off")
    hass.states.async_set(SENSOR, "39.6", {"unit_of_measurement": "°C"})
    assert await hass.config_entries.async_setup(heater_entry.entry_id)
    await hass.async_block_till_done()
    return heater_entry
