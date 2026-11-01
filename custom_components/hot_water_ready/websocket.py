"""Websocket commands the card uses.

Every command that changes something checks the calling user on the server (spec 2): admins
edit every member, a linked member only their own.
"""

from collections.abc import Awaitable, Callable
from datetime import time
from functools import wraps
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_connect
import probatio

from .const import DOMAIN, signal_heater_updated
from .heater import AwayDateInThePastError, Heater, MemberNotFoundError, ReadyTimeNotFoundError
from .storage import ready_time_to_dict

WEEKDAYS = probatio.All(
    [probatio.All(int, probatio.Range(min=0, max=6))], probatio.Length(min=1, max=7)
)

type Handler = Callable[
    [HomeAssistant, websocket_api.ActiveConnection, dict[str, Any], Heater], Awaitable[None]
]


def _to_minute(at: time) -> time:
    """Ready times are whole minutes."""
    return at.replace(second=0, microsecond=0)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register the card's commands."""
    websocket_api.async_register_command(hass, ws_heaters)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_add_ready_time)
    websocket_api.async_register_command(hass, ws_update_ready_time)
    websocket_api.async_register_command(hass, ws_remove_ready_time)
    websocket_api.async_register_command(hass, ws_set_away)
    websocket_api.async_register_command(hass, ws_heat_now)
    websocket_api.async_register_command(hass, ws_cancel_heat_now)


def _loaded_heaters(hass: HomeAssistant) -> list[Heater]:
    return [
        entry.runtime_data
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state is ConfigEntryState.LOADED
    ]


def _loaded_heater(hass: HomeAssistant, entry_id: str) -> Heater | None:
    """The heater of a loaded entry, or of one still setting up after a reload."""
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN:
        return None
    if entry.state not in (ConfigEntryState.LOADED, ConfigEntryState.SETUP_IN_PROGRESS):
        return None
    heater: Heater | None = getattr(entry, "runtime_data", None)
    return heater


def _member_edit(handler: Handler) -> Callable[..., Awaitable[None]]:
    """Find the heater and member, check the caller may edit that member, map errors."""

    @wraps(handler)
    async def wrapper(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
    ) -> None:
        heater = _loaded_heater(hass, msg["entry_id"])
        if heater is None:
            connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Heater not found")
            return
        try:
            heater.member(msg["member_id"])
        except MemberNotFoundError:
            connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Member not found")
            return
        if not heater.can_edit(connection.user, msg["member_id"]):
            connection.send_error(
                msg["id"], websocket_api.ERR_UNAUTHORIZED, "You may only change your own times"
            )
            return
        try:
            await handler(hass, connection, msg, heater)
        except ReadyTimeNotFoundError:
            connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Ready time not found")

    return wrapper


@websocket_api.websocket_command({probatio.Required("type"): f"{DOMAIN}/heaters"})
@callback
def ws_heaters(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """List the heaters, for the card's default configuration."""
    connection.send_result(
        msg["id"],
        [{"entry_id": h.entry_id, "name": h.name} for h in _loaded_heaters(hass)],
    )


@websocket_api.websocket_command(
    {probatio.Required("type"): f"{DOMAIN}/subscribe", probatio.Required("entry_id"): str}
)
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send the heater's snapshot now and again whenever it changes, across reloads."""
    entry_id: str = msg["entry_id"]
    if _loaded_heater(hass, entry_id) is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Heater not found")
        return

    @callback
    def send() -> None:
        if (heater := _loaded_heater(hass, entry_id)) is not None:
            connection.send_event(msg["id"], heater.snapshot(connection.user))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, signal_heater_updated(entry_id), send
    )
    connection.send_result(msg["id"])
    send()


@websocket_api.websocket_command(
    {
        probatio.Required("type"): f"{DOMAIN}/ready_time/add",
        probatio.Required("entry_id"): str,
        probatio.Required("member_id"): str,
        probatio.Required("time"): cv.time,
        probatio.Required("weekdays"): WEEKDAYS,
        probatio.Optional("enabled", default=True): bool,
    }
)
@websocket_api.async_response
@_member_edit
async def ws_add_ready_time(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    heater: Heater,
) -> None:
    """Add a ready time for a member."""
    at: time = msg["time"]
    ready = await heater.async_add_ready_time(
        msg["member_id"],
        _to_minute(at),
        frozenset(msg["weekdays"]),
        msg["enabled"],
    )
    connection.send_result(msg["id"], ready_time_to_dict(ready))


@websocket_api.websocket_command(
    {
        probatio.Required("type"): f"{DOMAIN}/ready_time/update",
        probatio.Required("entry_id"): str,
        probatio.Required("member_id"): str,
        probatio.Required("ready_time_id"): str,
        probatio.Optional("time"): cv.time,
        probatio.Optional("weekdays"): WEEKDAYS,
        probatio.Optional("enabled"): bool,
    }
)
@websocket_api.async_response
@_member_edit
async def ws_update_ready_time(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    heater: Heater,
) -> None:
    """Change a ready time's time, weekdays or on/off."""
    at: time | None = msg.get("time")
    weekdays = msg.get("weekdays")
    ready = await heater.async_update_ready_time(
        msg["member_id"],
        msg["ready_time_id"],
        at=None if at is None else _to_minute(at),
        weekdays=None if weekdays is None else frozenset(weekdays),
        enabled=msg.get("enabled"),
    )
    connection.send_result(msg["id"], ready_time_to_dict(ready))


@websocket_api.websocket_command(
    {
        probatio.Required("type"): f"{DOMAIN}/ready_time/remove",
        probatio.Required("entry_id"): str,
        probatio.Required("member_id"): str,
        probatio.Required("ready_time_id"): str,
    }
)
@websocket_api.async_response
@_member_edit
async def ws_remove_ready_time(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    heater: Heater,
) -> None:
    """Remove a ready time."""
    await heater.async_remove_ready_time(msg["member_id"], msg["ready_time_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        probatio.Required("type"): f"{DOMAIN}/away/set",
        probatio.Required("entry_id"): str,
        probatio.Required("member_id"): str,
        probatio.Required("away"): bool,
        probatio.Optional("until"): probatio.Any(None, cv.date),
    }
)
@websocket_api.async_response
@_member_edit
async def ws_set_away(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    heater: Heater,
) -> None:
    """Pause or resume a member's ready times, optionally until a date (the last day away)."""
    try:
        await heater.async_set_away(msg["member_id"], msg["away"], msg.get("until"))
    except AwayDateInThePastError:
        connection.send_error(
            msg["id"], websocket_api.ERR_INVALID_FORMAT, "The last day away is in the past"
        )
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        probatio.Required("type"): f"{DOMAIN}/heat_now/start",
        probatio.Required("entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_heat_now(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Ask for hot water now ("Aquecer agora"), or join a request ("Avisar-me também")."""
    heater = _loaded_heater(hass, msg["entry_id"])
    if heater is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Heater not found")
        return
    if not heater.can_ask_heat_now(connection.user):
        connection.send_error(
            msg["id"], websocket_api.ERR_UNAUTHORIZED, "Only members and admins may ask"
        )
        return
    await heater.async_heat_now(heater.requester_key(connection.user))
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        probatio.Required("type"): f"{DOMAIN}/heat_now/cancel",
        probatio.Required("entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_cancel_heat_now(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Cancel the heat-now request, if the caller may (spec 2)."""
    heater = _loaded_heater(hass, msg["entry_id"])
    if heater is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Heater not found")
        return
    if not heater.can_cancel_heat_now(connection.user):
        connection.send_error(
            msg["id"], websocket_api.ERR_UNAUTHORIZED, "Only who asked or an admin may cancel"
        )
        return
    await heater.async_cancel_heat_now()
    connection.send_result(msg["id"])
