import { describe, expect, it } from "vitest";
import { translations } from "../src/i18n";
import type { HeaterSnapshot, MemberSnapshot } from "../src/types";
import { defaultMemberId, heaterView, readyTimeRows, type ViewContext } from "../src/view";

const tiago: MemberSnapshot = {
  id: "m1",
  name: "Tiago",
  colour: "blue",
  can_edit: true,
  next_ready: null,
  ready_times: [],
};
const maria: MemberSnapshot = { ...tiago, id: "m2", name: "Maria", colour: "green", can_edit: false };

const cold: HeaterSnapshot = {
  entry_id: "abc",
  name: "Cilindro",
  temperature: 39.6,
  target: 42,
  margin: 1,
  status: "waiting",
  ready_in_minutes: null,
  next_ready: null,
  is_admin: true,
  me: "m1",
  members: [tiago, maria],
};

// Monday 2 November 2026, 05:00 in Lisbon.
const pt: ViewContext = { language: "pt", timeZone: "Europe/Lisbon", now: new Date("2026-11-02T05:00:00Z") };
const en: ViewContext = { ...pt, language: "en" };

describe("heaterView", () => {
  it("shows the temperature with a Portuguese decimal comma", () => {
    expect(heaterView(cold, pt).temperature).toBe("39,6°");
  });

  it("shows the temperature with an English decimal point", () => {
    expect(heaterView(cold, en).temperature).toBe("39.6°");
  });

  it("names the target", () => {
    expect(heaterView(cold, pt).target).toBe("alvo 42 °C");
    expect(heaterView(cold, en).target).toBe("target 42 °C");
  });

  it("says the water is waiting when nothing is coming", () => {
    expect(heaterView(cold, pt).headline).toBe("Em espera");
  });

  it("says when the water will be ready today", () => {
    const view = heaterView({ ...cold, next_ready: { at: "2026-11-02T07:00:00+00:00", members: ["m1"] } }, pt);
    expect(view.headline).toBe("Pronta às 07:00");
  });

  it("says when the water will be ready tomorrow", () => {
    const next = { at: "2026-11-03T07:00:00+00:00", members: ["m1"] };
    expect(heaterView({ ...cold, next_ready: next }, pt).headline).toBe("Pronta às 07:00 de amanhã");
    expect(heaterView({ ...cold, next_ready: next }, en).headline).toBe("Ready at 07:00 tomorrow");
  });

  it("names the weekday further ahead", () => {
    const next = { at: "2026-11-05T07:30:00+00:00", members: ["m1"] };
    expect(heaterView({ ...cold, next_ready: next }, pt).headline).toBe("Pronta às 07:30 de quinta-feira");
    expect(heaterView({ ...cold, next_ready: next }, en).headline).toBe("Ready at 07:30 on Thursday");
  });

  it("reads the time in the house's time zone, not the browser's", () => {
    // 07:00 UTC is 08:00 in Lisbon in summer.
    const summer: ViewContext = { ...pt, now: new Date("2026-07-01T05:00:00Z") };
    const next = { at: "2026-07-01T07:00:00+00:00", members: ["m1"] };
    expect(heaterView({ ...cold, next_ready: next }, summer).headline).toBe("Pronta às 08:00");
  });

  it("says how long heating will take", () => {
    const view = heaterView({ ...cold, status: "heating", ready_in_minutes: 15 }, pt);
    expect(view.headline).toBe("A aquecer: pronta em cerca de 15 min");
    expect(view.tone).toBe("heating");
  });

  it("says heating without a time when it is past the target", () => {
    expect(heaterView({ ...cold, status: "heating" }, en).headline).toBe("Heating");
  });

  it("says the water is ready, and when it is next wanted", () => {
    const view = heaterView(
      { ...cold, temperature: 42.3, status: "ready", next_ready: { at: "2026-11-03T07:00:00+00:00", members: ["m1"] } },
      pt,
    );
    expect(view.headline).toBe("Pronta");
    expect(view.subline).toBe("Próxima às 07:00 de amanhã");
    expect(view.tone).toBe("ready");
  });

  it("fills the ring in proportion to the target, never past full", () => {
    expect(heaterView(cold, en).fill).toBeCloseTo(39.6 / 42);
    expect(heaterView({ ...cold, temperature: 55 }, en).fill).toBe(1);
  });

  it("shows a dash and an empty ring without a reading", () => {
    const view = heaterView({ ...cold, temperature: null }, pt);
    expect(view.temperature).toBe("–");
    expect(view.fill).toBe(0);
  });

  it("falls back to English for other languages", () => {
    expect(heaterView(cold, { ...pt, language: "de" }).headline).toBe("Waiting");
  });

  it("uses European Portuguese for Brazilian Portuguese too", () => {
    expect(heaterView(cold, { ...pt, language: "pt-BR" }).headline).toBe("Em espera");
  });
});

describe("defaultMemberId", () => {
  it("opens on the viewer's own member", () => {
    expect(defaultMemberId({ ...cold, me: "m2" })).toBe("m2");
  });

  it("opens on the first member for an admin who is not a member", () => {
    expect(defaultMemberId({ ...cold, me: null })).toBe("m1");
  });

  it("has nothing to open without members", () => {
    expect(defaultMemberId({ ...cold, me: null, members: [] })).toBeUndefined();
  });
});

describe("readyTimeRows", () => {
  const weekdays = { ...tiago, ready_times: [{ id: "r1", time: "07:00", weekdays: [0, 1, 2, 3, 4], enabled: true }] };

  it("lights the weekday letters a ready time applies to, Monday first", () => {
    const [row] = readyTimeRows(weekdays, "pt");
    expect(row?.days.map((d) => d.letter).join("")).toBe("STQQSSD");
    expect(row?.days.map((d) => d.on)).toEqual([true, true, true, true, true, false, false]);
  });

  it("uses English letters in English", () => {
    const [row] = readyTimeRows(weekdays, "en");
    expect(row?.days.map((d) => d.letter).join("")).toBe("MTWTFSS");
  });

  it("lists ready times by time of day", () => {
    const two = {
      ...tiago,
      ready_times: [
        { id: "late", time: "20:00", weekdays: [0], enabled: true },
        { id: "early", time: "07:30", weekdays: [0], enabled: false },
      ],
    };
    expect(readyTimeRows(two, "pt").map((r) => [r.id, r.time, r.enabled])).toEqual([
      ["early", "07:30", false],
      ["late", "20:00", true],
    ]);
  });
});

describe("translations", () => {
  it("has every English text in Portuguese", () => {
    expect(Object.keys(translations.pt).sort()).toEqual(Object.keys(translations.en).sort());
  });
});
