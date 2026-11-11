import { describe, expect, it } from "vitest";
import { localeOf, pickLanguage, translations } from "../src/i18n";
import type { AdminSettings, HeaterSnapshot, MemberSnapshot, RateInfo } from "../src/types";
import {
  avatarViews,
  faultBanner,
  heatNowActions,
  choosesKeepTime,
  keepHotChoices,
  heatNowTargetField,
  heatNowTargetHint,
  heatNowTargetStart,
  heatNowTargetStepper,
  awayLine,
  privacySwitch,
  greeting,
  heaterView,
  houseTodayChips,
  listHeader,
  newSheet,
  editSheet,
  switchOffPeopleWith,
  peopleOf,
  switchOffSheet,
  switchOffShown,
  viewMode,
  readyTimeRows,
  selectedMember,
  sheetIsComplete,
  showsAvatarRow,
  rateView,
  settingsView,
  shownMember,
  solarLine,
  todayInHouse,
  clusterWarning,
  weekView,
  openClock,
  dialMarks,
  dialMarkOn,
  dialHand,
  dialPick,
  dialStep,
  clockHalf,
  clockTime,
  typedTime,
  switchClockMode,
  DIAL_SIZE,
  uses24Hours,
  wallTime,
  weekHint,
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
  visibility: "public",
  can_set_visibility: true,
};
const maria: MemberSnapshot = { ...tiago, id: "m2", name: "Maria", colour: "green", can_edit: false };

const learnedRate: RateInfo = {
  used: 5.3,
  source: "learned",
  manual: null,
  learned: 5.3,
  default: 7,
  physics: 7.61,
  physics_fast: 7.61,
  tank_litres: 300,
  runs: [
    { at: "2026-11-01T21:16:00+00:00", rate: 5.86 },
    { at: "2026-11-02T04:10:00+00:00", rate: 5.1 },
    { at: "2026-10-31T20:42:00+00:00", rate: 5.5 },
  ],
  window_days: 7,
  min_runs: 3,
  lead_margin_minutes: 15,
  lead_cap_minutes: 240,
};

const settingsOff: AdminSettings = {
  switch_off_people: [],
  solar_aware: false,
  rate: learnedRate,
  solar: { windows: 0, on_time: 0, minutes_saved: 0, kwh: null, solar_windows: 0, solar_on_time: 0 },
};

const cold: HeaterSnapshot = {
  entry_id: "abc",
  name: "Cilindro",
  temperature: 39.6,
  target: 42,
  margin: 1,
  status: "waiting",
  ready_in_minutes: null,
  next_heat_start: null,
  solar_aware: false,
  next_ready: null,
  is_admin: true,
  me: "m1",
  can_ask_heat_now: true,
  can_choose_heat_now_target: true,
  faults: [],
  heat_now_blocked: false,
  not_rising_checked: true,
  element_on: false,
  power_w: 0,
  keep_hot_minutes: 5,
  automatic: true,
  heat_now: null,
  viewer: "m1",
  can_switch_off: true,
  heating_for: [],
  settings: settingsOff,
  week: null,
  cluster_warning: null,
  today: [],
  members: [tiago, maria],
};

// Monday 2 November 2026, 05:00 in Lisbon.
const pt: ViewContext = {
  language: "pt",
  timeZone: "Europe/Lisbon",
  now: new Date("2026-11-02T05:00:00Z"),
  people: { "person.ana": "Ana", "person.rui": "Rui" },
};
const en: ViewContext = { ...pt, language: "en" };

describe("heaterView", () => {
  it("shows the heater on and what it draws, like version 1's card", () => {
    const on = { ...cold, element_on: true, power_w: 2790.4 };
    expect(heaterView(on, pt).element).toBe("Resistência ligada · a consumir 2790 W");
    expect(heaterView(on, en).element).toBe("Heater on · drawing 2,790 W");
  });

  it("shows the heater off with what it draws", () => {
    expect(heaterView(cold, pt).element).toBe("Resistência desligada · a consumir 0 W");
  });

  it("leaves the watts out without a power sensor", () => {
    expect(heaterView({ ...cold, element_on: true, power_w: null }, pt).element).toBe("Resistência ligada");
  });

  it("shows no heater line when Home Assistant cannot tell whether it heats", () => {
    expect(heaterView({ ...cold, element_on: null, power_w: null }, pt).element).toBe("");
  });

  it("says until when it keeps the water hot after the message", () => {
    const keeping = {
      ...cold,
      heat_now: {
        requesters: ["m1"],
        asked: true,
        unnamed: false,
        keep_until: "2026-11-02T18:25:00+00:00",
        target: 42,
      },
    };
    expect(heaterView(keeping, pt).keepHot).toBe("A manter a água quente até às 18:25");
    expect(heaterView(keeping, en).keepHot).toBe("Keeping hot until 18:25");
  });

  it("says nothing about keeping it hot before the message", () => {
    const asked = { ...cold, heat_now: { requesters: ["m1"], asked: true, unnamed: false, keep_until: null, target: null } };
    expect(heaterView(asked, pt).keepHot).toBe("");
    expect(heaterView(cold, pt).keepHot).toBe("");
  });

  it("shows the temperature with a Portuguese decimal comma", () => {
    expect(heaterView(cold, pt).temperature).toBe("39,6°");
  });

  it("shows the temperature with an English decimal point", () => {
    expect(heaterView(cold, en).temperature).toBe("39.6°");
  });

  it("names the target", () => {
    expect(heaterView(cold, pt).target).toBe("alvo 42°");
    expect(heaterView(cold, en).target).toBe("target 42°");
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

  it("says when heating is planned to start", () => {
    const waiting = { ...cold, next_heat_start: "2026-11-02T19:25:00+00:00" };
    expect(heaterView(waiting, pt).subline).toBe("Começa a aquecer por volta das 19:25.");
    expect(heaterView(waiting, en).subline).toBe("Starts heating around 19:25.");
  });

  it("allows for the sun when the solar-aware rule is on", () => {
    const sunny = { ...cold, next_heat_start: "2026-11-03T07:00:00+00:00", solar_aware: true };
    expect(heaterView(sunny, pt).subline).toBe("Começa a aquecer por volta das 07:00 de amanhã, se o sol não chegar.");
    expect(heaterView(sunny, en).subline).toBe("Starts heating around 07:00 tomorrow, if the sun has not done it by then.");
  });

  it("names who asked for heat now while heating", () => {
    const one = { ...cold, status: "heating" as const, heat_now: { requesters: ["m2"], asked: false, unnamed: false, keep_until: null, target: null } };
    expect(heaterView(one, pt).subline).toBe("Pedido por Maria. Recebe um aviso quando estiver pronta.");
    expect(heaterView(one, en).subline).toBe("Asked for by Maria. They are told when it is ready.");
    const two = { ...one, heat_now: { ...one.heat_now, requesters: ["m2", "person.ana"] } };
    expect(heaterView(two, pt).subline).toBe("Pedido por Maria e Ana. Cada um é avisado quando estiver pronta.");
    expect(heaterView(two, en).subline).toBe("Asked for by Maria and Ana. Each is told when it is ready.");
  });

  it("says whose ready time it is heating for", () => {
    const heating = {
      ...cold,
      status: "heating" as const,
      heating_for: [
        { member: "m2", at: "2026-11-02T07:00:00+00:00" },
        { member: "m1", at: "2026-11-02T07:30:00+00:00" },
      ],
    };
    expect(heaterView(heating, pt).subline).toBe("Para Maria às 07:00 e Tiago às 07:30.");
    expect(heaterView(heating, en).subline).toBe("For Maria at 07:00 and Tiago at 07:30.");
  });

  it("shows the status as a badge", () => {
    expect(heaterView(cold, pt).badge).toBe("EM ESPERA");
    expect(heaterView({ ...cold, status: "heating" }, pt).badge).toBe("A AQUECER");
    expect(heaterView({ ...cold, status: "manual" }, en).badge).toBe("MANUAL");
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

  it("falls back to English for a language it does not have", () => {
    expect(heaterView(cold, { ...pt, language: "ko" }).headline).toBe("Idle");
  });

  it("speaks each language it has, Brazilian Portuguese apart from European", () => {
    expect(heaterView(cold, { ...pt, language: "de" }).headline).toBe(translations.de["status.waiting"]);
    expect(heaterView(cold, { ...pt, language: "pt-BR" }).headline).toBe(translations["pt-BR"]["status.waiting"]);
    expect(translations["pt-BR"]).not.toBe(translations.pt);
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
  const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

  it.each(Object.keys(translations))("%s has every English text, with the same placeholders", (code) => {
    const texts = translations[code as keyof typeof translations];
    expect(Object.keys(texts).sort()).toEqual(Object.keys(translations.en).sort());
    for (const [key, english] of Object.entries(translations.en)) {
      expect([key, placeholders(texts[key as keyof typeof texts])]).toEqual([key, placeholders(english)]);
    }
    expect(texts["weekday.letters"].split(",")).toHaveLength(7);
  });

  it("picks the language Home Assistant names, or its family", () => {
    expect(pickLanguage("pt")).toBe("pt");
    expect(pickLanguage("pt-BR")).toBe("pt-BR");
    expect(pickLanguage("de-CH")).toBe("de");
    expect(pickLanguage("nn")).toBe("nb");
    expect(pickLanguage("zh-Hant")).toBe("zh-Hans");
    expect(pickLanguage("ko")).toBe("en");
    expect(localeOf("pt-BR")).toBe("pt-BR");
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

describe("houseTodayChips", () => {
  const today = [
    { member: "m1", at: "2026-11-02T07:00:00+00:00" },
    { member: "m2", at: "2026-11-02T07:30:00+00:00" },
    { member: "m1", at: "2026-11-02T21:00:00+00:00" },
  ];

  it("lists the house's times today, the member's own as you (mockup A)", () => {
    expect(houseTodayChips({ ...cold, me: "m2", today }, pt, "m2")).toEqual([
      { name: "Tiago", time: "07:00", colour: "blue", mine: false },
      { name: "Você", time: "07:30", colour: "green", mine: true },
      { name: "Tiago", time: "21:00", colour: "blue", mine: false },
    ]);
    expect(houseTodayChips({ ...cold, me: "m2", today }, en, "m2")[1]?.name).toBe("You");
  });

  it("is empty when nobody wants water today, and says so", () => {
    expect(houseTodayChips({ ...cold, today: [] }, pt, "m1")).toEqual([]);
    expect(translations.pt["today.nobody"]).toBe("Ninguém hoje");
    expect(translations.en["today.nobody"]).toBe("Nobody today");
  });
});

describe("listHeader", () => {
  it("counts the member's ready times", () => {
    const one = { ...tiago, ready_times: [{ id: "a", time: "07:00", weekdays: [0], enabled: true }] };
    expect(listHeader(one, "pt")).toEqual({ name: "Tiago", note: "1 horário" });
    expect(listHeader({ ...one, ready_times: [...one.ready_times, ...one.ready_times] }, "pt").note).toBe("2 horários");
    expect(listHeader(one, "en").note).toBe("1 ready time");
    expect(listHeader(tiago, "en").note).toBe("0 ready times");
  });

  it("explains a virtual member", () => {
    expect(listHeader({ ...tiago, name: "Global", virtual: true }, "pt").note).toBe(
      "Membro virtual · horários partilhados da casa",
    );
  });
});

describe("peopleOf", () => {
  it("takes Home Assistant's people by name, and nothing else", () => {
    const states = {
      "person.ana": { attributes: { friendly_name: "Ana" } },
      "person.rui": { attributes: {} },
      "switch.relay": { attributes: { friendly_name: "Relé" } },
    };
    expect(peopleOf(states)).toEqual({ "person.ana": "Ana", "person.rui": "person.rui" });
    expect(peopleOf(undefined)).toEqual({});
  });
});

describe("newSheet", () => {
  it("starts at 07:00 on weekdays, as in mockup A", () => {
    expect(newSheet()).toEqual({ time: "07:00", weekdays: [0, 1, 2, 3, 4] });
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

describe("privacySwitch", () => {
  it("is not offered to whoever may not set it", () => {
    expect(privacySwitch({ ...maria, can_set_visibility: false, visibility: null }, "pt")).toBeNull();
  });

  it("is off with no line while public", () => {
    expect(privacySwitch(tiago, "pt")).toEqual({ label: "Privado", on: false, hint: "" });
  });

  it("says who still sees a private member's times", () => {
    const own = privacySwitch({ ...tiago, visibility: "private" }, "pt");
    expect(own?.on).toBe(true);
    expect(own?.hint).toBe(
      "Os outros membros não vêem estes horários nem os seus pedidos de Aquecer agora; os administradores vêem.",
    );
    const guests = privacySwitch({ ...tiago, virtual: true, visibility: "private" }, "en");
    expect(guests?.hint).toBe("Only administrators see these times.");
  });
});

describe("heat now to an admin's own temperature (decision 16)", () => {
  it("starts at the heater's target, brought inside 35 to 45", () => {
    expect(heatNowTargetStart(cold)).toBe(42);
    expect(heatNowTargetStart({ ...cold, target: 50 })).toBe(45);
    expect(heatNowTargetStart({ ...cold, target: 30 })).toBe(35);
  });

  it("steps one degree at a time and stops at the ends", () => {
    expect(heatNowTargetStepper(42, "pt")).toEqual({ value: 42, shown: "42 °C", down: 41, up: 43 });
    expect(heatNowTargetStepper(45, "pt").up).toBeNull();
    expect(heatNowTargetStepper(35, "pt").down).toBeNull();
    expect(heatNowTargetStepper(42.5, "pt")).toEqual({ value: 42.5, shown: "42,5 °C", down: 42, up: 43 });
  });

  it("sends a temperature only when it is not the heater's own", () => {
    expect(heatNowTargetField(cold, 42)).toEqual({});
    expect(heatNowTargetField(cold, undefined)).toEqual({});
    expect(heatNowTargetField(cold, 38)).toEqual({ target: 38 });
    expect(heatNowTargetField({ ...cold, target: 50 }, 45)).toEqual({ target: 45 });
  });

  it("shows the viewer's own temperature on the ring while their request runs", () => {
    const own = { requesters: ["m1"], asked: true, unnamed: false, keep_until: null, target: 45 };
    expect(heaterView({ ...cold, heat_now: own }, pt).target).toBe("alvo 45°");
    expect(heaterView({ ...cold, heat_now: { ...own, asked: false, target: null } }, pt).target).toBe("alvo 42°");
  });

  it("says the heater's target stays as it is", () => {
    expect(heatNowTargetHint(cold, "pt")).toBe("Só para este pedido; o aquecedor continua nos 42 °C.");
  });
});

describe("keepHotChoices", () => {
  it("offers 5 min to 2 h with the heater's time picked", () => {
    const choices = keepHotChoices(cold, "pt");
    expect(choices.map((c) => c.label)).toEqual(["5 min", "15 min", "30 min", "1 h", "2 h"]);
    expect(choices.filter((c) => c.isDefault).map((c) => c.minutes)).toEqual([5]);
  });

  it("adds the heater's time when it is not one of them", () => {
    const choices = keepHotChoices({ ...cold, keep_hot_minutes: 10 }, "en");
    expect(choices.map((c) => c.minutes)).toEqual([5, 10, 15, 30, 60, 120]);
    expect(choices.find((c) => c.isDefault)?.label).toBe("10 min");
  });

  it("is offered by holding the buttons that ask, not the ones that cancel", () => {
    expect(heatNowActions(cold).map(choosesKeepTime)).toEqual([true]);
    expect(heatNowActions({ ...cold, status: "heating" }).map(choosesKeepTime)).toEqual([true]);
    const mine = { ...cold, heat_now: { requesters: ["m1"], asked: true, unnamed: false, keep_until: null, target: null } };
    expect(heatNowActions(mine).map(choosesKeepTime)).toEqual([false]);
  });
});

describe("heatNowActions", () => {
  const start = { message: { type: "hot_water_ready/heat_now/start" }, label: "heat_now.start" };
  const join = { ...start, label: "heat_now.join" };
  const cancel = { message: { type: "hot_water_ready/heat_now/cancel" }, label: "heat_now.cancel" };
  const leave = { ...cancel, label: "heat_now.leave" };

  it("offers to heat now when it is not heating", () => {
    expect(heatNowActions(cold)).toEqual([start]);
  });

  it("offers to be told when it is hot while it heats, for a ready time or for someone else", () => {
    expect(heatNowActions({ ...cold, status: "heating" })).toEqual([join]);
    expect(heatNowActions({ ...cold, heat_now: { requesters: ["m2"], asked: false, unnamed: false, keep_until: null, target: null } })).toEqual([join]);
    expect(translations.pt["heat_now.join"]).toBe("Avisar-me quando estiver quente");
  });

  it("lets the only one who asked cancel", () => {
    expect(heatNowActions({ ...cold, heat_now: { requesters: ["m1"], asked: true, unnamed: false, keep_until: null, target: null } })).toEqual([cancel]);
  });

  it("lets someone leave when an automation asked too, as heating goes on", () => {
    expect(heatNowActions({ ...cold, heat_now: { requesters: ["m1"], asked: true, unnamed: true, keep_until: null, target: null } })).toEqual([leave]);
  });

  it("offers nothing while it heats for the viewer's own ready time: they are told anyway", () => {
    const mine = { ...cold, status: "heating" as const, heating_for: [{ member: "m1", at: "2026-11-02T07:00:00+00:00" }] };
    expect(heatNowActions(mine)).toEqual([]);
  });

  it("lets one of several who asked leave", () => {
    expect(heatNowActions({ ...cold, heat_now: { requesters: ["m1", "m2"], asked: true, unnamed: false, keep_until: null, target: null } })).toEqual([leave]);
    expect(translations.pt["heat_now.leave"]).toBe("Não me avisar");
  });

  it("offers nothing to ask while automatic control is off, or to someone who may not ask", () => {
    expect(heatNowActions({ ...cold, automatic: false })).toEqual([]);
    expect(heatNowActions({ ...cold, can_ask_heat_now: false, status: "heating" })).toEqual([]);
  });
});

describe("switchOffShown", () => {
  it("is shown while heating, to whoever may switch off", () => {
    expect(switchOffShown({ ...cold, status: "heating" })).toBe(true);
    expect(switchOffShown(cold)).toBe(false);
    expect(switchOffShown({ ...cold, status: "heating", can_switch_off: false })).toBe(false);
  });

  it("is shown while a heat-now request waits without heating, to end it", () => {
    const waiting = { ...cold, status: "fault" as const, heat_now: { requesters: ["m2"], asked: false, unnamed: false, keep_until: null, target: null } };
    expect(switchOffShown(waiting)).toBe(true);
    expect(switchOffShown({ ...waiting, heat_now: { requesters: [], asked: false, unnamed: true, keep_until: null, target: null } })).toBe(true);
    expect(switchOffShown({ ...waiting, can_switch_off: false })).toBe(false);
  });
});

describe("switchOffSheet", () => {
  it("names who loses out, leaving the viewer out", () => {
    const heating = {
      ...cold,
      status: "heating" as const,
      heat_now: { requesters: ["m1", "person.ana"], asked: true, unnamed: false, keep_until: null, target: null },
      heating_for: [{ member: "m2", at: "2026-11-02T07:00:00+00:00" }],
    };
    expect(switchOffSheet(heating, pt)).toEqual({
      title: "Desligar o aquecimento?",
      lines: [
        "Ana já não recebe o aviso.",
        "Fica sem água quente: Maria às 07:00.",
        "Volta a ligar-se por si para o próximo horário.",
      ],
    });
    expect(switchOffSheet(heating, en).lines[0]).toBe("Ana will no longer be told.");
  });

  it("puts several people together", () => {
    const heating = {
      ...cold,
      me: null, // an administrator who is not a member
      viewer: null,
      status: "heating" as const,
      heat_now: { requesters: ["m2", "person.ana"], asked: false, unnamed: false, keep_until: null, target: null },
      heating_for: [
        { member: "m2", at: "2026-11-02T07:00:00+00:00" },
        { member: "m1", at: "2026-11-02T07:30:00+00:00" },
      ],
    };
    expect(switchOffSheet(heating, pt).lines.slice(0, 2)).toEqual([
      "Maria e Ana já não recebem o aviso.",
      "Ficam sem água quente: Maria às 07:00 e Tiago às 07:30.",
    ]);
  });

  it("just says heating stops when nobody else loses out", () => {
    const mine = { ...cold, status: "heating" as const, heat_now: { requesters: ["m1"], asked: true, unnamed: false, keep_until: null, target: null } };
    expect(switchOffSheet(mine, pt).lines).toEqual(["O aquecimento pára agora."]);
  });

  it("knows the viewer by their person too, and says it comes back on when their own time is skipped", () => {
    const listed = {
      ...cold,
      me: null,
      viewer: "person.ana",
      status: "heating" as const,
      heat_now: { requesters: ["person.ana"], asked: true, unnamed: false, keep_until: null, target: null },
      heating_for: [{ member: "person.ana", at: "2026-11-02T07:00:00+00:00" }],
    };
    expect(switchOffSheet(listed, pt).lines).toEqual([
      "O aquecimento pára agora.",
      "Volta a ligar-se por si para o próximo horário.",
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
    const running = { ...cold, heat_now_blocked: true, heat_now: { requesters: ["m1"], asked: true, unnamed: false, keep_until: null, target: null } };
    expect(heatNowActions(running)).toEqual([
      { message: { type: "hot_water_ready/heat_now/cancel" }, label: "heat_now.cancel" },
    ]);
  });
});

describe("settingsView", () => {
  it("is for administrators only", () => {
    expect(settingsView({ ...cold, is_admin: false, settings: null }, pt)).toBeUndefined();
  });

  it("shows the band as where heating stops and restarts", () => {
    const view = settingsView({ ...cold, target: 42.5, margin: 1.5 }, pt);
    expect(view?.band).toBe("Pára a 44 °C, retoma a 41 °C");
    expect(view?.target.shown).toBe("42,5");
  });

  it("steps the target by half a degree, back onto the step when set elsewhere", () => {
    expect(settingsView(cold, pt)?.target).toMatchObject({ down: 41.5, up: 42.5 });
    expect(settingsView({ ...cold, target: 42.3 }, pt)?.target).toMatchObject({ down: 42, up: 42.5 });
  });

  it("stops at the limits", () => {
    expect(settingsView({ ...cold, target: 75 }, pt)?.target.up).toBeNull();
    expect(settingsView({ ...cold, margin: 0 }, pt)?.margin.down).toBeNull();
    expect(settingsView({ ...cold, margin: 0 }, pt)?.margin.up).toBe(0.5);
  });

  it("lists the people who may switch off for everyone, ticking those chosen", () => {
    const listed = { ...cold, settings: { ...settingsOff, switch_off_people: ["person.rui"] } };
    expect(settingsView(listed, pt)?.people).toEqual([
      { id: "person.ana", name: "Ana", on: false },
      { id: "person.rui", name: "Rui", on: true },
    ]);
    expect(settingsView(listed, { ...pt, people: {} })?.people).toEqual([]);
  });

  it("works out the list once a box is ticked or cleared", () => {
    const people = [
      { id: "person.ana", name: "Ana", on: false },
      { id: "person.rui", name: "Rui", on: true },
    ];
    expect(switchOffPeopleWith(people, "person.ana", true)).toEqual(["person.ana", "person.rui"]);
    expect(switchOffPeopleWith(people, "person.rui", false)).toEqual([]);
  });

  it("carries the note when not rising cannot be checked", () => {
    expect(settingsView({ ...cold, not_rising_checked: false }, pt)?.notes).toEqual([
      "O termóstato não indica quando está a aquecer, por isso as verificações \"a água não aquece\" e \"o aquecedor não consome energia\" não são feitas.",
    ]);
    expect(settingsView(cold, pt)?.notes).toEqual([]);
  });
});

describe("solarLine", () => {
  const off = { switch_off_people: [], solar_aware: false, rate: learnedRate };

  it("says when nothing has been recorded yet", () => {
    expect(solarLine({ ...off, solar: { windows: 0, on_time: 0, minutes_saved: 0, kwh: null, solar_windows: 0, solar_on_time: 0 } }, "pt")).toBe(
      "Ainda não há janelas registadas nos últimos 30 dias.",
    );
  });

  it("gives the verdict with minutes and kWh while the rule is off", () => {
    expect(solarLine({ ...off, solar: { windows: 30, on_time: 27, minutes_saved: 412, kwh: 20.6, solar_windows: 0, solar_on_time: 0 } }, "pt")).toBe(
      "Com a regra solar ligada, a água teria ficado pronta a tempo em 27 de 30 janelas, e o aquecedor teria trabalhado menos 412 minutos, cerca de 20,6 kWh.",
    );
  });

  it("leaves kWh out without a measure of energy", () => {
    expect(solarLine({ ...off, solar: { windows: 3, on_time: 3, minutes_saved: 40, kwh: null, solar_windows: 0, solar_on_time: 0 } }, "en")).toBe(
      "With the solar-aware rule on, the water would have been ready on time in 3 of 3 windows, and the heater would have run 40 minutes less.",
    );
  });

  it("speaks of what happened once the rule is on, and of more minutes when it ran longer", () => {
    const on = { ...off, solar_aware: true };
    expect(solarLine({ ...on, solar: { windows: 4, on_time: 3, minutes_saved: -12, kwh: -0.6, solar_windows: 0, solar_on_time: 0 } }, "pt")).toBe(
      "Com a regra solar, a água ficou pronta a tempo em 3 de 4 janelas, e o aquecedor trabalhou mais 12 minutos, cerca de 0,6 kWh.",
    );
  });

  it("says how the rule did in the windows it was applied to", () => {
    const on = { ...off, solar_aware: true };
    const solar = { windows: 5, on_time: 4, minutes_saved: 30, kwh: null, solar_windows: 3, solar_on_time: 2 };
    expect(solarLine({ ...on, solar }, "pt")).toBe(
      "Com a regra solar, a água ficou pronta a tempo em 4 de 5 janelas, e o aquecedor trabalhou menos 30 minutos. A regra foi aplicada em 3 delas: a tempo em 2.",
    );
  });

  it("says nothing about minutes when none were saved", () => {
    expect(solarLine({ ...off, solar: { windows: 2, on_time: 2, minutes_saved: 0, kwh: 0, solar_windows: 0, solar_on_time: 0 } }, "en")).toBe(
      "With the solar-aware rule on, the water would have been ready on time in 2 of 2 windows.",
    );
  });
});

describe("weekView", () => {
  const at = (time: string, weekdays: number[]) => ({ id: time, time, weekdays, enabled: true });
  const household: HeaterSnapshot = {
    ...cold,
    members: [
      { ...tiago, ready_times: [at("07:00", [0, 1, 2, 3, 4]), { ...at("09:00", [5]), enabled: false }] },
      { ...maria, ready_times: [at("20:00", [0]), at("07:30", [0, 2])] },
      { ...tiago, id: "g", name: "Global", virtual: true, ready_times: [at("10:00", [5])] },
      { ...tiago, id: "j", name: "José", away: { on: true, until: null }, ready_times: [at("19:30", [0, 1, 2, 3, 4, 5, 6])] },
    ],
    week: {
      monday: "2026-11-02",
      today: "2026-11-04",
      windows: [
        { start: "2026-11-02T06:30:00+00:00", end: "2026-11-02T07:45:00+00:00" },
        { start: "2026-11-02T19:30:00+00:00", end: "2026-11-02T20:15:00+00:00" },
        { start: "2026-11-08T23:30:00+00:00", end: "2026-11-09T00:15:00+00:00" },
      ],
    },
  };

  it("labels the heating bar's hours and the hint for the user's clock", () => {
    const labels = weekView(household, { ...en, hour24: false })?.hours.map((h) => h.label);
    expect(labels?.[0]).toMatch(/^6\s?am$/i);
    expect(labels?.[2]).toMatch(/^6\s?pm$/i);
    expect(weekHint("pt")).toContain("(05h a 24h)");
    expect(weekHint("en", false)).toMatch(/\(5\s?am to 12\s?am\)/i);
  });

  it("labels the heating bar's hours where they fall on the 05h to 24h day", () => {
    expect(weekView(household, pt)?.hours).toEqual([
      { label: "06h", at: 1 / 19 },
      { label: "12h", at: 7 / 19 },
      { label: "18h", at: 13 / 19 },
      { label: "24h", at: 1 },
    ]);
  });

  it("is for administrators only", () => {
    expect(weekView({ ...household, is_admin: false, week: null }, pt)).toBeUndefined();
    expect(viewMode({ ...household, is_admin: false })).not.toBe("admin");
  });

  it("puts each person's enabled times under their days", () => {
    const rows = weekView(household, pt)?.rows;
    expect(rows?.[0]?.cells.map((cell) => cell.times)).toEqual([
      ["07:00"],
      ["07:00"],
      ["07:00"],
      ["07:00"],
      ["07:00"],
      [],
      [],
    ]);
    expect(rows?.[1]?.cells[0]?.times).toEqual(["07:30", "20:00"]);
  });

  it("notes away, virtual and the count a week", () => {
    expect(weekView(household, pt)?.rows.map((row) => [row.initial, row.note])).toEqual([
      ["T", "5 por semana"],
      ["M", "3 por semana"],
      ["★", "virtual · 1"],
      ["J", "ausente"],
    ]);
  });

  it("counts showers without the away, windows, and the busiest day", () => {
    const week = weekView(household, pt);
    expect([week?.showers, week?.windows, week?.busiest]).toEqual([9, 3, "Seg"]);
  });

  it("marks today and places the heating on the 05h to 24h day", () => {
    const days = weekView(household, pt)?.days ?? [];
    expect(days.map((day) => day.today)).toEqual([false, false, true, false, false, false, false]);
    expect(days[0]?.bars).toEqual([
      { from: 90 / 1140, length: 75 / 1140 },
      { from: 870 / 1140, length: 45 / 1140 },
    ]);
  });

  it("counts an away with a last day only up to that day", () => {
    const until = { ...household, members: [{ ...tiago, away: { on: true, until: "2026-11-04" }, ready_times: [at("07:00", [0, 1, 2, 3, 4])] }] };
    const week = weekView(until, pt);
    expect(week?.rows[0]?.cells.map((cell) => cell.away)).toEqual([true, true, true, false, false, false, false]);
    expect(week?.rows[0]?.note).toBe("5 por semana");
    expect(week?.showers).toBe(2); // Thursday and Friday
  });

  it("splits a window across midnight and leaves the night part out", () => {
    const days = weekView(household, pt)?.days ?? [];
    expect(days[6]?.bars).toEqual([{ from: 1110 / 1140, length: 30 / 1140 }]);
  });
});

describe("clusterWarning", () => {
  it("is empty without a warning", () => {
    expect(clusterWarning(cold, pt)).toBe("");
  });

  it("says when, what is needed and what the heater allows", () => {
    const warning = { at: "2026-11-02T07:00:00+00:00", needed: 72, cap: 50 };
    expect(clusterWarning({ ...cold, cluster_warning: warning }, pt)).toBe(
      "Os duches a partir das 07:00 precisam da água a 72 °C, mas o aquecedor só aquece até 50 °C: os últimos podem sair menos quentes.",
    );
  });
});

describe("the time format in the user's profile", () => {
  it("follows the profile's choice of 12 or 24 hours, else the language's", () => {
    expect(uses24Hours("24", "en")).toBe(true);
    expect(uses24Hours("12", "pt")).toBe(false);
    expect(uses24Hours("language", "pt")).toBe(true);
    expect(uses24Hours("language", "en")).toBe(false);
    expect(uses24Hours("language", "en-GB")).toBe(true);
    expect(uses24Hours(undefined, "pt")).toBe(true);
  });

  it("writes times on a 24-hour clock by default", () => {
    expect(wallTime("07:05", "en")).toBe("07:05");
    expect(wallTime("21:30", "pt", true)).toBe("21:30");
  });

  it("writes times on a 12-hour clock when the user reads them so", () => {
    expect(wallTime("21:30", "en", false)).toMatch(/^9:30\s?pm$/i);
    expect(wallTime("00:15", "en", false)).toMatch(/^12:15\s?am$/i);
  });

  it("uses the same clock for the house's times today and the list", () => {
    const today = [{ member: "m1", at: "2026-11-02T21:00:00+00:00" }];
    expect(houseTodayChips({ ...cold, today }, { ...en, hour24: false }, "m1")[0]?.time).toMatch(/^9:00\s?pm$/i);
    expect(houseTodayChips({ ...cold, today }, en, "m1")[0]?.time).toBe("21:00");
    const evening = { ...tiago, ready_times: [{ id: "r1", time: "21:00", weekdays: [0], enabled: true }] };
    expect(readyTimeRows(evening, "en", false)[0]?.time).toMatch(/^9:00\s?pm$/i);
  });
});

describe("editSheet", () => {
  const member = { ...tiago, ready_times: [{ id: "r1", time: "06:45", weekdays: [4, 0, 2], enabled: false }] };

  it("opens a ready time as it is now, to be changed", () => {
    expect(editSheet(member, "r1")).toEqual({ id: "r1", time: "06:45", weekdays: [0, 2, 4] });
  });

  it("has nothing to open for a ready time that is gone", () => {
    expect(editSheet(member, "gone")).toBeUndefined();
  });

  it("says it changes a ready time rather than adding one", () => {
    expect(translations.pt["sheet.edit_title"]).toBe("Alterar horário");
    expect(translations.en["sheet.edit_title"]).toBe("Change ready time");
  });
});

describe("the time popup", () => {
  const centre = DIAL_SIZE / 2;
  // A point on the dial, `fraction` of a turn from the top, `radius` from the centre.
  const at = (fraction: number, radius: number): [number, number] => [
    centre + radius * Math.sin(fraction * 2 * Math.PI),
    centre - radius * Math.cos(fraction * 2 * Math.PI),
  ];

  it("opens on the dial at the hour, with the time it was given", () => {
    expect(openClock("06:45", true)).toEqual({
      hour: 6, minute: 45, part: "hour", mode: "dial", hourText: "06", minuteText: "45", fresh: true,
    });
  });

  it("lays out the hours as Android does: 0 to 11 outside, 12 to 23 inside, 0 and 12 at the top", () => {
    const marks = dialMarks("hour");
    expect(marks).toHaveLength(24);
    const zero = marks.find((mark) => mark.value === 0);
    const twelve = marks.find((mark) => mark.value === 12);
    const three = marks.find((mark) => mark.value === 3);
    expect(zero?.x).toBeCloseTo(centre);
    expect(twelve?.x).toBeCloseTo(centre);
    expect(twelve?.y).toBeGreaterThan(zero?.y ?? 0);
    expect(three?.y).toBeCloseTo(centre);
    expect(three?.x).toBeGreaterThan(centre);
  });

  it("shows one ring of 12 to 11 on a 12-hour clock, and minutes in fives", () => {
    expect(dialMarks("hour", false).map((mark) => mark.label).slice(0, 3)).toEqual(["12", "1", "2"]);
    expect(dialMarks("minute").map((mark) => mark.label).slice(0, 3)).toEqual(["00", "05", "10"]);
  });

  it("picks the hour of the ring touched, snapping to the nearest number", () => {
    const clock = openClock("07:00", false);
    expect(dialPick(clock, ...at(3 / 12 + 0.02, 104)).hour).toBe(3);
    expect(dialPick(clock, ...at(3 / 12, 68)).hour).toBe(15);
    expect(dialPick(clock, ...at(0.99, 104)).hour).toBe(0);
    expect(dialPick(clock, ...at(0, 60))).toMatchObject({ hour: 12, hourText: "12" });
  });

  it("keeps the morning or afternoon on a 12-hour clock", () => {
    const evening = openClock("21:00", false, false);
    expect(dialPick(evening, ...at(3 / 12, 104), false)).toMatchObject({ hour: 15, hourText: "3" });
    expect(clockHalf(evening, false).hour).toBe(9);
    expect(dialMarkOn(evening, { value: 9, label: "9", x: 0, y: 0 }, false)).toBe(true);
  });

  it("takes any of the sixty minutes", () => {
    const clock = { ...openClock("07:00", false), part: "minute" as const };
    expect(dialPick(clock, ...at(7 / 60, 90))).toMatchObject({ minute: 7, minuteText: "07" });
    expect(clockTime(dialPick(clock, ...at(0.5, 90)))).toBe("07:30");
  });

  it("puts the hand on the inner ring for the afternoon", () => {
    const afternoon = dialHand(openClock("15:00", false));
    const morning = dialHand(openClock("03:00", false));
    expect(afternoon.x).toBeCloseTo(centre + 68);
    expect(afternoon.y).toBeCloseTo(centre);
    expect(morning.x).toBeCloseTo(centre + 104);
    expect(morning.y).toBeCloseTo(centre);
  });

  it("steps round the clock from the keyboard", () => {
    expect(dialStep(openClock("23:00", false), 1).hour).toBe(0);
    expect(dialStep({ ...openClock("07:00", false), part: "minute" }, -1).minute).toBe(59);
  });

  it("accepts only a real time typed in the boxes", () => {
    const keys = switchClockMode(openClock("07:05", false));
    expect(keys).toMatchObject({ mode: "keys", hourText: "07", minuteText: "05" });
    expect(clockTime({ ...keys, hourText: "6", minuteText: "30" })).toBe("06:30");
    expect(typedTime({ ...keys, hourText: "24" })).toBeUndefined();
    expect(typedTime({ ...keys, minuteText: "60" })).toBeUndefined();
    expect(typedTime({ ...keys, hourText: "" })).toBeUndefined();
    expect(typedTime({ ...keys, hourText: "7a" })).toBeUndefined();
  });

  it("reads typed hours on a 12-hour clock with the half of the day chosen", () => {
    const keys = switchClockMode(openClock("21:00", false, false), false);
    expect(keys.hourText).toBe("9");
    expect(typedTime({ ...keys, hourText: "12", minuteText: "00" }, false)).toBe("12:00");
    expect(typedTime({ ...clockHalf(keys, false), hourText: "12", minuteText: "00" }, false)).toBe("00:00");
    expect(typedTime({ ...keys, hourText: "0" }, false)).toBeUndefined();
  });

  it("carries a typed time back to the dial, and keeps the dial's when the typing is not a time", () => {
    const keys = switchClockMode(openClock("07:00", false));
    expect(switchClockMode({ ...keys, hourText: "18", minuteText: "20" })).toMatchObject({ mode: "dial", part: "hour", hour: 18, minute: 20 });
    expect(switchClockMode({ ...keys, hourText: "99" })).toMatchObject({ mode: "dial", hour: 7, minute: 0, hourText: "07" });
  });
});

describe("rateView", () => {
  const at = (rate: Partial<RateInfo>, temperature: number | null = 27) =>
    rateView({ ...cold, temperature, settings: { ...settingsOff, rate: { ...learnedRate, ...rate } } }, pt);

  it("is for administrators only", () => {
    expect(rateView({ ...cold, is_admin: false, settings: null }, pt)).toBeUndefined();
  });

  it("shows the learned rate and the runs behind it, newest first", () => {
    const view = at({});
    expect(view?.shown).toBe("5,3");
    expect(view?.fixed).toBe(false);
    expect(view?.source).toBe("Aprendido: mediana das 3 aquecidas limpas dos últimos 7 dias");
    expect(view?.runs.map((run) => run.rate)).toEqual(["5,1", "5,9", "5,5"]);
    expect(view?.runs[0]?.when).toBe("2 Nov, 04:10");
  });

  it("works out when heating starts from the water now", () => {
    expect(at({})?.example).toBe(
      "Agora 27 °C → 42 °C: 15 °C × 5,3 = 80 min, mais 15 min de margem: começa 95 min antes",
    );
    expect(at({}, null)?.example).toBeNull();
    expect(at({}, 45)?.example).toBe("Agora 45 °C: já está no alvo, não precisa de começar antes");
  });

  it("says when the lead hits its cap", () => {
    expect(at({ used: 20, learned: 20 })?.example).toBe(
      "Agora 27 °C → 42 °C: 15 °C × 20 = 300 min, mais 15 min de margem: começa 240 min antes (o máximo)",
    );
  });

  it("before three clean runs, says how many are still missing", () => {
    const view = at({ used: 7, source: "default", learned: null, runs: learnedRate.runs.slice(0, 1) });
    expect(view?.source).toBe("Valor inicial: faltam 2 aquecidas limpas nos últimos 7 dias para aprender");
  });

  it("a fixed rate says so and suggests the learned one", () => {
    const view = at({ used: 6, source: "manual", manual: 6 });
    expect(view?.fixed).toBe(true);
    expect(view?.source).toBe("Fixo à mão: a aprendizagem continua, mas não é usada");
    expect(view?.suggestion).toEqual({ value: 5.3, line: "Sugerido: 5,3 (aprendido)" });
    expect(view?.stepper).toMatchObject({ shown: "6", down: 5.9, up: 6.1 });
  });

  it("without a learned rate, suggests the physics one, then the default", () => {
    expect(at({ source: "manual", manual: 6, learned: null })?.suggestion).toEqual({
      value: 7.6,
      line: "Sugerido: 7,6 (pela física do tanque)",
    });
    expect(at({ source: "manual", manual: 6, learned: null, physics: null })?.suggestion).toEqual({
      value: 7,
      line: "Sugerido: 7 (valor inicial)",
    });
  });

  it("no suggestion when the fixed value already is it", () => {
    expect(at({ used: 5.3, source: "manual", manual: 5.3 })?.suggestion).toBeNull();
  });

  it("checks the rate against physics as the volume it amounts to heating", () => {
    expect(at({ used: 7.3, learned: 7.3 })?.check).toEqual({
      line: "Equivale a aquecer 288 L dos 300 L do tanque",
      warn: false,
    });
    expect(at({})?.check).toEqual({
      line:
        "Equivale a aquecer 209 L dos 300 L do tanque: 30% abaixo da física. Confirme o volume do tanque, a potência da resistência e onde está a sonda.",
      warn: true,
    });
    expect(at({ used: 10, learned: 10 })?.check?.line).toContain("31% acima da física");
    expect(at({ physics: null, physics_fast: null, tank_litres: null })?.check).toBeNull();
  });

  it("with the element up the tank, physics is a range and only outside it warns", () => {
    const middle = { physics_fast: 3.8 };
    expect(at(middle)?.physics).toBe(
      "Pela física: entre 3,8 min/°C (só a água acima da resistência) e 7,6 min/°C (o tanque inteiro)",
    );
    expect(at(middle)?.check).toEqual({ line: "Equivale a aquecer 209 L dos 300 L do tanque", warn: false });
    expect(at({ ...middle, used: 2.5, learned: 2.5 })?.check).toMatchObject({ warn: true });
    expect(at({ ...middle, used: 2.5, learned: 2.5 })?.check?.line).toContain("34% abaixo da física");
    expect(at({ ...middle, used: 9.6, learned: 9.6 })?.check?.line).toContain("26% acima da física");
  });

  it("shows the physics rate as a check", () => {
    expect(at({})?.physics).toBe("Pela física, o tanque inteiro aquecido pela resistência: 7,6 min/°C");
    expect(at({ physics: null })?.physics).toBeNull();
  });
});
