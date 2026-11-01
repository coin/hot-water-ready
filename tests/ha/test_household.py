"""The whole household in Home Assistant: virtual members, away, who may change what (ticket 03)."""

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_USER, ConfigSubentry
from homeassistant.core import Context, HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import Unauthorized
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
    async_mock_service,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from .conftest import MARIA, TIAGO


async def _send(
    hass: HomeAssistant, ws: WebSocketGenerator, message: dict[str, Any], **kwargs: Any
) -> dict[str, Any]:
    client = await ws(hass, **kwargs)
    await client.send_json_auto_id(message)
    reply: dict[str, Any] = await client.receive_json()
    return reply


async def _snapshot(
    hass: HomeAssistant, ws: WebSocketGenerator, entry_id: str, **kwargs: Any
) -> Any:
    client = await ws(hass, **kwargs)
    await client.send_json_auto_id({"type": "hot_water_ready/subscribe", "entry_id": entry_id})
    await client.receive_json()
    return (await client.receive_json())["event"]


async def _maria_token(hass: HomeAssistant, maria_user: MockUser) -> str:
    refresh = await hass.auth.async_create_refresh_token(maria_user, "https://example.com/")
    return hass.auth.async_create_access_token(refresh)


async def test_admin_adds_a_virtual_member(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    result = await hass.config_entries.subentries.async_init(
        (heater.entry_id, "member"), context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.MENU
    assert result["menu_options"] == ["linked", "virtual"]
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"next_step_id": "virtual"}
    )
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Convidados", "colour": "teal", "recipients": ["person.tiago"]}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    guests = next(s for s in heater.subentries.values() if s.title == "Convidados")
    assert guests.data == {"colour": "teal", "recipients": ["person.tiago"]}
    member = heater.runtime_data.member(guests.subentry_id)
    assert member.person is None


async def test_virtual_member_is_admin_only(
    hass: HomeAssistant, heater_entry: MockConfigEntry, maria_user: MockUser
) -> None:
    hass.config_entries.async_add_subentry(
        heater_entry,
        ConfigSubentry(
            data={"colour": "teal", "recipients": []},
            subentry_type="member",
            title="Global",
            unique_id=None,
        ),
    )
    hass.states.async_set("sensor.cylinder_temperature", "40")
    assert await hass.config_entries.async_setup(heater_entry.entry_id)
    await hass.async_block_till_done()
    heater = heater_entry.runtime_data
    global_id = next(m.id for m in heater.members if m.name == "Global")

    assert not heater.can_edit(maria_user, global_id)


async def test_member_sets_their_own_away_until_a_date(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    token = await _maria_token(hass, maria_user)
    own = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/away/set",
            "entry_id": heater.entry_id,
            "member_id": MARIA,
            "away": True,
            "until": "2026-11-04",
        },
        access_token=token,
    )
    assert own["success"]
    assert hass.states.get("switch.maria_away").state == "on"
    assert hass.states.get("switch.maria_away").attributes["until"] == "2026-11-04"

    other = await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/away/set",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "away": True,
        },
        access_token=token,
    )
    assert other["error"]["code"] == "unauthorized"
    assert hass.states.get("switch.tiago_away").state == "off"


async def test_away_switch_entity_follows_the_same_rule(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser
) -> None:
    maria = Context(user_id=maria_user.id)
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": "switch.maria_away"}, blocking=True, context=maria
    )
    assert hass.states.get("switch.maria_away").state == "on"

    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            "switch", "turn_on", {"entity_id": "switch.tiago_away"}, blocking=True, context=maria
        )
    assert hass.states.get("switch.tiago_away").state == "off"


async def test_away_ends_by_itself_after_its_date(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    freezer: FrozenDateTimeFactory,
) -> None:
    await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/away/set",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "away": True,
            "until": "2026-11-02",
        },
    )
    freezer.move_to("2026-11-02 23:59:00+00:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert hass.states.get("switch.tiago_away").state == "on"

    freezer.tick(timedelta(minutes=2))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert hass.states.get("switch.tiago_away").state == "off"
    assert hass.states.get("switch.tiago_away").attributes["until"] is None


async def test_away_keeps_ready_times_but_skips_them(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "time": "07:00",
            "weekdays": [0, 1, 2, 3, 4, 5, 6],
        },
    )
    await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/away/set",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "away": True,
            "until": "2026-11-03",
        },
    )
    assert hass.states.get("sensor.tiago_next_ready_time").state == "2026-11-04T07:00:00+00:00"
    assert len(heater.runtime_data.ready_times(TIAGO)) == 1


async def test_house_today_and_read_only_for_a_member(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    for member, clock in ((TIAGO, "07:00"), (TIAGO, "21:00"), (MARIA, "07:30")):
        await _send(
            hass,
            hass_ws_client,
            {
                "type": "hot_water_ready/ready_time/add",
                "entry_id": heater.entry_id,
                "member_id": member,
                "time": clock,
                "weekdays": [0],
            },
        )
    snapshot = await _snapshot(
        hass, hass_ws_client, heater.entry_id, access_token=await _maria_token(hass, maria_user)
    )

    assert snapshot["is_admin"] is False
    assert snapshot["me"] == MARIA
    assert [(t["member"], t["at"][11:16]) for t in snapshot["today"]] == [
        (TIAGO, "07:00"),
        (MARIA, "07:30"),
        (TIAGO, "21:00"),
    ]
    editable = {m["id"]: m["can_edit"] for m in snapshot["members"]}
    assert editable == {TIAGO: False, MARIA: True}


async def test_going_away_stops_your_window(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    on = async_mock_service(hass, "switch", "turn_on")
    off = async_mock_service(hass, "switch", "turn_off")
    hass.states.async_set("sensor.cylinder_temperature", "38.0")
    await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "time": "05:20",
            "weekdays": [0],
        },
    )
    await hass.async_block_till_done()
    assert len(on) == 1
    hass.states.async_set("switch.cylinder_relay", "on")

    await _send(
        hass,
        hass_ws_client,
        {
            "type": "hot_water_ready/away/set",
            "entry_id": heater.entry_id,
            "member_id": TIAGO,
            "away": True,
        },
    )
    await hass.async_block_till_done()
    assert len(off) == 1
