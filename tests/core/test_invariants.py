"""Random households run through the simulated cylinder, checking what must always hold.

Seeded, so a failure names its seed and replays exactly. The rules (from ticket 12 of version 1
and the spec):
- the relay never chatters: inside a window, each switch needs a different probe reading than
  the one before;
- each member is told "ready" at most once per ready time, and only at or above the target;
- the relay is never on without an open window or a heat-now request;
- a heat-now request tells each person who asked once, at or above the target;
- a restart at any moment, from the saved state, changes none of the above.
"""

from dataclasses import replace
from datetime import datetime, timedelta
import itertools
import random
from zoneinfo import ZoneInfo

import pytest

from custom_components.hot_water_ready.core.controller import Occurrence, Settings

from .simulation import Cylinder

LISBON = ZoneInfo("Europe/Lisbon")
START = datetime(2026, 11, 2, 4, 0, tzinfo=LISBON)


def _household(rng: random.Random) -> list[Occurrence]:
    occurrences: dict[datetime, set[str]] = {}
    for _ in range(rng.randint(1, 5)):
        at = START + timedelta(minutes=rng.randrange(30, 6 * 60, 5))
        occurrences.setdefault(at, set()).add(rng.choice("abc"))
    return [Occurrence(at, frozenset(members)) for at, members in sorted(occurrences.items())]


@pytest.mark.parametrize("seed", range(300))
def test_random_households_keep_the_rules(seed: int) -> None:
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

    for minute in range(8 * 60):
        draw = 0.4 if rng.random() < 0.03 else 0.0
        cylinder.run(1, draw_per_minute=draw)
        if minute == restart_at:
            cylinder.restart()
        if minute == withdraw_at and cylinder.occurrences:
            cylinder.occurrences = cylinder.occurrences[1:]
        if rng.random() < 0.01:
            cylinder.heat_now(rng.choice("abc"))
        if rng.random() < 0.003:
            cylinder.cancel_heat_now()
        state = cylinder.controller.state
        assert not cylinder.relay or state.window is not None or state.heat_now is not None, (
            f"seed {seed}: relay on with nothing asking for it at {cylinder.now}"
        )

    # A window closing (or the next one opening) may switch at the reading of the switch before;
    # two switches at one reading, both with a window open, would be the band chattering.
    chatter = [
        (a.probe, b.at)
        for a, b in itertools.pairwise(cylinder.toggles)
        if a.in_window and b.in_window and a.probe == b.probe
    ]
    assert not chatter, f"seed {seed}: chatter {chatter}"
    told = [
        (member, event.ready_at) for _, event in cylinder.ready_events() for member in event.members
    ]
    assert len(told) == len(set(told)), f"seed {seed}: told twice {told}"
    assert all(e.temperature >= settings.target for _, e in cylinder.ready_events()), f"seed {seed}"
    now_told = [e for _, e in cylinder.events if e.kind == "heat_now_ready"]
    assert all(e.temperature >= settings.target for e in now_told), f"seed {seed}"
    per_request = [(m, e.ready_at) for e in now_told for m in e.members]
    assert len(per_request) == len(set(per_request)), f"seed {seed}: heat now told twice"
