"""Adding a heater through the setup flow."""

from homeassistant.config_entries import SOURCE_USER
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.hot_water_ready.const import (
    CONF_SWITCH,
    CONF_TEMPERATURE_SENSOR,
    DOMAIN,
)

from .conftest import SENSOR, SWITCH


async def test_user_creates_heater_from_switch_and_sensor(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {CONF_NAME: "Cylinder", CONF_SWITCH: SWITCH, CONF_TEMPERATURE_SENSOR: SENSOR},
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Cylinder"
    assert result["data"] == {CONF_SWITCH: SWITCH, CONF_TEMPERATURE_SENSOR: SENSOR}


async def test_same_switch_cannot_be_added_twice(
    hass: HomeAssistant, heater_entry: MockConfigEntry
) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {CONF_NAME: "Again", CONF_SWITCH: SWITCH, CONF_TEMPERATURE_SENSOR: SENSOR},
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
