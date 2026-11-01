"""Hot Water Ready: make hot water ready when the household wants it."""

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from . import websocket
from .const import DOMAIN
from .frontend import async_load_card, async_unload_card
from .heater import Heater

PLATFORMS: list[Platform] = [Platform.SENSOR]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type HotWaterReadyConfigEntry = ConfigEntry[Heater]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register what every heater shares."""
    websocket.async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> bool:
    """Set up one heater."""
    await async_load_card(hass)
    heater = Heater(hass, entry)
    entry.runtime_data = heater
    heater.async_start()
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> bool:
    """Unload one heater."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_entry(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> None:
    """Stop loading the card once no heater is left."""
    others = [e for e in hass.config_entries.async_entries(DOMAIN) if e.entry_id != entry.entry_id]
    if not others:
        await async_unload_card(hass)
