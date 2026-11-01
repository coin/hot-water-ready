"""The heater's problem sensor (spec 4.8, 5)."""

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HotWaterReadyConfigEntry
from .entity import HeaterEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HotWaterReadyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the problem sensor."""
    async_add_entities([ProblemSensor(entry.runtime_data, "problem")])


class ProblemSensor(HeaterEntity, BinarySensorEntity):
    """On while any fault is active; the details are in Repairs."""

    _attr_device_class = BinarySensorDeviceClass.PROBLEM

    @property
    def is_on(self) -> bool:
        """Whether something is wrong."""
        return bool(self.heater.faults)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Which faults."""
        return {"faults": sorted(self.heater.faults)}
