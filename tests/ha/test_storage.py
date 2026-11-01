"""Ready times, settings and controller state in the component's storage (spec 3.3)."""

from datetime import time
import logging
from typing import Any

from homeassistant.core import HomeAssistant
import pytest

from custom_components.hot_water_ready.core.ready_times import ReadyTime
from custom_components.hot_water_ready.storage import HeaterStore


async def test_empty_store_gives_defaults(hass: HomeAssistant) -> None:
    store = HeaterStore(hass, "entry1")
    data = await store.async_load()

    assert data.target == 42.0
    assert data.margin == 1.0
    assert data.ready_times == {}
    assert data.controller is None


async def test_saved_data_loads_back(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    store = HeaterStore(hass, "entry1")
    data = await store.async_load()
    data.target = 44.5
    data.ready_times["m1"] = [ReadyTime("r1", time(7, 0), frozenset({0, 2}), enabled=False)]
    await store.async_save(data)

    loaded = await HeaterStore(hass, "entry1").async_load()
    assert loaded.target == 44.5
    assert loaded.ready_times == {
        "m1": [ReadyTime("r1", time(7, 0), frozenset({0, 2}), enabled=False)]
    }


@pytest.mark.parametrize(
    "bad",
    [
        {"time": "25:00", "weekdays": [0], "enabled": True, "id": "x"},
        {"time": "07:00", "weekdays": [9], "enabled": True, "id": "x"},
        {"time": "07:00", "weekdays": [0], "enabled": "yes", "id": "x"},
        {"weekdays": [0], "enabled": True, "id": "x"},
    ],
)
async def test_invalid_ready_time_is_dropped_on_load(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    caplog: pytest.LogCaptureFixture,
    bad: dict[str, Any],
) -> None:
    good = {"id": "ok", "time": "06:30", "weekdays": [1], "enabled": True}
    hass_storage["hot_water_ready.entry1"] = {
        "version": 1,
        "minor_version": 1,
        "key": "hot_water_ready.entry1",
        "data": {
            "settings": {"target": 42, "margin": 1},
            "members": {"m1": {"ready_times": [good, bad]}},
        },
    }
    with caplog.at_level(logging.WARNING):
        data = await HeaterStore(hass, "entry1").async_load()

    assert data.ready_times == {"m1": [ReadyTime("ok", time(6, 30), frozenset({1}))]}
    assert "Dropped an invalid ready time" in caplog.text


async def test_invalid_settings_fall_back_to_defaults(
    hass: HomeAssistant, hass_storage: dict[str, Any]
) -> None:
    hass_storage["hot_water_ready.entry1"] = {
        "version": 1,
        "minor_version": 1,
        "key": "hot_water_ready.entry1",
        "data": {"settings": {"target": "hot", "margin": -3}},
    }
    data = await HeaterStore(hass, "entry1").async_load()

    assert (data.target, data.margin) == (42.0, 1.0)


@pytest.mark.parametrize(
    "raw",
    [
        ["not", "a", "mapping"],
        {"settings": "hot", "members": [1, 2]},
        {"members": {"m1": "x"}},
        {"members": {"m1": {"ready_times": "07:00"}}},
        {"controller": [1]},
        {"controller": {"heating": True, "window": {"ready_at": "2026-11-02T07:00:00"}}},
    ],
)
async def test_corrupt_shapes_load_as_defaults(
    hass: HomeAssistant, hass_storage: dict[str, Any], raw: Any
) -> None:
    hass_storage["hot_water_ready.entry1"] = {
        "version": 1,
        "minor_version": 1,
        "key": "hot_water_ready.entry1",
        "data": raw,
    }
    data = await HeaterStore(hass, "entry1").async_load()

    assert (data.target, data.margin, data.controller) == (42.0, 1.0, None)
    assert all(times == [] for times in data.ready_times.values())
