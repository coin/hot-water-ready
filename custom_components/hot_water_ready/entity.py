"""Base entity tied to the heater device."""

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .heater import Heater


class HeaterEntity(Entity):
    """An entity of the heater device that refreshes with the heater."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, heater: Heater, key: str) -> None:
        """Name the entity by its translation key on the heater's device."""
        self.heater = heater
        self._attr_translation_key = key
        self._attr_unique_id = f"{heater.entry.entry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, heater.entry.entry_id)},
            name=heater.name,
            manufacturer="Hot Water Ready",
            model="Heater",
        )

    async def async_added_to_hass(self) -> None:
        """Refresh whenever the heater changes."""
        self.async_on_remove(self.heater.async_add_listener(self.async_write_ha_state))
