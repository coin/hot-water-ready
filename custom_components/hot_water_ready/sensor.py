"""Heater and member sensors."""

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HotWaterReadyConfigEntry
from .core.status import Status
from .entity import HeaterEntity, MemberEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HotWaterReadyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the heater's sensors, then each member's on that member's subentry."""
    heater = entry.runtime_data
    async_add_entities([StatusSensor(heater, "status"), NextReadySensor(heater, "next_ready_time")])
    for member in heater.members:
        async_add_entities(
            [MemberNextReadySensor(heater, member, "next_ready_time")],
            config_subentry_id=member.id,
        )


class StatusSensor(HeaterEntity, SensorEntity):
    """Waiting, heating, ready, fault or manual."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [status.value for status in Status]

    @property
    def native_value(self) -> str:
        """The heater's status now."""
        return self.heater.status.value


class NextReadySensor(HeaterEntity, SensorEntity):
    """When the water is next wanted ready, and for whom."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP

    @property
    def native_value(self) -> datetime | None:
        """The next ready time of anyone."""
        coming = self.heater.next_ready()
        return None if coming is None else coming.at

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """The names of the members it is for."""
        coming = self.heater.next_ready()
        if coming is None:
            return {"members": []}
        names = {member.id: member.name for member in self.heater.members}
        return {"members": sorted(names[member_id] for member_id in coming.members)}


class MemberNextReadySensor(MemberEntity, SensorEntity):
    """When this member next wants the water ready."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP

    @property
    def native_value(self) -> datetime | None:
        """This member's next ready time."""
        coming = self.heater.next_ready(self.member_id)
        return None if coming is None else coming.at
