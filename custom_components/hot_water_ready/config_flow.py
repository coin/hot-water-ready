"""Setup flow (one heater per entry) and member subentry flow."""

from typing import Any, override

from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.config_entries import (
    SOURCE_RECONFIGURE,
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryFlow,
    OptionsFlow,
    SubentryFlowResult,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.data_entry_flow import section
from homeassistant.helpers import selector
import probatio

from .actuator import thermostat_supported
from .const import (
    CANCEL_EVERYONE,
    CANCEL_PEOPLE,
    CANCEL_REQUESTERS,
    COLOURS,
    CONF_ADVANCED,
    CONF_CANCEL_PEOPLE,
    CONF_CANCEL_RULE,
    CONF_CLIMATE,
    CONF_COLOUR,
    CONF_ELEMENT_WATTS,
    CONF_FAULT_RECIPIENTS,
    CONF_HEATER_TYPE,
    CONF_HEATING_RATE,
    CONF_KEEP_HEATING_GAP,
    CONF_MAX_TEMPERATURE,
    CONF_NOTIFY_TARGETS,
    CONF_PERSON,
    CONF_POWER_SENSOR,
    CONF_RECIPIENTS,
    CONF_RICH_NOTIFICATIONS,
    CONF_SOLAR_AWARE,
    CONF_SWITCH,
    CONF_TANK_LITRES,
    CONF_TEMPERATURE_SENSOR,
    DEFAULT_MAX_TEMPERATURE,
    DOMAIN,
    HEATER_CLIMATE,
    HEATER_SWITCH,
    SUBENTRY_MEMBER,
)
from .core.controller import Settings
from .core.faults import FaultSettings


def _heater_schema(element: dict[Any, Any]) -> probatio.Schema:
    """Name, the element (switch or thermostat), the water sensor, an optional power sensor."""
    return probatio.Schema(
        {
            probatio.Required(CONF_NAME): selector.TextSelector(),
            **element,
            probatio.Required(CONF_TEMPERATURE_SENSOR): selector.EntitySelector(
                selector.EntitySelectorConfig(
                    domain="sensor", device_class=SensorDeviceClass.TEMPERATURE
                )
            ),
            probatio.Optional(CONF_POWER_SENSOR): selector.EntitySelector(
                selector.EntitySelectorConfig(domain="sensor", device_class=SensorDeviceClass.POWER)
            ),
        }
    )


SWITCH_SCHEMA = _heater_schema(
    {
        probatio.Required(CONF_SWITCH): selector.EntitySelector(
            selector.EntitySelectorConfig(domain="switch")
        )
    }
)
CLIMATE_SCHEMA = _heater_schema(
    {
        probatio.Required(CONF_CLIMATE): selector.EntitySelector(
            selector.EntitySelectorConfig(domain="climate")
        )
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
        """(a) a switch the component runs, or (b) an existing thermostat (spec 3.1).

        A menu, as 2026.10 has no `visible` fields.
        """
        return self.async_show_menu(step_id="user", menu_options=[HEATER_SWITCH, HEATER_CLIMATE])

    async def async_step_switch(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """A relay or smart plug and a water sensor."""
        return self._create_or_ask(HEATER_SWITCH, CONF_SWITCH, SWITCH_SCHEMA, user_input)

    async def async_step_climate(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """An existing thermostat and a water sensor."""
        return self._create_or_ask(HEATER_CLIMATE, CONF_CLIMATE, CLIMATE_SCHEMA, user_input)

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Change the heater setup later (spec 3.1): the same choice, then the same fields."""
        return self.async_show_menu(
            step_id="reconfigure", menu_options=[HEATER_SWITCH, HEATER_CLIMATE]
        )

    def _create_or_ask(
        self,
        heater_type: str,
        element: str,
        schema: probatio.Schema,
        user_input: dict[str, Any] | None,
    ) -> ConfigFlowResult:
        reconfiguring = self.source == SOURCE_RECONFIGURE
        errors: dict[str, str] = {}
        if user_input is not None:
            if heater_type == HEATER_CLIMATE and not thermostat_supported(
                self.hass.states.get(user_input[CONF_CLIMATE])
            ):
                errors[CONF_CLIMATE] = "unsupported_thermostat"
            else:
                data = {
                    CONF_HEATER_TYPE: heater_type,
                    element: user_input[element],
                    CONF_TEMPERATURE_SENSOR: user_input[CONF_TEMPERATURE_SENSOR],
                }
                power = user_input.get(CONF_POWER_SENSOR)
                if not reconfiguring:
                    self._async_abort_entries_match({element: user_input[element]})
                    return self.async_create_entry(
                        title=user_input[CONF_NAME],
                        data=data,
                        options={CONF_POWER_SENSOR: power},
                    )
                entry = self._get_reconfigure_entry()
                taken = [
                    other
                    for other in self._async_current_entries(include_ignore=False)
                    if other.entry_id != entry.entry_id
                    and other.data.get(element) == user_input[element]
                ]
                if taken:
                    return self.async_abort(reason="already_configured")
                # The entry's update listener reloads it; no second reload here.
                return self.async_update_and_abort(
                    entry,
                    title=user_input[CONF_NAME],
                    data=data,
                    options={**entry.options, CONF_POWER_SENSOR: power},
                )
        if reconfiguring and user_input is None:
            entry = self._get_reconfigure_entry()
            current = {CONF_NAME: entry.title, **entry.data, **entry.options}
            schema = self.add_suggested_values_to_schema(schema, current)
        return self.async_show_form(step_id=heater_type, data_schema=schema, errors=errors)


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


def _box(low: float, high: float, step: float, unit: str) -> selector.NumberSelector:
    """A number typed into a box, with its unit."""
    return selector.NumberSelector(
        selector.NumberSelectorConfig(
            min=low,
            max=high,
            step=step,
            unit_of_measurement=unit,
            mode=selector.NumberSelectorMode.BOX,
        )
    )


def _threshold_fields(current: dict[str, Any]) -> dict[Any, Any]:
    """The fault thresholds (spec 4.8), each a number with its unit."""
    defaults = FaultSettings()
    units = {
        "sensor_timeout_minutes": ("min", 1, 60, 1),
        "sensor_recovery_minutes": ("min", 0, 30, 1),
        "not_rising_minutes": ("min", 5, 180, 5),
        "not_rising_degrees": ("°C", 0.2, 10, 0.1),
        "power_watts": ("W", 1, 1000, 1),
        "power_minutes": ("min", 1, 60, 1),
    }
    return {
        probatio.Required(name, default=current.get(name, getattr(defaults, name))): (
            selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=low,
                    max=high,
                    step=step,
                    unit_of_measurement=unit,
                    mode=selector.NumberSelectorMode.BOX,
                )
            )
        )
        for name, (unit, low, high, step) in units.items()
    }


class HeaterOptionsFlow(OptionsFlow):
    """Settings that rarely change (spec 3.1)."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """The keep-heating-through gap, the solar rule, the rate, who may cancel heat now..."""
        if user_input is not None:
            # A cleared field is left out of user_input; it means nobody listed, or no sensor.
            data = {
                **self.config_entry.options,
                CONF_CANCEL_PEOPLE: [],
                CONF_FAULT_RECIPIENTS: [],
                CONF_POWER_SENSOR: None,
                CONF_HEATING_RATE: None,
                CONF_TANK_LITRES: None,
                CONF_ELEMENT_WATTS: None,
                **user_input,
            }
            return self.async_create_entry(data=data)
        options = self.config_entry.options
        gap = options.get(CONF_KEEP_HEATING_GAP, Settings().keep_heating_gap_minutes)
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
                    CONF_SOLAR_AWARE, default=options.get(CONF_SOLAR_AWARE, False)
                ): selector.BooleanSelector(),
                probatio.Optional(
                    CONF_HEATING_RATE,
                    description={"suggested_value": options.get(CONF_HEATING_RATE)},
                ): _box(0.5, 60, 0.1, "min/°C"),
                probatio.Optional(
                    CONF_TANK_LITRES,
                    description={"suggested_value": options.get(CONF_TANK_LITRES)},
                ): _box(20, 1000, 5, "L"),
                probatio.Optional(
                    CONF_ELEMENT_WATTS,
                    description={"suggested_value": options.get(CONF_ELEMENT_WATTS)},
                ): _box(100, 10000, 50, "W"),
                probatio.Required(
                    CONF_MAX_TEMPERATURE,
                    default=options.get(CONF_MAX_TEMPERATURE, DEFAULT_MAX_TEMPERATURE),
                ): _box(40, 60, 1, "°C"),
                probatio.Required(
                    CONF_CANCEL_RULE, default=options.get(CONF_CANCEL_RULE, CANCEL_REQUESTERS)
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=[CANCEL_REQUESTERS, CANCEL_PEOPLE, CANCEL_EVERYONE],
                        translation_key=CONF_CANCEL_RULE,
                    )
                ),
                probatio.Required(
                    CONF_RICH_NOTIFICATIONS,
                    default=options.get(CONF_RICH_NOTIFICATIONS, False),
                ): selector.BooleanSelector(),
                probatio.Optional(
                    CONF_POWER_SENSOR,
                    description={"suggested_value": options.get(CONF_POWER_SENSOR)},
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor", device_class="power")
                ),
                probatio.Optional(
                    CONF_FAULT_RECIPIENTS,
                    description={"suggested_value": options.get(CONF_FAULT_RECIPIENTS, [])},
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="person", multiple=True)
                ),
                probatio.Optional(CONF_ADVANCED): section(
                    probatio.Schema(_threshold_fields(options.get(CONF_ADVANCED, {}))),
                    {"collapsed": True},
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
