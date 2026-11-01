"""The learned heating rate, the solar-aware rule and the comparison record (ticket 08)."""

from collections.abc import Awaitable, Callable
from datetime import timedelta
import json

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util.json import JsonObjectType
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockUser,
    async_fire_time_changed,
)
from pytest_homeassistant_custom_component.components.diagnostics import (
    get_diagnostics_for_config_entry,
)
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from .conftest import MARIA_PERSON, SENSOR, SWITCH, TIAGO, TIAGO_PERSON, local
from .fakes import FakeRelay

RATE = "sensor.cylinder_learned_heating_rate"
LEAD = "sensor.cylinder_lead"
SOLAR_LEAD = "sensor.cylinder_solar_aware_lead"


class House:
    """The cylinder's water, heated by the fake relay and by the sun, ticked 30 s at a time."""

    def __init__(self, hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
        self.hass, self.freezer = hass, freezer
        self.relay = FakeRelay(hass, SWITCH).install()
        self.water = 30.0
        self.heat_per_minute = 0.2  # 5 min per degree
        self.sun_per_minute = 0.0
        self.set(self.water)

    def set(self, water: float) -> None:
        self.water = water
        self.hass.states.async_set(SENSOR, f"{water:.1f}", {"unit_of_measurement": "°C"})

    @property
    def heating(self) -> bool:
        state = self.hass.states.get(SWITCH)
        return state is not None and state.state == "on"

    async def tick(self, minutes: float = 0.5) -> None:
        for _ in range(round(minutes * 2)):
            gain = self.sun_per_minute + (self.heat_per_minute if self.heating else 0.0)
            self.set(self.water + gain / 2)
            self.freezer.tick(timedelta(seconds=30))
            async_fire_time_changed(self.hass)
            await self.hass.async_block_till_done()

    async def until_off(self) -> None:
        """Tick until the relay has been on and is off again."""
        for _ in range(600):
            await self.tick()
            if not self.heating:
                return
        pytest.fail("the relay never switched off")


@pytest.fixture
def house(hass: HomeAssistant, heater: MockConfigEntry, freezer: FrozenDateTimeFactory) -> House:
    """The heater set up with water at 30 C, at 05:00 in Lisbon (night: the sun is down)."""
    hass.config.latitude, hass.config.longitude = 38.72, -9.14
    return House(hass, freezer)


type Download = Callable[[MockConfigEntry], Awaitable[JsonObjectType]]


@pytest.fixture
def diagnostics(
    hass: HomeAssistant, hass_client: ClientSessionGenerator, hass_admin_user: MockUser
) -> Download:
    """Download an entry's diagnostics as the admin, with a token issued now.

    The fixture's own token is issued before the clock is moved, and lasts 30 minutes.
    """

    async def download(entry: MockConfigEntry) -> JsonObjectType:
        refresh = await hass.auth.async_create_refresh_token(hass_admin_user, "https://hwr.test/")
        token = hass.auth.async_create_access_token(refresh)
        return await get_diagnostics_for_config_entry(hass, lambda: hass_client(token), entry)

    return download


async def _run(house: House, entry: MockConfigEntry, night: int, clock: str = "02:00") -> None:
    """Heat now from 30 C on the given day of November, at 02:00 unless told otherwise."""
    house.freezer.move_to(f"2026-11-{night:02d} {clock}:00+00:00")
    house.set(30.0)
    await house.tick()
    await entry.runtime_data.async_heat_now("tiago")
    await house.until_off()


async def test_runs_with_the_sun_up_are_not_learned_from(
    hass: HomeAssistant, heater: MockConfigEntry, house: House
) -> None:
    for day in (3, 4, 5):
        await _run(house, heater, day, clock="12:00")

    assert hass.states.get(RATE).state == "unknown"


async def test_the_learned_rate_replaces_the_fixed_one_and_a_value_by_hand_beats_it(
    hass: HomeAssistant, heater: MockConfigEntry, house: House
) -> None:
    assert hass.states.get(RATE).state == "unknown"
    assert hass.states.get(RATE).attributes["rate_used"] == 7.0  # version 1's seed value

    for night in (3, 4, 5):
        await _run(house, heater, night)

    learned = float(hass.states.get(RATE).state)
    assert learned == pytest.approx(5.0, abs=0.3)  # 0.2 C a minute, steps of 30 s
    assert heater.runtime_data.rate == pytest.approx(learned)

    hass.config_entries.async_update_entry(heater, options={"heating_rate": 8.0})
    await hass.async_block_till_done()

    assert heater.runtime_data.rate == 8.0
    assert float(hass.states.get(RATE).state) == pytest.approx(learned)  # kept on reload
    assert hass.states.get(RATE).attributes["rate_used"] == 8.0


async def test_the_leads_are_hidden_diagnostic_sensors(
    hass: HomeAssistant, heater: MockConfigEntry, house: House
) -> None:
    await heater.runtime_data.async_add_ready_time(
        TIAGO, local("09:00").time(), frozenset({0}), True
    )
    await house.tick()

    # (42 - 30) x 7 + 15 = 99 min; no trend measured yet, so the solar-aware one is the same.
    assert float(hass.states.get(LEAD).state) == pytest.approx(99.0)
    assert float(hass.states.get(SOLAR_LEAD).state) == pytest.approx(99.0)
    registry = er.async_get(hass)
    for entity_id in (RATE, LEAD, SOLAR_LEAD):
        entity = registry.async_get(entity_id)
        assert entity is not None
        assert entity.entity_category == "diagnostic"
        assert entity.hidden_by == "integration"


@pytest.mark.parametrize(("solar_aware", "rule"), [(False, "version_1"), (True, "solar")])
async def test_each_window_is_recorded_with_the_rule_it_used(
    hass: HomeAssistant,
    heater: MockConfigEntry,
    house: House,
    diagnostics: Download,
    solar_aware: bool,
    rule: str,
) -> None:
    hass.config_entries.async_update_entry(heater, options={"solar_aware": solar_aware})
    await hass.async_block_till_done()
    house.sun_per_minute = 0.03
    await heater.runtime_data.async_add_ready_time(
        TIAGO, local("07:00").time(), frozenset({0}), True
    )
    for _ in range(4 * 60):  # 05:00 to 07:00
        await house.tick()

    downloaded = await diagnostics(heater)
    (record,) = downloaded["solar_comparison"]["records"]
    assert record["rule"] == rule
    assert record["members"] == [TIAGO]
    assert record["reached_at"] is not None
    assert record["drawn"] is False
    if rule == "solar":
        assert record["solar_start"] > record["start"]  # the sun let it start later
    verdict = downloaded["solar_comparison"]["verdict"]
    assert (verdict["windows"], verdict["on_time"]) == (1, 1)
    assert verdict["minutes_saved"] > 0
    assert verdict["kwh"] is None  # no power sensor and no element power


async def test_records_survive_a_restart(
    hass: HomeAssistant, heater: MockConfigEntry, house: House
) -> None:
    await heater.runtime_data.async_add_ready_time(
        TIAGO, local("06:00").time(), frozenset({0}), True
    )
    for _ in range(3 * 60):  # 05:00 to 06:30: heating from 30 C ends at about 06:00
        await house.tick()
    assert len(heater.runtime_data.comparison_records()) == 1

    await hass.config_entries.async_reload(heater.entry_id)
    await hass.async_block_till_done()

    assert len(heater.runtime_data.comparison_records()) == 1


async def test_diagnostics_leave_out_names_and_people(
    hass: HomeAssistant, heater: MockConfigEntry, hass_client: ClientSessionGenerator
) -> None:
    hass.config_entries.async_update_entry(
        heater, options={"cancel_people": [MARIA_PERSON], "fault_recipients": [TIAGO_PERSON]}
    )
    await hass.async_block_till_done()

    diagnostics = await get_diagnostics_for_config_entry(hass, hass_client, heater)

    text = json.dumps(diagnostics)
    for personal in ("Tiago", "Maria", TIAGO_PERSON, MARIA_PERSON):
        assert personal not in text
    assert [m["id"] for m in diagnostics["members"]] == [TIAGO, "member_maria"]
    assert diagnostics["state"]["rate_used"] == 7.0
