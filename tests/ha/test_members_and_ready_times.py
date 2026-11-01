"""Members as subentries; ready times edited over the websocket and kept in storage."""

from typing import Any

from homeassistant.config_entries import SOURCE_RECONFIGURE, SOURCE_USER, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import MARIA, TIAGO, TIAGO_PERSON, access_token


async def test_admin_adds_a_linked_member(
    hass: HomeAssistant, heater: MockConfigEntry, device_registry: dr.DeviceRegistry
) -> None:
    result = await hass.config_entries.subentries.async_init(
        (heater.entry_id, "member"), context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.MENU
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"next_step_id": "linked"}
    )
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "José", "person": "person.jose", "colour": "orange"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    names = sorted(s.title for s in heater.subentries.values())
    assert names == ["José", "Maria", "Tiago"]
    assert heater.state is ConfigEntryState.LOADED
    assert hass.states.get("sensor.jose_next_ready_time") is not None
    jose = next(s for s in heater.subentries.values() if s.title == "José")
    device = device_registry.async_get_device_by_identifier(
        (DOMAIN, f"{heater.entry_id}_{jose.subentry_id}"), heater.entry_id
    )
    assert device is not None
    assert device.name == "José"


async def test_member_is_reconfigured(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    result = await hass.config_entries.subentries.async_init(
        (heater.entry_id, "member"),
        context={"source": SOURCE_RECONFIGURE, "subentry_id": TIAGO},
    )
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Tiago S", "person": TIAGO_PERSON, "colour": "red"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.ABORT
    assert heater.subentries[TIAGO].title == "Tiago S"
    assert heater.state is ConfigEntryState.LOADED


async def _send(
    hass: HomeAssistant, ws: WebSocketGenerator, message: dict[str, Any], **kwargs: Any
) -> dict[str, Any]:
    client = await ws(hass, **kwargs)
    await client.send_json_auto_id(message)
    reply: dict[str, Any] = await client.receive_json()
    return reply


async def _snapshot(hass: HomeAssistant, ws: WebSocketGenerator, entry_id: str) -> Any:
    client = await ws(hass)
    await client.send_json_auto_id({"type": "hot_water_ready/subscribe", "entry_id": entry_id})
    await client.receive_json()
    return (await client.receive_json())["event"]


async def test_ready_time_is_added_changed_and_removed_without_a_reload(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    runtime = heater.runtime_data
    added = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "time": "07:00",
            "weekdays": [0, 1, 2, 3, 4],
        },
    )
    assert added["success"]
    ready = added["result"]
    assert ready["time"] == "07:00"
    assert ready["weekdays"] == [0, 1, 2, 3, 4]
    assert ready["enabled"] is True

    changed = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/update",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "ready_time_id": ready["id"],
            "time": "07:30",
            "enabled": False,
        },
    )
    assert changed["result"]["time"] == "07:30"
    assert changed["result"]["enabled"] is False
    snapshot = await _snapshot(hass, hass_ws_client, heater.entry_id)
    tiago = next(m for m in snapshot["members"] if m["id"] == TIAGO)
    assert tiago["ready_times"] == [changed["result"]]

    removed = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/remove",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "ready_time_id": ready["id"],
        },
    )
    assert removed["success"]
    assert heater.runtime_data is runtime  # never reloaded


async def test_ready_times_survive_a_restart(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": heater.entry_id,
            "member_id": MARIA,
            "time": "07:30",
            "weekdays": [5, 6],
        },
    )
    assert await hass.config_entries.async_unload(heater.entry_id)
    assert await hass.config_entries.async_setup(heater.entry_id)
    await hass.async_block_till_done()

    snapshot = await _snapshot(hass, hass_ws_client, heater.entry_id)
    maria = next(m for m in snapshot["members"] if m["id"] == MARIA)
    assert [(r["time"], r["weekdays"]) for r in maria["ready_times"]] == [("07:30", [5, 6])]


async def test_member_edits_only_their_own_ready_times(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_access_token: str,
    maria_user: MockUser,
) -> None:
    maria_token = await access_token(hass, maria_user)

    own = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": heater.entry_id,
            "member_id": MARIA,
            "time": "08:00",
            "weekdays": [0],
        },
        access_token=maria_token,
    )
    assert own["success"]

    other = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "time": "08:00",
            "weekdays": [0],
        },
        access_token=maria_token,
    )
    assert not other["success"]
    assert other["error"]["code"] == "unauthorized"
    assert heater.runtime_data.ready_times(TIAGO) == []


async def test_bad_ready_time_is_refused(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    reply = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "time": "07:00",
            "weekdays": [7],
        },
    )
    assert not reply["success"]
    assert reply["error"]["code"] == "invalid_format"


async def test_unknown_member_and_ready_time_are_not_found(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    unknown_member = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/remove",
            "entry_id": heater.entry_id,
            "member_id": "nobody",
            "ready_time_id": "x",
        },
    )
    unknown_ready = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/remove",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "ready_time_id": "x",
        },
    )
    assert unknown_member["error"]["code"] == "not_found"
    assert unknown_ready["error"]["code"] == "not_found"
