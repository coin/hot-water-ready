"""Scheduled notifications and restarts (ticket 05, spec 4.9 and 4.10)."""

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigSubentry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util
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
    """Every notify.send_message call; switch calls are swallowed."""
    async_mock_service(hass, "switch", "turn_on")
    async_mock_service(hass, "switch", "turn_off")
    return async_mock_service(hass, "notify", "send_message")


def _water(hass: HomeAssistant, value: float) -> None:
    hass.states.async_set(SENSOR, str(value), {"unit_of_measurement": "°C"})


async def _ready_time(
    hass: HomeAssistant, ws: WebSocketGenerator, entry: MockConfigEntry, member: str, clock: str
) -> None:
    client = await ws(hass)
    await client.send_json_auto_id(
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": entry.entry_id,
            "member_id": member,
            "time": clock,
            "weekdays": [0],
        }
    )
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()


def _messages(sent: list[ServiceCall]) -> list[tuple[str, str]]:
    return [(call.data["entity_id"], call.data["message"]) for call in sent]


async def test_each_member_of_a_window_is_told_heating_then_ready(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    _water(hass, 40.0)
    await _ready_time(hass, hass_ws_client, heater, TIAGO, "05:20")  # lead 29 min: open now
    await _ready_time(hass, hass_ws_client, heater, MARIA, "05:20")
    # Maria's time joins Tiago's window while it heats, so she is told it is heating too.
    assert sorted(_messages(sent)) == sorted(
        [
            (phones[TIAGO], "Cylinder heating: water ready in about 29 min."),
            (phones[MARIA], "Cylinder heating: water ready in about 29 min."),
        ]
    )

    _water(hass, 42.0)
    await hass.async_block_till_done()
    ready = "Hot water ready: the water is at 42.0 °C."
    assert (phones[TIAGO], ready) in _messages(sent)
    assert (phones[MARIA], ready) in _messages(sent)


async def test_portuguese_heating_message(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    hass.config.language = "pt"
    _water(hass, 40.0)
    await _ready_time(hass, hass_ws_client, heater, TIAGO, "05:20")

    assert _messages(sent) == [
        (phones[TIAGO], "Cylinder a aquecer: água pronta em cerca de 29 min.")
    ]


async def _virtual(
    hass: HomeAssistant, entry: MockConfigEntry, name: str, recipients: list[str]
) -> str:
    hass.config_entries.async_add_subentry(
        entry,
        ConfigSubentry(
            data={"colour": "teal", "recipients": recipients},
            subentry_type="member",
            title=name,
            unique_id=None,
        ),
    )
    await hass.async_block_till_done()
    return next(s.subentry_id for s in entry.subentries.values() if s.title == name)


async def test_virtual_member_tells_only_its_recipients(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    guests = await _virtual(hass, heater, "Convidados", [MARIA_PERSON])
    _water(hass, 40.0)
    await _ready_time(hass, hass_ws_client, heater, guests, "05:20")

    assert [target for target, _ in _messages(sent)] == [phones[MARIA]]


async def test_virtual_member_with_no_recipients_tells_nobody_and_is_not_an_error(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    phones: dict[str, str],
    sent: list[ServiceCall],
    caplog: pytest.LogCaptureFixture,
) -> None:
    global_id = await _virtual(hass, heater, "Global", [])
    _water(hass, 40.0)
    await _ready_time(hass, hass_ws_client, heater, global_id, "05:20")
    _water(hass, 42.0)
    await hass.async_block_till_done()

    assert sent == []
    assert "Nobody to notify" not in caplog.text


async def test_a_restart_in_the_middle_of_heating_sends_nothing_twice(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    phones: dict[str, str],
    sent: list[ServiceCall],
    hass_storage: dict[str, Any],
) -> None:
    _water(hass, 40.0)
    await _ready_time(hass, hass_ws_client, heater, TIAGO, "05:20")
    hass.states.async_set(SWITCH, "on")
    assert len(sent) == 1  # "a aquecer"

    # What was told is on disk at once, not only after the delayed save.
    saved = hass_storage[f"hot_water_ready.{heater.entry_id}"]["data"]["controller"]
    assert saved["window"] is not None

    assert await hass.config_entries.async_reload(heater.entry_id)
    await hass.async_block_till_done()
    assert len(sent) == 1
    hass.states.async_set(SWITCH, "off")
    _water(hass, 42.0)
    await hass.async_block_till_done()
    assert len(sent) == 2  # "Duche pronto", once

    assert await hass.config_entries.async_reload(heater.entry_id)
    _water(hass, 42.3)
    await hass.async_block_till_done()
    assert len(sent) == 2


async def test_rich_option_replaces_the_heating_message_on_mobile_app_phones(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    hass.config_entries.async_update_entry(heater, options={"rich_notifications": True})
    await hass.async_block_till_done()
    action = AsyncMock()
    with patch("custom_components.hot_water_ready.messages.async_call_mobile_app_action", action):
        _water(hass, 40.0)
        await _ready_time(hass, hass_ws_client, heater, TIAGO, "05:20")
        _water(hass, 42.0)
        await hass.async_block_till_done()

    assert sent == []  # rich phones go through the mobile_app device action instead
    tags = {call.kwargs["data"]["tag"] for call in action.await_args_list}
    assert len(tags) == 1  # "Duche pronto" replaces "a aquecer" on the phone
    assert action.await_count == 2


async def test_after_a_real_stop_it_resumes_and_repeats_nothing(
    hass: HomeAssistant,
    heater_entry: MockConfigEntry,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    hass_storage: dict[str, Any],
) -> None:
    """Home Assistant stops without unloading: start from what was on disk mid-heating."""
    sent = async_mock_service(hass, "notify", "send_message")
    tiago_phone = _phone(hass, "pixel_tiago", TIAGO_PERSON, hass_admin_user.id)
    hass_storage[f"hot_water_ready.{heater_entry.entry_id}"] = {
        "version": 1,
        "minor_version": 1,
        "key": f"hot_water_ready.{heater_entry.entry_id}",
        "data": {
            "settings": {"target": 42.0, "margin": 1.0},
            "members": {
                TIAGO: {
                    "ready_times": [
                        {"id": "r1", "time": "05:20", "weekdays": [0], "enabled": True}
                    ],
                    "away": {"on": False, "until": None},
                }
            },
            "controller": {
                "heating": True,
                "told": [],
                "told_heating": [[TIAGO, "2026-11-02T05:20:00+00:00"]],
                "window": {
                    "ready_at": "2026-11-02T05:20:00+00:00",
                    "last_ready_at": "2026-11-02T05:20:00+00:00",
                    "end": "2026-11-02T05:35:00+00:00",
                    "members": [TIAGO],
                    "target": 42.0,
                    "wants_heat": True,
                },
            },
        },
    }
    hass.states.async_set(SWITCH, "off")  # the relay came back off after the power cut
    _water(hass, 40.5)
    assert await hass.config_entries.async_setup(heater_entry.entry_id)
    await hass.async_block_till_done()
    # Setting up loaded the switch component, which owns switch.turn_on from now on.
    on = async_mock_service(hass, "switch", "turn_on")
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=31))
    await hass.async_block_till_done()

    assert heater_entry.runtime_data.heating
    assert len(on) == 1  # resumed heating
    assert sent == []  # "a aquecer" was already sent before the stop
    _water(hass, 42.0)
    await hass.async_block_till_done()
    assert [c.data["entity_id"] for c in sent] == [tiago_phone]  # "Duche pronto", once


async def test_a_window_member_with_no_phone_gets_one_note_and_one_warning(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    sent: list[ServiceCall],
    caplog: pytest.LogCaptureFixture,
) -> None:
    _water(hass, 40.0)
    await _ready_time(hass, hass_ws_client, heater, TIAGO, "05:20")  # Tiago has no phone
    _water(hass, 42.0)
    await hass.async_block_till_done()

    notes = persistent_notification._async_get_or_create_notifications(hass)
    mine = [n for n in notes.values() if n["notification_id"].startswith("hot_water_ready")]
    assert len(mine) == 1  # replaced by the latest message, not one per message
    assert caplog.text.count("Nobody to notify for Tiago") == 1


async def test_a_phone_that_refuses_the_rich_action_still_gets_the_plain_message(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    phones: dict[str, str],
    sent: list[ServiceCall],
) -> None:
    hass.config_entries.async_update_entry(heater, options={"rich_notifications": True})
    await hass.async_block_till_done()
    refuse = AsyncMock(side_effect=HomeAssistantError("no push for this phone"))
    with patch("custom_components.hot_water_ready.messages.async_call_mobile_app_action", refuse):
        _water(hass, 40.0)
        await _ready_time(hass, hass_ws_client, heater, TIAGO, "05:20")

    assert [c.data["entity_id"] for c in sent] == [phones[TIAGO]]
