"""Websocket commands the card uses."""

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
import probatio

from .const import DOMAIN, signal_heater_updated
from .heater import Heater


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register the card's commands."""
    websocket_api.async_register_command(hass, ws_heaters)
    websocket_api.async_register_command(hass, ws_subscribe)


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
            connection.send_event(msg["id"], heater.snapshot())

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, signal_heater_updated(entry_id), send
    )
    connection.send_result(msg["id"])
    send()
