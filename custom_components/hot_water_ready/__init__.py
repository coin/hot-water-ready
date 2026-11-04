"""Hot Water Ready: make hot water ready when the household wants it."""

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv, issue_registry as ir
from homeassistant.helpers.typing import ConfigType

from . import services, websocket
from .const import CONF_SWITCH_OFF_PEOPLE, DOMAIN
from .core.faults import Fault
from .entity import register_heater_device
from .frontend import async_load_card, async_unload_card
from .heater import Heater, issue_id
from .storage import HeaterStore

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.CALENDAR,
    Platform.NUMBER,
    Platform.SENSOR,
    Platform.SWITCH,
]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type HotWaterReadyConfigEntry = ConfigEntry[Heater]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register what every heater shares."""
    websocket.async_register(hass)
    services.async_register(hass)
    return True


def _drop_cancel_rule(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> None:
    """Options from before 0.1.2 had a cancel rule; only its "people" choice kept a list.

    The list now says who may switch off for everyone, so under the other two choices it was
    never in force and must not start to be.
    """
    options = dict(entry.options)
    if "cancel_rule" not in options:
        return
    if options.pop("cancel_rule") != "people":
        options[CONF_SWITCH_OFF_PEOPLE] = []
    hass.config_entries.async_update_entry(entry, options=options)


async def async_setup_entry(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> bool:
    """Set up one heater."""
    _drop_cancel_rule(hass, entry)
    await async_load_card(hass)
    store = HeaterStore(hass, entry.entry_id)
    heater = Heater(hass, entry, store, await store.async_load())
    entry.runtime_data = heater
    register_heater_device(heater)
    # Members are subentries: adding or removing one changes the entry, and a reload picks it
    # up. Member reconfigure uses async_update_and_abort, so this listener is the only reload.
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    heater.async_start()
    return True


async def _async_reload(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> bool:
    """Unload one heater, saving its state first."""
    await entry.runtime_data.async_stop()
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_entry(hass: HomeAssistant, entry: HotWaterReadyConfigEntry) -> None:
    """Delete the heater's storage and Repairs entries; stop loading the card when none is left.

    On 2026.10 a repair issue is not tied to its entry, so it is removed here.
    """
    await HeaterStore(hass, entry.entry_id).async_remove()
    for fault in Fault:
        ir.async_delete_issue(hass, DOMAIN, issue_id(entry.entry_id, fault))
    others = [e for e in hass.config_entries.async_entries(DOMAIN) if e.entry_id != entry.entry_id]
    if not others:
        await async_unload_card(hass)
