"""Constants for Hot Water Ready."""

from typing import Final

from .core.controller import Settings

DOMAIN: Final = "hot_water_ready"

# Heater (config entry)
CONF_SWITCH: Final = "switch"
CONF_TEMPERATURE_SENSOR: Final = "temperature_sensor"

# Members (config subentries)
SUBENTRY_MEMBER: Final = "member"
CONF_PERSON: Final = "person"
CONF_COLOUR: Final = "colour"
CONF_RECIPIENTS: Final = "recipients"
COLOURS: Final = ("blue", "green", "orange", "purple", "red", "teal", "pink", "brown")

# Options
CONF_KEEP_HEATING_GAP: Final = "keep_heating_gap_minutes"

# Temperature band (number entities, kept in storage)
DEFAULT_TARGET: Final = Settings().target
DEFAULT_MARGIN: Final = Settings().margin
MIN_TARGET: Final = 30.0
MAX_TARGET: Final = 75.0
MAX_MARGIN: Final = 5.0

# Card
CARD_URL: Final = f"/{DOMAIN}/hot-water-ready-card.js"
CARD_FILE: Final = "frontend/hot-water-ready-card.js"


def signal_heater_updated(entry_id: str) -> str:
    """Dispatcher signal sent when a heater's snapshot may have changed."""
    return f"{DOMAIN}_{entry_id}_updated"
