"""A simulated cylinder for driving the controller minute by minute.

Like version 1's harnesses: the water is continuous, the probe reports it in 0.1 C steps, and the
element only heats while the relay is on.
"""

from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta

from custom_components.hot_water_ready.core.controller import (
    Controller,
    ControllerEvent,
    ControllerState,
    Occurrence,
    Settings,
)
from custom_components.hot_water_ready.core.solar import SolarTrend


@dataclass
class Toggle:
    """The relay switched, at a time, with the probe reading that caused it."""

    at: datetime
    on: bool
    probe: float
    in_window: bool = True  # whether a window or heat now was still asking after the switch
    window: datetime | None = None  # the first ready time of the window asking, if any


@dataclass
class Cylinder:
    """Water, probe, relay and the controller that drives them."""

    now: datetime
    water: float
    settings: Settings = field(default_factory=Settings)
    heat_per_minute: float = 0.17  # Tiago's cylinder: about 5.9 min per degree
    cool_per_minute: float = 0.0
    sun_per_minute: float = 0.0  # solar gain, whether the relay is on or not
    probe_online: bool = True
    relay: bool = False
    occurrences: list[Occurrence] = field(default_factory=list)
    toggles: list[Toggle] = field(default_factory=list)
    events: list[tuple[datetime, ControllerEvent]] = field(default_factory=list)
    controller: Controller = field(init=False)
    trend: SolarTrend = field(init=False, default_factory=SolarTrend)

    def __post_init__(self) -> None:
        self.controller = Controller(self.settings)

    @property
    def probe(self) -> float | None:
        """What the sensor reports: the water rounded to 0.1, or nothing while offline."""
        return round(self.water, 1) if self.probe_online else None

    def step(self) -> None:
        """Let the controller look at the house now and act on its decision."""
        self.trend.step(now=self.now, temperature=self.probe, heating=self.relay)
        decision = self.controller.step(
            now=self.now,
            temperature=self.probe,
            occurrences=self.occurrences,
            solar_rise=self.trend.rise_per_minute(self.now),
        )
        self.events.extend((self.now, event) for event in decision.events)
        if decision.relay_on is not None and decision.relay_on != self.relay:
            self.relay = decision.relay_on
            probe = self.probe
            state = self.controller.state
            in_window = state.window is not None or state.heat_now is not None
            probe_value = -1.0 if probe is None else probe
            window = None if state.window is None else state.window.ready_at
            self.toggles.append(Toggle(self.now, self.relay, probe_value, in_window, window))

    def heat_now(self, requester: str, keep_minutes: float | None = None) -> None:
        """Someone presses "Aquecer agora"; Home Assistant steps at once."""
        self.controller.request_heat_now(self.now, requester, keep_minutes)
        self.step()

    def cancel_heat_now(self) -> None:
        """Someone presses "Cancelar"; Home Assistant steps at once."""
        self.controller.cancel_heat_now()
        self.step()

    def run(self, minutes: float, *, draw_per_minute: float = 0.0) -> None:
        """Advance in 0.1-minute ticks, stepping the controller whenever the probe changes and
        at least once a minute, as the Home Assistant layer does."""
        ticks = round(minutes * 10)
        last_probe = self.probe
        for tick in range(1, ticks + 1):
            # Real time, not wall-clock time: across a clock change an hour is still an hour.
            self.now = (self.now.astimezone(UTC) + timedelta(minutes=0.1)).astimezone(
                self.now.tzinfo
            )
            change = (self.heat_per_minute if self.relay else -self.cool_per_minute) + (
                self.sun_per_minute - draw_per_minute
            )
            self.water += change / 10
            if self.probe != last_probe or tick % 10 == 0:
                last_probe = self.probe
                self.step()

    def run_until(self, when: datetime, **kwargs: float) -> None:
        """Advance to `when`."""
        elapsed = when.astimezone(UTC) - self.now.astimezone(UTC)
        self.run(elapsed.total_seconds() / 60, **kwargs)

    def restart(self, *, keep_state: bool = True) -> None:
        """Home Assistant restarts: a new controller from the saved state, or from nothing."""
        saved = ControllerState.from_dict(self.controller.state.to_dict()) if keep_state else None
        self.controller = Controller(self.settings, saved)

    def ready_events(self) -> list[tuple[datetime, ControllerEvent]]:
        """The "water is ready" events so far."""
        return [(at, event) for at, event in self.events if event.kind == "ready"]

    def heating_events(self) -> list[tuple[datetime, ControllerEvent]]:
        """The "started heating for a window" events so far."""
        return [(at, event) for at, event in self.events if event.kind == "heating"]
