"""Setup flow: one heater per entry."""

from typing import Any, override

from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import CONF_NAME
from homeassistant.helpers import selector
import probatio

from .const import CONF_SWITCH, CONF_TEMPERATURE_SENSOR, DOMAIN

USER_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_NAME): selector.TextSelector(),
        probatio.Required(CONF_SWITCH): selector.EntitySelector(
            selector.EntitySelectorConfig(domain="switch")
        ),
        probatio.Required(CONF_TEMPERATURE_SENSOR): selector.EntitySelector(
            selector.EntitySelectorConfig(
                domain="sensor", device_class=SensorDeviceClass.TEMPERATURE
            )
        ),
    }
)


class HotWaterReadyConfigFlow(ConfigFlow, domain=DOMAIN):
    """Add a heater."""

    VERSION = 1

    @override
    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Ask for the heater's name, relay and temperature sensor."""
        if user_input is not None:
            self._async_abort_entries_match({CONF_SWITCH: user_input[CONF_SWITCH]})
            return self.async_create_entry(
                title=user_input[CONF_NAME],
                data={
                    CONF_SWITCH: user_input[CONF_SWITCH],
                    CONF_TEMPERATURE_SENSOR: user_input[CONF_TEMPERATURE_SENSOR],
                },
            )
        return self.async_show_form(step_id="user", data_schema=USER_SCHEMA)
