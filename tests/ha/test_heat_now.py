"""Aquecer agora in Home Assistant (ticket 04): asking, telling, cancelling, the time limit."""

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.components import persistent_notification
from homeassistant.core import Context, HomeAssistant, ServiceCall
from homeassistant.helpers import device_registry as dr, entity_registry as er
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
    async_mock_service,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from .conftest import MARIA, MARIA_PERSON, SENSOR, SWITCH, TIAGO, TIAGO_PERSON


def _phone(hass: HomeAssistant, name: str, person: str, user_id: str) -> str:
    """A phone the way mobile_app makes one: a device with a tracker and a notify entity."""
    phone_entry = MockConfigEntry(domain="mobile_app", title=name)
    phone_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=phone_entry.entry_id, identifiers={("mobile_app", name)}, name=name
    )
    registry = er.async_get(hass)
    tracker = registry.async_get_or_create(
        "device_tracker", "mobile_app", f"{name}_tracker", device_id=device.id
    ).entity_id
    notify = registry.async_get_or_create(
        "notify", "mobile_app", f"{name}_notify", device_id=device.id
    ).entity_id
    hass.states.async_set(person, "home", {"user_id": user_id, "device_trackers": [tracker]})
    return notify


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


async def _press(hass: HomeAssistant, user: MockUser | None) -> None:
    await hass.services.async_call(
        "button",
        "press",
        {"entity_id": "button.cylinder_heat_now"},
        blocking=True,
        context=Context(user_id=None if user is None else user.id),
    )
    await hass.async_block_till_done()


def _water(hass: HomeAssistant, value: float) -> None:
    hass.states.async_set(SENSOR, str(value), {"unit_of_measurement": "°C"})


async def _ws(
    hass: HomeAssistant,
    ws: WebSocketGenerator,
    message: dict[str, Any],
    user: MockUser | None = None,
) -> dict[str, Any]:
    kwargs = {}
    if user is not None:
        refresh = await hass.auth.async_create_refresh_token(user, "https://example.com/")
        kwargs["access_token"] = hass.auth.async_create_access_token(refresh)
    client = await ws(hass, **kwargs)
    await client.send_json_auto_id(message)
    reply: dict[str, Any] = await client.receive_json()
    return reply


async def test_the_person_who_pressed_is_told_on_their_phone(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    _water(hass, 40.0)
    await _press(hass, maria_user)
    assert hass.states.get("sensor.cylinder_status").state == "heating"
    hass.states.async_set(SWITCH, "on")

    _water(hass, 42.1)
    await hass.async_block_till_done()
    assert [(c.data["entity_id"], c.data["message"]) for c in sent] == [
        (phones[MARIA], "Hot water ready: the water is at 42.1 °C.")
    ]
    assert sent[0].data["title"] == "Cylinder"


async def test_two_people_ask_and_both_are_told(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    _water(hass, 40.0)
    await _press(hass, maria_user)
    await _press(hass, hass_admin_user)  # "Avisar-me também"
    _water(hass, 42.0)
    await hass.async_block_till_done()

    assert sorted(c.data["entity_id"] for c in sent) == sorted(phones.values())


async def test_portuguese_message(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    hass.config.language = "pt"
    _water(hass, 40.0)
    await _press(hass, maria_user)
    _water(hass, 42.3)
    await hass.async_block_till_done()

    assert sent[0].data["message"] == "Duche pronto: a água está a 42,3 °C."


async def test_only_who_asked_and_admins_cancel_by_default(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    _water(hass, 40.0)
    await _press(hass, hass_admin_user)
    cancel = {"type": "hot_water_ready/heat_now/cancel", "entry_id": heater.entry_id}

    refused = await _ws(hass, hass_ws_client, cancel, maria_user)
    assert refused["error"]["code"] == "unauthorized"
    assert heater.runtime_data.heat_now_requesters == frozenset({TIAGO})

    await _press(hass, maria_user)  # now Maria asked too, so she may cancel
    assert (await _ws(hass, hass_ws_client, cancel, maria_user))["success"]
    assert heater.runtime_data.heat_now_requesters == frozenset()


async def test_the_setting_lets_everyone_cancel(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    hass.config_entries.async_update_entry(heater, options={"cancel_rule": "everyone"})
    await hass.async_block_till_done()
    _water(hass, 40.0)
    await _press(hass, hass_admin_user)

    reply = await _ws(
        hass,
        hass_ws_client,
        {"type": "hot_water_ready/heat_now/cancel", "entry_id": heater.entry_id},
        maria_user,
    )
    assert reply["success"]


async def test_the_setting_lets_listed_people_cancel(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    hass.config_entries.async_update_entry(
        heater, options={"cancel_rule": "people", "cancel_people": [MARIA_PERSON]}
    )
    await hass.async_block_till_done()
    _water(hass, 40.0)
    await _press(hass, hass_admin_user)

    reply = await _ws(
        hass,
        hass_ws_client,
        {"type": "hot_water_ready/heat_now/cancel", "entry_id": heater.entry_id},
        maria_user,
    )
    assert reply["success"]


async def test_explicit_targets_replace_the_phones_found(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    subentry = heater.subentries[MARIA]
    hass.config_entries.async_update_subentry(
        heater, subentry, data={**subentry.data, "notify_targets": ["notify.kitchen_speaker"]}
    )
    await hass.async_block_till_done()
    _water(hass, 40.0)
    await _press(hass, maria_user)
    _water(hass, 42.0)
    await hass.async_block_till_done()

    assert [c.data["entity_id"] for c in sent] == ["notify.kitchen_speaker"]


async def test_nobody_to_reach_makes_one_persistent_notification(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    sent: list[ServiceCall],
    caplog: pytest.LogCaptureFixture,
) -> None:
    _water(hass, 40.0)
    await _press(hass, maria_user)  # Maria has no phone
    _water(hass, 42.0)
    await hass.async_block_till_done()

    assert sent == []
    notes = persistent_notification._async_get_or_create_notifications(hass)
    (note,) = (n for n in notes.values() if n["notification_id"].startswith("hot_water_ready"))
    assert "Maria" in note["message"]
    assert "Hot water ready" in note["message"]
    assert caplog.text.count("Nobody to notify for Maria") == 1


async def test_from_an_automation_nobody_is_told(
    hass: HomeAssistant, heater: MockConfigEntry, phones: dict[str, str], sent: list[ServiceCall]
) -> None:
    _water(hass, 40.0)
    await _press(hass, None)
    assert hass.states.get("sensor.cylinder_status").state == "heating"
    _water(hass, 42.0)
    await hass.async_block_till_done()

    assert sent == []


async def test_a_request_past_its_time_limit_tells_who_asked(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    phones: dict[str, str],
    sent: list[ServiceCall],
    freezer: FrozenDateTimeFactory,
) -> None:
    _water(hass, 30.0)
    await _press(hass, maria_user)
    freezer.tick(timedelta(minutes=256))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert [c.data["entity_id"] for c in sent] == [phones[MARIA]]
    assert "did not get hot in time" in sent[0].data["message"]
    assert hass.states.get("sensor.cylinder_status").state != "heating"


async def test_card_sees_who_asked_and_whether_it_may_cancel(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],
) -> None:
    _water(hass, 40.0)
    await _press(hass, hass_admin_user)
    refresh = await hass.auth.async_create_refresh_token(maria_user, "https://example.com/")
    client = await hass_ws_client(hass, access_token=hass.auth.async_create_access_token(refresh))
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": heater.entry_id}
    )
    await client.receive_json()
    snapshot = (await client.receive_json())["event"]

    assert snapshot["heat_now"] == {"requesters": [TIAGO], "asked": False, "can_cancel": False}
