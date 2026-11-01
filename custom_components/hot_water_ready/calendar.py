"""The read-only calendar of heating windows and whose showers they serve (spec 5)."""

from datetime import datetime, timedelta

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import HotWaterReadyConfigEntry
from .core.controller import PlannedWindow
from .entity import HeaterEntity
from .messages import async_message

LOOK_AHEAD = timedelta(days=8)  # far enough to find next week's window


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HotWaterReadyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the heater's calendar."""
    async_add_entities([WindowsCalendar(entry.runtime_data, "windows")])


class WindowsCalendar(HeaterEntity, CalendarEntity):
    """Each heating window as an event: when the heater may heat, and for whom."""

    _summary = "{members}"  # replaced by the translated text once added

    async def async_added_to_hass(self) -> None:
        """Read the event title in Home Assistant's language, then follow the heater."""
        self._summary = await async_message(self.hass, "calendar_window", {"members": "{members}"})
        await super().async_added_to_hass()

    @property
    def event(self) -> CalendarEvent | None:
        """The window now, or the next one."""
        now = dt_util.utcnow()
        for window in self.heater.windows_between(now - timedelta(days=1), now + LOOK_AHEAD):
            if window.end > now:
                return self._event(window)
        return None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        """The windows that overlap [start_date, end_date)."""
        # A window starts before its first ready time, so look a day earlier and later.
        windows = self.heater.windows_between(
            start_date - timedelta(days=1), end_date + timedelta(days=1)
        )
        return [self._event(w) for w in windows if w.start < end_date and w.end > start_date]

    def _event(self, window: PlannedWindow) -> CalendarEvent:
        names = self.heater.member_names()
        people: list[str] = []
        lines: list[str] = []
        for occurrence in window.ready_times:
            clock = dt_util.as_local(occurrence.at).strftime("%H:%M")
            for member_id in sorted(occurrence.members, key=lambda m: names.get(m, m)):
                name = names.get(member_id, member_id)
                if name not in people:
                    people.append(name)
                lines.append(f"{clock} {name}")
        return CalendarEvent(
            start=dt_util.as_local(window.start),
            end=dt_util.as_local(window.end),
            summary=self._summary.format(members=", ".join(people)),
            description="\n".join(lines),
        )
