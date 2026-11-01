"""Random households run through the simulated cylinder, checking what must always hold.

Seeded, so a failure names its seed and replays exactly. The rules (from ticket 12 of version 1
and the spec):
- the relay never chatters: while something asks for heat, each switch needs a different probe
  reading than the one before;
- each member is told "ready" at most once per ready time, and only at or above the target;
- each member is told "heating" at most once per ready time;
- the relay is never on without an open window or a heat-now request;
- a heat-now request tells each person who asked once, at or above the target;
- a restart at any moment, from the saved state, changes none of the above.

Each rule also has a test that breaks the controller on purpose and expects the households to
catch it, so a rule the random scenarios never exercise fails here instead of passing quietly.
"""

from collections.abc import Callable, Iterator
from contextlib import contextmanager
from dataclasses import replace
from datetime import datetime, timedelta
import itertools
import random
from unittest.mock import patch
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.controller import (
    Controller,
    ControllerEvent,
    Occurrence,
    Settings,
)

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
START = datetime(2026, 11, 2, 4, 0, tzinfo=LISBON)
SEEDS = range(300)


def _household(rng: random.Random) -> list[Occurrence]:
    occurrences: dict[datetime, set[str]] = {}
    for _ in range(rng.randint(1, 5)):
        at = START + timedelta(minutes=rng.randrange(30, 6 * 60, 5))
        occurrences.setdefault(at, set()).add(rng.choice("abc"))
    return [Occurrence(at, frozenset(members)) for at, members in sorted(occurrences.items())]


def broken_rules(seed: int) -> list[str]:  # noqa: PLR0912 - one branch per rule
    """Run one random household for eight hours; return the rules it saw broken."""
    rng = random.Random(seed)
    settings = replace(
        Settings(),
        margin=rng.choice([0.0, 0.5, 1.0]),
        keep_heating_gap_minutes=rng.choice([0.0, 40.0]),
    )
    cylinder = Cylinder(now=START, water=rng.uniform(15, 48), settings=settings)
    cylinder.cool_per_minute = rng.uniform(0.0, 0.05)
    cylinder.occurrences = _household(rng)
    restart_at = rng.randrange(30, 7 * 60)
    withdraw_at = rng.randrange(30, 7 * 60)
    broken: list[str] = []

    pending: list[tuple[int, Occurrence]] = []
    for minute in range(8 * 60):
        draw = 0.4 if rng.random() < 0.03 else 0.0
        cylinder.run(1, draw_per_minute=draw)
        if minute == restart_at:
            cylinder.restart()
        if minute == withdraw_at and cylinder.occurrences:
            cylinder.occurrences = cylinder.occurrences[1:]
        if rng.random() < 0.02 and cylinder.occurrences:
            # A ready time switched off, and back on a few minutes later.
            switched_off = rng.choice(cylinder.occurrences)
            back_on_at = minute + rng.randint(1, 10)
            cylinder.occurrences = [o for o in cylinder.occurrences if o is not switched_off]
            pending.append((back_on_at, switched_off))
        for item in [p for p in pending if p[0] == minute]:
            pending.remove(item)
            cylinder.occurrences = sorted([*cylinder.occurrences, item[1]], key=lambda o: o.at)
        if rng.random() < 0.01:
            cylinder.heat_now(rng.choice("abc"))
        if rng.random() < 0.003:
            cylinder.cancel_heat_now()
        state = cylinder.controller.state
        if cylinder.relay and state.window is None and state.heat_now is None:
            broken.append(f"relay on with nothing asking for it at {cylinder.now}")

    # A window closing (or the next one opening) may switch at the reading of the switch before;
    # two switches at one reading, both while something asks for heat, is the band chattering.
    if any(
        a.in_window and b.in_window and a.probe == b.probe
        for a, b in itertools.pairwise(cylinder.toggles)
    ):
        broken.append("chatter")
    told = [(m, e.ready_at) for _, e in cylinder.ready_events() for m in e.members]
    if len(told) != len(set(told)):
        broken.append("told ready twice")
    if any(
        e.temperature is None or e.temperature < settings.target for _, e in cylinder.ready_events()
    ):
        broken.append("told ready below the target")
    heating = [(m, e.ready_at) for _, e in cylinder.heating_events() for m in e.members]
    if len(heating) != len(set(heating)):
        broken.append("told heating twice")
    now_told = [e for _, e in cylinder.events if e.kind == "heat_now_ready"]
    if any(e.temperature is None or e.temperature < settings.target for e in now_told):
        broken.append("heat now told below the target")
    per_request = [(m, e.ready_at) for e in now_told for m in e.members]
    if len(per_request) != len(set(per_request)):
        broken.append("heat now told twice")
    return broken


@pytest.mark.parametrize("seed", SEEDS)
def test_random_households_keep_the_rules(seed: int) -> None:
    assert broken_rules(seed) == [], f"seed {seed}"


# --------------------------------------------------------------------------- the rules can fail


@contextmanager
def _broken(name: str, replacement: Callable[..., object]) -> Iterator[None]:
    with patch.object(Controller, name, replacement):
        yield


def _caught(rule: str) -> int:
    return sum(rule in " ".join(broken_rules(seed)) for seed in SEEDS)


def test_heating_told_twice_is_caught() -> None:
    def keep_all(_self: Controller, events: list[ControllerEvent]) -> tuple[ControllerEvent, ...]:
        return tuple(events)

    with _broken("_once", keep_all):
        assert _caught("told heating twice") > 0


def test_chatter_is_caught() -> None:
    def no_hysteresis(self: Controller, temperature: float) -> None:
        # Stop at target + margin as usual, but switch back on at the very next reading that is
        # not above it: the band with no gap between its stop and restart points.
        target = self.settings.target + self.settings.margin
        if self.state.heating and temperature >= target:
            self.state.heating = False
        elif not self.state.heating and temperature <= target:
            self.state.heating = True

    with _broken("_band", no_hysteresis):
        assert _caught("chatter") > 0


def test_relay_on_with_nothing_asking_is_caught() -> None:
    def never_close(self: Controller) -> None:
        self.state.window = None  # forgets the window but leaves the heater on

    with _broken("_close", never_close):
        assert _caught("relay on with nothing asking") > 0
