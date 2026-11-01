"""The heater's status sensor follows the water temperature."""

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from .conftest import SENSOR

STATUS = "sensor.cylinder_status"


async def test_cold_water_is_waiting(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    state = hass.states.get(STATUS)
    assert state is not None
    assert state.state == "waiting"
    assert state.attributes["options"] == ["waiting", "heating", "ready", "fault", "manual"]


async def test_water_reaching_target_is_ready(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    hass.states.async_set(SENSOR, "42.4", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()

    state = hass.states.get(STATUS)
    assert state is not None
    assert state.state == "ready"


async def test_status_belongs_to_the_heater_device(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    device_registry: dr.DeviceRegistry,
    entity_registry: er.EntityRegistry,
) -> None:
    entity = entity_registry.async_get(STATUS)
    assert entity is not None
    assert entity.translation_key == "status"
    device = device_registry.async_get(entity.device_id or "")
    assert device is not None
    assert device.name == "Cylinder"


async def test_unload_and_reload(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    assert await hass.config_entries.async_unload(heater.entry_id)
    assert heater.state is ConfigEntryState.NOT_LOADED
    assert await hass.config_entries.async_setup(heater.entry_id)
    await hass.async_block_till_done()
    assert heater.state is ConfigEntryState.LOADED
