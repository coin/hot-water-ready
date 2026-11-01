"""Base entities: on the heater's device, or on a member's device."""

from homeassistant.auth.models import User
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import Unauthorized
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .heater import Heater, Member

MANUFACTURER = "Hot Water Ready"


async def async_calling_user(hass: HomeAssistant, context: Context | None) -> User | None:
    """The user behind a service call; None for automations and the system.

    A user id that no longer resolves to a user is refused rather than treated as nobody.
    """
    user_id = context.user_id if context else None
    if user_id is None:
        return None
    user = await hass.auth.async_get_user(user_id)
    if user is None:
        raise Unauthorized(context=context)
    return user


def member_device_identifier(entry_id: str, member_id: str) -> tuple[str, str]:
    """How a member's device is known in the device registry."""
    return (DOMAIN, f"{entry_id}_{member_id}")


def heater_device_info(heater: Heater) -> DeviceInfo:
    """The heater's own device."""
    return DeviceInfo(
        identifiers={(DOMAIN, heater.entry_id)},
        name=heater.name,
        manufacturer=MANUFACTURER,
        model="Heater",
    )


def register_heater_device(heater: Heater) -> None:
    """Create the heater's device before any entity, so member devices can point at it."""
    device = dr.async_get(heater.hass).async_get_or_create(
        config_entry_id=heater.entry_id, **heater_device_info(heater)
    )
    heater.device_id = device.id


class HeaterEntity(Entity):
    """An entity of the heater device that refreshes with the heater."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, heater: Heater, key: str) -> None:
        """Name the entity by its translation key on the heater's device."""
        self.heater = heater
        self._attr_translation_key = key
        self._attr_unique_id = f"{heater.entry_id}_{key}"
        self._attr_device_info = heater_device_info(heater)

    async def _async_calling_user(self) -> User | None:
        """The user behind the current service call; None for automations and the system."""
        return await async_calling_user(self.hass, self._context)

    async def async_require_admin(self) -> None:
        """Heater settings are for administrators (spec 2)."""
        if not self.heater.can_change_settings(await self._async_calling_user()):
            raise Unauthorized(context=self._context)

    async def async_added_to_hass(self) -> None:
        """Refresh whenever the heater changes."""
        self.async_on_remove(self.heater.async_add_listener(self.async_write_ha_state))


class MemberEntity(HeaterEntity):
    """An entity of one member's device, linked to the heater's device."""

    def __init__(self, heater: Heater, member: Member, key: str) -> None:
        """Name the entity by its translation key on the member's device."""
        super().__init__(heater, key)
        self.member_id = member.id
        self._attr_unique_id = f"{heater.entry_id}_{member.id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={member_device_identifier(heater.entry_id, member.id)},
            name=member.name,
            manufacturer=MANUFACTURER,
            model="Member",
            via_device_id=heater.device_id,
        )

    async def async_require_editor(self) -> None:
        """Admins change every member; a linked member only their own (spec 2)."""
        if not self.heater.can_edit(await self._async_calling_user(), self.member_id):
            raise Unauthorized(context=self._context)
