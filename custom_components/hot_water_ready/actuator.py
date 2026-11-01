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


class Actuator(Protocol):
    """The heater's element as Home Assistant controls it."""

    @property
    def entity_id(self) -> str:
        """The switch or climate entity."""

    def heating(self, hass: HomeAssistant) -> bool | None:
        """Whether the element is heating now, as far as Home Assistant can tell; None: unknown."""

    def calls_for(self, hass: HomeAssistant, on: bool, setpoint: float) -> list[ServiceCall]:
        """The service calls that bring it to on or off; none when it is already there, or
        while it is unavailable (it is set when it comes back)."""

    def has_heating_indication(self, hass: HomeAssistant) -> bool:
        """Whether `heating` can be known; without it the not-rising check is skipped."""


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

    def calls_for(self, hass: HomeAssistant, on: bool, setpoint: float) -> list[ServiceCall]:
        """turn_on or turn_off, when it differs."""
        if (current := self.heating(hass)) is None or current == on:
            return []
        return [("switch", "turn_on" if on else "turn_off", {"entity_id": self.entity_id})]

    def has_heating_indication(self, hass: HomeAssistant) -> bool:
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
        return bool(state.attributes["hvac_action"] == "heating")

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
        current = state.attributes.get("temperature")
        if not isinstance(current, int | float) or abs(current - setpoint) > 1e-6:
            calls.append(("climate", "set_temperature", {**target, "temperature": setpoint}))
        return calls

    def has_heating_indication(self, hass: HomeAssistant) -> bool:
        """Whether the thermostat reports `hvac_action`."""
        state = self._state(hass)
        return state is not None and "hvac_action" in state.attributes
