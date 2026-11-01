"""Adding a heater through the setup flow: a switch or a thermostat (spec 3.1)."""

from homeassistant.config_entries import SOURCE_USER
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.hot_water_ready.const import (
    CONF_CLIMATE,
    CONF_HEATER_TYPE,
    CONF_POWER_SENSOR,
    CONF_SWITCH,
    CONF_TEMPERATURE_SENSOR,
    DOMAIN,
)

from .conftest import SENSOR, SWITCH


async def _start(hass: HomeAssistant, kind: str) -> str:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.MENU
    assert result["menu_options"] == ["switch", "climate"]
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"next_step_id": kind}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == kind
    return str(result["flow_id"])


async def test_user_creates_heater_from_switch_and_sensor(hass: HomeAssistant) -> None:
    flow_id = await _start(hass, "switch")
    result = await hass.config_entries.flow.async_configure(
        flow_id,
        {
            CONF_NAME: "Cylinder",
            CONF_SWITCH: SWITCH,
            CONF_TEMPERATURE_SENSOR: SENSOR,
            CONF_POWER_SENSOR: "sensor.cylinder_power",
        },
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Cylinder"
    assert result["data"] == {
        CONF_HEATER_TYPE: "switch",
        CONF_SWITCH: SWITCH,
        CONF_TEMPERATURE_SENSOR: SENSOR,
    }
    assert result["options"] == {CONF_POWER_SENSOR: "sensor.cylinder_power"}


async def test_user_creates_heater_from_a_thermostat(hass: HomeAssistant) -> None:
    flow_id = await _start(hass, "climate")
    result = await hass.config_entries.flow.async_configure(
        flow_id,
        {CONF_NAME: "Boiler", CONF_CLIMATE: "climate.boiler", CONF_TEMPERATURE_SENSOR: SENSOR},
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"] == {
        CONF_HEATER_TYPE: "climate",
        CONF_CLIMATE: "climate.boiler",
        CONF_TEMPERATURE_SENSOR: SENSOR,
    }


async def test_same_switch_cannot_be_added_twice(
    hass: HomeAssistant, heater_entry: MockConfigEntry
) -> None:
    flow_id = await _start(hass, "switch")
    result = await hass.config_entries.flow.async_configure(
        flow_id, {CONF_NAME: "Again", CONF_SWITCH: SWITCH, CONF_TEMPERATURE_SENSOR: SENSOR}
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_same_thermostat_cannot_be_added_twice(hass: HomeAssistant) -> None:
    MockConfigEntry(
        domain=DOMAIN,
        data={CONF_HEATER_TYPE: "climate", CONF_CLIMATE: "climate.boiler"},
    ).add_to_hass(hass)
    flow_id = await _start(hass, "climate")
    result = await hass.config_entries.flow.async_configure(
        flow_id,
        {CONF_NAME: "Again", CONF_CLIMATE: "climate.boiler", CONF_TEMPERATURE_SENSOR: SENSOR},
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
