"""Websocket commands the card uses."""

from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
import probatio

from .const import DOMAIN
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


@websocket_api.websocket_command({probatio.Required("type"): f"{DOMAIN}/heaters"})
@callback
def ws_heaters(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """List the heaters, for the card's default configuration."""
    connection.send_result(
        msg["id"],
        [{"entry_id": h.entry.entry_id, "name": h.name} for h in _loaded_heaters(hass)],
    )


@websocket_api.websocket_command(
    {probatio.Required("type"): f"{DOMAIN}/subscribe", probatio.Required("entry_id"): str}
)
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send the heater's snapshot now and again whenever it changes."""
    heater = next((h for h in _loaded_heaters(hass) if h.entry.entry_id == msg["entry_id"]), None)
    if heater is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Heater not found")
        return

    @callback
    def send() -> None:
        connection.send_event(msg["id"], heater.snapshot())

    connection.subscriptions[msg["id"]] = heater.async_add_listener(send)
    connection.send_result(msg["id"])
    send()
