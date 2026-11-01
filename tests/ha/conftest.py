"""Fixtures for the Home Assistant layer tests."""

from datetime import datetime
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.auth.const import GROUP_ID_USER
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser

from custom_components.hot_water_ready.const import (
    CONF_COLOUR,
    CONF_PERSON,
    CONF_SWITCH,
    CONF_TEMPERATURE_SENSOR,
    DOMAIN,
    SUBENTRY_MEMBER,
)

SWITCH = "switch.cylinder_relay"
SENSOR = "sensor.cylinder_temperature"
TIAGO_PERSON = "person.tiago"
MARIA_PERSON = "person.maria"
TIAGO = "member_tiago"
MARIA = "member_maria"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let Home Assistant load the integration from custom_components."""


@pytest.fixture(autouse=True)
async def lisbon(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """Run every test in Lisbon, starting on Monday 2 November 2026 at 05:00 (UTC+0)."""
    await hass.config.async_set_time_zone("Europe/Lisbon")
    freezer.move_to("2026-11-02 05:00:00+00:00")


def local(clock: str, day: int = 2) -> datetime:
    """A Lisbon wall-clock time in November 2026 (Monday the 2nd by default)."""
    hour, minute = (int(part) for part in clock.split(":"))
    return datetime(2026, 11, day, hour, minute, tzinfo=dt_util.get_default_time_zone())


async def access_token(hass: HomeAssistant, user: MockUser) -> str:
    """An access token for `user`, issued now.

    Tokens last 30 minutes, and the `hass_client` and `hass_ws_client` fixtures issue theirs
    before a test moves the clock: a test that moves it further gets 401 unless it asks here.
    """
    refresh = await hass.auth.async_create_refresh_token(user, "https://hwr.test/")
    return hass.auth.async_create_access_token(refresh)


@pytest.fixture
def heater_data() -> dict[str, Any]:
    """Entry data for a relay and a temperature sensor."""
    return {CONF_SWITCH: SWITCH, CONF_TEMPERATURE_SENSOR: SENSOR}


def member(subentry_id: str, name: str, person: str, colour: str) -> dict[str, Any]:
    """Subentry data for a linked member."""
    return {
        "subentry_id": subentry_id,
        "subentry_type": SUBENTRY_MEMBER,
        "title": name,
        "unique_id": None,
        "data": {CONF_PERSON: person, CONF_COLOUR: colour},
    }


@pytest.fixture
def heater_entry(hass: HomeAssistant, heater_data: dict[str, Any]) -> MockConfigEntry:
    """A heater entry with two linked members, added to Home Assistant but not set up."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Cylinder",
        data=heater_data,
        subentries_data=[
            member(TIAGO, "Tiago", TIAGO_PERSON, "blue"),
            member(MARIA, "Maria", MARIA_PERSON, "green"),
        ],
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
async def maria_user(hass: HomeAssistant, hass_admin_user: MockUser) -> MockUser:
    """A non-admin user whose person is Maria; Tiago's person belongs to the admin."""
    users = await hass.auth.async_get_group(GROUP_ID_USER)
    assert users is not None
    user = MockUser(name="Maria", groups=[users]).add_to_hass(hass)
    hass.states.async_set(MARIA_PERSON, "home", {"user_id": user.id})
    hass.states.async_set(TIAGO_PERSON, "home", {"user_id": hass_admin_user.id})
    return user


@pytest.fixture
async def heater(
    hass: HomeAssistant, heater_entry: MockConfigEntry, maria_user: MockUser
) -> MockConfigEntry:
    """A heater entry set up, its relay off and the water at 39.6 C."""
    hass.states.async_set(SWITCH, "off")
    hass.states.async_set(SENSOR, "39.6", {"unit_of_measurement": "°C"})
    assert await hass.config_entries.async_setup(heater_entry.entry_id)
    await hass.async_block_till_done()
    return heater_entry
