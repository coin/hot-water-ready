"""Heater and member sensors."""

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.const import EntityCategory, UnitOfTime
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
    async_add_entities(
        [
            StatusSensor(heater, "status"),
            NextReadySensor(heater, "next_ready_time"),
            HeatingRateSensor(heater, "heating_rate"),
            LeadSensor(heater, "lead"),
            SolarLeadSensor(heater, "solar_lead"),
        ]
    )
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


class _Diagnostic(HeaterEntity, SensorEntity):
    """A number for whoever tunes the heater: hidden until shown in the entity settings."""

    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_entity_registry_visible_default = False


class HeatingRateSensor(_Diagnostic):
    """Minutes per degree learned from clean heating runs (spec 4.2)."""

    _attr_native_unit_of_measurement = "min/°C"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1

    @property
    def native_value(self) -> float | None:
        """The learned rate; unknown until three clean runs in a week."""
        return self.heater.learned_rate

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """The rate actually used, which a value set by hand overrides."""
        return {"rate_used": self.heater.rate}


class _LeadSensor(_Diagnostic):
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES
    _attr_suggested_display_precision = 0


class LeadSensor(_LeadSensor):
    """How long before the next ready time the rule in use would start heating, from now."""

    @property
    def native_value(self) -> float | None:
        """The lead of the rule applied."""
        leads = self.heater.leads()
        return None if leads is None else leads.used


class SolarLeadSensor(_LeadSensor):
    """The solar-aware lead, worked out whether or not the rule is applied (spec 4.3)."""

    @property
    def native_value(self) -> float | None:
        """The solar-aware lead."""
        leads = self.heater.leads()
        return None if leads is None else leads.solar
