// The compact card (issue 17): what it shows for a private member's heating, from the snapshots
// the heater really sends. `tests/ha/test_compact_card_snapshots.py` makes them and keeps them
// in fixtures/compact-private.json, failing when they change.

import { describe, expect, it } from "vitest";
import { translations } from "../src/i18n";
import fixtureJson from "./fixtures/compact-private.json";
import type { HeaterSnapshot } from "../src/types";
import {
  DEFAULT_TAP_ACTION,
  TAP_ACTIONS,
  compactView,
  editedConfig,
  heaterView,
  tapActionOf,
  type CompactView,
  type ViewContext,
} from "../src/view";

type Case = "ready_time" | "heat_now" | "shared";
type Viewer = "admin" | "member";
const fixture = fixtureJson as unknown as Record<Case, Record<Viewer, HeaterSnapshot>>;

/** Monday 2 November 2026 at 05:00 in Lisbon, the moment the snapshots were made. */
function context(language = "en"): ViewContext {
  return {
    language,
    timeZone: "Europe/Lisbon",
    now: new Date("2026-11-02T05:00:00Z"),
    people: { "person.tiago": "Tiago", "person.maria": "Maria" },
    hour24: true,
  };
}

/** Every text the compact card puts on screen. */
function shown(view: CompactView): string {
  return [view.name, view.temperature, view.target, view.badge, view.headline, ...view.lines].join(" | ");
}

const CASES: Case[] = ["ready_time", "heat_now"];
const LANGUAGES = Object.keys(translations);

describe("the compact card with a private member heating", () => {
  it.each(CASES)("shows a plain member no trace of it (%s), in every language", (name) => {
    const snapshot = fixture[name].member;
    for (const language of LANGUAGES) {
      const view = compactView(snapshot, context(language));
      const text = shown(view);
      expect(text, language).not.toContain("Tiago");
      expect(text, language).not.toMatch(/2\D?739/);
      expect(view.tone, language).not.toBe("heating");
      expect(view.badge, language).not.toBe(translations[language as keyof typeof translations]["status.heating"].toLocaleUpperCase());
    }
  });

  it("names only the plain member's own ready time in a window shared with the private one", () => {
    for (const language of LANGUAGES) {
      const view = compactView(fixture.shared.member, context(language));
      expect(view.tone, language).toBe("heating");
      expect(shown(view), language).toContain("Maria");
      expect(shown(view), language).not.toContain("Tiago");
      expect(shown(view), language).not.toMatch(/2\D?739/);
    }
    const admin = shown(compactView(fixture.shared.admin, context()));
    expect(admin).toContain("Maria");
    expect(admin).toContain("Tiago");
  });

  it("shows the plain member the water as it is: idle, 37.5 against 42", () => {
    const view = compactView(fixture.ready_time.member, context());
    expect(view).toMatchObject({ temperature: "37.5°", target: "target 42°", badge: "IDLE", headline: "Idle", lines: [] });
  });

  it("shows the admin the private ready time it heats for, the element and its power", () => {
    const view = compactView(fixture.ready_time.admin, context());
    expect(view.badge).toBe("HEATING");
    expect(view.tone).toBe("heating");
    expect(view.headline).toBe("Heating: ready in about 32 min");
    expect(view.lines[0]).toContain("Tiago");
    expect(view.lines[0]).toContain("05:45");
    expect(view.lines).toContain("Heater on · drawing 2,739 W");
  });

  it("shows the admin the private heat now", () => {
    const view = compactView(fixture.heat_now.admin, context());
    expect(view.badge).toBe("HEATING");
    expect(shown(view)).toContain("Tiago");
    expect(view.lines).toContain("Heater on · drawing 2,739 W");
  });

  it.each(CASES.flatMap((name) => (["admin", "member"] as Viewer[]).map((viewer) => [name, viewer] as const)))(
    "says what the full card's top block says (%s, %s)",
    (name, viewer) => {
      const snapshot = fixture[name][viewer];
      const full = heaterView(snapshot, context());
      const compact = compactView(snapshot, context());
      expect(compact).toMatchObject({
        temperature: full.temperature,
        target: full.target,
        badge: full.badge,
        headline: full.headline,
        fill: full.fill,
        tone: full.tone,
      });
      expect(compact.lines).toEqual([full.subline, full.element, full.keepHot].filter((line) => line !== ""));
    },
  );
});

describe("the compact card's tap and editor", () => {
  it("does nothing on a tap unless told", () => {
    expect(tapActionOf({ type: "custom:hot-water-ready-card", compact: true })).toEqual(DEFAULT_TAP_ACTION);
    expect(DEFAULT_TAP_ACTION.action).toBe("none");
  });

  it("passes a configured tap action on as it is", () => {
    const tap = { action: "navigate", navigation_path: "/dashboard-home/showers" };
    expect(tapActionOf({ type: "custom:hot-water-ready-card", compact: true, tap_action: tap })).toBe(tap);
  });

  it("does not offer more-info, which would open the status sensor", () => {
    expect(TAP_ACTIONS).not.toContain("more-info");
    expect(TAP_ACTIONS).toContain("navigate");
  });

  it("drops the tap action when compact is switched off in the editor", () => {
    const tap = { action: "navigate", navigation_path: "/x" };
    expect(editedConfig({ type: "t", entry_id: "e", compact: false, tap_action: tap })).toEqual({ type: "t", entry_id: "e" });
    expect(editedConfig({ type: "t", compact: true, tap_action: tap })).toEqual({ type: "t", compact: true, tap_action: tap });
  });
});
