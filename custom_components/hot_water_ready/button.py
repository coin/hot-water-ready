"""The "Aquecer agora" button (spec 4.6, 5)."""

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HotWaterReadyConfigEntry
from .entity import HeaterEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HotWaterReadyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the heater's heat-now button."""
    async_add_entities([HeatNowButton(entry.runtime_data, "heat_now")])


class HeatNowButton(HeaterEntity, ButtonEntity):
    """Ask for hot water now; whoever pressed is told when it is ready."""

    async def async_press(self) -> None:
        """Start or join a heat-now request for the person behind the press."""
        user = await self._async_calling_user()
        if not self.heater.can_ask_heat_now(user):
            raise Unauthorized(context=self._context)
        await self.heater.async_heat_now(self.heater.requester_key(user))
