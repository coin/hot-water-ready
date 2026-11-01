"""A heater at runtime: reads its entities and tells listeners when its picture changes."""

from collections.abc import Callable
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event

from .const import CONF_TEMPERATURE_SENSOR, DEFAULT_TARGET
from .core.status import Status, heater_status

type Listener = Callable[[], None]


class Heater:
    """The Home Assistant side of one heater."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Keep the entry; nothing is read until started."""
        self.hass = hass
        self.entry = entry
        self.target = DEFAULT_TARGET
        self._listeners: list[Listener] = []

    @property
    def name(self) -> str:
        """The heater's name, which is the entry title."""
        return self.entry.title

    @property
    def temperature(self) -> float | None:
        """The water temperature now, or None when the sensor has no number."""
        state = self.hass.states.get(self.entry.data[CONF_TEMPERATURE_SENSOR])
        if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return None
        try:
            return float(state.state)
        except ValueError:
            return None

    @property
    def status(self) -> Status:
        """What the status sensor shows."""
        return heater_status(temperature=self.temperature, target=self.target)

    def snapshot(self) -> dict[str, Any]:
        """Everything the card needs, as plain data."""
        return {
            "entry_id": self.entry.entry_id,
            "name": self.name,
            "temperature": self.temperature,
            "target": self.target,
            "status": self.status.value,
        }

    @callback
    def async_start(self) -> None:
        """Follow the temperature sensor until the entry unloads."""
        self.entry.async_on_unload(
            async_track_state_change_event(
                self.hass, [self.entry.data[CONF_TEMPERATURE_SENSOR]], self._on_change
            )
        )

    @callback
    def async_add_listener(self, listener: Listener) -> Callable[[], None]:
        """Call `listener` whenever the snapshot may have changed."""
        self._listeners.append(listener)

        @callback
        def remove() -> None:
            self._listeners.remove(listener)

        return remove

    @callback
    def _on_change(self, _event: Event[EventStateChangedData]) -> None:
        for listener in list(self._listeners):
            listener()
