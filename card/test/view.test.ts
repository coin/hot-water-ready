import { describe, expect, it } from "vitest";
import { translations } from "../src/i18n";
import type { AdminSettings, HeaterSnapshot, MemberSnapshot } from "../src/types";
import {
  avatarViews,
  faultBanner,
  heatNowActions,
  awayLine,
  greeting,
  heaterView,
  houseTodayChips,
  listHeader,
  newSheet,
  cancelPeopleWith,
  peopleOf,
  viewMode,
  readyTimeRows,
  selectedMember,
  sheetIsComplete,
  showsAvatarRow,
  settingsView,
  shownMember,
  solarLine,
  todayInHouse,
  clusterWarning,
  weekView,
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

const settingsOff: AdminSettings = {
  cancel_rule: "requesters",
  cancel_people: [],
  solar_aware: false,
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
  faults: [],
  heat_now_blocked: false,
  not_rising_checked: true,
  automatic: true,
  heat_now: null,
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
    const one = { ...cold, status: "heating" as const, heat_now: { requesters: ["m2"], asked: false, can_cancel_all: true } };
    expect(heaterView(one, pt).subline).toBe("Pedido por Maria. Recebe um aviso quando estiver pronta.");
    expect(heaterView(one, en).subline).toBe("Asked for by Maria. They are told when it is ready.");
    const two = { ...one, heat_now: { ...one.heat_now, requesters: ["m2", "person.ana"] } };
    expect(heaterView(two, pt).subline).toBe("Pedido por Maria e Ana. Cada um é avisado quando estiver pronta.");
    expect(heaterView(two, en).subline).toBe("Asked for by Maria and Ana. Each is told when it is ready.");
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

describe("heatNowActions", () => {
  const start = { message: { type: "hot_water_ready/heat_now/start" }, label: "heat_now.start", values: {}, primary: true };
  const join = { ...start, label: "heat_now.join" };
  const withdraw = { message: { type: "hot_water_ready/heat_now/cancel", all: false }, label: "heat_now.cancel", values: {}, primary: true };

  it("offers to heat now when nothing is running", () => {
    expect(heatNowActions(cold, pt)).toEqual([start]);
  });

  it("offers nothing to ask while automatic control is off", () => {
    expect(heatNowActions({ ...cold, automatic: false }, pt)).toEqual([]);
  });

  it("lets someone who asked withdraw their own request", () => {
    const asked = { ...cold, heat_now: { requesters: ["m1"], asked: true, can_cancel_all: false } };
    expect(heatNowActions(asked, pt)).toEqual([withdraw]);
  });

  it("offers to be told too to someone who did not ask", () => {
    const other = { ...cold, heat_now: { requesters: ["m2"], asked: false, can_cancel_all: false } };
    expect(heatNowActions(other, pt)).toEqual([join]);
  });

  it("lets an administrator cancel everyone's request, naming who asked", () => {
    const other = { ...cold, heat_now: { requesters: ["m2", "person.ana"], asked: false, can_cancel_all: true } };
    const all = { message: { type: "hot_water_ready/heat_now/cancel", all: true }, label: "heat_now.cancel_all", values: { names: "Maria e Ana" }, primary: false };
    expect(heatNowActions(other, pt)).toEqual([join, all]);
    expect(translations.pt["heat_now.cancel_all"]).toBe("Cancelar pedido de {names}");
  });

  it("offers both to an administrator who asked along with others", () => {
    const both = { ...cold, heat_now: { requesters: ["m1", "m2"], asked: true, can_cancel_all: true } };
    expect(heatNowActions(both, en)).toEqual([
      withdraw,
      { message: { type: "hot_water_ready/heat_now/cancel", all: true }, label: "heat_now.cancel_all", values: { names: "Tiago and Maria" }, primary: false },
    ]);
  });

  it("gives only one cancel to someone who is the only one who asked", () => {
    const alone = { ...cold, heat_now: { requesters: ["m1"], asked: true, can_cancel_all: true } };
    expect(heatNowActions(alone, pt)).toEqual([withdraw]);
  });

  it("lets an administrator cancel a request from an automation, which names nobody", () => {
    const automation = { ...cold, heat_now: { requesters: [], asked: false, can_cancel_all: true } };
    expect(heatNowActions(automation, pt)).toEqual([
      join,
      { message: { type: "hot_water_ready/heat_now/cancel", all: true }, label: "heat_now.cancel", values: {}, primary: false },
    ]);
  });

  it("offers nothing to ask to someone who may not ask, but still lets them cancel if allowed", () => {
    const viewer = { ...cold, can_ask_heat_now: false };
    expect(heatNowActions(viewer, pt)).toEqual([]);
    const running = { ...viewer, heat_now: { requesters: ["m2"], asked: false, can_cancel_all: true } };
    expect(heatNowActions(running, pt)).toEqual([
      { message: { type: "hot_water_ready/heat_now/cancel", all: true }, label: "heat_now.cancel_all", values: { names: "Maria" }, primary: false },
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
    expect(heatNowActions({ ...cold, heat_now_blocked: true }, pt)).toEqual([]);
  });

  it("still lets someone cancel a request that was running when the fault came", () => {
    const running = { ...cold, heat_now_blocked: true, heat_now: { requesters: ["m1"], asked: true, can_cancel_all: true } };
    expect(heatNowActions(running, pt)).toEqual([
      { message: { type: "hot_water_ready/heat_now/cancel", all: false }, label: "heat_now.cancel", values: {}, primary: true },
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

  it("marks the cancel rule in use", () => {
    const rules = settingsView(cold, pt)?.cancel.filter((option) => option.selected).map((o) => o.rule);
    expect(rules).toEqual(["requesters"]);
  });

  it("lists the people who may cancel only under the list rule", () => {
    expect(settingsView(cold, pt)?.people).toEqual([]);
    expect(settingsView(cold, pt)?.listsPeople).toBe(false);
    const listed = { ...cold, settings: { ...settingsOff, cancel_rule: "people" as const, cancel_people: ["person.rui"] } };
    expect(settingsView(listed, pt)?.people).toEqual([
      { id: "person.ana", name: "Ana", on: false },
      { id: "person.rui", name: "Rui", on: true },
    ]);
    expect(settingsView(listed, { ...pt, people: {} })).toMatchObject({ listsPeople: true, people: [] });
  });

  it("works out the list once a box is ticked or cleared", () => {
    const people = [
      { id: "person.ana", name: "Ana", on: false },
      { id: "person.rui", name: "Rui", on: true },
    ];
    expect(cancelPeopleWith(people, "person.ana", true)).toEqual(["person.ana", "person.rui"]);
    expect(cancelPeopleWith(people, "person.rui", false)).toEqual([]);
  });

  it("carries the note when not rising cannot be checked", () => {
    expect(settingsView({ ...cold, not_rising_checked: false }, pt)?.notes).toEqual([
      "O termóstato não indica quando está a aquecer, por isso as verificações \"a água não aquece\" e \"o aquecedor não consome energia\" não são feitas.",
    ]);
    expect(settingsView(cold, pt)?.notes).toEqual([]);
  });
});

describe("solarLine", () => {
  const off = { cancel_rule: "requesters" as const, cancel_people: [], solar_aware: false };

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
