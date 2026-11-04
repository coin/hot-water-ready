"""The card's settings sheet: what an admin sees and may change (spec 6, 7)."""

from typing import Any

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from .conftest import MARIA_PERSON, access_token


async def _snapshot(
    hass: HomeAssistant, ws: WebSocketGenerator, entry: MockConfigEntry, **kwargs: Any
) -> dict[str, Any]:
    client = await ws(hass, **kwargs)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": entry.entry_id}
    )
    assert (await client.receive_json())["success"]
    event: dict[str, Any] = (await client.receive_json())["event"]
    return event


async def _set(
    hass: HomeAssistant, ws: WebSocketGenerator, entry: MockConfigEntry, **changes: Any
) -> dict[str, Any]:
    client = await ws(hass)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/settings/set", "entry_id": entry.entry_id, **changes}
    )
    reply: dict[str, Any] = await client.receive_json()
    await hass.async_block_till_done()
    return reply


async def test_an_admin_sees_the_settings_and_the_solar_comparison(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    snapshot = await _snapshot(hass, hass_ws_client, heater)

    assert snapshot["settings"] == {
        "switch_off_people": [],
        "solar_aware": False,
        "solar": {
            "windows": 0,
            "on_time": 0,
            "minutes_saved": 0,
            "kwh": None,
            "solar_windows": 0,
            "solar_on_time": 0,
        },
    }


async def test_a_member_does_not_see_the_settings(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    token = await access_token(hass, maria_user)

    snapshot = await _snapshot(hass, hass_ws_client, heater, access_token=token)

    assert snapshot["settings"] is None


async def test_an_admin_changes_each_setting(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    assert (await _set(hass, hass_ws_client, heater, target=45, margin=1.5))["success"]
    assert (await _set(hass, hass_ws_client, heater, automatic=False))["success"]

    heater_now = heater.runtime_data
    assert (heater_now.target, heater_now.margin, heater_now.automatic) == (45.0, 1.5, False)


async def test_an_admin_sets_the_people_who_may_cancel(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    reply = await _set(hass, hass_ws_client, heater, switch_off_people=[MARIA_PERSON])

    assert reply["success"]
    assert heater.options["cancel_people"] == [MARIA_PERSON]
    assert (await _snapshot(hass, hass_ws_client, heater))["settings"]["switch_off_people"] == [
        MARIA_PERSON
    ]


async def test_only_existing_people_go_on_the_list(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    for people in (["person.nobody"], ["switch.cylinder"]):
        reply = await _set(hass, hass_ws_client, heater, switch_off_people=people)
        assert reply["success"] is False, people
    assert heater.options.get("cancel_people", []) == []


async def test_values_out_of_range_are_refused(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    for change in ({"target": 90}, {"margin": -1}):
        reply = await _set(hass, hass_ws_client, heater, **change)
        assert reply["success"] is False, change
    assert heater.runtime_data.target == 42.0


async def test_a_member_may_not_change_the_settings(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    client = await hass_ws_client(hass, access_token=await access_token(hass, maria_user))
    await client.send_json_auto_id(
        {"type": "hot_water_ready/settings/set", "entry_id": heater.entry_id, "target": 50}
    )

    reply = await client.receive_json()
    assert reply["error"]["code"] == "unauthorized"
    assert heater.runtime_data.target == 42.0
