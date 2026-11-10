"""Heating runs found again in Home Assistant's history: the card's recalculation (spec 4.2).

Live learning ends a run when Home Assistant restarts and keeps only what it saw itself; the
recorder kept every reading, so replaying it through the same learner finds those runs again.
"""

from datetime import datetime
from functools import partial
from typing import Any

from homeassistant.components.recorder import get_instance, history
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State

from .actuator import Actuator

type Sample = tuple[datetime, float | None, bool | None]


class HistoryUnavailableError(Exception):
    """Home Assistant keeps no history here (no recorder)."""


def _number(state: State | None) -> float | None:
    if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
        return None
    try:
        return float(state.state)
    except ValueError:
        return None


async def async_samples(
    hass: HomeAssistant, sensor: str, actuator: Actuator, start: datetime, end: datetime
) -> list[Sample]:
    """The water temperature and whether it was heating, at every change between the two times."""
    if "recorder" not in hass.config.components:
        raise HistoryUnavailableError
    # Full State objects: minimal_response is off, so no compressed dicts come back.
    found: dict[str, list[State | dict[str, Any]]] = await get_instance(
        hass
    ).async_add_executor_job(
        partial(
            history.get_significant_states,
            hass,
            start,
            end,
            [sensor, actuator.entity_id],
            significant_changes_only=False,
        )
    )
    changes = sorted(
        (
            (state.last_updated, entity_id, state)
            for entity_id in (sensor, actuator.entity_id)
            for state in found.get(entity_id, [])
            if isinstance(state, State)
        ),
        key=lambda change: change[0],
    )
    samples: list[Sample] = []
    temperature: float | None = None
    heating: bool | None = None
    for at, entity_id, state in changes:
        if entity_id == sensor:
            temperature = _number(state)
        else:
            heating = actuator.heating_in(state)
        samples.append((max(at, start), temperature, heating))
    return samples
