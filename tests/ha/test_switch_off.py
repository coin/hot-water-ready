"""Desligar o aquecimento: who may switch the heater off now, and who is told."""

from datetime import time, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import Context, HomeAssistant, ServiceCall
from homeassistant.exceptions import Unauthorized
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
    async_mock_service,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import MARIA, MARIA_PERSON, SENSOR, SWITCH, TIAGO, TIAGO_PERSON, access_token
from .test_heat_now import _phone

EVERY_DAY = frozenset(range(7))


@pytest.fixture
def phones(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser, hass_admin_user: MockUser
) -> dict[str, str]:
    """Maria's and Tiago's phones."""
    return {
        MARIA: _phone(hass, "pixel_maria", MARIA_PERSON, maria_user.id),
        TIAGO: _phone(hass, "pixel_tiago", TIAGO_PERSON, hass_admin_user.id),
    }


@pytest.fixture
def sent(hass: HomeAssistant) -> list[ServiceCall]:
    """Every notify.send_message call."""
    async_mock_service(hass, "switch", "turn_on")
    async_mock_service(hass, "switch", "turn_off")
    return async_mock_service(hass, "notify", "send_message")


def _water(hass: HomeAssistant, value: float) -> None:
    hass.states.async_set(SENSOR, str(value), {"unit_of_measurement": "°C"})


async def _ws(
    hass: HomeAssistant, ws: WebSocketGenerator, message: dict[str, Any], user: MockUser | None
) -> dict[str, Any]:
    kwargs = {} if user is None else {"access_token": await access_token(hass, user)}
    client = await ws(hass, **kwargs)
    await client.send_json_auto_id(message)
    reply: dict[str, Any] = await client.receive_json()
    await hass.async_block_till_done()
    return reply


async def _ask(hass: HomeAssistant, user: MockUser | None) -> None:
    await hass.services.async_call(
        "button",
        "press",
        {"entity_id": "button.cylinder_heat_now"},
        blocking=True,
        context=Context(user_id=None if user is None else user.id),
    )
    await hass.async_block_till_done()


def _off(entry: MockConfigEntry) -> dict[str, Any]:
    return {"type": "hot_water_ready/switch_off", "entry_id": entry.entry_id}


async def test_an_admin_switches_off_and_who_asked_is_told(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    _water(hass, 38.0)
    await _ask(hass, maria_user)
    await _ask(hass, hass_admin_user)
    assert hass.states.get("sensor.cylinder_status").state == "heating"

    assert (await _ws(hass, hass_ws_client, _off(heater), hass_admin_user))["success"]

    assert hass.states.get("sensor.cylinder_status").state != "heating"
    assert heater.runtime_data.heat_now_requesters == frozenset()
    # Maria is told; Tiago switched it off himself and is not.
    assert [(c.data["entity_id"], c.data["message"]) for c in sent] == [
        (phones[MARIA], "Tiago switched off the heating.")
    ]
    assert sent[0].data["title"] == "Cylinder"


async def test_members_whose_ready_time_is_skipped_are_told_too(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    hass.config.language = "pt"
    _water(hass, 30.0)
    # 05:30 with the water at 30: (42 - 30) x 7 + 15 = 99 min of lead, so it heats at once.
    await heater.runtime_data.async_add_ready_time(MARIA, time(5, 30), EVERY_DAY, True)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.cylinder_status").state == "heating"
    sent.clear()  # "a aquecer" for Maria

    assert (await _ws(hass, hass_ws_client, _off(heater), hass_admin_user))["success"]

    assert hass.states.get("sensor.cylinder_status").state != "heating"
    assert [(c.data["entity_id"], c.data["message"]) for c in sent] == [
        (phones[MARIA], "Tiago desligou o aquecimento.")
    ]


async def test_an_automation_switches_off_without_a_name(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    _water(hass, 38.0)
    await _ask(hass, maria_user)

    await hass.services.async_call(DOMAIN, "switch_off", {"heater": heater.entry_id}, blocking=True)
    await hass.async_block_till_done()

    assert [c.data["message"] for c in sent] == ["The heating was switched off."]
    assert hass.states.get("sensor.cylinder_status").state != "heating"


async def test_only_admins_and_the_people_on_the_list_may_switch_off(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    _water(hass, 38.0)
    await _ask(hass, maria_user)

    refused = await _ws(hass, hass_ws_client, _off(heater), maria_user)
    assert refused["error"]["code"] == "unauthorized"
    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            "switch_off",
            {"heater": heater.entry_id},
            blocking=True,
            context=Context(user_id=maria_user.id),
        )
    assert heater.runtime_data.heat_now_requesters == frozenset({MARIA})

    hass.config_entries.async_update_entry(heater, options={"cancel_people": [MARIA_PERSON]})
    await hass.async_block_till_done()
    assert (await _ws(hass, hass_ws_client, _off(heater), maria_user))["success"]


@pytest.fixture
async def stranger(hass: HomeAssistant) -> MockUser:
    """A user who is not an admin and is no member's person."""
    from homeassistant.auth.const import GROUP_ID_USER  # noqa: PLC0415

    users = await hass.auth.async_get_group(GROUP_ID_USER)
    assert users is not None
    return MockUser(name="Visitor", groups=[users]).add_to_hass(hass)


async def test_a_stranger_may_not_switch_off(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    stranger: MockUser,
    maria_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    _water(hass, 38.0)
    await _ask(hass, maria_user)

    refused = await _ws(hass, hass_ws_client, _off(heater), stranger)

    assert refused["error"]["code"] == "unauthorized"
    assert heater.runtime_data.heat_now_requesters == frozenset({MARIA})


async def _snapshot(
    hass: HomeAssistant, ws: WebSocketGenerator, entry: MockConfigEntry, user: MockUser
) -> dict[str, Any]:
    client = await ws(hass, access_token=await access_token(hass, user))
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": entry.entry_id}
    )
    assert (await client.receive_json())["success"]
    event: dict[str, Any] = (await client.receive_json())["event"]
    return event


async def test_the_card_knows_who_may_switch_off_and_what_is_heating_for(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    _water(hass, 30.0)
    await heater.runtime_data.async_add_ready_time(MARIA, time(5, 30), EVERY_DAY, True)
    await hass.async_block_till_done()

    admin = await _snapshot(hass, hass_ws_client, heater, hass_admin_user)
    member = await _snapshot(hass, hass_ws_client, heater, maria_user)

    assert (admin["can_switch_off"], member["can_switch_off"]) == (True, False)
    assert [entry["member"] for entry in admin["heating_for"]] == [MARIA]
    assert admin["heating_for"][0]["at"].startswith("2026-11-02T05:30:00")


async def test_a_listed_person_may_switch_off_through_the_action(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser, sent: list[ServiceCall]
) -> None:
    hass.config_entries.async_update_entry(heater, options={"cancel_people": [MARIA_PERSON]})
    await hass.async_block_till_done()
    _water(hass, 38.0)
    await _ask(hass, None)

    await hass.services.async_call(
        DOMAIN,
        "switch_off",
        {"heater": heater.entry_id},
        blocking=True,
        context=Context(user_id=maria_user.id),
    )
    await hass.async_block_till_done()

    assert hass.states.get("sensor.cylinder_status").state != "heating"


async def test_during_a_fault_switching_off_ends_a_waiting_request(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
    freezer: FrozenDateTimeFactory,
) -> None:
    """Spec 2: an admin can drop a request that is not heating, so it cannot start later."""
    _water(hass, 38.0)
    await _ask(hass, maria_user)
    hass.states.async_set(SENSOR, "unavailable")
    freezer.tick(timedelta(minutes=5.5))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.cylinder_status").state == "fault"
    sent.clear()

    assert (await _ws(hass, hass_ws_client, _off(heater), hass_admin_user))["success"]

    assert heater.runtime_data.heat_now_requesters == frozenset()
    assert [(c.data["entity_id"], c.data["message"]) for c in sent] == [
        (phones[MARIA], "Tiago switched off the heating.")
    ]


async def test_nothing_happens_when_it_is_not_heating(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    # Water above the target: Maria's 05:05 window is open (a lead of 15 - 7 = 8 min) but has
    # nothing to heat.
    _water(hass, 43.0)
    await heater.runtime_data.async_add_ready_time(MARIA, time(5, 5), EVERY_DAY, True)
    await hass.async_block_till_done()
    assert [member for member, _ in heater.runtime_data.heating_for()] == [MARIA]
    sent.clear()

    assert (await _ws(hass, hass_ws_client, _off(heater), hass_admin_user))["success"]

    assert sent == []
    assert heater.runtime_data.next_ready() is not None
    assert heater.runtime_data.heating_for() != []  # the window was not skipped


async def test_a_skipped_ready_time_is_no_longer_the_next_one(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    _water(hass, 30.0)
    await heater.runtime_data.async_add_ready_time(MARIA, time(5, 30), EVERY_DAY, True)
    await hass.async_block_till_done()

    assert (await _ws(hass, hass_ws_client, _off(heater), hass_admin_user))["success"]

    snapshot = await _snapshot(hass, hass_ws_client, heater, hass_admin_user)
    assert snapshot["next_ready"]["at"].startswith("2026-11-03T05:30")  # tomorrow's
    assert snapshot["next_heat_start"] >= "2026-11-02T05:45"  # not before the skip ends
    assert snapshot["today"] == []  # "Casa hoje" no longer lists the skipped 05:30


async def test_the_card_knows_an_automation_also_asked(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    _water(hass, 38.0)
    await _ask(hass, None)
    await _ask(hass, maria_user)

    snapshot = await _snapshot(hass, hass_ws_client, heater, maria_user)

    assert snapshot["heat_now"] == {
        "requesters": [MARIA],
        "asked": True,
        "unnamed": True,
        "keep_until": None,
    }


@pytest.mark.parametrize(
    ("rule", "kept"), [("people", [MARIA_PERSON]), ("requesters", []), ("everyone", [])]
)
async def test_the_old_cancel_rule_is_dropped_keeping_the_list_only_where_it_was_in_force(
    hass: HomeAssistant,
    heater_entry: MockConfigEntry,
    maria_user: MockUser,
    rule: str,
    kept: list[str],
) -> None:
    hass.config_entries.async_update_entry(
        heater_entry, options={"cancel_rule": rule, "cancel_people": [MARIA_PERSON]}
    )
    hass.states.async_set(SWITCH, "off")
    hass.states.async_set(SENSOR, "39.6", {"unit_of_measurement": "°C"})

    assert await hass.config_entries.async_setup(heater_entry.entry_id)
    await hass.async_block_till_done()

    assert "cancel_rule" not in heater_entry.options
    assert heater_entry.options["cancel_people"] == kept


async def test_the_calendar_and_week_leave_out_the_skipped_window(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    _water(hass, 30.0)
    await heater.runtime_data.async_add_ready_time(MARIA, time(5, 30), EVERY_DAY, True)
    await hass.async_block_till_done()

    assert (await _ws(hass, hass_ws_client, _off(heater), hass_admin_user))["success"]

    week = (await _snapshot(hass, hass_ws_client, heater, hass_admin_user))["week"]
    assert not any(w["end"].startswith("2026-11-02T05:45") for w in week["windows"])
    assert any(w["end"].startswith("2026-11-03T05:45") for w in week["windows"])  # tomorrow's
