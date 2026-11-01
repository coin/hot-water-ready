"""Heater sensors."""

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HotWaterReadyConfigEntry
from .core.status import Status
from .entity import HeaterEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HotWaterReadyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the heater's sensors."""
    async_add_entities([StatusSensor(entry.runtime_data, "status")])


class StatusSensor(HeaterEntity, SensorEntity):
    """Waiting, heating, ready, fault or manual."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [status.value for status in Status]

    @property
    def native_value(self) -> str:
        """The heater's status now."""
        return self.heater.status.value
