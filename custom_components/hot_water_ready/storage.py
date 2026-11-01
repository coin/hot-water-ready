"""The component's own storage: one store per heater (spec 3.3).

Ready times change often, so they live here rather than in the config entry, and editing them
never reloads the integration. Everything read back is validated: a bad record is dropped with a
warning instead of breaking the heater.
"""

from dataclasses import dataclass, field
from datetime import time
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DEFAULT_MARGIN, DEFAULT_TARGET, DOMAIN, MAX_MARGIN, MAX_TARGET, MIN_TARGET
from .core.ready_times import ReadyTime

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1
SAVE_DELAY = 10  # seconds; controller state changes often, user edits are saved at once


@dataclass
class HeaterData:
    """Everything stored for one heater."""

    target: float = DEFAULT_TARGET
    margin: float = DEFAULT_MARGIN
    ready_times: dict[str, list[ReadyTime]] = field(default_factory=dict)
    controller: dict[str, Any] = field(default_factory=dict)


def ready_time_to_dict(ready: ReadyTime) -> dict[str, Any]:
    """A ready time as plain data, for storage and for the card."""
    return {
        "id": ready.id,
        "time": ready.time.strftime("%H:%M"),
        "weekdays": sorted(ready.weekdays),
        "enabled": ready.enabled,
    }


def ready_time_from_dict(raw: object) -> ReadyTime:
    """Read a ready time, raising ValueError when anything is off."""
    if not isinstance(raw, dict):
        raise TypeError("not a mapping")
    ready_id = raw["id"]
    weekdays = raw["weekdays"]
    enabled = raw["enabled"]
    if not isinstance(ready_id, str) or not ready_id:
        raise ValueError("bad id")
    if not isinstance(enabled, bool):
        raise TypeError("bad enabled")
    if not isinstance(weekdays, list) or not all(
        isinstance(d, int) and not isinstance(d, bool) and 0 <= d <= 6 for d in weekdays
    ):
        raise ValueError("bad weekdays")
    return ReadyTime(
        id=ready_id,
        time=time.fromisoformat(raw["time"]),
        weekdays=frozenset(weekdays),
        enabled=enabled,
    )


def _number(raw: object, default: float, low: float, high: float) -> float:
    if isinstance(raw, int | float) and not isinstance(raw, bool) and low <= raw <= high:
        return float(raw)
    if raw is not None:
        _LOGGER.warning("Stored value %r is out of range; using %s", raw, default)
    return default


class HeaterStore:
    """Load and save one heater's data."""

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Bind to the heater's storage file."""
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry_id}")

    async def async_load(self) -> HeaterData:
        """Read and validate; missing or bad parts fall back to defaults."""
        raw = await self._store.async_load() or {}
        settings = raw.get("settings") or {}
        data = HeaterData(
            target=_number(settings.get("target"), DEFAULT_TARGET, MIN_TARGET, MAX_TARGET),
            margin=_number(settings.get("margin"), DEFAULT_MARGIN, 0.0, MAX_MARGIN),
            controller=raw.get("controller") or {},
        )
        members = raw.get("members") or {}
        for member_id, member in members.items():
            kept: list[ReadyTime] = []
            for item in (member or {}).get("ready_times") or []:
                try:
                    kept.append(ready_time_from_dict(item))
                except (KeyError, TypeError, ValueError) as err:
                    _LOGGER.warning("Dropped an invalid ready time %r: %s", item, err)
            data.ready_times[member_id] = kept
        return data

    def _serialise(self, data: HeaterData) -> dict[str, Any]:
        return {
            "settings": {"target": data.target, "margin": data.margin},
            "members": {
                member_id: {"ready_times": [ready_time_to_dict(r) for r in ready_times]}
                for member_id, ready_times in data.ready_times.items()
            },
            "controller": data.controller,
        }

    async def async_save(self, data: HeaterData) -> None:
        """Save now."""
        await self._store.async_save(self._serialise(data))

    def async_delay_save(self, data: HeaterData) -> None:
        """Save soon, coalescing frequent changes."""
        self._store.async_delay_save(lambda: self._serialise(data), SAVE_DELAY)

    async def async_remove(self) -> None:
        """Delete the file when the heater is removed."""
        await self._store.async_remove()
