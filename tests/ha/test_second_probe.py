"""The second probe, lower down: the start from both, and the probe check's warnings."""

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.hot_water_ready.const import DOMAIN
from custom_components.hot_water_ready.core.faults import BLOCKING, Fault
from custom_components.hot_water_ready.core.probes import Probe
from custom_components.hot_water_ready.heater import issue_id

from .conftest import SENSOR

MIDDLE = "sensor.cylinder_middle"


async def _with_middle(hass: HomeAssistant, heater: MockConfigEntry, top: str, middle: str) -> None:
    hass.states.async_set(SENSOR, top, {"unit_of_measurement": "°C"})
    hass.states.async_set(MIDDLE, middle, {"unit_of_measurement": "°C"})
    hass.config_entries.async_update_entry(
        heater, options={**heater.options, "middle_temperature_sensor": MIDDLE}
    )
    await hass.async_block_till_done()


async def test_without_a_second_probe_the_lead_follows_the_top(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    hass.states.async_set(MIDDLE, "30.0", {"unit_of_measurement": "°C"})
    await hass.async_block_till_done()

    assert heater.runtime_data.lead_temperature == 39.6


async def test_a_colder_middle_brings_the_lead_down_to_the_probes_mean(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    """4 Nov's top-up: top 39.4, middle 33.3, so the start is worked out from 36.35."""
    await _with_middle(hass, heater, "39.4", "33.3")

    runtime = heater.runtime_data
    assert runtime.temperature == 39.4  # ready still follows the top
    assert runtime.lead_temperature == pytest.approx(36.35)


async def test_a_middle_warmer_than_the_top_does_not_delay_the_start(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    await _with_middle(hass, heater, "39.0", "40.0")

    assert heater.runtime_data.lead_temperature == 39.0


async def test_a_suspect_middle_probe_is_set_aside_and_heating_goes_on(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    await _with_middle(hass, heater, "39.4", "33.3")
    runtime = heater.runtime_data

    runtime._probes.state.suspect = frozenset({Probe.MIDDLE})  # what two slow heats would do

    assert Fault.MIDDLE_PROBE in runtime.faults
    assert runtime.lead_temperature == 39.4
    assert not runtime.faults & BLOCKING  # a warning: heating is not stopped


async def test_a_suspect_probe_is_resolved_in_repairs(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    await _with_middle(hass, heater, "39.4", "33.3")
    runtime = heater.runtime_data
    runtime._probes.state.suspect = frozenset({Probe.BOTH})
    runtime._sync_issues()
    issues = ir.async_get(hass)
    assert issues.async_get_issue(DOMAIN, issue_id(heater.entry_id, Fault.PROBES_DISAGREE))

    await runtime.async_resolve_fault(Fault.PROBES_DISAGREE)

    assert Fault.PROBES_DISAGREE not in runtime.faults
    assert not issues.async_get_issue(DOMAIN, issue_id(heater.entry_id, Fault.PROBES_DISAGREE))


async def test_the_probe_check_survives_a_reload(
    hass: HomeAssistant, heater: MockConfigEntry
) -> None:
    await _with_middle(hass, heater, "39.4", "33.3")
    heater.runtime_data._probes.state.suspect = frozenset({Probe.TOP})
    heater.runtime_data._probes.state.rates[Probe.TOP] = [5.1, 5.5]
    await heater.runtime_data._async_save()

    assert await hass.config_entries.async_reload(heater.entry_id)
    await hass.async_block_till_done()

    state = heater.runtime_data._probes.state
    assert state.suspect == frozenset({Probe.TOP})
    assert state.rates[Probe.TOP] == [5.1, 5.5]
