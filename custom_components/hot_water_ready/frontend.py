"""Serve the card and load it on every dashboard (spec 8).

On Home Assistant 2026.10 an extra module alone can lose the race with the frontend's scoped
element registry, so the card is also a Lovelace resource when resources are kept in storage.
The two loads use different URLs on purpose: a browser evaluates a module URL only once, so with
one URL the resource could not recover a card the extra module lost. The card guards its own
definition. Drop the resource branch once the minimum version is 2026.11.
"""

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url, remove_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace import LOVELACE_DATA, MODE_STORAGE
from homeassistant.components.lovelace.resources import ResourceStorageCollection
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration
from homeassistant.util.hass_dict import HassKey

from .const import CARD_FILE, CARD_URL, DOMAIN

_SERVED: HassKey[bool] = HassKey(f"{DOMAIN}_card_served")
_LOADED: HassKey[str] = HassKey(f"{DOMAIN}_card_url")
MODULE_SUFFIX = "&load=module"


async def async_load_card(hass: HomeAssistant) -> None:
    """Serve the card once per process and make every dashboard load it."""
    if _LOADED in hass.data:
        return
    integration = await async_get_integration(hass, DOMAIN)
    url = f"{CARD_URL}?v={integration.version}"
    hass.data[_LOADED] = url
    if _SERVED not in hass.data:
        # A static route cannot be registered twice in one process.
        hass.data[_SERVED] = True
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, str(Path(__file__).parent / CARD_FILE), True)]
        )
    add_extra_js_url(hass, f"{url}{MODULE_SUFFIX}")
    if (resources := await _storage_resources(hass)) is None:
        return
    items = _card_items(resources)
    if not items:
        await resources.async_create_item({"res_type": "module", "url": url})
        return
    first, *extra = items
    if first["url"] != url:
        await resources.async_update_item(first["id"], {"res_type": "module", "url": url})
    for item in extra:
        await resources.async_delete_item(item["id"])


async def async_unload_card(hass: HomeAssistant) -> None:
    """Stop loading the card; called when the last heater is removed."""
    if (url := hass.data.pop(_LOADED, None)) is not None:
        remove_extra_js_url(hass, f"{url}{MODULE_SUFFIX}")
    if (resources := await _storage_resources(hass)) is None:
        return
    for item in _card_items(resources):
        await resources.async_delete_item(item["id"])


async def _storage_resources(hass: HomeAssistant) -> ResourceStorageCollection | None:
    """The Lovelace resources, unless they are kept in YAML (read-only to us)."""
    lovelace = hass.data.get(LOVELACE_DATA)
    if lovelace is None or lovelace.resource_mode != MODE_STORAGE:
        return None
    resources = lovelace.resources
    if not isinstance(resources, ResourceStorageCollection):
        return None
    await resources.async_get_info()  # loads the collection from storage
    return resources


def _card_items(resources: ResourceStorageCollection) -> list[dict[str, str]]:
    return [item for item in resources.async_items() if item["url"].startswith(CARD_URL)]
