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
    assert event["element_on"] is False
    assert event["power_w"] is None

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


async def test_subscription_survives_a_reload(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": heater.entry_id}
    )
    await client.receive_json()
    await client.receive_json()

    assert await hass.config_entries.async_reload(heater.entry_id)
    await hass.async_block_till_done()
    assert (await client.receive_json())["event"]["temperature"] == 39.6

    hass.states.async_set(SENSOR, "44.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()

    events = []
    while not events or events[-1]["temperature"] != 44.0:
        events.append((await client.receive_json())["event"])
    assert events[-1]["status"] == "ready"


async def test_snapshot_carries_the_power_drawn(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    hass.states.async_set("sensor.cylinder_power", "2790.4", {"unit_of_measurement": "W"})
    hass.config_entries.async_update_entry(
        heater, options={**heater.options, "power_sensor": "sensor.cylinder_power"}
    )
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": heater.entry_id}
    )
    assert (await client.receive_json())["success"]
    assert (await client.receive_json())["event"]["power_w"] == 2790.4

    hass.states.async_set("sensor.cylinder_power", "0", {"unit_of_measurement": "W"})
    await hass.async_block_till_done()
    assert (await client.receive_json())["event"]["power_w"] == 0.0
