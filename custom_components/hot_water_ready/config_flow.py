"""Setup flow (one heater per entry) and member subentry flow."""

from typing import Any, override

from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryFlow,
    OptionsFlow,
    SubentryFlowResult,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers import selector
import probatio

from .const import (
    CANCEL_EVERYONE,
    CANCEL_PEOPLE,
    CANCEL_REQUESTERS,
    COLOURS,
    CONF_CANCEL_PEOPLE,
    CONF_CANCEL_RULE,
    CONF_COLOUR,
    CONF_KEEP_HEATING_GAP,
    CONF_NOTIFY_TARGETS,
    CONF_PERSON,
    CONF_RECIPIENTS,
    CONF_SWITCH,
    CONF_TEMPERATURE_SENSOR,
    DOMAIN,
    SUBENTRY_MEMBER,
)
from .core.controller import Settings

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

    @staticmethod
    @callback
    @override
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """The heater's settings; the entry's update listener reloads it."""
        return HeaterOptionsFlow()

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


def _member_schema(
    entry: ConfigEntry, *, virtual: bool, current: dict[str, Any] | None = None
) -> probatio.Schema:
    """Name and colour; a person for a linked member, recipients for a virtual one.

    On 2026.10 the two kinds are separate steps of a menu, as `visible` fields need 2026.11.
    """
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

    fields: dict[Any, Any] = {
        probatio.Required(CONF_NAME, description=suggested(CONF_NAME)): selector.TextSelector()
    }
    if virtual:
        fields[probatio.Optional(CONF_RECIPIENTS, description=suggested(CONF_RECIPIENTS))] = (
            selector.EntitySelector(selector.EntitySelectorConfig(domain="person", multiple=True))
        )
    else:
        fields[probatio.Required(CONF_PERSON, description=suggested(CONF_PERSON))] = (
            selector.EntitySelector(selector.EntitySelectorConfig(domain="person"))
        )
        fields[
            probatio.Optional(CONF_NOTIFY_TARGETS, description=suggested(CONF_NOTIFY_TARGETS))
        ] = selector.EntitySelector(selector.EntitySelectorConfig(domain="notify", multiple=True))
    fields[probatio.Required(CONF_COLOUR, default=current.get(CONF_COLOUR, free))] = (
        selector.SelectSelector(
            selector.SelectSelectorConfig(options=list(COLOURS), translation_key=CONF_COLOUR)
        )
    )
    return probatio.Schema(fields)


def _member_data(user_input: dict[str, Any]) -> dict[str, Any]:
    if CONF_PERSON in user_input:
        return {
            CONF_PERSON: user_input[CONF_PERSON],
            CONF_COLOUR: user_input[CONF_COLOUR],
            CONF_NOTIFY_TARGETS: list(user_input.get(CONF_NOTIFY_TARGETS, [])),
        }
    return {
        CONF_COLOUR: user_input[CONF_COLOUR],
        CONF_RECIPIENTS: list(user_input.get(CONF_RECIPIENTS, [])),
    }


class MemberSubentryFlow(ConfigSubentryFlow):
    """Add or change a member of a heater."""

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        """A member linked to a person, or a virtual one such as Global or Guests."""
        return self.async_show_menu(step_id="user", menu_options=["linked", "virtual"])

    async def async_step_linked(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Name, person and colour of a new linked member."""
        return self._create_or_ask("linked", user_input, virtual=False)

    async def async_step_virtual(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Name, colour and who is told, for a new virtual member."""
        return self._create_or_ask("virtual", user_input, virtual=True)

    def _create_or_ask(
        self, step_id: str, user_input: dict[str, Any] | None, *, virtual: bool
    ) -> SubentryFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title=user_input[CONF_NAME], data=_member_data(user_input)
            )
        return self.async_show_form(
            step_id=step_id, data_schema=_member_schema(self._get_entry(), virtual=virtual)
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Change a member; the entry's update listener reloads it."""
        entry = self._get_entry()
        subentry = self._get_reconfigure_subentry()
        if user_input is not None:
            return self.async_update_and_abort(
                entry, subentry, title=user_input[CONF_NAME], data=_member_data(user_input)
            )
        current = {CONF_NAME: subentry.title, **subentry.data}
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=_member_schema(
                entry, virtual=CONF_PERSON not in subentry.data, current=current
            ),
        )


class HeaterOptionsFlow(OptionsFlow):
    """Settings that rarely change (spec 3.1)."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """The keep-heating-through gap and who may cancel heat now."""
        if user_input is not None:
            data = {**self.config_entry.options, **user_input}
            data.setdefault(CONF_CANCEL_PEOPLE, [])
            if CONF_CANCEL_PEOPLE not in user_input:
                data[CONF_CANCEL_PEOPLE] = []
            return self.async_create_entry(data=data)
        options = self.config_entry.options
        gap = self.config_entry.options.get(
            CONF_KEEP_HEATING_GAP, Settings().keep_heating_gap_minutes
        )
        schema = probatio.Schema(
            {
                probatio.Required(CONF_KEEP_HEATING_GAP, default=gap): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0,
                        max=180,
                        step=5,
                        unit_of_measurement="min",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
                probatio.Required(
                    CONF_CANCEL_RULE, default=options.get(CONF_CANCEL_RULE, CANCEL_REQUESTERS)
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=[CANCEL_REQUESTERS, CANCEL_PEOPLE, CANCEL_EVERYONE],
                        translation_key=CONF_CANCEL_RULE,
                    )
                ),
                probatio.Optional(
                    CONF_CANCEL_PEOPLE,
                    description={"suggested_value": options.get(CONF_CANCEL_PEOPLE, [])},
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="person", multiple=True)
                ),
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
