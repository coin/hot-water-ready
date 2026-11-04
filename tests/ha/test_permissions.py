"""Every websocket command that changes something refuses someone who may not (spec 2).

The list of commands comes from Home Assistant's registry, so a new command is checked the
moment it exists: it must either be listed as read-only below or refuse a stranger (a user who
is neither an admin nor any member's person).
"""

from typing import Any

from homeassistant.auth.const import GROUP_ID_USER
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import TIAGO, access_token

READ_ONLY = {f"{DOMAIN}/heaters", f"{DOMAIN}/subscribe"}

# The smallest valid message for each command; the test fails on a command missing here.
MESSAGES: dict[str, dict[str, Any]] = {
    f"{DOMAIN}/ready_time/add": {"member_id": TIAGO, "time": "07:00", "weekdays": [0]},
    f"{DOMAIN}/ready_time/update": {"member_id": TIAGO, "ready_time_id": "x", "enabled": False},
    f"{DOMAIN}/ready_time/remove": {"member_id": TIAGO, "ready_time_id": "x"},
    f"{DOMAIN}/away/set": {"member_id": TIAGO, "away": True},
    f"{DOMAIN}/heat_now/start": {},
    f"{DOMAIN}/heat_now/cancel": {},
    f"{DOMAIN}/switch_off": {},
    f"{DOMAIN}/settings/set": {"target": 45},
}


def _write_commands(hass: HomeAssistant) -> list[str]:
    return sorted(
        command
        for command in hass.data["websocket_api"]  # where async_register_command keeps them
        if command.startswith(f"{DOMAIN}/") and command not in READ_ONLY
    )


async def test_every_write_command_is_listed(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    assert _write_commands(hass) == sorted(MESSAGES)


@pytest.mark.parametrize("command", sorted(MESSAGES))
async def test_a_stranger_is_refused(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    command: str,
) -> None:
    # Something to cancel, started by the admin, so cancel is refused for permission only.
    await heater.runtime_data.async_heat_now(TIAGO)
    users = await hass.auth.async_get_group(GROUP_ID_USER)
    assert users is not None
    stranger = MockUser(name="Visitor", groups=[users]).add_to_hass(hass)
    client = await hass_ws_client(hass, access_token=await access_token(hass, stranger))
    await client.send_json_auto_id(
        {"type": command, "entry_id": heater.entry_id, **MESSAGES[command]}
    )
    reply = await client.receive_json()

    assert reply["success"] is False
    assert reply["error"]["code"] == "unauthorized"
