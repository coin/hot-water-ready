import { describe, expect, it } from "vitest";
import { HeaterSubscription } from "../src/subscription";
import type { Hass, HeaterSnapshot, HeaterSummary } from "../src/types";

interface FakeHass extends Hass {
  calls: Record<string, unknown>[];
  subscriptions: { message: Record<string, unknown>; stopped: boolean; push: (s: HeaterSnapshot) => void }[];
}

function fakeHass(heaters: HeaterSummary[], options: { failSubscribe?: boolean; slowWs?: Promise<void> } = {}): FakeHass {
  const hass: FakeHass = {
    calls: [],
    subscriptions: [],
    connection: {
      subscribeMessage<T>(callback: (message: T) => void, message: Record<string, unknown>) {
        const record = { message, stopped: false, push: (s: HeaterSnapshot) => { callback(s as T); } };
        hass.subscriptions.push(record);
        if (options.failSubscribe) return Promise.reject(new Error("not_found"));
        return Promise.resolve(() => {
          record.stopped = true;
          return Promise.resolve();
        });
      },
    },
    async callWS<T>(message: Record<string, unknown>): Promise<T> {
      hass.calls.push(message);
      await options.slowWs;
      return heaters as T;
    },
  };
  return hass;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const cylinder = { entry_id: "e1", name: "Cilindro" };

describe("HeaterSubscription", () => {
  it("asks for the heater list once, however often Home Assistant updates", async () => {
    const hass = fakeHass([cylinder]);
    const subscription = new HeaterSubscription(() => undefined, () => undefined);
    for (let n = 0; n < 5; n++) await subscription.follow(hass, undefined);

    expect(hass.calls).toHaveLength(1);
    expect(hass.subscriptions.map((s) => s.message)).toEqual([
      { type: "hot_water_ready/subscribe", entry_id: "e1" },
    ]);
  });

  it("subscribes once to a configured heater", async () => {
    const hass = fakeHass([]);
    const subscription = new HeaterSubscription(() => undefined, () => undefined);
    await subscription.follow(hass, "e1");
    await subscription.follow(hass, "e1");

    expect(hass.calls).toHaveLength(0);
    expect(hass.subscriptions).toHaveLength(1);
  });

  it("hands each snapshot on", async () => {
    const hass = fakeHass([cylinder]);
    const seen: HeaterSnapshot[] = [];
    const subscription = new HeaterSubscription((s) => seen.push(s), () => undefined);
    await subscription.follow(hass, "e1");
    const snapshot: HeaterSnapshot = {
      ...cylinder,
      temperature: 40,
      target: 42,
      margin: 1,
      status: "waiting",
      ready_in_minutes: null,
      next_heat_start: null,
      solar_aware: false,
      viewer: null,
      can_switch_off: false,
      heating_for: [],
      next_ready: null,
      is_admin: true,
      me: null,
      can_ask_heat_now: true,
      settings: null,
      week: null,
      cluster_warning: null,
      faults: [],
      heat_now_blocked: false,
      not_rising_checked: true,
      element_on: false,
      power_w: null,
      keep_hot_minutes: 5,
      automatic: true,
      heat_now: null,
      today: [],
      members: [],
    };
    hass.subscriptions[0]?.push(snapshot);

    expect(seen).toEqual([snapshot]);
  });

  it("says when there is no heater at all", async () => {
    let missing = false;
    const subscription = new HeaterSubscription(() => undefined, () => { missing = true; });
    await subscription.follow(fakeHass([]), undefined);

    expect(missing).toBe(true);
  });

  it("does not subscribe when stopped while the heater list was loading", async () => {
    let release: () => void = () => undefined;
    const hass = fakeHass([cylinder], { slowWs: new Promise((resolve) => { release = resolve; }) });
    const subscription = new HeaterSubscription(() => undefined, () => undefined);
    const pending = subscription.follow(hass, undefined);
    subscription.stop();
    release();
    await pending;

    expect(hass.subscriptions).toHaveLength(0);
  });

  it("stops the old subscription when the heater changes", async () => {
    const hass = fakeHass([]);
    const subscription = new HeaterSubscription(() => undefined, () => undefined);
    await subscription.follow(hass, "e1");
    await subscription.follow(hass, "e2");
    await flush();

    expect(hass.subscriptions.map((s) => s.stopped)).toEqual([true, false]);
  });

  it("an old failed subscription does not undo a newer one", async () => {
    let missing = 0;
    const failing = fakeHass([], { failSubscribe: true });
    const working = fakeHass([]);
    const subscription = new HeaterSubscription(() => undefined, () => { missing++; });
    // The first reply arrives only after the card has moved on to e2.
    void subscription.follow(failing, "e1");
    void subscription.follow(working, "e2");
    await flush();
    await subscription.follow(working, "e2");

    expect(working.subscriptions).toHaveLength(1);
    expect(missing).toBe(0);
  });
});
