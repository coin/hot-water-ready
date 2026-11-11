"""Public and private members: who sees whose ready times, requests and heating (decision 15).

Tiago is the admin's person and Maria a plain user's. Admins see everything, so what a private
member hides is checked on Maria's card.
"""

from datetime import time, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
    async_mock_service,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import CONF_COLOUR, DOMAIN, SUBENTRY_MEMBER
from custom_components.hot_water_ready.core.visibility import Visibility

from .conftest import (
    MARIA,
    MARIA_PERSON,
    SENSOR,
    TIAGO,
    TIAGO_PERSON,
    access_token,
    local,
    member,
)

EVERY_DAY = frozenset(range(7))
GUESTS = "member_guests"
CALENDAR = "calendar.cylinder_heating_windows"


@pytest.fixture
def heater_entry(hass: HomeAssistant, heater_data: dict[str, Any]) -> MockConfigEntry:
    """Tiago and Maria, linked, and Guests, a virtual member."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Cylinder",
        data=heater_data,
        subentries_data=[
            member(TIAGO, "Tiago", TIAGO_PERSON, "blue"),
            member(MARIA, "Maria", MARIA_PERSON, "green"),
            {
                "subentry_id": GUESTS,
                "subentry_type": SUBENTRY_MEMBER,
                "title": "Guests",
                "unique_id": None,
                "data": {CONF_COLOUR: "red"},
            },
        ],
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def relay(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    """A relay that answers, registered after setup so setup does not replace it."""
    async_mock_service(hass, "switch", "turn_on")
    async_mock_service(hass, "switch", "turn_off")


def _water(hass: HomeAssistant, value: float) -> None:
    hass.states.async_set(SENSOR, str(value), {"unit_of_measurement": "°C"})


async def _ws(
    hass: HomeAssistant, ws: WebSocketGenerator, user: MockUser, message: dict[str, Any]
) -> dict[str, Any]:
    client = await ws(hass, access_token=await access_token(hass, user))
    await client.send_json_auto_id(message)
    reply: dict[str, Any] = await client.receive_json()
    await hass.async_block_till_done()
    return reply


def _set(entry: MockConfigEntry, member_id: str, visibility: str) -> dict[str, Any]:
    return {
        "type": f"{DOMAIN}/visibility/set",
        "entry_id": entry.entry_id,
        "member_id": member_id,
        "visibility": visibility,
    }


def _member(snapshot: dict[str, Any], member_id: str) -> dict[str, Any]:
    return next(m for m in snapshot["members"] if m["id"] == member_id)


async def _advance_to(hass: HomeAssistant, freezer: FrozenDateTimeFactory, clock: str) -> None:
    target = local(clock)
    while freezer().astimezone(target.tzinfo) < target:  # type: ignore[attr-defined]
        freezer.tick(timedelta(seconds=30))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()


# ---------------------------------------------------------------- who may set it


async def test_a_member_makes_their_own_ready_times_private(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
) -> None:
    reply = await _ws(hass, hass_ws_client, hass_admin_user, _set(heater, TIAGO, "private"))

    assert reply["success"]
    assert heater.runtime_data.visibility(TIAGO) is Visibility.PRIVATE
    assert (await _ws(hass, hass_ws_client, hass_admin_user, _set(heater, TIAGO, "public")))[
        "success"
    ]
    assert heater.runtime_data.visibility(TIAGO) is Visibility.PUBLIC


async def test_a_plain_member_may_set_their_own(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    assert (await _ws(hass, hass_ws_client, maria_user, _set(heater, MARIA, "private")))["success"]
    refused = await _ws(hass, hass_ws_client, maria_user, _set(heater, TIAGO, "private"))
    assert refused["error"]["code"] == "unauthorized"
    assert heater.runtime_data.visibility(TIAGO) is Visibility.PUBLIC


async def test_an_admin_does_not_make_another_person_private(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
) -> None:
    refused = await _ws(hass, hass_ws_client, hass_admin_user, _set(heater, MARIA, "private"))

    assert refused["error"]["code"] == "unauthorized"
    assert heater.runtime_data.visibility(MARIA) is Visibility.PUBLIC


async def test_only_an_admin_sets_a_virtual_member(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    maria_user: MockUser,
) -> None:
    refused = await _ws(hass, hass_ws_client, maria_user, _set(heater, GUESTS, "private"))
    assert refused["error"]["code"] == "unauthorized"

    assert (await _ws(hass, hass_ws_client, hass_admin_user, _set(heater, GUESTS, "private")))[
        "success"
    ]
    assert heater.runtime_data.visibility(GUESTS) is Visibility.PRIVATE


async def test_an_unknown_level_or_member_is_refused(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
) -> None:
    bad_level = await _ws(hass, hass_ws_client, hass_admin_user, _set(heater, TIAGO, "secret"))
    assert bad_level["error"]["code"] == "invalid_format"
    nobody = await _ws(hass, hass_ws_client, hass_admin_user, _set(heater, "nobody", "private"))
    assert nobody["error"]["code"] == "not_found"


async def test_it_survives_a_reload(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    await heater.runtime_data.async_set_visibility(TIAGO, Visibility.PRIVATE)
    assert await hass.config_entries.async_reload(heater.entry_id)
    await hass.async_block_till_done()

    assert heater.runtime_data.visibility(TIAGO) is Visibility.PRIVATE


# ---------------------------------------------------------------- what the card shows


async def test_others_do_not_see_a_private_members_ready_times(
    hass: HomeAssistant, heater: MockConfigEntry, hass_admin_user: MockUser, maria_user: MockUser
) -> None:
    runtime = heater.runtime_data
    await runtime.async_add_ready_time(TIAGO, time(9, 0), EVERY_DAY, True)
    await runtime.async_add_ready_time(MARIA, time(10, 0), EVERY_DAY, True)
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)

    maria = runtime.snapshot(maria_user)
    tiago_for_maria = _member(maria, TIAGO)
    assert tiago_for_maria["ready_times"] == []
    assert tiago_for_maria["next_ready"] is None
    assert tiago_for_maria["visibility"] is None  # not even told that Tiago is private
    assert [entry["member"] for entry in maria["today"]] == [MARIA]
    assert maria["next_ready"]["members"] == [MARIA]
    assert maria["next_heat_start"] > local("09:00").isoformat()  # her own window, not his

    admin = runtime.snapshot(hass_admin_user)
    assert len(_member(admin, TIAGO)["ready_times"]) == 1
    assert _member(admin, TIAGO)["visibility"] == "private"
    assert [entry["member"] for entry in admin["today"]] == [TIAGO, MARIA]


async def test_the_owner_sees_their_own_and_the_switch(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser
) -> None:
    runtime = heater.runtime_data
    await runtime.async_add_ready_time(MARIA, time(10, 0), EVERY_DAY, True)
    await runtime.async_set_visibility(MARIA, Visibility.PRIVATE)

    own = _member(runtime.snapshot(maria_user), MARIA)
    assert len(own["ready_times"]) == 1
    assert (own["visibility"], own["can_set_visibility"]) == ("private", True)
    assert _member(runtime.snapshot(maria_user), TIAGO)["can_set_visibility"] is False


async def test_heating_only_for_a_private_ready_time_is_not_shown(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    relay: None,
    hass_admin_user: MockUser,
    maria_user: MockUser,
) -> None:
    runtime = heater.runtime_data
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await runtime.async_add_ready_time(TIAGO, time(5, 15), EVERY_DAY, True)
    await hass.async_block_till_done()
    assert runtime.heating

    maria = runtime.snapshot(maria_user)
    assert maria["status"] == "waiting"
    assert (maria["ready_in_minutes"], maria["heating_for"]) == (None, [])
    assert (maria["element_on"], maria["power_w"]) == (None, None)
    assert runtime.snapshot(hass_admin_user)["status"] == "heating"
    # The status sensor stays true, for admins and automations.
    assert hass.states.get("sensor.cylinder_status").state == "heating"  # type: ignore[union-attr]


async def test_a_shared_window_shows_heating_from_the_viewers_own_start(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    relay: None,
    freezer: FrozenDateTimeFactory,
    hass_admin_user: MockUser,
    maria_user: MockUser,
) -> None:
    runtime = heater.runtime_data
    _water(hass, 30.0)
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await runtime.async_add_ready_time(TIAGO, time(7, 0), EVERY_DAY, True)
    await runtime.async_add_ready_time(MARIA, time(7, 30), EVERY_DAY, True)

    # From 30 C the lead is (42 - 30) x 7 + 15 = 99 min: Tiago's 07:00 starts at 05:21, and
    # Maria's 07:30 on its own would start at 05:51.
    await _advance_to(hass, freezer, "05:30")
    assert runtime.heating
    assert runtime.snapshot(maria_user)["status"] == "waiting"
    assert runtime.snapshot(hass_admin_user)["status"] == "heating"

    await _advance_to(hass, freezer, "05:52")
    maria = runtime.snapshot(maria_user)
    assert maria["status"] == "heating"
    assert all(entry["member"] == MARIA for entry in maria["heating_for"])


async def test_a_private_heat_now_is_not_shown_and_cannot_be_switched_off_by_others(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    relay: None,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    hass.config_entries.async_update_entry(heater, options={"cancel_people": [MARIA_PERSON]})
    await hass.async_block_till_done()
    runtime = heater.runtime_data
    _water(hass, 38.0)
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await runtime.async_heat_now(TIAGO)
    await hass.async_block_till_done()
    assert runtime.heating

    maria = runtime.snapshot(maria_user)
    assert (maria["status"], maria["heat_now"]) == ("waiting", None)

    off = {"type": f"{DOMAIN}/switch_off", "entry_id": heater.entry_id}
    assert (await _ws(hass, hass_ws_client, maria_user, off))["success"]
    assert runtime.heat_now_requesters == frozenset({TIAGO})  # nothing she could see to stop


async def test_joining_a_private_heat_now_shows_only_ones_own_request(
    hass: HomeAssistant, heater: MockConfigEntry, relay: None, maria_user: MockUser
) -> None:
    runtime = heater.runtime_data
    _water(hass, 38.0)
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await runtime.async_heat_now(TIAGO)
    await runtime.async_heat_now(MARIA)
    await hass.async_block_till_done()

    maria = runtime.snapshot(maria_user)
    assert maria["status"] == "heating"
    assert maria["heat_now"]["requesters"] == [MARIA]
    assert maria["heat_now"]["asked"] is True


# ---------------------------------------------------------------- entities


async def test_entities_leave_private_ready_times_out(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    runtime = heater.runtime_data
    await runtime.async_add_ready_time(TIAGO, time(9, 0), EVERY_DAY, True)
    await runtime.async_add_ready_time(MARIA, time(10, 0), EVERY_DAY, True)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.tiago_next_ready_time").state != "unknown"  # type: ignore[union-attr]

    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    await hass.async_block_till_done()

    assert hass.states.get("sensor.tiago_next_ready_time").state == "unknown"  # type: ignore[union-attr]
    heater_next = hass.states.get("sensor.cylinder_next_ready_time")
    assert heater_next is not None
    assert heater_next.attributes["members"] == ["Maria"]
    calendar = hass.states.get(CALENDAR)
    assert calendar is not None
    assert calendar.attributes["message"] == "Heating: Maria"

    start = dt_util.start_of_local_day(local("00:00").date() + timedelta(days=1))
    reply = await hass.services.async_call(
        "calendar",
        "get_events",
        {"entity_id": CALENDAR, "start_date_time": start, "duration": {"days": 7}},
        blocking=True,
        return_response=True,
    )
    events = reply[CALENDAR]["events"]  # type: ignore[index]
    assert events
    assert all(event["description"] == "10:00 Maria" for event in events)
