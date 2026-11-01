"""The heater switched by Home Assistant: one member, one ready time (ticket 02)."""

from datetime import timedelta

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

from .conftest import SENSOR, SWITCH, TIAGO, local


async def _add_ready_time(
    hass: HomeAssistant, ws: WebSocketGenerator, entry: MockConfigEntry, clock: str
) -> None:
    client = await ws(hass)
    await client.send_json_auto_id(
        {
            "type": "hot_water_ready/ready_time/add",
            "entry_id": entry.entry_id,
            "member_id": TIAGO,
            "time": clock,
            "weekdays": [0, 1, 2, 3, 4, 5, 6],
        }
    )
    assert (await client.receive_json())["success"]


async def _advance_to(hass: HomeAssistant, freezer: FrozenDateTimeFactory, clock: str) -> None:
    target = local(clock)
    while (now := freezer()) and now.astimezone(target.tzinfo) < target:  # type: ignore[attr-defined]
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()


def _water(hass: HomeAssistant, value: float) -> None:
    hass.states.async_set(SENSOR, str(value), {"unit_of_measurement": "°C"})


def _calls(calls: list[ServiceCall]) -> list[str]:
    return [call.service for call in calls]


async def test_seven_o_clock_heats_from_the_lead(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    freezer: FrozenDateTimeFactory,
) -> None:
    on = async_mock_service(hass, "switch", "turn_on")
    _water(hass, 30.0)
    await _add_ready_time(hass, hass_ws_client, heater, "07:00")

    # Lead from 30 C: (42 - 30) x 7 + 15 = 99 min, so 05:21.
    await _advance_to(hass, freezer, "05:20")
    assert on == []
    await _advance_to(hass, freezer, "05:21")
    await hass.async_block_till_done()
    assert [c.data["entity_id"] for c in on] == [SWITCH]
    assert hass.states.get("sensor.cylinder_status").state == "heating"


async def test_relay_stops_at_target_plus_margin(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    freezer: FrozenDateTimeFactory,
) -> None:
    async_mock_service(hass, "switch", "turn_on")
    off = async_mock_service(hass, "switch", "turn_off")
    _water(hass, 40.0)
    await _add_ready_time(hass, hass_ws_client, heater, "05:20")
    await hass.async_block_till_done()
    hass.states.async_set(SWITCH, "on")

    _water(hass, 42.0)
    await hass.async_block_till_done()
    assert off == []
    assert hass.states.get("sensor.cylinder_status").state == "heating"
    _water(hass, 43.0)
    await hass.async_block_till_done()
    assert _calls(off) == ["turn_off"]
    hass.states.async_set(SWITCH, "off")
    await hass.async_block_till_done()
    assert hass.states.get("sensor.cylinder_status").state == "ready"


async def test_warm_water_keeps_the_heater_off(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    freezer: FrozenDateTimeFactory,
) -> None:
    on = async_mock_service(hass, "switch", "turn_on")
    _water(hass, 45.0)
    await _add_ready_time(hass, hass_ws_client, heater, "06:00")
    await _advance_to(hass, freezer, "06:20")

    assert on == []


async def test_reconnecting_relay_is_switched_on_again(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    on = async_mock_service(hass, "switch", "turn_on")
    _water(hass, 40.0)
    await _add_ready_time(hass, hass_ws_client, heater, "05:20")
    await hass.async_block_till_done()
    hass.states.async_set(SWITCH, "on")
    await hass.async_block_till_done()
    assert len(on) == 1

    hass.states.async_set(SWITCH, "unavailable")
    await hass.async_block_till_done()
    assert len(on) == 1  # nothing to switch while it is gone
    hass.states.async_set(SWITCH, "off")  # the relay comes back off
    await hass.async_block_till_done()
    assert len(on) == 2


async def test_late_sensor_waits_then_heats(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    on = async_mock_service(hass, "switch", "turn_on")
    hass.states.async_set(SENSOR, "unavailable")
    await _add_ready_time(hass, hass_ws_client, heater, "05:20")
    await hass.async_block_till_done()
    assert on == []

    _water(hass, 38.0)
    await hass.async_block_till_done()
    assert len(on) == 1


async def test_restart_mid_heat_carries_on(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    on = async_mock_service(hass, "switch", "turn_on")
    off = async_mock_service(hass, "switch", "turn_off")
    _water(hass, 41.5)
    await _add_ready_time(hass, hass_ws_client, heater, "05:10")  # lead 18.5 min: open now
    await hass.async_block_till_done()
    hass.states.async_set(SWITCH, "on")
    _water(hass, 42.3)  # ready reported; still heating towards 43
    await hass.async_block_till_done()

    assert await hass.config_entries.async_reload(heater.entry_id)
    await hass.async_block_till_done()
    # Unloading switched the relay off; the reloaded heater resumes and switches it on again.
    assert len(off) == 1
    hass.states.async_set(SWITCH, "off")
    await hass.async_block_till_done()
    assert len(on) == 2
    assert hass.states.get("sensor.cylinder_status").state == "heating"
    hass.states.async_set(SWITCH, "on")
    _water(hass, 43.0)
    await hass.async_block_till_done()
    assert len(off) == 2


async def test_next_ready_time_sensors(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    await _add_ready_time(hass, hass_ws_client, heater, "07:00")
    await hass.async_block_till_done()

    heater_next = hass.states.get("sensor.cylinder_next_ready_time")
    assert heater_next.state == local("07:00").isoformat()
    assert heater_next.attributes["members"] == ["Tiago"]
    assert hass.states.get("sensor.tiago_next_ready_time").state == local("07:00").isoformat()
    assert hass.states.get("sensor.maria_next_ready_time").state == "unknown"


async def test_target_and_margin_numbers_drive_the_band(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    off = async_mock_service(hass, "switch", "turn_off")
    async_mock_service(hass, "switch", "turn_on")
    await hass.services.async_call(
        "number",
        "set_value",
        {"entity_id": "number.cylinder_target_temperature", "value": 45},
        blocking=True,
    )
    await hass.services.async_call(
        "number",
        "set_value",
        {"entity_id": "number.cylinder_margin", "value": 0.5},
        blocking=True,
    )
    _water(hass, 44.0)
    await _add_ready_time(hass, hass_ws_client, heater, "05:20")
    await hass.async_block_till_done()
    hass.states.async_set(SWITCH, "on")
    _water(hass, 45.4)
    await hass.async_block_till_done()
    assert off == []
    _water(hass, 45.5)
    await hass.async_block_till_done()
    assert len(off) == 1
    assert hass.states.get("number.cylinder_target_temperature").state == "45.0"


async def test_removing_the_heater_switches_off_what_it_switched_on(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    async_mock_service(hass, "switch", "turn_on")
    off = async_mock_service(hass, "switch", "turn_off")
    _water(hass, 40.0)
    await _add_ready_time(hass, hass_ws_client, heater, "05:20")
    await hass.async_block_till_done()
    hass.states.async_set(SWITCH, "on")
    await hass.async_block_till_done()

    assert await hass.config_entries.async_remove(heater.entry_id)
    await hass.async_block_till_done()
    assert len(off) == 1


async def test_only_admins_change_the_band(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser
) -> None:
    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            "number",
            "set_value",
            {"entity_id": "number.cylinder_target_temperature", "value": 50},
            blocking=True,
            context=Context(user_id=maria_user.id),
        )
    assert heater.runtime_data.target == 42.0
