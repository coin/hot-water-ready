"""The diagnostics download: settings, state and the solar comparison record (spec 7).

Names, people and notification targets are redacted; members appear by their opaque ids, so
the record still shows which windows were whose without saying who.
"""

from dataclasses import asdict
from typing import Any

from homeassistant.components.diagnostics import REDACTED, async_redact_data
from homeassistant.core import HomeAssistant

from . import HotWaterReadyConfigEntry
from .const import (
    CONF_CANCEL_PEOPLE,
    CONF_FAULT_RECIPIENTS,
    CONF_NOTIFY_TARGETS,
    CONF_PERSON,
    CONF_RECIPIENTS,
)
from .storage import ready_time_to_dict

TO_REDACT = {
    CONF_PERSON,
    CONF_RECIPIENTS,
    CONF_NOTIFY_TARGETS,
    CONF_CANCEL_PEOPLE,
    CONF_FAULT_RECIPIENTS,
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: HotWaterReadyConfigEntry
) -> dict[str, Any]:
    """Everything worth knowing about one heater, without personal data."""
    heater = entry.runtime_data
    leads = heater.leads()
    return {
        "entry": {
            "data": dict(entry.data),
            "options": async_redact_data(dict(entry.options), TO_REDACT),
        },
        "members": [
            {
                "id": member.id,
                "name": REDACTED,
                "virtual": member.virtual,
                "colour": member.colour,
                "away": heater.away(member.id).on,
                "ready_times": [ready_time_to_dict(r) for r in heater.ready_times(member.id)],
            }
            for member in heater.members
        ],
        "state": {
            "temperature": heater.temperature,
            "target": heater.target,
            "margin": heater.margin,
            "status": heater.status.value,
            "automatic": heater.automatic,
            "faults": sorted(heater.faults),
            "rate_used": heater.rate,
            "learned_rate": heater.learned_rate,
            "solar_aware": heater.solar_aware,
            "lead": None if leads is None else leads._asdict(),
        },
        "solar_comparison": {
            "verdict": asdict(heater.solar_verdict()),
            "records": heater.comparison_records(),
        },
    }
