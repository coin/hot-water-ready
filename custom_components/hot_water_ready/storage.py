"""The component's own storage: one store per heater (spec 3.3).

Ready times change often, so they live here rather than in the config entry, and editing them
never reloads the integration. Everything read back is validated: a bad record is dropped with a
warning instead of breaking the heater.
"""

from dataclasses import dataclass, field
from datetime import date, time
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DEFAULT_MARGIN, DEFAULT_TARGET, DOMAIN, MAX_MARGIN, MAX_TARGET, MIN_TARGET
from .core.controller import ControllerState
from .core.faults import FaultState
from .core.household import Away
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
    away: dict[str, Away] = field(default_factory=dict)
    controller: ControllerState | None = None
    faults: FaultState | None = None
    automatic: bool = True  # off: the heater is run by hand and left alone (spec 4.7)


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


def away_to_dict(away: Away) -> dict[str, Any]:
    """Away as plain data, for storage and for the card."""
    return {"on": away.on, "until": None if away.until is None else away.until.isoformat()}


def away_from_dict(raw: object) -> Away:
    """Read an away, raising ValueError or TypeError when anything is off."""
    if not isinstance(raw, dict):
        raise TypeError("not a mapping")
    on, until = raw.get("on", False), raw.get("until")
    if not isinstance(on, bool):
        raise TypeError("bad on")
    if until is not None and not isinstance(until, str):
        raise TypeError("bad until")
    return Away(on=on, until=None if until is None else date.fromisoformat(until))


def _number(raw: object, default: float, low: float, high: float) -> float:
    if isinstance(raw, int | float) and not isinstance(raw, bool) and low <= raw <= high:
        return float(raw)
    if raw is not None:
        _LOGGER.warning("Stored value %r is out of range; using %s", raw, default)
    return default


def _mapping(raw: object, what: str) -> dict[str, Any]:
    """`raw` when it is a mapping; an empty one otherwise, with a warning if it was not empty."""
    if isinstance(raw, dict):
        return raw
    if raw:
        _LOGGER.warning("Ignored stored %s that is not a mapping: %r", what, raw)
    return {}


def _controller(raw: object) -> ControllerState | None:
    if not raw:
        return None
    try:
        return ControllerState.from_dict(raw)
    except ValueError as err:
        _LOGGER.warning("Ignored the saved heating state: %s", err)
        return None


def _faults(raw: object) -> FaultState | None:
    if not raw:
        return None
    try:
        return FaultState.from_dict(raw)
    except ValueError as err:
        _LOGGER.warning("Ignored the saved fault state: %s", err)
        return None


def _flag(raw: object, *, default: bool) -> bool:
    if isinstance(raw, bool):
        return raw
    if raw is not None:
        _LOGGER.warning("Stored flag %r is not true or false; using %s", raw, default)
    return default


class HeaterStore:
    """Load and save one heater's data."""

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Bind to the heater's storage file."""
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry_id}")

    async def async_load(self) -> HeaterData:
        """Read and validate; missing or bad parts fall back to defaults."""
        raw = _mapping(await self._store.async_load(), "stored data")
        settings = _mapping(raw.get("settings"), "settings")
        data = HeaterData(
            target=_number(settings.get("target"), DEFAULT_TARGET, MIN_TARGET, MAX_TARGET),
            margin=_number(settings.get("margin"), DEFAULT_MARGIN, 0.0, MAX_MARGIN),
            controller=_controller(raw.get("controller")),
            faults=_faults(raw.get("faults")),
            automatic=_flag(raw.get("automatic"), default=True),
        )
        for member_id, member in _mapping(raw.get("members"), "members").items():
            stored = _mapping(member, "member")
            if "away" in stored:
                try:
                    data.away[member_id] = away_from_dict(stored["away"])
                except (TypeError, ValueError) as err:
                    _LOGGER.warning("Ignored an invalid away %r: %s", stored["away"], err)
            ready_times = stored.get("ready_times") or []
            if not isinstance(ready_times, list):
                _LOGGER.warning("Ignored ready times that are not a list: %r", ready_times)
                ready_times = []
            kept: list[ReadyTime] = []
            for item in ready_times:
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
                member_id: {
                    "ready_times": [
                        ready_time_to_dict(r) for r in data.ready_times.get(member_id, [])
                    ],
                    "away": away_to_dict(data.away.get(member_id, Away())),
                }
                for member_id in sorted(set(data.ready_times) | set(data.away))
            },
            "controller": None if data.controller is None else data.controller.to_dict(),
            "faults": None if data.faults is None else data.faults.to_dict(),
            "automatic": data.automatic,
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
