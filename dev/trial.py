"""Run the trial scenarios against the test HA and write a report (ticket 11).

    python dev/trial.py [report.md]

Needs the test HA from dev/testha.sh, with a switch heater named "Cilindro" over the fake relay
and water, and its long-lived token in dev/testha/config/.token. The simulated cylinder heats
1 C a minute while the fake relay is on, so a scenario takes minutes, in real time. What the
trial changes (automatic control, away, ready times, the water) is put back at the end.

Scenarios: A, a ready time waits for its lead before heating; B, one ready time heats the
water and stops at the band; C, two close ready times show as one window in the calendar;
D, heat now; E, a heater that does not warm the water is a fault, resolved in Repairs; F, after a
restart in the middle of a window, the integration switches the relay back on itself.
"""

import asyncio
from collections.abc import Callable
import contextlib
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import json
from pathlib import Path
import subprocess
import sys
import time
from typing import Any
import urllib.request
from zoneinfo import ZoneInfo

import websockets

HERE = Path(__file__).parent
TOKEN = (HERE / "testha" / "config" / ".token").read_text().strip()
BASE = "http://localhost:8124"
ZONE = ZoneInfo("Europe/Lisbon")
HEATER_NAME = "Cilindro"
WATER = "input_number.fake_water_temperature"
RELAY = "input_boolean.fake_relay"
PHYSICS = "automation.fake_cylinder_physics"
STATUS = "sensor.cilindro_status"
AUTOMATIC = "switch.cilindro_automatic_control"
PROBLEM = "binary_sensor.cilindro_problem"
CALENDAR = "calendar.cilindro_heating_windows"


def rest(method: str, path: str, body: object | None = None) -> Any:
    """One REST call to the test HA; the parsed JSON reply."""
    request = urllib.request.Request(  # noqa: S310 - a fixed local address
        f"{BASE}{path}",
        method=method,
        data=None if body is None else json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=30) as reply:  # noqa: S310
        text = reply.read()
    return json.loads(text) if text else None


def state(entity_id: str) -> str:
    return str(rest("GET", f"/api/states/{entity_id}")["state"])


def call(domain: str, service: str, data: dict[str, Any]) -> None:
    rest("POST", f"/api/services/{domain}/{service}", data)


async def _ws(messages: list[dict[str, Any]], *, subscribed: bool = False) -> list[Any]:
    async with websockets.connect(f"{BASE.replace('http', 'ws')}/api/websocket") as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()
        replies = []
        for n, message in enumerate(messages, start=1):
            await ws.send(json.dumps({"id": n, **message}))
            reply = json.loads(await ws.recv())
            if subscribed:  # the result, then the first event
                reply = json.loads(await ws.recv())
            replies.append(reply)
        return replies


def ws(message: dict[str, Any]) -> Any:
    (reply,) = asyncio.run(_ws([message]))
    if not reply["success"]:
        raise RuntimeError(reply)
    return reply.get("result")


def snapshot(entry_id: str) -> dict[str, Any]:
    (reply,) = asyncio.run(
        _ws([{"type": "hot_water_ready/subscribe", "entry_id": entry_id}], subscribed=True)
    )
    event: dict[str, Any] = reply["event"]
    return event


@dataclass
class Trial:
    """The scenarios, what they saw, and what to put back."""

    entry_id: str = ""
    stop: float = 43.0  # target plus margin, read from the heater at the start
    members: dict[str, str] = field(default_factory=dict)  # name to id
    added: list[tuple[str, str]] = field(default_factory=list)  # (member id, ready time id)
    lines: list[str] = field(default_factory=list)
    results: list[tuple[str, bool, str]] = field(default_factory=list)
    started: float = field(default_factory=time.monotonic)

    def log(self, text: str) -> None:
        stamp = datetime.now(ZONE).strftime("%H:%M:%S")
        line = f"{stamp} {text}"
        print(line, flush=True)
        self.lines.append(line)

    def look(self) -> str:
        """Status, relay and water now, for the timeline."""
        return f"status {state(STATUS)}, relay {state(RELAY)}, water {state(WATER)} C"

    def wait(self, what: str, until: Callable[[], bool], minutes: float) -> bool:
        deadline = time.monotonic() + minutes * 60
        while time.monotonic() < deadline:
            try:
                if until():
                    self.log(f"  {what}: yes ({self.look()})")
                    return True
            except OSError:
                pass  # Home Assistant restarting
            time.sleep(5)
        self.log(f"  {what}: NOT within {minutes} min ({self.look()})")
        return False

    def result(self, name: str, ok: bool, note: str) -> None:
        self.results.append((name, ok, note))
        self.log(f"{'PASS' if ok else 'FAIL'} {name}: {note}")

    def at_band(self) -> bool:
        """The relay off with the water at the stop point: a window or request finished."""
        return state(RELAY) == "off" and float(state(WATER)) >= self.stop - 0.1

    def water(self, value: float) -> None:
        call("input_number", "set_value", {"entity_id": WATER, "value": value})

    def ready_time(self, member: str, minutes_ahead: int) -> str:
        at = datetime.now(ZONE) + timedelta(minutes=minutes_ahead)
        clock = at.strftime("%H:%M")
        reply = ws(
            {
                "type": "hot_water_ready/ready_time/add",
                "entry_id": self.entry_id,
                "member_id": self.members[member],
                "time": clock,
                "weekdays": [at.weekday()],
            }
        )
        self.added.append((self.members[member], reply["id"]))
        self.log(f"  ready time for {member} at {clock}")
        return clock

    def clear_ready_times(self) -> None:
        for member_id, ready_id in self.added:
            ws(
                {
                    "type": "hot_water_ready/ready_time/remove",
                    "entry_id": self.entry_id,
                    "member_id": member_id,
                    "ready_time_id": ready_id,
                }
            )
        self.added.clear()

    def settle(self) -> None:
        """Between scenarios: no trial ready times, no heat now, relay off, water below target."""
        self.clear_ready_times()
        with contextlib.suppress(RuntimeError):  # nothing to cancel
            ws({"type": "hot_water_ready/heat_now/cancel", "entry_id": self.entry_id})
        call("homeassistant", "turn_off", {"entity_id": RELAY})
        self.water(36.0)
        time.sleep(35)


def scenario_lead(trial: Trial) -> None:
    trial.log("A. A ready time 30 min ahead with the water at 41 C waits for its lead")
    trial.water(41.0)
    time.sleep(35)
    trial.ready_time("Dev", 30)
    # (42 - 41) x 7 + 15 = 22 min of lead: nothing for about 8 min, then heating.
    waited = not trial.wait("heating too early", lambda: state(RELAY) == "on", 4)
    started = trial.wait("heating once the lead says so", lambda: state(RELAY) == "on", 8)
    trial.result("A lead", waited and started, trial.look())


def scenario_window(trial: Trial) -> None:
    trial.log("B. One ready time, water at 36 C")
    trial.water(36.0)
    clock = trial.ready_time("Dev", 15)
    heating = trial.wait("heating", lambda: state(STATUS) == "heating" and state(RELAY) == "on", 2)
    stopped = trial.wait(f"stopped at the band ({trial.stop} C)", trial.at_band, 12)
    ready = state(STATUS) == "ready"
    trial.result("B one window", heating and stopped and ready, f"ready by {clock}: {trial.look()}")


def scenario_cluster(trial: Trial) -> None:
    trial.log("C. Two ready times 15 min apart show as one window in the calendar")
    trial.water(30.0)
    first = trial.ready_time("Dev", 25)
    second = trial.ready_time("Global", 40)
    time.sleep(10)
    now = datetime.now(ZONE)
    end = now + timedelta(hours=2)
    span = f"start={now.isoformat()}&end={end.isoformat()}".replace("+", "%2B")
    events = rest("GET", f"/api/calendars/{CALENDAR}?{span}")
    mine = [e for e in events if first in e.get("description", "")]
    one = len(mine) == 1 and second in mine[0].get("description", "")
    trial.log(f"  calendar: {[(e['summary'], e['description']) for e in events]}")
    trial.result("C calendar", one, f"one window for {first} and {second}: {one}")


def scenario_heat_now(trial: Trial) -> None:
    trial.log("D. Heat now from 38 C")
    trial.water(38.0)
    time.sleep(35)
    call("hot_water_ready", "heat_now", {"heater": trial.entry_id})
    heating = trial.wait("heating", lambda: state(RELAY) == "on", 1)
    done = trial.wait("ready and off", trial.at_band, 8)
    trial.result("D heat now", heating and done, trial.look())


def scenario_fault(trial: Trial) -> None:
    trial.log("E. The water does not rise while heating (physics stopped)")
    call("automation", "turn_off", {"entity_id": PHYSICS})
    trial.water(34.0)
    time.sleep(5)
    call("hot_water_ready", "heat_now", {"heater": trial.entry_id})
    fault = trial.wait(
        "fault raised, relay off", lambda: state(PROBLEM) == "on" and state(RELAY) == "off", 9
    )
    issues = ws({"type": "repairs/list_issues"})["issues"]
    mine = [i for i in issues if i["domain"] == "hot_water_ready" and "not_rising" in i["issue_id"]]
    trial.log(f"  Repairs: {[i['issue_id'] for i in mine]}")
    call("automation", "turn_on", {"entity_id": PHYSICS})
    resolved = False
    if mine:
        flow = rest(
            "POST",
            "/api/repairs/issues/fix",
            {"handler": "hot_water_ready", "issue_id": mine[0]["issue_id"]},
        )
        rest("POST", f"/api/repairs/issues/fix/{flow['flow_id']}", {})
        resolved = trial.wait("cleared after Resolved", lambda: state(PROBLEM) == "off", 1)
    trial.result(
        "E fault",
        fault and bool(mine) and resolved,
        f"Repairs entry and Resolved: {bool(mine)}, {resolved}",
    )


def scenario_restart(trial: Trial) -> None:
    trial.log("F. A restart in the middle of a window")
    trial.water(30.0)
    trial.ready_time("Dev", 20)
    trial.wait("heating", lambda: state(RELAY) == "on", 2)
    time.sleep(60)
    trial.log("  restarting Home Assistant")
    subprocess.run(["docker", "restart", "hwr-testha"], check=True, capture_output=True)  # noqa: S607
    trial.wait("Home Assistant answering", lambda: state(STATUS) == "heating", 4)
    # Home Assistant restores the relay's last state by itself; switch it off by hand, so only
    # the integration, still serving the window, can switch it back on.
    call("homeassistant", "turn_off", {"entity_id": RELAY})
    back = trial.wait("relay switched on again by the integration", lambda: state(RELAY) == "on", 2)
    done = trial.wait("then ready and off", trial.at_band, 15)
    trial.result("F restart", back and done, trial.look())


def report(trial: Trial, path: Path) -> None:
    passed = sum(ok for _, ok, _ in trial.results)
    lines = [
        f"# Trial in the test Home Assistant ({datetime.now(ZONE):%Y-%m-%d})",
        "",
        "Written by `dev/trial.py` in the hot-water-ready repository. Times are in Lisbon time.",
        "The simulated cylinder heats 1 C a minute, much faster than a real one.",
        "",
        f"**{passed} of {len(trial.results)} scenarios passed.**",
        "",
        "| Scenario | Result | What was seen |",
        "|---|---|---|",
        *[f"| {name} | {'pass' if ok else 'FAIL'} | {note} |" for name, ok, note in trial.results],
        "",
        "## What this trial does not cover",
        "",
        "It runs in real time on one day. Daylight-saving days, away with an end date, windows",
        "across midnight and whole clusters heated through are covered by the scenario tests in",
        "`tests/core` and `tests/ha`, which move the clock. Not covered anywhere live: phones (the",
        "test members have none), the solar rule (no sun in the simulation), a power sensor.",
        "",
        "## Timeline",
        "",
        "```",
        *trial.lines,
        "```",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8", newline="\n")


def main() -> int:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "trial-report.md"
    trial = Trial()
    heaters = ws({"type": "hot_water_ready/heaters"})
    trial.entry_id = next(h["entry_id"] for h in heaters if h["name"] == HEATER_NAME)
    before = snapshot(trial.entry_id)
    trial.stop = before["target"] + before["margin"]
    trial.members = {m["name"]: m["id"] for m in before["members"]}
    dev_away = next(m["away"] for m in before["members"] if m["name"] == "Dev")
    automatic = before["automatic"]
    trial.log(f"Before: automatic {automatic}, Dev away {dev_away}, {trial.look()}")
    try:
        call("switch", "turn_on", {"entity_id": AUTOMATIC})
        ws(
            {
                "type": "hot_water_ready/away/set",
                "entry_id": trial.entry_id,
                "member_id": trial.members["Dev"],
                "away": False,
                "until": None,
            }
        )
        for scenario in (
            scenario_lead,
            scenario_window,
            scenario_cluster,
            scenario_heat_now,
            scenario_fault,
            scenario_restart,
        ):
            trial.settle()
            scenario(trial)
    finally:
        trial.settle()
        call("automation", "turn_on", {"entity_id": PHYSICS})
        ws(
            {
                "type": "hot_water_ready/away/set",
                "entry_id": trial.entry_id,
                "member_id": trial.members["Dev"],
                "away": dev_away["on"],
                "until": dev_away["until"],
            }
        )
        call("switch", "turn_on" if automatic else "turn_off", {"entity_id": AUTOMATIC})
        trial.log(f"Put back: automatic {automatic}, Dev away {dev_away}")
        report(trial, out)
        print(f"Report: {out}")
    return 0 if all(ok for _, ok, _ in trial.results) else 1


if __name__ == "__main__":
    sys.exit(main())
