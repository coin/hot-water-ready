"""Constants for Hot Water Ready."""

from typing import Final

DOMAIN: Final = "hot_water_ready"

CONF_SWITCH: Final = "switch"
CONF_TEMPERATURE_SENSOR: Final = "temperature_sensor"

DEFAULT_TARGET: Final = 42.0

CARD_URL: Final = f"/{DOMAIN}/hot-water-ready-card.js"
CARD_FILE: Final = "frontend/hot-water-ready-card.js"


def signal_heater_updated(entry_id: str) -> str:
    """Dispatcher signal sent when a heater's snapshot may have changed."""
    return f"{DOMAIN}_{entry_id}_updated"
