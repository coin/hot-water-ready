"""Each member's away switch (spec 3.3, 5)."""

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import HotWaterReadyConfigEntry
from .entity import MemberEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HotWaterReadyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add an away switch to each member's device."""
    heater = entry.runtime_data
    for member in heater.members:
        async_add_entities([AwaySwitch(heater, member, "away")], config_subentry_id=member.id)


class AwaySwitch(MemberEntity, SwitchEntity):
    """On: the member's ready times are paused, kept for when they are back."""

    @property
    def is_on(self) -> bool:
        """Whether the member is away."""
        return self.heater.away(self.member_id).on

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """The last day away, when the pause ends by itself."""
        until = self.heater.away(self.member_id).until
        return {"until": None if until is None else until.isoformat()}

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Pause the member's ready times, with no end date."""
        await self.async_require_editor()
        await self.heater.async_set_away(self.member_id, True, None)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Resume the member's ready times."""
        await self.async_require_editor()
        await self.heater.async_set_away(self.member_id, False, None)
