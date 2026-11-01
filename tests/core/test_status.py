"""What the status sensor and the card say about the water."""

from custom_components.hot_water_ready.core.status import Status, heater_status


def test_water_at_target_is_ready() -> None:
    assert heater_status(temperature=42.0, target=42.0) is Status.READY


def test_water_above_target_is_ready() -> None:
    assert heater_status(temperature=47.3, target=42.0) is Status.READY


def test_water_below_target_is_waiting() -> None:
    assert heater_status(temperature=39.6, target=42.0) is Status.WAITING


def test_unknown_temperature_is_waiting() -> None:
    assert heater_status(temperature=None, target=42.0) is Status.WAITING
