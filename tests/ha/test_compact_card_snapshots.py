"""The snapshots the compact card is tested with, made by the real heater (decision 15).

The compact card shows only the top block of the full card, built from the same per-viewer
snapshot. These tests make that snapshot for a private member's heating, for Maria (a plain
user) and for the admin, check what each may see, and keep the result in
`card/test/fixtures/compact-private.json`, which the card's tests render. A change to the
snapshot that the fixture does not have fails here; to accept it, run with
`HWR_UPDATE_FIXTURES=1` and read the diff.
"""

from datetime import time
import json
import os
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_mock_service,
)

from custom_components.hot_water_ready.const import CONF_POWER_SENSOR
from custom_components.hot_water_ready.core.visibility import Visibility

from .conftest import MARIA, SENSOR, SWITCH, TIAGO

FIXTURE = Path(__file__).parents[2] / "card" / "test" / "fixtures" / "compact-private.json"
POWER = "sensor.cylinder_power"
EVERY_DAY = frozenset(range(7))


@pytest.fixture
async def relay(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    """A relay that answers, and a power sensor, so the element line has watts."""
    async_mock_service(hass, "switch", "turn_on")
    async_mock_service(hass, "switch", "turn_off")
    hass.config_entries.async_update_entry(heater, options={CONF_POWER_SENSOR: POWER})
    await hass.async_block_till_done()


def _element_on(hass: HomeAssistant) -> None:
    """The relay reports on and the element draws 2739 W, as on the household's tank."""
    hass.states.async_set(SWITCH, "on")
    hass.states.async_set(POWER, "2739", {"unit_of_measurement": "W"})


def _stable(snapshot: dict[str, Any]) -> dict[str, Any]:
    """The snapshot with the ids that change on every run replaced."""
    stable = json.loads(json.dumps(snapshot))
    stable["entry_id"] = "entry"
    for member in stable["members"]:
        for index, ready_time in enumerate(member["ready_times"]):
            ready_time["id"] = f"{member['id']}-{index}"
    return stable


def _no_trace_of_tiago(snapshot: dict[str, Any]) -> None:
    """Nothing in what the compact card reads says that Tiago's heating exists."""
    assert snapshot["status"] != "heating"
    assert snapshot["ready_in_minutes"] is None
    assert snapshot["heating_for"] == []
    assert snapshot["heat_now"] is None
    assert (snapshot["element_on"], snapshot["power_w"]) == (None, None)
    assert snapshot["next_ready"] is None or TIAGO not in snapshot["next_ready"]["members"]
    assert snapshot["next_heat_start"] is None


async def _ready_time_case(
    hass: HomeAssistant, heater: MockConfigEntry, admin: MockUser, maria: MockUser
) -> dict[str, Any]:
    """Tiago, private, has 05:45 every day; at 05:00 its window is heating the water."""
    runtime = heater.runtime_data
    hass.states.async_set(SENSOR, "37.5", {"unit_of_measurement": "°C"})
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await runtime.async_add_ready_time(TIAGO, time(5, 45), EVERY_DAY, True)
    await hass.async_block_till_done()
    _element_on(hass)
    await hass.async_block_till_done()
    assert runtime.heating
    return {"admin": runtime.snapshot(admin), "member": runtime.snapshot(maria)}


async def _heat_now_case(
    hass: HomeAssistant, heater: MockConfigEntry, admin: MockUser, maria: MockUser
) -> dict[str, Any]:
    """Tiago, private, asked for heat now and nobody else did."""
    runtime = heater.runtime_data
    hass.states.async_set(SENSOR, "38.0", {"unit_of_measurement": "°C"})
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await runtime.async_heat_now(TIAGO)
    await hass.async_block_till_done()
    _element_on(hass)
    await hass.async_block_till_done()
    assert runtime.heating
    return {"admin": runtime.snapshot(admin), "member": runtime.snapshot(maria)}


async def _shared_case(
    hass: HomeAssistant, heater: MockConfigEntry, admin: MockUser, maria: MockUser
) -> dict[str, Any]:
    """Tiago (private) and Maria both have 05:45: one window heats for both."""
    runtime = heater.runtime_data
    hass.states.async_set(SENSOR, "37.5", {"unit_of_measurement": "°C"})
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await runtime.async_add_ready_time(TIAGO, time(5, 45), EVERY_DAY, True)
    await runtime.async_add_ready_time(MARIA, time(5, 45), EVERY_DAY, True)
    await hass.async_block_till_done()
    _element_on(hass)
    await hass.async_block_till_done()
    assert runtime.heating
    return {"admin": runtime.snapshot(admin), "member": runtime.snapshot(maria)}


CASES = {"ready_time": _ready_time_case, "heat_now": _heat_now_case}


async def test_a_shared_window_names_only_the_viewers_own_ready_time(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    relay: None,
    hass_admin_user: MockUser,
    maria_user: MockUser,
) -> None:
    snapshots = await _shared_case(hass, heater, hass_admin_user, maria_user)

    maria = snapshots["member"]
    assert maria["status"] == "heating"  # for her own 05:45, which she may see
    assert [entry["member"] for entry in maria["heating_for"]] == [MARIA]
    assert maria["next_ready"]["members"] == [MARIA]
    assert (maria["element_on"], maria["power_w"]) == (None, None)
    admin = snapshots["admin"]
    assert sorted(entry["member"] for entry in admin["heating_for"]) == [MARIA, TIAGO]

    _keep("shared", {viewer: _stable(snapshot) for viewer, snapshot in snapshots.items()})


@pytest.mark.parametrize("case", CASES)
async def test_a_private_members_heating_leaves_no_trace_for_others(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    relay: None,
    hass_admin_user: MockUser,
    maria_user: MockUser,
    case: str,
) -> None:
    snapshots = await CASES[case](hass, heater, hass_admin_user, maria_user)

    _no_trace_of_tiago(snapshots["member"])
    admin = snapshots["admin"]
    assert admin["status"] == "heating"
    assert (admin["element_on"], admin["power_w"]) == (True, 2739.0)
    if case == "ready_time":
        assert [entry["member"] for entry in admin["heating_for"]] == [TIAGO]
    else:
        assert admin["heat_now"]["requesters"] == [TIAGO]
    # Maria's own member is in both, so the card can still name her.
    assert any(member["id"] == MARIA for member in snapshots["member"]["members"])

    _keep(case, {viewer: _stable(snapshot) for viewer, snapshot in snapshots.items()})


def _keep(case: str, snapshots: dict[str, Any]) -> None:
    """Compare with the fixture the card's tests read, or write it when asked."""
    kept: dict[str, Any] = json.loads(FIXTURE.read_text("utf-8")) if FIXTURE.exists() else {}
    if os.environ.get("HWR_UPDATE_FIXTURES") == "1":
        kept[case] = snapshots
        FIXTURE.parent.mkdir(parents=True, exist_ok=True)
        FIXTURE.write_text(json.dumps(kept, indent=2, sort_keys=True) + "\n", "utf-8")
        return
    assert kept.get(case) == snapshots, (
        f"{FIXTURE.name} is out of date for {case!r}: run with HWR_UPDATE_FIXTURES=1"
    )
