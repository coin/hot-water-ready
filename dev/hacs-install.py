"""Install a GitHub release of the integration through HACS in the test HA, and check it loads.

    dev/testha.sh --hacs
    python dev/hacs-install.py [v0.1.1]     # left out: the latest release

Sets HACS up first if the test HA has none: its setup prints a code to enter at
https://github.com/login/device, which the owner approves, and waits up to 15 minutes. Then adds
the repository, downloads the release, restarts Home Assistant and checks that every heater
entry loads, that no heater entity is unavailable, and that the card served is the one in the
checkout. Afterwards `dev/testha.sh` puts the checkout back.
"""

import asyncio
import io
import json
from pathlib import Path
import subprocess
import sys
import time
from typing import Any
import urllib.request
import zipfile

import websockets

HERE = Path(__file__).parent
CONFIG = HERE / "testha" / "config"
TOKEN = (CONFIG / ".token").read_text().strip()
BASE = "http://localhost:8124"
REPOSITORY = "coin/hot-water-ready"
HACS_ZIP = "https://github.com/hacs/integration/releases/latest/download/hacs.zip"
CARD = (
    HERE.parent / "custom_components" / "hot_water_ready" / "frontend" / "hot-water-ready-card.js"
)


def rest(method: str, path: str, body: object | None = None, *, raw: bool = False) -> Any:
    """One REST call to the test HA; the parsed JSON reply, or the bytes with raw."""
    request = urllib.request.Request(  # noqa: S310 - a fixed local address
        f"{BASE}{path}",
        method=method,
        data=None if body is None else json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=60) as reply:  # noqa: S310
        text = reply.read()
    return text if raw else (json.loads(text) if text else None)


def restart() -> None:
    subprocess.run(["docker", "restart", "hwr-testha"], check=True, capture_output=True)  # noqa: S607
    for _ in range(90):
        try:
            rest("GET", "/api/")
            break
        except OSError:
            time.sleep(2)
    else:
        sys.exit("Home Assistant did not come back")
    time.sleep(15)  # config entries finish loading after the API answers


def entries(domain: str) -> list[dict[str, Any]]:
    return [e for e in rest("GET", "/api/config/config_entries/entry") if e["domain"] == domain]


def set_up_hacs() -> None:
    target = CONFIG / "custom_components" / "hacs"
    if not target.exists():
        print("Downloading HACS from its latest GitHub release")
        with urllib.request.urlopen(HACS_ZIP, timeout=120) as reply:
            zipfile.ZipFile(io.BytesIO(reply.read())).extractall(target)
        restart()
    if entries("hacs"):
        return
    flow = rest("POST", "/api/config/config_entries/flow", {"handler": "hacs"})
    # HACS's four acknowledgements (logs, add-ons, untested, how to disable it).
    answers = {f["name"]: True for f in flow["data_schema"] if f["type"] == "boolean"}
    flow = rest("POST", f"/api/config/config_entries/flow/{flow['flow_id']}", answers)
    code = flow["description_placeholders"]["code"]
    print(f"Enter {code} at https://github.com/login/device to let HACS use GitHub")
    for _ in range(90):
        time.sleep(10)
        flow = rest("GET", f"/api/config/config_entries/flow/{flow['flow_id']}")
        if flow["type"] != "progress":
            break
    if flow["type"] != "create_entry":
        sys.exit(f"HACS was not set up: {flow}")


async def download(version: str | None) -> str:
    """Add the repository to HACS and download a release; the version downloaded."""
    async with websockets.connect(f"{BASE.replace('http', 'ws')}/api/websocket") as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()
        sent = 0

        async def send(message: dict[str, Any]) -> Any:
            nonlocal sent
            sent += 1
            await ws.send(json.dumps({"id": sent, **message}))
            while True:  # HACS also sends events on this connection
                reply = json.loads(await ws.recv())
                if reply.get("id") == sent and reply["type"] == "result":
                    if not reply["success"]:
                        raise RuntimeError(reply)
                    return reply["result"]

        await send(
            {"type": "hacs/repositories/add", "repository": REPOSITORY, "category": "integration"}
        )
        for _ in range(30):
            found = [
                r
                for r in await send({"type": "hacs/repositories/list"})
                if r["full_name"].lower() == REPOSITORY
            ]
            if found and found[0].get("available_version"):
                break
            await asyncio.sleep(2)
        else:
            raise RuntimeError(f"HACS did not list {REPOSITORY}")
        version = version or found[0]["available_version"]
        await send(
            {"type": "hacs/repository/download", "repository": found[0]["id"], "version": version}
        )
        return str(version)


def main() -> None:
    if _checkout_mounted():
        sys.exit("The checkout is mounted over the integration: start with dev/testha.sh --hacs")
    set_up_hacs()
    version = asyncio.run(download(sys.argv[1] if len(sys.argv) > 1 else None))
    print(f"Downloaded {version} through HACS; restarting")
    restart()
    heaters = entries("hot_water_ready")
    states = rest("GET", "/api/states")
    unavailable = [
        s["entity_id"]
        for s in states
        if s["state"] == "unavailable"
        and s["entity_id"].split(".", 1)[1].startswith(tuple(h["title"].lower() for h in heaters))
    ]
    served = rest("GET", "/hot_water_ready/hot-water-ready-card.js", raw=True)
    installed = json.loads(
        (CONFIG / "custom_components" / "hot_water_ready" / "manifest.json").read_text()
    )["version"]
    checks = {
        f"manifest says {installed}": f"v{installed}" == version,
        "every heater loaded": bool(heaters) and all(h["state"] == "loaded" for h in heaters),
        "no heater entity unavailable": not unavailable,
        "the card served is the checkout's": served == CARD.read_bytes(),
    }
    for name, ok in checks.items():
        print(f"{'ok  ' if ok else 'FAIL'} {name}")
    if unavailable:
        print("unavailable:", ", ".join(unavailable))
    print("Put the checkout back with dev/testha.sh")
    sys.exit(0 if all(checks.values()) else 1)


def _checkout_mounted() -> bool:
    mounts = subprocess.run(
        ["docker", "inspect", "hwr-testha", "--format", "{{json .Mounts}}"],  # noqa: S607
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    return any(m["Destination"].endswith("/hot_water_ready") for m in json.loads(mounts))


if __name__ == "__main__":
    main()
