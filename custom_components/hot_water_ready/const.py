"""Constants for Hot Water Ready."""

from typing import Final

from .core.cluster import MAX_TEMPERATURE
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
CONF_KEEP_HOT: Final = "keep_hot_minutes"  # heat now: how long to keep it hot after the message
# Who may switch off for everyone besides admins; stored under its first name, "cancel_people".
CONF_SWITCH_OFF_PEOPLE: Final = "cancel_people"
CONF_RICH_NOTIFICATIONS: Final = "rich_notifications"
CONF_POWER_SENSOR: Final = "power_sensor"
CONF_MIDDLE_SENSOR: Final = "middle_temperature_sensor"  # a second probe, lower down
CONF_FAULT_RECIPIENTS: Final = "fault_recipients"
CONF_ADVANCED: Final = "advanced"  # a collapsed section holding the fault thresholds
CONF_SOLAR_AWARE: Final = "solar_aware"
CONF_HEATING_RATE: Final = "heating_rate"  # minutes per degree, set by hand
CONF_TANK_LITRES: Final = "tank_litres"
CONF_ELEMENT_WATTS: Final = "element_watts"
CONF_TANK_ORIENTATION: Final = "tank_orientation"  # vertical or horizontal
CONF_ELEMENT_HEIGHT: Final = "element_height"  # bottom, lower_third or middle
CONF_MAX_TEMPERATURE: Final = "max_temperature"
DEFAULT_MAX_TEMPERATURE: Final = MAX_TEMPERATURE

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
