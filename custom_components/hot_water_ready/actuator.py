"""What switches the heating element: a relay, or an existing thermostat (spec 3.1).

(a) A switch: on and off. (b) A climate entity: the component sets its mode and setpoint, heat at
target + margin when the water is wanted hot, off otherwise. Either way the controller decides
when; the actuator only translates that into service calls and reports what it sees.
"""

from dataclasses import dataclass
from typing import Any, Protocol

from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State

type ServiceCall = tuple[str, str, dict[str, Any]]

HEATING_ACTIONS = frozenset({"heating", "preheating"})


class Actuator(Protocol):
    """The heater's element as Home Assistant controls it."""

    @property
    def entity_id(self) -> str:
        """The switch or climate entity."""

    def heating(self, hass: HomeAssistant) -> bool | None:
        """Whether the element is heating now, as far as Home Assistant can tell; None: unknown."""

    def told_off(self, hass: HomeAssistant) -> bool | None:
        """Whether it was told to stay off (relay off, thermostat in mode off); None: unknown."""

    def calls_for(self, hass: HomeAssistant, on: bool, setpoint: float) -> list[ServiceCall]:
        """The service calls that bring it to on or off; none when it is already there, or
        while it is unavailable (it is set when it comes back)."""

    def has_heating_indication(self, hass: HomeAssistant) -> bool | None:
        """Whether `heating` can be known; None while the element is unavailable."""


@dataclass(frozen=True)
class SwitchActuator:
    """A relay or smart plug in front of the element."""

    entity_id: str

    def heating(self, hass: HomeAssistant) -> bool | None:
        """On is heating."""
        state = hass.states.get(self.entity_id)
        if state is None or state.state not in (STATE_ON, STATE_OFF):
            return None
        return state.state == STATE_ON

    def told_off(self, hass: HomeAssistant) -> bool | None:
        """Off is told off."""
        heating = self.heating(hass)
        return None if heating is None else not heating

    def calls_for(self, hass: HomeAssistant, on: bool, setpoint: float) -> list[ServiceCall]:
        """turn_on or turn_off, when it differs."""
        if (current := self.heating(hass)) is None or current == on:
            return []
        return [("switch", "turn_on" if on else "turn_off", {"entity_id": self.entity_id})]

    def has_heating_indication(self, hass: HomeAssistant) -> bool | None:
        """A relay always says whether it is on."""
        return True


@dataclass(frozen=True)
class ClimateActuator:
    """An existing thermostat: the component sets its mode and setpoint."""

    entity_id: str

    def _state(self, hass: HomeAssistant) -> State | None:
        state = hass.states.get(self.entity_id)
        if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return None
        return state

    def heating(self, hass: HomeAssistant) -> bool | None:
        """The thermostat's own heating indication (`hvac_action`), when it reports one."""
        state = self._state(hass)
        if state is None or "hvac_action" not in state.attributes:
            return None
        return state.attributes["hvac_action"] in HEATING_ACTIONS

    def told_off(self, hass: HomeAssistant) -> bool | None:
        """Mode off is told off."""
        state = self._state(hass)
        return None if state is None else state.state == "off"

    def calls_for(self, hass: HomeAssistant, on: bool, setpoint: float) -> list[ServiceCall]:
        """Heat at the setpoint, or off; only what differs."""
        state = self._state(hass)
        if state is None:
            return []
        target = {"entity_id": self.entity_id}
        if not on:
            if state.state == "off":
                return []
            return [("climate", "set_hvac_mode", {**target, "hvac_mode": "off"})]
        calls: list[ServiceCall] = []
        if state.state != "heat":
            calls.append(("climate", "set_hvac_mode", {**target, "hvac_mode": "heat"}))
        # A thermostat keeps its setpoint in its own steps (whole degrees, often), so a setpoint
        # within half a step of ours is ours; otherwise it would be sent again every step.
        current = state.attributes.get("temperature")
        step = state.attributes.get("target_temp_step") or 0.5
        if not isinstance(current, int | float) or abs(current - setpoint) > step / 2 + 1e-6:
            calls.append(("climate", "set_temperature", {**target, "temperature": setpoint}))
        return calls

    def has_heating_indication(self, hass: HomeAssistant) -> bool | None:
        """Whether the thermostat reports `hvac_action`; None while it is unavailable."""
        state = self._state(hass)
        return None if state is None else "hvac_action" in state.attributes


def thermostat_supported(state: State | None) -> bool:
    """A thermostat this can drive: it offers modes heat and off and takes one setpoint."""
    if state is None:
        return True  # not loaded yet: judge it when it is
    modes = state.attributes.get("hvac_modes") or []
    return "heat" in modes and "off" in modes
