"""The fault guard in Home Assistant (ticket 06): stopping, Repairs, telling, refusing, clearing."""

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.components.repairs import repairs_flow_manager
from homeassistant.core import Context, HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import (
    device_registry as dr,
    entity_registry as er,
    issue_registry as ir,
)
from homeassistant.setup import async_setup_component
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
    async_mock_service,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import SENSOR, SWITCH, TIAGO, TIAGO_PERSON

POWER = "sensor.cylinder_power"


@pytest.fixture
def calls(hass: HomeAssistant, heater: MockConfigEntry) -> dict[str, list[ServiceCall]]:
    """Switch and notify calls, mocked after setup (setup loads the switch component)."""
    return {
        "on": async_mock_service(hass, "switch", "turn_on"),
        "off": async_mock_service(hass, "switch", "turn_off"),
        "sent": async_mock_service(hass, "notify", "send_message"),
    }


@pytest.fixture
def tiago_phone(hass: HomeAssistant, heater: MockConfigEntry, hass_admin_user: MockUser) -> str:
    """The admin's phone: faults go to every admin by default."""
    phone_entry = MockConfigEntry(domain="mobile_app", title="pixel_tiago")
    phone_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=phone_entry.entry_id, identifiers={("mobile_app", "pt")}, name="pt"
    )
    registry = er.async_get(hass)
    tracker = registry.async_get_or_create(
        "device_tracker", "mobile_app", "pt_tracker", device_id=device.id
    ).entity_id
    notify = registry.async_get_or_create(
        "notify", "mobile_app", "pt_notify", device_id=device.id
    ).entity_id
    hass.states.async_set(
        TIAGO_PERSON, "home", {"user_id": hass_admin_user.id, "device_trackers": [tracker]}
    )
    return notify


async def _minutes(hass: HomeAssistant, freezer: FrozenDateTimeFactory, minutes: float) -> None:
    for _ in range(round(minutes * 2)):
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()


def _water(hass: HomeAssistant, value: float | str) -> None:
    hass.states.async_set(SENSOR, str(value), {"unit_of_measurement": "°C"})


async def _heating_window(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    from datetime import time  # noqa: PLC0415

    _water(hass, 38.0)
    await heater.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    hass.states.async_set(SWITCH, "on")
    await hass.async_block_till_done()


def _issue(hass: HomeAssistant, heater: MockConfigEntry, fault: str) -> Any:
    return ir.async_get(hass).async_get_issue(DOMAIN, f"{heater.entry_id}_{fault}")


async def test_a_silent_sensor_stops_heating_raises_an_issue_and_tells_admins(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    calls: dict[str, list[ServiceCall]],
    tiago_phone: str,
    freezer: FrozenDateTimeFactory,
) -> None:
    await _heating_window(hass, heater)
    hass.states.async_set(SENSOR, "unavailable")
    await _minutes(hass, freezer, 5.5)

    # The mocked relay never turns off, so the heater keeps asking: once is what matters.
    assert calls["off"]
    assert hass.states.get("sensor.cylinder_status").state == "fault"
    assert hass.states.get("binary_sensor.cylinder_problem").state == "on"
    issue = _issue(hass, heater, "sensor_unavailable")
    assert issue is not None
    assert not issue.is_fixable
    faults_told = [c for c in calls["sent"] if "sensor" in c.data["message"]]
    assert [c.data["entity_id"] for c in faults_told] == [tiago_phone]

    hass.states.async_set(SWITCH, "off")
    on_before = len(calls["on"])
    _water(hass, 38.0)
    await _minutes(hass, freezer, 1.5)
    assert _issue(hass, heater, "sensor_unavailable") is None
    assert hass.states.get("binary_sensor.cylinder_problem").state == "off"
    assert len(calls["on"]) > on_before  # heating resumed


async def test_heat_now_is_refused_with_the_reason_during_a_fault(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    calls: dict[str, list[ServiceCall]],
    hass_ws_client: WebSocketGenerator,
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.states.async_set(SENSOR, "unavailable")
    await _minutes(hass, freezer, 5.5)

    with pytest.raises(HomeAssistantError, match="sensor gives no readings"):
        await hass.services.async_call(
            "button", "press", {"entity_id": "button.cylinder_heat_now"}, blocking=True
        )
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "hot_water_ready/heat_now/start", "entry_id": heater.entry_id}
    )
    reply = await client.receive_json()
    assert reply["error"]["code"] == "refused"
    assert "sensor gives no readings" in reply["error"]["message"]


async def test_not_rising_is_fixed_through_repairs(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    calls: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    await _heating_window(hass, heater)
    await _minutes(hass, freezer, 31)  # on, and the water stays at 38
    issue = _issue(hass, heater, "not_rising")
    assert issue is not None
    assert issue.is_fixable
    assert calls["off"]

    # Through Home Assistant's own repairs flow manager, as the Repairs page does.
    assert await async_setup_component(hass, "repairs", {})
    manager = repairs_flow_manager(hass)
    assert manager is not None
    flow = await manager.async_init(DOMAIN, data={"issue_id": issue.issue_id})
    assert flow["step_id"] == "confirm"
    done = await manager.async_configure(flow["flow_id"], {})
    assert done["type"] == "create_entry"
    await hass.async_block_till_done()

    assert _issue(hass, heater, "not_rising") is None
    assert hass.states.get("binary_sensor.cylinder_problem").state == "off"


async def test_power_checks_need_a_power_sensor_and_relay_stuck_only_reports(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    calls: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.config_entries.async_update_entry(heater, options={"power_sensor": POWER})
    await hass.async_block_till_done()
    calls["off"].clear()
    hass.states.async_set(POWER, "2700", {"unit_of_measurement": "W"})
    _water(hass, 45.0)
    await _minutes(hass, freezer, 5.5)  # relay off, drawing 2700 W

    assert _issue(hass, heater, "relay_stuck") is not None
    assert hass.states.get("sensor.cylinder_status").state == "fault"
    hass.states.async_set(POWER, "0", {"unit_of_measurement": "W"})
    await _minutes(hass, freezer, 1.5)  # a minute seen without power
    assert _issue(hass, heater, "relay_stuck") is None


async def test_no_consumption_stops_heating(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.config_entries.async_update_entry(heater, options={"power_sensor": POWER})
    await hass.async_block_till_done()
    off = async_mock_service(hass, "switch", "turn_off")
    async_mock_service(hass, "switch", "turn_on")
    hass.states.async_set(POWER, "2", {"unit_of_measurement": "W"})
    await _heating_window(hass, heater)
    await _minutes(hass, freezer, 5.5)

    assert _issue(hass, heater, "no_consumption") is not None
    assert off


async def test_automatic_off_leaves_the_heater_alone_and_shows_manual(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    calls: dict[str, list[ServiceCall]],
) -> None:
    # The calls fixture mocks switch.turn_off, so go through the heater as the switch does.
    await heater.runtime_data.async_set_automatic(False)
    calls["on"].clear()
    await _heating_window(hass, heater)
    hass.states.async_set(SWITCH, "off")
    await hass.async_block_till_done()

    assert calls["on"] == []
    assert hass.states.get("sensor.cylinder_status").state == "manual"


async def test_only_admins_switch_automatic_control(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser
) -> None:
    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            "switch",
            "turn_off",
            {"entity_id": "switch.cylinder_automatic_control"},
            blocking=True,
            context=Context(user_id=maria_user.id),
        )
    assert hass.states.get("switch.cylinder_automatic_control").state == "on"


async def test_fault_recipients_option_replaces_the_admins(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    tiago_phone: str,
    maria_user: MockUser,
    freezer: FrozenDateTimeFactory,
) -> None:
    phone_entry = MockConfigEntry(domain="mobile_app", title="pixel_maria")
    phone_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=phone_entry.entry_id, identifiers={("mobile_app", "pm")}, name="pm"
    )
    registry = er.async_get(hass)
    tracker = registry.async_get_or_create(
        "device_tracker", "mobile_app", "pm_tracker", device_id=device.id
    ).entity_id
    maria_phone = registry.async_get_or_create(
        "notify", "mobile_app", "pm_notify", device_id=device.id
    ).entity_id
    hass.states.async_set(
        "person.maria", "home", {"user_id": maria_user.id, "device_trackers": [tracker]}
    )
    hass.config_entries.async_update_entry(heater, options={"fault_recipients": ["person.maria"]})
    await hass.async_block_till_done()
    sent = async_mock_service(hass, "notify", "send_message")
    async_mock_service(hass, "switch", "turn_off")
    hass.states.async_set(SENSOR, "unavailable")
    await _minutes(hass, freezer, 5.5)

    assert [c.data["entity_id"] for c in sent] == [maria_phone]


async def test_only_admins_switch_automatic_control_back_on(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser
) -> None:
    await heater.runtime_data.async_set_automatic(False)
    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            "switch",
            "turn_on",
            {"entity_id": "switch.cylinder_automatic_control"},
            blocking=True,
            context=Context(user_id=maria_user.id),
        )
    assert hass.states.get("switch.cylinder_automatic_control").state == "off"


async def test_heat_now_is_refused_while_run_by_hand(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    hass.config.language = "pt"
    await heater.runtime_data.async_set_automatic(False)
    with pytest.raises(HomeAssistantError, match="comandado manualmente"):
        await hass.services.async_call(
            "button", "press", {"entity_id": "button.cylinder_heat_now"}, blocking=True
        )


async def test_no_heating_message_while_a_fault_stops_heating(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    calls: dict[str, list[ServiceCall]],
    tiago_phone: str,
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.states.async_set(SENSOR, "unavailable")
    await _minutes(hass, freezer, 5.5)
    calls["sent"].clear()
    _water(hass, 38.0)  # one reading: the fault needs a minute of them to clear
    from datetime import time  # noqa: PLC0415

    await heater.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    await hass.async_block_till_done()

    assert [c for c in calls["sent"] if "heating" in c.data["message"]] == []


async def test_issues_are_removed_with_the_heater(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    calls: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.states.async_set(SENSOR, "unavailable")
    await _minutes(hass, freezer, 5.5)
    assert _issue(hass, heater, "sensor_unavailable") is not None

    assert await hass.config_entries.async_remove(heater.entry_id)
    await hass.async_block_till_done()
    assert _issue(hass, heater, "sensor_unavailable") is None
