import { describe, expect, it } from "vitest";
import { translations } from "../src/i18n";
import type { HeaterSnapshot, MemberSnapshot } from "../src/types";
import {
  avatarViews,
  faultBanner,
  heatNowActions,
  awayLine,
  greeting,
  heaterView,
  houseToday,
  viewMode,
  readyTimeRows,
  selectedMember,
  sheetIsComplete,
  showsAvatarRow,
  shownMember,
  todayInHouse,
  type ViewContext,
} from "../src/view";

const tiago: MemberSnapshot = {
  id: "m1",
  name: "Tiago",
  colour: "blue",
  can_edit: true,
  virtual: false,
  away: { on: false, until: null },
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
  can_ask_heat_now: true,
  faults: [],
  heat_now_blocked: false,
  automatic: true,
  heat_now: null,
  today: [],
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

  it("knows tomorrow on the night the clocks go back (a 25-hour day)", () => {
    // Sunday 25 October 2026 in Lisbon is 25 hours long: just after midnight, now + 24 h is
    // still Sunday, yet Monday 07:00 is tomorrow. Once it is Monday, it is today.
    const late: ViewContext = { ...pt, now: new Date("2026-10-26T00:30:00Z") };
    const sunday: ViewContext = { ...pt, now: new Date("2026-10-25T00:10:00+01:00") };
    const next = { at: "2026-10-26T07:00:00+00:00", members: ["m1"] };
    expect(heaterView({ ...cold, next_ready: next }, sunday).headline).toBe("Pronta às 07:00 de amanhã");
    expect(heaterView({ ...cold, next_ready: next }, late).headline).toBe("Pronta às 07:00");
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

describe("selectedMember", () => {
  it("opens on the viewer's own member", () => {
    expect(selectedMember({ ...cold, me: "m2" }, undefined)?.id).toBe("m2");
  });

  it("opens on the first member for an admin who is not a member", () => {
    expect(selectedMember({ ...cold, me: null }, undefined)?.id).toBe("m1");
  });

  it("keeps the member the viewer picked", () => {
    expect(selectedMember(cold, "m2")?.id).toBe("m2");
  });

  it("falls back when the picked member was removed", () => {
    expect(selectedMember(cold, "gone")?.id).toBe("m1");
  });

  it("has nothing to open without members", () => {
    expect(selectedMember({ ...cold, me: null, members: [] }, undefined)).toBeUndefined();
  });
});

describe("showsAvatarRow", () => {
  it("always shows it to administrators, who add members from it", () => {
    expect(showsAvatarRow({ ...cold, members: [tiago] })).toBe(true);
  });

  it("never shows it to a member, who sees their own list", () => {
    expect(showsAvatarRow({ ...cold, is_admin: false, me: "m2" })).toBe(false);
  });

  it("shows it to anyone else only when there is someone to switch to", () => {
    const viewer = { ...cold, is_admin: false, me: null };
    expect(showsAvatarRow(viewer)).toBe(true);
    expect(showsAvatarRow({ ...viewer, members: [tiago] })).toBe(false);
  });
});

describe("shownMember", () => {
  it("shows a member their own list whatever was picked", () => {
    expect(shownMember({ ...cold, is_admin: false, me: "m2" }, "m1")?.id).toBe("m2");
  });

  it("shows an administrator the member picked", () => {
    expect(shownMember(cold, "m2")?.id).toBe("m2");
  });
});

describe("todayInHouse", () => {
  it("is the house's date, for the earliest last day away", () => {
    expect(todayInHouse({ ...pt, now: new Date("2026-11-02T23:30:00Z") })).toBe("2026-11-02");
    expect(todayInHouse({ ...pt, now: new Date("2026-07-01T23:30:00Z") })).toBe("2026-07-02");
  });
});

describe("sheetIsComplete", () => {
  it("needs a time and at least one day", () => {
    expect(sheetIsComplete({ time: "07:00", weekdays: [0] })).toBe(true);
    expect(sheetIsComplete({ time: "", weekdays: [0] })).toBe(false);
    expect(sheetIsComplete({ time: "07:00", weekdays: [] })).toBe(false);
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

describe("viewMode", () => {
  it("gives administrators the whole household", () => {
    expect(viewMode(cold)).toBe("admin");
  });

  it("gives a member their own view", () => {
    expect(viewMode({ ...cold, is_admin: false, me: "m2" })).toBe("member");
  });

  it("shows the house read-only to someone who is neither", () => {
    expect(viewMode({ ...cold, is_admin: false, me: null })).toBe("viewer");
  });
});

describe("avatarViews", () => {
  const global: MemberSnapshot = { ...tiago, id: "g", name: "global", virtual: true };
  const away: MemberSnapshot = { ...maria, away: { on: true, until: null } };

  it("stars virtual members and fades away ones", () => {
    const views = avatarViews({ ...cold, members: [tiago, away, global] }, "m1");
    expect(views.map((v) => [v.initial, v.star, v.faded, v.selected])).toEqual([
      ["T", false, false, true],
      ["M", false, true, false],
      ["G", true, false, false],
    ]);
  });
});

describe("greeting", () => {
  it("greets the member by name", () => {
    expect(greeting({ ...cold, is_admin: false, me: "m2" }, "pt")).toBe("Olá, Maria");
    expect(greeting({ ...cold, is_admin: false, me: "m2" }, "en")).toBe("Hello, Maria");
  });
});

describe("houseToday", () => {
  const today = [
    { member: "m1", at: "2026-11-02T07:00:00+00:00" },
    { member: "m2", at: "2026-11-02T07:30:00+00:00" },
    { member: "m1", at: "2026-11-02T21:00:00+00:00" },
  ];

  it("lists everyone else's times today in the house's time zone", () => {
    expect(houseToday({ ...cold, me: "m2", today }, pt, "m2")).toBe("Tiago 07:00 · Tiago 21:00");
  });

  it("says when nobody else wants water today", () => {
    expect(houseToday({ ...cold, me: "m1", today: [] }, pt, "m1")).toBe("Mais ninguém hoje");
    expect(houseToday({ ...cold, me: "m1", today: [] }, en, "m1")).toBe("Nobody else today");
  });
});

describe("awayLine", () => {
  it("says nothing while the member is home", () => {
    expect(awayLine(tiago, pt)).toBe("");
  });

  it("says away without an end date", () => {
    expect(awayLine({ ...tiago, away: { on: true, until: null } }, pt)).toBe("Ausente");
  });

  it("names the last day away", () => {
    expect(awayLine({ ...tiago, away: { on: true, until: "2026-11-04" } }, pt)).toBe("Ausente até 4 de Novembro");
    expect(awayLine({ ...tiago, away: { on: true, until: "2026-11-04" } }, en)).toBe("Away until 4 November");
  });
});

describe("heatNowActions", () => {
  it("offers to heat now when nothing is running", () => {
    expect(heatNowActions(cold)).toEqual([
      { command: "hot_water_ready/heat_now/start", label: "heat_now.start", primary: true },
    ]);
  });

  it("offers to cancel to someone who asked", () => {
    const asked = { ...cold, heat_now: { requesters: ["m1"], asked: true, can_cancel: true } };
    expect(heatNowActions(asked)).toEqual([
      { command: "hot_water_ready/heat_now/cancel", label: "heat_now.cancel", primary: true },
    ]);
  });

  it("offers to be told too to someone who did not ask", () => {
    const other = { ...cold, heat_now: { requesters: ["m2"], asked: false, can_cancel: false } };
    expect(heatNowActions(other)).toEqual([
      { command: "hot_water_ready/heat_now/start", label: "heat_now.join", primary: true },
    ]);
  });

  it("also offers an administrator to cancel someone else's request", () => {
    const other = { ...cold, heat_now: { requesters: ["m2"], asked: false, can_cancel: true } };
    expect(heatNowActions(other)).toEqual([
      { command: "hot_water_ready/heat_now/start", label: "heat_now.join", primary: true },
      { command: "hot_water_ready/heat_now/cancel", label: "heat_now.cancel", primary: false },
    ]);
  });

  it("offers nothing to ask to someone who may not ask, but still lets them cancel if allowed", () => {
    const viewer = { ...cold, can_ask_heat_now: false };
    expect(heatNowActions(viewer)).toEqual([]);
    const running = { ...viewer, heat_now: { requesters: ["m2"], asked: false, can_cancel: true } };
    expect(heatNowActions(running)).toEqual([
      { command: "hot_water_ready/heat_now/cancel", label: "heat_now.cancel", primary: false },
    ]);
  });
});

describe("faultBanner", () => {
  it("says nothing when all is well", () => {
    expect(faultBanner(cold, "pt")).toEqual([]);
  });

  it("names each fault in plain words", () => {
    const broken = { ...cold, faults: ["not_rising", "relay_stuck"] as HeaterSnapshot["faults"] };
    expect(faultBanner(broken, "pt")).toEqual([
      "Avaria: a água não aquece. O aquecimento parou; veja as Reparações.",
      "Avaria: o aquecedor consome energia com o relé desligado. Verifique o relé.",
    ]);
  });
});

describe("heatNowActions during a fault", () => {
  it("offers nothing to ask while a fault stops heating", () => {
    expect(heatNowActions({ ...cold, heat_now_blocked: true })).toEqual([]);
  });

  it("still lets someone cancel a request that was running when the fault came", () => {
    const running = { ...cold, heat_now_blocked: true, heat_now: { requesters: ["m1"], asked: true, can_cancel: true } };
    expect(heatNowActions(running)).toEqual([
      { command: "hot_water_ready/heat_now/cancel", label: "heat_now.cancel", primary: true },
    ]);
  });
});
