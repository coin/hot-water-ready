"""The card reads its heater through the websocket API."""

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from .conftest import SENSOR


async def test_list_heaters(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "hot_water_ready/heaters"})
    msg = await client.receive_json()

    assert msg["success"]
    assert msg["result"] == [{"entry_id": heater.entry_id, "name": "Cylinder"}]


async def test_subscribe_sends_snapshot_then_updates(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": heater.entry_id}
    )
    msg = await client.receive_json()
    assert msg["success"]
    event = (await client.receive_json())["event"]
    assert event["name"] == "Cylinder"
    assert event["temperature"] == 39.6
    assert event["target"] == 42.0
    assert event["status"] == "waiting"

    hass.states.async_set(SENSOR, "42.1", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()
    event = (await client.receive_json())["event"]
    assert event["temperature"] == 42.1
    assert event["status"] == "ready"


async def test_subscribe_to_unknown_heater_fails(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "hot_water_ready/subscribe", "entry_id": "nope"})
    msg = await client.receive_json()

    assert not msg["success"]
    assert msg["error"]["code"] == "not_found"
