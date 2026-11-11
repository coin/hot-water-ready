"""Actions for automations and voice (spec 4.6, 5), with the card's permission rules (spec 2).

Called by a user, the user's rights apply: an admin may do anything, a linked member only for
themselves. Called by an automation or Home Assistant itself (no user), anything is allowed.
"""

from datetime import date, time

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError, Unauthorized
from homeassistant.helpers import config_validation as cv, device_registry as dr
import probatio

from .const import DOMAIN
from .core.controller import HEAT_NOW_MAX_TARGET, HEAT_NOW_MIN_TARGET, MAX_KEEP_HOT_MINUTES
from .entity import async_calling_user, member_device_identifier
from .heater import AwayDateInThePastError, Heater, HeatNowRefusedError

WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
ATTR_HEATER = "heater"
ATTR_MEMBER = "member"
ATTR_KEEP_MINUTES = "keep_minutes"
ATTR_TARGET = "target"

SWITCH_OFF_SCHEMA = probatio.Schema({probatio.Required(ATTR_HEATER): cv.string})
HEAT_NOW_SCHEMA = probatio.Schema(
    {
        probatio.Required(ATTR_HEATER): cv.string,
        probatio.Optional(ATTR_MEMBER): cv.string,
        probatio.Optional(ATTR_KEEP_MINUTES): probatio.All(
            probatio.Coerce(float), probatio.Range(min=0, max=MAX_KEEP_HOT_MINUTES)
        ),
        probatio.Optional(ATTR_TARGET): probatio.All(
            probatio.Coerce(float),
            probatio.Range(min=HEAT_NOW_MIN_TARGET, max=HEAT_NOW_MAX_TARGET),
        ),
    }
)
ADD_SCHEMA = probatio.Schema(
    {
        probatio.Required(ATTR_MEMBER): cv.string,
        probatio.Required("time"): cv.time,
        probatio.Optional("weekdays", default=WEEKDAYS): probatio.All(
            cv.ensure_list, [probatio.In(WEEKDAYS)], probatio.Length(min=1)
        ),
        probatio.Optional("enabled", default=True): cv.boolean,
    }
)
REMOVE_SCHEMA = probatio.Schema(
    {probatio.Required(ATTR_MEMBER): cv.string, probatio.Required("time"): cv.time}
)
AWAY_SCHEMA = probatio.Schema(
    {
        probatio.Required(ATTR_MEMBER): cv.string,
        probatio.Required("away"): cv.boolean,
        probatio.Optional("until"): cv.date,
    }
)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register the actions once, for every heater."""
    hass.services.async_register(DOMAIN, "heat_now", _heat_now, schema=HEAT_NOW_SCHEMA)
    hass.services.async_register(DOMAIN, "add_ready_time", _add_ready_time, schema=ADD_SCHEMA)
    hass.services.async_register(
        DOMAIN, "remove_ready_time", _remove_ready_time, schema=REMOVE_SCHEMA
    )
    hass.services.async_register(DOMAIN, "set_away", _set_away, schema=AWAY_SCHEMA)
    hass.services.async_register(DOMAIN, "switch_off", _switch_off, schema=SWITCH_OFF_SCHEMA)


def _error(key: str, **placeholders: str) -> ServiceValidationError:
    return ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key=key,
        translation_placeholders=placeholders or None,
    )


def _heater(hass: HomeAssistant, entry_id: str) -> Heater:
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.state is not ConfigEntryState.LOADED:
        raise _error("heater_not_found")
    heater: Heater = entry.runtime_data
    return heater


def _member(hass: HomeAssistant, device_id: str) -> tuple[Heater, str]:
    """The heater and member behind a member's device."""
    device = dr.async_get(hass).async_get(device_id)
    if device is not None:
        for entry in hass.config_entries.async_loaded_entries(DOMAIN):
            heater: Heater = entry.runtime_data
            for member in heater.members:
                if member_device_identifier(heater.entry_id, member.id) in device.identifiers:
                    return heater, member.id
    raise _error("member_not_found")


async def _require_editor(call: ServiceCall, heater: Heater, member_id: str) -> None:
    """Refuse a user who may not change this member (spec 2)."""
    user = await async_calling_user(call.hass, call.context)
    if not heater.can_edit(user, member_id):
        raise Unauthorized(context=call.context)


async def _member_to_change(call: ServiceCall) -> tuple[Heater, str]:
    """The member the call names, once the caller is known to be allowed to change them."""
    heater, member_id = _member(call.hass, call.data[ATTR_MEMBER])
    await _require_editor(call, heater, member_id)
    return heater, member_id


async def _heat_now(call: ServiceCall) -> None:
    """Hot water now; the named member is told, else the calling person, else nobody (4.6)."""
    heater = _heater(call.hass, call.data[ATTR_HEATER])
    user = await async_calling_user(call.hass, call.context)
    if not heater.can_ask_heat_now(user):
        raise Unauthorized(context=call.context)
    if ATTR_TARGET in call.data and not heater.can_choose_heat_now_target(user):
        raise Unauthorized(context=call.context)
    requester = heater.requester_key(user)
    if ATTR_MEMBER in call.data:
        named_heater, requester = _member(call.hass, call.data[ATTR_MEMBER])
        if named_heater is not heater:
            raise _error("member_not_found")
        await _require_editor(call, heater, requester)  # telling someone is acting for them
    try:
        await heater.async_heat_now(
            requester, call.data.get(ATTR_KEEP_MINUTES), call.data.get(ATTR_TARGET)
        )
    except HeatNowRefusedError as err:
        raise HomeAssistantError(await heater.async_refusal_message(err)) from err


async def _switch_off(call: ServiceCall) -> None:
    """Switch the heater off now for everyone: admins, the people listed, automations."""
    heater = _heater(call.hass, call.data[ATTR_HEATER])
    user = await async_calling_user(call.hass, call.context)
    if not heater.can_switch_off(user):
        raise Unauthorized(context=call.context)
    await heater.async_switch_off(user)


async def _add_ready_time(call: ServiceCall) -> None:
    """A new ready time for a member."""
    heater, member_id = await _member_to_change(call)
    at: time = call.data["time"]
    weekdays = frozenset(WEEKDAYS.index(day) for day in call.data["weekdays"])
    await heater.async_add_ready_time(
        member_id, at.replace(second=0, microsecond=0), weekdays, call.data["enabled"]
    )


async def _remove_ready_time(call: ServiceCall) -> None:
    """Remove a member's ready times at a time of day, whatever their days."""
    heater, member_id = await _member_to_change(call)
    at: time = call.data["time"].replace(second=0, microsecond=0)
    if not await heater.async_remove_ready_times_at(member_id, at):
        raise _error("ready_time_not_found", time=at.strftime("%H:%M"))


async def _set_away(call: ServiceCall) -> None:
    """Pause or resume a member's ready times, optionally until a last day away."""
    heater, member_id = await _member_to_change(call)
    until: date | None = call.data.get("until")
    try:
        await heater.async_set_away(member_id, call.data["away"], until)
    except AwayDateInThePastError as err:
        raise _error("away_date_in_past") from err
