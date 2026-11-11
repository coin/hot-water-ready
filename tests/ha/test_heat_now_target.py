"""Heat now to a temperature of one's own (decision 16): admins and automations choose it."""

from typing import Any

from homeassistant.core import Context, HomeAssistant, ServiceCall
from homeassistant.exceptions import Unauthorized
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.hot_water_ready.const import DOMAIN
from custom_components.hot_water_ready.core.visibility import Visibility

from .conftest import MARIA, SWITCH, TIAGO
from .test_heat_now import _press, _water, _ws, phones, sent  # noqa: F401  (fixtures)


def _start(heater: MockConfigEntry, **extra: Any) -> dict[str, Any]:
    return {"type": "hot_water_ready/heat_now/start", "entry_id": heater.entry_id, **extra}


def _state(heater: MockConfigEntry) -> Any:
    heat_now = heater.runtime_data._controller.state.heat_now
    assert heat_now is not None
    return heat_now


async def test_an_admin_heats_higher_and_each_is_told_at_their_own(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    phones: dict[str, str],  # noqa: F811
    sent: list[ServiceCall],  # noqa: F811
) -> None:
    _water(hass, 40.0)
    await _press(hass, maria_user)
    reply = await _ws(hass, hass_ws_client, _start(heater, target=45), hass_admin_user)
    assert reply["success"], reply
    hass.states.async_set(SWITCH, "on")

    _water(hass, 42.0)
    await hass.async_block_till_done()
    assert [c.data["entity_id"] for c in sent] == [phones[MARIA]]
    assert hass.states.get("sensor.cylinder_status").state == "heating"

    _water(hass, 45.0)
    await hass.async_block_till_done()
    assert [c.data["entity_id"] for c in sent] == [phones[MARIA], phones[TIAGO]]


async def test_a_member_may_not_choose_a_temperature(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    sent: list[ServiceCall],  # noqa: F811
) -> None:
    _water(hass, 40.0)
    reply = await _ws(hass, hass_ws_client, _start(heater, target=44), maria_user)

    assert reply["error"]["code"] == "unauthorized"
    assert "administrator" in reply["error"]["message"]
    assert heater.runtime_data._controller.state.heat_now is None


@pytest.mark.parametrize("target", [34, 46])
async def test_a_temperature_outside_35_to_45_is_refused(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],  # noqa: F811
    target: int,
) -> None:
    _water(hass, 40.0)
    reply = await _ws(hass, hass_ws_client, _start(heater, target=target), hass_admin_user)

    assert reply["error"]["code"] == "invalid_format"
    assert heater.runtime_data._controller.state.heat_now is None


async def test_an_automation_chooses_a_lower_temperature(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    sent: list[ServiceCall],  # noqa: F811
) -> None:
    _water(hass, 36.0)
    await hass.services.async_call(
        DOMAIN,
        "heat_now",
        {"heater": heater.entry_id, "target": 38},
        blocking=True,
        context=Context(),
    )
    await hass.async_block_till_done()

    assert _state(heater).targets == {"": 38.0}
    assert heater.runtime_data._controller.target_now() == 38.0


async def test_a_member_calling_the_action_may_not_choose_a_temperature(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    maria_user: MockUser,
    sent: list[ServiceCall],  # noqa: F811
) -> None:
    _water(hass, 40.0)
    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            "heat_now",
            {"heater": heater.entry_id, "target": 44},
            blocking=True,
            context=Context(user_id=maria_user.id),
        )

    assert heater.runtime_data._controller.state.heat_now is None


async def test_the_card_sees_its_own_temperature_and_who_may_choose(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],  # noqa: F811
) -> None:
    _water(hass, 40.0)
    await _press(hass, maria_user)
    await _ws(hass, hass_ws_client, _start(heater, target=45, keep_minutes=30), hass_admin_user)
    runtime = heater.runtime_data

    admin = runtime.snapshot(hass_admin_user)
    maria = runtime.snapshot(maria_user)
    assert admin["can_choose_heat_now_target"] is True
    assert maria["can_choose_heat_now_target"] is False
    assert admin["heat_now"]["target"] == 45.0
    assert maria["heat_now"]["target"] == 42.0
    # Towards their own temperature, at 7 min a degree: 5 degrees for the admin, 2 for Maria.
    assert admin["ready_in_minutes"] == 35
    assert maria["ready_in_minutes"] == 14


async def test_a_private_admins_temperature_stays_out_of_others_cards(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    hass_ws_client: WebSocketGenerator,
    maria_user: MockUser,
    hass_admin_user: MockUser,
    sent: list[ServiceCall],  # noqa: F811
) -> None:
    runtime = heater.runtime_data
    await runtime.async_set_visibility(TIAGO, Visibility.PRIVATE)
    _water(hass, 41.0)
    await _press(hass, maria_user)
    await _ws(hass, hass_ws_client, _start(heater, target=45, keep_minutes=60), hass_admin_user)
    _water(hass, 42.0)  # Maria told; still heating for Tiago's 45
    await hass.async_block_till_done()

    maria = runtime.snapshot(maria_user)["heat_now"]
    assert maria["requesters"] == [MARIA]
    assert maria["target"] == 42.0
    assert maria["keep_until"] is not None  # her own time
    assert runtime.snapshot(hass_admin_user)["heat_now"]["keep_until"] is None  # not told yet
