"""Constants for Hot Water Ready."""

from typing import Final

from .core.controller import Settings

DOMAIN: Final = "hot_water_ready"

# Heater (config entry)
CONF_HEATER_TYPE: Final = "heater_type"
HEATER_SWITCH: Final = "switch"  # (a) a relay; the component runs the band itself
HEATER_CLIMATE: Final = "climate"  # (b) an existing thermostat; the component sets it
CONF_SWITCH: Final = "switch"
CONF_CLIMATE: Final = "climate"
CONF_TEMPERATURE_SENSOR: Final = "temperature_sensor"

# Members (config subentries)
SUBENTRY_MEMBER: Final = "member"
CONF_PERSON: Final = "person"
CONF_COLOUR: Final = "colour"
CONF_RECIPIENTS: Final = "recipients"
CONF_NOTIFY_TARGETS: Final = "notify_targets"
COLOURS: Final = ("blue", "green", "orange", "purple", "red", "teal", "pink", "brown")

# Options
CONF_KEEP_HEATING_GAP: Final = "keep_heating_gap_minutes"
CONF_CANCEL_RULE: Final = "cancel_rule"
CONF_CANCEL_PEOPLE: Final = "cancel_people"
CONF_RICH_NOTIFICATIONS: Final = "rich_notifications"
CONF_POWER_SENSOR: Final = "power_sensor"
CONF_FAULT_RECIPIENTS: Final = "fault_recipients"
CONF_ADVANCED: Final = "advanced"  # a collapsed section holding the fault thresholds
CANCEL_REQUESTERS: Final = "requesters"  # who asked, and admins (default)
CANCEL_PEOPLE: Final = "people"  # also the people listed
CANCEL_EVERYONE: Final = "everyone"

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
