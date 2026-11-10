"""Relearning the heating rate from the recorder's history: the card's "Recalcular" (spec 4.2)."""

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)
from pytest_homeassistant_custom_component.typing import (
    RecorderInstanceGenerator,
    WebSocketGenerator,
)

from .conftest import SENSOR, SWITCH


@pytest.fixture
async def mock_recorder_before_hass(async_test_recorder: RecorderInstanceGenerator) -> None:
    """The recorder must be prepared before Home Assistant is (the plugin's hook for it)."""


async def _recalculate(client: Any, entry: MockConfigEntry) -> dict[str, Any]:
    await client.send_json_auto_id(
        {"type": "hot_water_ready/rate/recalculate", "entry_id": entry.entry_id}
    )
    reply: dict[str, Any] = await client.receive_json()
    return reply


async def _night_run(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, *, minutes: int, per_minute: float
) -> None:
    """The relay on for `minutes` before dawn, the water rising `per_minute`, then off."""
    water = 30.0
    hass.states.async_set(SENSOR, f"{water:.1f}", {"unit_of_measurement": "°C"})
    hass.states.async_set(SWITCH, "on")
    for _ in range(minutes):
        freezer.tick(timedelta(minutes=1))
        water += per_minute
        hass.states.async_set(SENSOR, f"{water:.1f}", {"unit_of_measurement": "°C"})
    freezer.tick(timedelta(minutes=1))
    hass.states.async_set(SENSOR, f"{water + per_minute:.1f}", {"unit_of_measurement": "°C"})
    hass.states.async_set(SWITCH, "off")
    await hass.async_block_till_done()


async def test_recalculating_finds_the_weeks_runs_in_history(
    recorder_mock: Any,
    hass: HomeAssistant,
    heater: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Three clean night runs the live learner never kept (say, a restart each time)."""
    hass.config.latitude, hass.config.longitude = 38.72, -9.14
    runtime = heater.runtime_data
    await runtime.async_set_automatic(False)  # run by hand: the component leaves the relay alone
    for night, per_minute in enumerate((0.2, 0.25, 0.1)):  # 5, 4 and 10 min per degree
        freezer.move_to(f"2026-11-0{3 + night} 02:00:00+00:00")
        await _night_run(hass, freezer, minutes=40, per_minute=per_minute)
    runtime._learner.state.runs = []  # what the live learner lost
    freezer.move_to("2026-11-06 12:00:00+00:00")
    await async_wait_recording_done(hass)

    result = await runtime.async_recalculate_rate()

    assert result["runs"] == 3
    assert result["learned"] == pytest.approx(5.0, abs=0.2)
    assert runtime.rate == pytest.approx(5.0, abs=0.2)


async def test_an_admin_recalculates_from_the_card(
    recorder_mock: Any,
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    """Nothing heated in the last week: no runs, nothing learned, and the reply says so."""
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)

    reply = await _recalculate(client, heater)

    assert reply["success"], reply
    assert reply["result"] == {"runs": 0, "learned": None}


async def test_recalculating_drops_a_fixed_rate(
    recorder_mock: Any,
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
) -> None:
    """The recalculation is a way back to what history says: a rate fixed by hand goes."""
    await heater.runtime_data.async_set_manual_rate(6.0)
    await hass.async_block_till_done()
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)

    reply = await _recalculate(client, heater)
    await hass.async_block_till_done()

    assert reply["success"], reply
    assert heater.options.get("heating_rate") is None
    assert heater.runtime_data.rate == 7.0  # nothing learned yet: the starting value
