"""A heater run through an existing thermostat (ticket 07, setup (b) of spec 3.1)."""

from datetime import time, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import issue_registry as ir
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
    async_mock_service,
)

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import SENSOR, TIAGO, member

CLIMATE = "climate.boiler"


def _thermostat(hass: HomeAssistant, mode: str, **attributes: Any) -> None:
    hass.states.async_set(
        CLIMATE, mode, {"hvac_modes": ["off", "heat"], "temperature": 30.0, **attributes}
    )


@pytest.fixture
async def boiler(hass: HomeAssistant, maria_user: MockUser) -> MockConfigEntry:
    """A heater whose element is a thermostat that reports whether it is heating."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Boiler",
        data={"heater_type": "climate", "climate": CLIMATE, "temperature_sensor": SENSOR},
        subentries_data=[member(TIAGO, "Tiago", "person.tiago", "blue")],
    )
    entry.add_to_hass(hass)
    _thermostat(hass, "off", hvac_action="off")
    hass.states.async_set(SENSOR, "40.0", {"unit_of_measurement": "°C"})
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


@pytest.fixture
def climate_calls(hass: HomeAssistant, boiler: MockConfigEntry) -> dict[str, list[ServiceCall]]:
    """The thermostat's mode and setpoint calls (mocked after setup)."""
    return {
        "mode": async_mock_service(hass, "climate", "set_hvac_mode"),
        "setpoint": async_mock_service(hass, "climate", "set_temperature"),
    }


def _summary(calls: dict[str, list[ServiceCall]]) -> list[tuple[str, Any]]:
    return sorted(
        [("set_hvac_mode", c.data["hvac_mode"]) for c in calls["mode"]]
        + [("set_temperature", c.data["temperature"]) for c in calls["setpoint"]]
    )


async def test_a_window_sets_the_thermostat_to_heat_at_the_stop_point(
    hass: HomeAssistant, boiler: MockConfigEntry, climate_calls: dict[str, list[ServiceCall]]
) -> None:
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    await hass.async_block_till_done()

    assert _summary(climate_calls) == [("set_hvac_mode", "heat"), ("set_temperature", 43.0)]


async def test_the_band_turns_the_thermostat_off_at_target_plus_margin(
    hass: HomeAssistant, boiler: MockConfigEntry, climate_calls: dict[str, list[ServiceCall]]
) -> None:
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    _thermostat(hass, "heat", hvac_action="heating", temperature=43.0)
    hass.states.async_set(SENSOR, "43.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()

    assert ("set_hvac_mode", "off") in _summary(climate_calls)
    assert hass.states.get("sensor.boiler_status").state == "ready"


async def test_not_rising_uses_the_thermostats_heating_indication(
    hass: HomeAssistant, boiler: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    async_mock_service(hass, "climate", "set_hvac_mode")
    async_mock_service(hass, "climate", "set_temperature")
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    _thermostat(hass, "heat", hvac_action="heating", temperature=43.0)
    for _ in range(62):  # 31 min heating, the water stuck at 40
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()

    issue = ir.async_get(hass).async_get_issue(DOMAIN, f"{boiler.entry_id}_not_rising")
    assert issue is not None


async def test_without_a_heating_indication_not_rising_is_skipped_with_a_note(
    hass: HomeAssistant, boiler: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    async_mock_service(hass, "climate", "set_hvac_mode")
    async_mock_service(hass, "climate", "set_temperature")
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    _thermostat(hass, "heat", temperature=43.0)  # no hvac_action at all
    for _ in range(62):
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()

    assert ir.async_get(hass).async_get_issue(DOMAIN, f"{boiler.entry_id}_not_rising") is None
    assert boiler.runtime_data.not_rising_checked is False
    snapshot = boiler.runtime_data.snapshot(await hass.auth.async_create_user("x"))
    assert snapshot["not_rising_checked"] is False


async def test_unloading_turns_a_heating_thermostat_off(
    hass: HomeAssistant, boiler: MockConfigEntry
) -> None:
    async_mock_service(hass, "climate", "set_temperature")
    mode = async_mock_service(hass, "climate", "set_hvac_mode")
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    _thermostat(hass, "heat", hvac_action="heating", temperature=43.0)
    await hass.async_block_till_done()
    mode.clear()

    assert await hass.config_entries.async_unload(boiler.entry_id)
    assert [c.data["hvac_mode"] for c in mode] == ["off"]


async def test_the_thermostat_restarts_at_target_minus_margin(
    hass: HomeAssistant, boiler: MockConfigEntry, climate_calls: dict[str, list[ServiceCall]]
) -> None:
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    _thermostat(hass, "heat", hvac_action="heating", temperature=43.0)
    hass.states.async_set(SENSOR, "43.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()
    _thermostat(hass, "off", hvac_action="off", temperature=43.0)
    climate_calls["mode"].clear()
    hass.states.async_set(SENSOR, "41.1", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()
    assert climate_calls["mode"] == []
    hass.states.async_set(SENSOR, "41.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()

    assert [c.data["hvac_mode"] for c in climate_calls["mode"]] == ["heat"]


async def test_a_thermostat_that_rounds_its_setpoint_is_not_sent_it_again(
    hass: HomeAssistant, boiler: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    await boiler.runtime_data.async_set_band(target=42.5)
    setpoint = async_mock_service(hass, "climate", "set_temperature")
    async_mock_service(hass, "climate", "set_hvac_mode")
    # It keeps whole degrees: asked for 43.5, it shows 43 (or 44).
    _thermostat(hass, "heat", hvac_action="heating", temperature=43.0, target_temp_step=1)
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    for _ in range(10):
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()

    assert setpoint == []


async def test_a_refused_command_is_logged_once(
    hass: HomeAssistant,
    boiler: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
    caplog: pytest.LogCaptureFixture,
) -> None:
    from homeassistant.exceptions import HomeAssistantError  # noqa: PLC0415

    async def refuse(call: ServiceCall) -> None:
        raise HomeAssistantError("thermostat offline")

    hass.services.async_register("climate", "set_hvac_mode", refuse)
    async_mock_service(hass, "climate", "set_temperature")
    await boiler.runtime_data.async_add_ready_time(TIAGO, time(5, 20), frozenset({0}), True)
    for _ in range(10):
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()

    warnings = [
        r for r in caplog.records if r.levelname == "WARNING" and "set_hvac_mode" in r.getMessage()
    ]
    assert len(warnings) == 1  # later failures go to the debug log


async def test_a_thermostat_without_heat_and_off_is_refused(hass: HomeAssistant) -> None:
    from homeassistant.config_entries import SOURCE_USER  # noqa: PLC0415
    from homeassistant.data_entry_flow import FlowResultType  # noqa: PLC0415

    hass.states.async_set("climate.cooler", "cool", {"hvac_modes": ["off", "cool"]})
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"next_step_id": "climate"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"name": "Cooler", "climate": "climate.cooler", "temperature_sensor": SENSOR},
    )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"climate": "unsupported_thermostat"}


async def test_the_heater_setup_is_changed_later(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    from homeassistant.data_entry_flow import FlowResultType  # noqa: PLC0415

    _thermostat(hass, "off", hvac_action="off")
    result = await heater.start_reconfigure_flow(hass)
    assert result["type"] is FlowResultType.MENU
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"next_step_id": "climate"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"name": "Cylinder", "climate": CLIMATE, "temperature_sensor": SENSOR},
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    assert heater.data["heater_type"] == "climate"
    assert heater.runtime_data.actuator.entity_id == CLIMATE
