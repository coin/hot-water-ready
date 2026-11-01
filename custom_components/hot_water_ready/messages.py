"""Telling people: finding a person's phones and sending to them (spec 4.9).

Home Assistant has no "notify this person" call, so a person's phones are found through the
person: their device trackers, the devices those belong to, and the notify entities on those
devices (mobile_app creates one per phone since 2026.5). An explicit list of notify entities on
a member replaces that. Each target is sent to on its own, so one failing phone does not stop the
rest. Nobody to reach means a persistent notification and one warning in the log, never a silent
fallback to someone else.
"""

from collections.abc import Iterable
import logging

from homeassistant.components import persistent_notification
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er, translation

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


def person_targets(hass: HomeAssistant, person: str) -> list[str]:
    """The notify entities on the devices of a person's device trackers."""
    state = hass.states.get(person)
    if state is None:
        return []
    registry = er.async_get(hass)
    device_ids = {
        entry.device_id
        for tracker in state.attributes.get("device_trackers", [])
        if (entry := registry.async_get(tracker)) is not None and entry.device_id
    }
    return sorted(
        entry.entity_id
        for device_id in device_ids
        for entry in er.async_entries_for_device(registry, device_id)
        if entry.domain == "notify" and not entry.disabled
    )


async def async_message(
    hass: HomeAssistant, key: str, placeholders: dict[str, str] | None = None
) -> str:
    """A message from the translations, in Home Assistant's language (English as a fallback)."""
    placeholders = placeholders or {}
    for language in (hass.config.language, "en"):
        texts = await translation.async_get_translations(hass, language, "exceptions", [DOMAIN])
        text = texts.get(f"component.{DOMAIN}.exceptions.{key}.message")
        if text:
            return text.format(**placeholders)
    return key


def format_temperature(hass: HomeAssistant, value: float) -> str:
    """42.3 in English, 42,3 in Portuguese."""
    text = f"{value:.1f}"
    return text.replace(".", ",") if hass.config.language.startswith("pt") else text


async def async_send(
    hass: HomeAssistant, targets: Iterable[str], title: str, message: str
) -> list[str]:
    """Send to every target; returns the ones that took it."""
    sent: list[str] = []
    for target in targets:
        try:
            await hass.services.async_call(
                "notify",
                "send_message",
                {"entity_id": target, "title": title, "message": message},
                blocking=True,
            )
        except HomeAssistantError as err:
            _LOGGER.warning("Could not notify %s: %s", target, err)
        else:
            sent.append(target)
    return sent


async def async_nobody_to_tell(hass: HomeAssistant, who: str, title: str, message: str) -> None:
    """Say, once, that `who` could not be reached, and what they would have been told."""
    note = await async_message(hass, "no_target", {"name": who, "message": message})
    _LOGGER.warning("Nobody to notify for %s; the message was: %s", who, message)
    persistent_notification.async_create(
        hass, note, title=title, notification_id=f"{DOMAIN}_no_target_{who}"
    )
