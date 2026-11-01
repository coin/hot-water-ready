"""The calendar of heating windows, the actions, and the week for the card (ticket 09)."""

from datetime import time, timedelta
from typing import Any

from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError, Unauthorized
from homeassistant.helpers import device_registry as dr
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import DOMAIN

from .conftest import MARIA, TIAGO, access_token, local

CALENDAR = "calendar.cylinder_heating_windows"
EVERY_DAY = frozenset(range(7))


def _device(hass: HomeAssistant, entry: MockConfigEntry, member_id: str) -> str:
    device = dr.async_get(hass).async_get_device_by_identifier(
        (DOMAIN, f"{entry.entry_id}_{member_id}"), entry.entry_id
    )
    assert device is not None
    return device.id


async def _call(
    hass: HomeAssistant, action: str, data: dict[str, Any], user: MockUser | None = None
) -> None:
    context = Context(user_id=user.id) if user is not None else None
    await hass.services.async_call(DOMAIN, action, data, blocking=True, context=context)
    await hass.async_block_till_done()


def _times(entry: MockConfigEntry, member_id: str) -> list[str]:
    return [r.time.strftime("%H:%M") for r in entry.runtime_data.ready_times(member_id)]


# ---------------------------------------------------------------- calendar


async def test_the_calendar_lists_the_coming_week_of_windows_and_who_they_serve(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    await heater.runtime_data.async_add_ready_time(TIAGO, time(7, 0), EVERY_DAY, True)
    await heater.runtime_data.async_add_ready_time(MARIA, time(7, 30), frozenset({0}), True)
    start = dt_util.start_of_local_day(local("00:00").date() + timedelta(days=1))  # Tuesday

    reply = await hass.services.async_call(
        "calendar",
        "get_events",
        {"entity_id": CALENDAR, "start_date_time": start, "duration": {"days": 7}},
        blocking=True,
        return_response=True,
    )

    events = reply[CALENDAR]["events"]  # type: ignore[index]
    assert len(events) == 7  # Tuesday to Monday, one window a day
    monday = events[-1]
    assert monday["summary"] == "Heating: Tiago, Maria"
    assert monday["description"] == "07:00 Tiago\n07:30 Maria"
    assert monday["end"] == local("07:45", day=9).isoformat()  # Maria's time plus the grace


async def test_the_calendar_state_is_the_window_now_or_next(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    await heater.runtime_data.async_add_ready_time(TIAGO, time(9, 0), EVERY_DAY, True)
    await hass.async_block_till_done()

    state = hass.states.get(CALENDAR)
    assert state is not None
    assert state.attributes["message"] == "Heating: Tiago"
    # The water is at 39.6: (42 - 39.6) x 7 + 15 = 31.8 min before 09:00.
    assert state.attributes["start_time"] == "2026-11-02 08:28:12"


# ---------------------------------------------------------------- actions


async def test_an_admin_adds_and_removes_anyones_ready_times(
    hass: HomeAssistant, heater: MockConfigEntry, hass_admin_user: MockUser
) -> None:
    maria = _device(hass, heater, MARIA)

    await _call(
        hass,
        "add_ready_time",
        {"member": maria, "time": "06:45", "weekdays": ["mon", "fri"]},
        hass_admin_user,
    )
    (ready,) = heater.runtime_data.ready_times(MARIA)
    assert (ready.time, ready.weekdays, ready.enabled) == (time(6, 45), frozenset({0, 4}), True)

    await _call(hass, "remove_ready_time", {"member": maria, "time": "06:45"}, hass_admin_user)
    assert _times(heater, MARIA) == []


async def test_a_member_acts_only_for_themselves(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser
) -> None:
    await _call(
        hass,
        "add_ready_time",
        {"member": _device(hass, heater, MARIA), "time": "20:00"},
        maria_user,
    )
    assert _times(heater, MARIA) == ["20:00"]

    tiago = _device(hass, heater, TIAGO)
    for action, data in (
        ("add_ready_time", {"member": tiago, "time": "20:00"}),
        ("remove_ready_time", {"member": tiago, "time": "20:00"}),
        ("set_away", {"member": tiago, "away": True}),
        ("heat_now", {"heater": heater.entry_id, "member": tiago}),
    ):
        with pytest.raises(Unauthorized):
            await _call(hass, action, data, maria_user)
    assert _times(heater, TIAGO) == []
    assert heater.runtime_data.away(TIAGO).on is False


async def test_a_stranger_may_not_ask_for_heat_now(
    hass: HomeAssistant, heater: MockConfigEntry, maria_user: MockUser
) -> None:
    stranger = MockUser(name="Visitor", groups=maria_user.groups).add_to_hass(hass)

    with pytest.raises(Unauthorized):
        await _call(hass, "heat_now", {"heater": heater.entry_id}, stranger)


async def test_an_automation_may_do_anything(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    tiago = _device(hass, heater, TIAGO)

    await _call(hass, "add_ready_time", {"member": tiago, "time": "07:00:00"})
    await _call(hass, "set_away", {"member": tiago, "away": True, "until": "2026-11-05"})

    assert _times(heater, TIAGO) == ["07:00"]
    away = heater.runtime_data.away(TIAGO)
    assert (away.on, str(away.until)) == (True, "2026-11-05")


@pytest.mark.parametrize(
    ("member", "user", "told"),
    [
        (TIAGO, None, TIAGO),  # the named member
        (None, "maria", MARIA),  # else the person behind the calling user
        (None, None, None),  # else nobody, and the request still runs and shows
    ],
)
async def test_heat_now_tells_the_named_member_else_the_caller_else_nobody(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    member: str | None,
    user: str | None,
    told: str | None,
) -> None:
    data: dict[str, Any] = {"heater": heater.entry_id}
    if member is not None:
        data["member"] = _device(hass, heater, member)

    await _call(hass, "heat_now", data, maria_user if user else None)

    assert heater.runtime_data.heat_now_requesters == (frozenset() if told is None else {told})
    assert heater.runtime_data.heating  # 39.6 C: the request heats whoever is told


async def test_mistakes_are_explained(hass: HomeAssistant, heater: MockConfigEntry) -> None:
    tiago = _device(hass, heater, TIAGO)

    with pytest.raises(ServiceValidationError, match="no ready time at 05:00"):
        await _call(hass, "remove_ready_time", {"member": tiago, "time": "05:00"})
    with pytest.raises(ServiceValidationError, match="cannot be in the past"):
        await _call(hass, "set_away", {"member": tiago, "away": True, "until": "2026-10-01"})
    with pytest.raises(ServiceValidationError, match="No loaded Hot Water Ready heater"):
        await _call(hass, "heat_now", {"heater": "not-a-heater"})
    with pytest.raises(ServiceValidationError, match="not a member of this heater"):
        await _call(hass, "add_ready_time", {"member": "not-a-device", "time": "07:00"})


async def test_heat_now_with_automatic_control_off_is_refused_with_the_reason(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    await heater.runtime_data.async_set_automatic(False)

    with pytest.raises(HomeAssistantError, match="while automatic control is off") as refused:
        await _call(hass, "heat_now", {"heater": heater.entry_id})
    assert type(refused.value) is HomeAssistantError  # the refusal, not a validation error


# ---------------------------------------------------------------- the week on the card


async def _snapshot(
    hass: HomeAssistant, ws: WebSocketGenerator, entry: MockConfigEntry, token: str | None = None
) -> dict[str, Any]:
    client = await ws(hass, **({"access_token": token} if token else {}))
    await client.send_json_auto_id(
        {"type": "hot_water_ready/subscribe", "entry_id": entry.entry_id}
    )
    assert (await client.receive_json())["success"]
    event: dict[str, Any] = (await client.receive_json())["event"]
    return event


async def test_the_admin_gets_this_weeks_windows_and_a_member_does_not(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
) -> None:
    await heater.runtime_data.async_add_ready_time(TIAGO, time(7, 0), frozenset({0, 2}), True)
    await heater.runtime_data.async_add_ready_time(MARIA, time(7, 30), frozenset({2}), True)

    week = (await _snapshot(hass, hass_ws_client, heater))["week"]

    assert (week["monday"], week["today"]) == ("2026-11-02", "2026-11-02")
    # Monday's 07:00 is after now (05:00); Wednesday's two share one window.
    assert [w["end"] for w in week["windows"]] == [
        local("07:15").isoformat(),
        local("07:45", day=4).isoformat(),
    ]
    member_view = await _snapshot(
        hass, hass_ws_client, heater, await access_token(hass, maria_user)
    )
    assert member_view["week"] is None
