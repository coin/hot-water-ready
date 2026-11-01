"""The integration serves its card and loads it without a resource added by hand (spec 8)."""

import hashlib
from pathlib import Path
from typing import Any

from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL
from homeassistant.components.lovelace import LOVELACE_DATA
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

import custom_components.hot_water_ready
from custom_components.hot_water_ready.const import CARD_FILE, CARD_URL, DOMAIN
from custom_components.hot_water_ready.frontend import MODULE_SUFFIX


async def _card_url(hass: HomeAssistant) -> str:
    integration = await async_get_integration(hass, DOMAIN)
    bundle = Path(custom_components.hot_water_ready.__file__).parent / CARD_FILE
    digest = hashlib.sha256(bundle.read_bytes()).hexdigest()[:8]
    return f"{CARD_URL}?v={integration.version}-{digest}"


def _card_resources(hass: HomeAssistant) -> list[dict[str, Any]]:
    return [
        item
        for item in hass.data[LOVELACE_DATA].resources.async_items()
        if item["url"].startswith(CARD_URL)
    ]


async def test_card_is_a_module_and_a_resource(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    url = await _card_url(hass)
    assert f"{url}{MODULE_SUFFIX}" in hass.data[DATA_EXTRA_MODULE_URL].urls
    assert [(r["type"], r["url"]) for r in _card_resources(hass)] == [("module", url)]


async def test_card_file_is_served(
    hass: HomeAssistant, heater: MockConfigEntry, hass_client: ClientSessionGenerator
) -> None:
    client = await hass_client()
    response = await client.get(await _card_url(hass))
    assert response.status == 200
    assert "hot-water-ready-card" in await response.text()


async def test_second_heater_adds_no_second_resource(
    hass: HomeAssistant, heater: MockConfigEntry, heater_data: dict[str, Any]
) -> None:
    other = MockConfigEntry(
        domain=DOMAIN, title="Upstairs", data={**heater_data, "switch": "switch.other"}
    )
    other.add_to_hass(hass)
    assert await hass.config_entries.async_setup(other.entry_id)
    await hass.async_block_till_done()

    assert len(_card_resources(hass)) == 1


async def test_old_version_resource_is_updated(
    hass: HomeAssistant, heater_entry: MockConfigEntry
) -> None:
    assert await async_setup_component(hass, "lovelace", {})
    resources = hass.data[LOVELACE_DATA].resources
    await resources.async_get_info()
    await resources.async_create_item({"res_type": "module", "url": f"{CARD_URL}?v=0.0.1"})

    hass.states.async_set("sensor.cylinder_temperature", "40")
    assert await hass.config_entries.async_setup(heater_entry.entry_id)
    await hass.async_block_till_done()

    assert [r["url"] for r in _card_resources(hass)] == [await _card_url(hass)]


async def test_removing_last_heater_removes_resource(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    assert await hass.config_entries.async_remove(heater.entry_id)
    await hass.async_block_till_done()

    assert _card_resources(hass) == []
    assert not [u for u in hass.data[DATA_EXTRA_MODULE_URL].urls if u.startswith(CARD_URL)]


async def test_yaml_resources_are_left_alone(
    hass: HomeAssistant, heater_entry: MockConfigEntry
) -> None:
    assert await async_setup_component(hass, "lovelace", {"lovelace": {"resource_mode": "yaml"}})
    hass.states.async_set("sensor.cylinder_temperature", "40")
    assert await hass.config_entries.async_setup(heater_entry.entry_id)
    await hass.async_block_till_done()

    assert f"{await _card_url(hass)}{MODULE_SUFFIX}" in hass.data[DATA_EXTRA_MODULE_URL].urls
    assert _card_resources(hass) == []
