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
    hass: HomeAssistant,
    ws: WebSocketGenerator,
    entry: MockConfigEntry,
    access_token: str | None = None,
    **changes: Any,
) -> dict[str, Any]:
    client = await (ws(hass) if access_token is None else ws(hass, access_token=access_token))
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
        "rate": {
            "used": 7.0,
            "source": "default",
            "manual": None,
            "learned": None,
            "default": 7.0,
            "physics": None,
            "physics_fast": None,
            "tank_litres": None,
            "runs": [],
            "window_days": 7,
            "min_runs": 3,
            "lead_margin_minutes": 15.0,
            "lead_cap_minutes": 240.0,
        },
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


async def test_an_admin_fixes_the_rate_and_goes_back_to_the_learned_one(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    assert (await _set(hass, hass_ws_client, heater, rate=6.2))["success"]

    rate = (await _snapshot(hass, hass_ws_client, heater))["settings"]["rate"]
    assert (rate["used"], rate["source"], rate["manual"]) == (6.2, "manual", 6.2)

    assert (await _set(hass, hass_ws_client, heater, rate=None))["success"]

    rate = (await _snapshot(hass, hass_ws_client, heater))["settings"]["rate"]
    assert (rate["used"], rate["source"], rate["manual"]) == (7.0, "default", None)


async def test_a_fixed_rate_must_be_within_the_settings_page_limits(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    assert not (await _set(hass, hass_ws_client, heater, rate=0.1))["success"]
    assert not (await _set(hass, hass_ws_client, heater, rate=61))["success"]


async def test_a_member_may_not_fix_the_rate_or_recalculate(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    token = await access_token(hass, maria_user)

    assert not (await _set(hass, hass_ws_client, heater, rate=6.0, access_token=token))["success"]
    client = await hass_ws_client(hass, access_token=token)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/rate/recalculate", "entry_id": heater.entry_id}
    )
    reply = await client.receive_json()
    assert reply["error"]["code"] == "unauthorized"


async def test_the_physics_rate_shows_once_the_tank_is_known(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    hass.config_entries.async_update_entry(
        heater, options={**heater.options, "tank_litres": 300, "element_watts": 2750}
    )
    await hass.async_block_till_done()

    rate = (await _snapshot(hass, hass_ws_client, heater))["settings"]["rate"]
    assert round(rate["physics"], 1) == 7.6
    assert rate["physics_fast"] == rate["physics"]  # the element at the bottom: one value


async def test_a_horizontal_tank_heated_from_the_middle_gives_a_range(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    """Only the half above the element heats quickly: the fast end is half the tank's time."""
    hass.config_entries.async_update_entry(
        heater,
        options={
            **heater.options,
            "tank_litres": 300,
            "element_watts": 2750,
            "tank_orientation": "horizontal",
            "element_height": "middle",
        },
    )
    await hass.async_block_till_done()

    rate = (await _snapshot(hass, hass_ws_client, heater))["settings"]["rate"]
    assert (round(rate["physics_fast"], 1), round(rate["physics"], 1)) == (3.8, 7.6)


async def test_recalculating_without_history_says_so(
    hass: HomeAssistant, heater: MockConfigEntry, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/rate/recalculate", "entry_id": heater.entry_id}
    )
    reply = await client.receive_json()
    assert reply["error"]["code"] == "not_supported"
