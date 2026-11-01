"""Fake heating elements whose services change their own state, as real devices do.

A bare `async_mock_service` records a call and changes nothing, which hides the bugs that
matter here: commands sent again and again, or twice by overlapping steps. These fakes answer
like a relay or a thermostat would, and count every command they get.
"""

from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant, ServiceCall


@dataclass
class FakeRelay:
    """A switch that turns on and off when told."""

    hass: HomeAssistant
    entity_id: str
    commands: list[str] = field(default_factory=list)

    def install(self) -> FakeRelay:
        """Register switch.turn_on and turn_off; call it after the entry is set up."""

        async def turn(call: ServiceCall) -> None:
            self.commands.append(call.service)
            self.hass.states.async_set(self.entity_id, "on" if call.service == "turn_on" else "off")

        for service in ("turn_on", "turn_off"):
            self.hass.services.async_register("switch", service, turn)
        return self


@dataclass
class FakeThermostat:
    """A climate entity that keeps its setpoint in whole degrees, like many real ones."""

    hass: HomeAssistant
    entity_id: str
    commands: list[tuple[str, Any]] = field(default_factory=list)

    def _set(self, **changes: Any) -> None:
        state = self.hass.states.get(self.entity_id)
        attributes = dict(state.attributes) if state is not None else {}
        mode = changes.pop("mode", state.state if state is not None else "off")
        attributes.update(changes)
        attributes["hvac_action"] = "heating" if mode == "heat" else "off"
        self.hass.states.async_set(self.entity_id, mode, attributes)

    def install(self) -> FakeThermostat:
        """Register set_hvac_mode and set_temperature; call it after the entry is set up."""
        self._set(mode="off", hvac_modes=["off", "heat"], temperature=30, target_temp_step=1)

        async def set_mode(call: ServiceCall) -> None:
            self.commands.append(("mode", call.data["hvac_mode"]))
            self._set(mode=call.data["hvac_mode"])

        async def set_temperature(call: ServiceCall) -> None:
            self.commands.append(("setpoint", call.data["temperature"]))
            self._set(temperature=round(call.data["temperature"]))

        self.hass.services.async_register("climate", "set_hvac_mode", set_mode)
        self.hass.services.async_register("climate", "set_temperature", set_temperature)
        return self
