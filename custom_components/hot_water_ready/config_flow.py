"""Setup flow (one heater per entry) and member subentry flow."""

from typing import Any, override

from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryFlow,
    SubentryFlowResult,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers import selector
import probatio

from .const import (
    COLOURS,
    CONF_COLOUR,
    CONF_PERSON,
    CONF_SWITCH,
    CONF_TEMPERATURE_SENSOR,
    DOMAIN,
    SUBENTRY_MEMBER,
)

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

    @classmethod
    @callback
    @override
    def async_get_supported_subentry_types(
        cls, config_entry: ConfigEntry
    ) -> dict[str, type[ConfigSubentryFlow]]:
        """Members are subentries of their heater."""
        return {SUBENTRY_MEMBER: MemberSubentryFlow}

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


def _member_schema(entry: ConfigEntry, current: dict[str, Any] | None = None) -> probatio.Schema:
    used = {
        subentry.data.get(CONF_COLOUR)
        for subentry in entry.subentries.values()
        if subentry.subentry_type == SUBENTRY_MEMBER
    }
    free = next((colour for colour in COLOURS if colour not in used), COLOURS[0])
    current = current or {}

    def suggested(key: str) -> dict[str, Any]:
        # A suggestion pre-fills the field without becoming the value of an empty one.
        return {"suggested_value": current[key]} if key in current else {}

    return probatio.Schema(
        {
            probatio.Required(CONF_NAME, description=suggested(CONF_NAME)): (
                selector.TextSelector()
            ),
            probatio.Required(CONF_PERSON, description=suggested(CONF_PERSON)): (
                selector.EntitySelector(selector.EntitySelectorConfig(domain="person"))
            ),
            probatio.Required(
                CONF_COLOUR, default=current.get(CONF_COLOUR, free)
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(options=list(COLOURS), translation_key=CONF_COLOUR)
            ),
        }
    )


def _member_data(user_input: dict[str, Any]) -> dict[str, Any]:
    return {CONF_PERSON: user_input[CONF_PERSON], CONF_COLOUR: user_input[CONF_COLOUR]}


class MemberSubentryFlow(ConfigSubentryFlow):
    """Add or change a member of a heater."""

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        """Name, person and colour of a new linked member."""
        entry = self._get_entry()
        if user_input is not None:
            return self.async_create_entry(
                title=user_input[CONF_NAME],
                data=_member_data(user_input),
            )
        return self.async_show_form(step_id="user", data_schema=_member_schema(entry))

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Change a member; the entry's update listener reloads it."""
        entry = self._get_entry()
        subentry = self._get_reconfigure_subentry()
        if user_input is not None:
            return self.async_update_and_abort(
                entry,
                subentry,
                title=user_input[CONF_NAME],
                data=_member_data(user_input),
            )
        current = {CONF_NAME: subentry.title, **subentry.data}
        return self.async_show_form(
            step_id="reconfigure", data_schema=_member_schema(entry, current)
        )
