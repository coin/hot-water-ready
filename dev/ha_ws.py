"""Send websocket commands to the test HA: python dev/ha_ws.py '<json>' ['<json>' ...].

Reads the token from dev/testha/config/.token. Prints each reply.
"""

import asyncio
import json
from pathlib import Path
import sys

import websockets

TOKEN = (Path(__file__).parent / "testha" / "config" / ".token").read_text().strip()


async def main(messages: list[dict[str, object]]) -> None:
    async with websockets.connect("ws://localhost:8124/api/websocket", max_size=None) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()
        for n, message in enumerate(messages, start=1):
            await ws.send(json.dumps({"id": n, **message}))
            print(json.dumps(json.loads(await ws.recv()), ensure_ascii=False)[:2000])


asyncio.run(main([json.loads(arg) for arg in sys.argv[1:]]))
