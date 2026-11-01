"""Constants for Hot Water Ready."""

from typing import Final

DOMAIN: Final = "hot_water_ready"

CONF_SWITCH: Final = "switch"
CONF_TEMPERATURE_SENSOR: Final = "temperature_sensor"

DEFAULT_TARGET: Final = 42.0

CARD_URL: Final = f"/{DOMAIN}/hot-water-ready-card.js"
CARD_FILE: Final = "frontend/hot-water-ready-card.js"
