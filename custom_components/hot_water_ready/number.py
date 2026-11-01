"""Target and margin of the temperature band (spec 4.4)."""

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberMode
from homeassistant.const import EntityCategory, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HotWaterReadyConfigEntry
from .const import MAX_MARGIN, MAX_TARGET, MIN_TARGET
from .entity import HeaterEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HotWaterReadyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the band's two numbers."""
    heater = entry.runtime_data
    async_add_entities([TargetNumber(heater, "target_temperature"), MarginNumber(heater, "margin")])


class _BandNumber(HeaterEntity, NumberEntity):
    _attr_device_class = NumberDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_mode = NumberMode.BOX
    _attr_entity_category = EntityCategory.CONFIG


class TargetNumber(_BandNumber):
    """The water is ready at or above this."""

    _attr_native_min_value = MIN_TARGET
    _attr_native_max_value = MAX_TARGET
    _attr_native_step = 0.5

    @property
    def native_value(self) -> float:
        """The target now."""
        return self.heater.target

    async def async_set_native_value(self, value: float) -> None:
        """Change the target."""
        await self.async_require_admin()
        await self.heater.async_set_band(target=value)


class MarginNumber(_BandNumber):
    """Heating stops at target plus this and restarts at target minus it."""

    _attr_native_min_value = 0.0
    _attr_native_max_value = MAX_MARGIN
    _attr_native_step = 0.1

    @property
    def native_value(self) -> float:
        """The margin now."""
        return self.heater.margin

    async def async_set_native_value(self, value: float) -> None:
        """Change the margin."""
        await self.async_require_admin()
        await self.heater.async_set_band(margin=value)
