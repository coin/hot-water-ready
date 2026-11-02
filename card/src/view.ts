// What the card shows, worked out from a heater snapshot without touching the DOM.

import { localeOf, localize, pickLanguage, weekdayLetters, type TextKey } from "./i18n";
import type { AdminSettings, CancelRule, HeaterSnapshot, MemberSnapshot, Status, TimeSpan } from "./types";

export interface ViewContext {
  language: string;
  /** The house's time zone (Home Assistant's), which ready times are in. */
  timeZone: string;
  now: Date;
  /** Home Assistant's people, entity id to name: who asked for heat now, who may cancel. */
  people?: Record<string, string>;
}

export interface HeaterView {
  temperature: string;
  target: string;
  /** The status in capitals, as a badge (mockup A). */
  badge: string;
  headline: string;
  subline: string;
  /** Ring fill, 0 to 1. */
  fill: number;
  tone: Status;
}

function formatNumber(value: number, language: string, digits: number): string {
  return new Intl.NumberFormat(localeOf(language), { maximumFractionDigits: digits }).format(value);
}

/** The calendar date of a moment in a time zone, as "YYYY-MM-DD". */
function dayKey(moment: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(moment);
}

/** The calendar day after a "YYYY-MM-DD" day; counted in days, so a 23 or 25-hour day is one. */
function nextDayKey(day: string): string {
  const next = new Date(`${day}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

/** "07:00", "07:00 de amanhã" or "07:30 de quinta-feira", in the house's time zone. */
export function describeWhen(iso: string, context: ViewContext): string {
  const { language, timeZone, now } = context;
  const moment = new Date(iso);
  const time = clock(iso, context);
  const today = dayKey(now, timeZone);
  if (dayKey(moment, timeZone) === today) return localize(language, "when.today", { time });
  if (dayKey(moment, timeZone) === nextDayKey(today)) return localize(language, "when.tomorrow", { time });
  const weekday = new Intl.DateTimeFormat(localeOf(language), { timeZone, weekday: "long" }).format(moment);
  return localize(language, "when.weekday", { time, weekday });
}

function headlineOf(heater: HeaterSnapshot, context: ViewContext): string {
  const { language } = context;
  if (heater.status === "heating" && heater.ready_in_minutes !== null) {
    return localize(language, "headline.heating_for", { minutes: heater.ready_in_minutes });
  }
  if (heater.status === "waiting" && heater.next_ready) {
    return localize(language, "headline.ready_at", { when: describeWhen(heater.next_ready.at, context) });
  }
  return localize(language, `status.${heater.status}`);
}

function membersById(heater: HeaterSnapshot): Map<string, MemberSnapshot> {
  return new Map(heater.members.map((member) => [member.id, member]));
}

/** Member ids and person entities by name. */
function namesOf(heater: HeaterSnapshot, ids: string[], context: ViewContext): string[] {
  const members = membersById(heater);
  return ids.map((id) => members.get(id)?.name ?? context.people?.[id] ?? id);
}

/** Home Assistant's people, entity id to name, from its states. */
export function peopleOf(states: Record<string, { attributes: { friendly_name?: string } }> | undefined): Record<string, string> {
  const people: Record<string, string> = {};
  for (const [id, state] of Object.entries(states ?? {})) {
    if (id.startsWith("person.")) people[id] = state.attributes.friendly_name ?? id;
  }
  return people;
}

/** "Maria", "Maria e Ana", "Tiago, Maria e Ana". */
function joinNames(names: string[], language: string): string {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")}${localize(language, "names.and")}${names.at(-1) ?? ""}`;
}

/** Under the headline: who asked while heating for them, when heating starts, or the next time. */
function sublineOf(heater: HeaterSnapshot, context: ViewContext): string {
  const { language } = context;
  const requesters = heater.heat_now?.requesters ?? [];
  if (heater.status === "heating" && requesters.length > 0) {
    const names = namesOf(heater, requesters, context);
    return names.length === 1
      ? localize(language, "subline.asked_by_one", { name: names[0] ?? "" })
      : localize(language, "subline.asked_by_many", { names: joinNames(names, language) });
  }
  if (heater.status === "waiting" && heater.next_heat_start) {
    const key = heater.solar_aware ? "subline.starts_at_solar" : "subline.starts_at";
    return localize(language, key, { when: describeWhen(heater.next_heat_start, context) });
  }
  if (heater.status === "ready" && heater.next_ready) {
    return localize(language, "subline.next_at", { when: describeWhen(heater.next_ready.at, context) });
  }
  return "";
}

export function heaterView(heater: HeaterSnapshot, context: ViewContext): HeaterView {
  const { language } = context;
  const { temperature, target } = heater;
  return {
    temperature: temperature === null ? "–" : `${formatNumber(temperature, language, 1)}°`,
    target: localize(language, "ring.target", { target: formatNumber(target, language, 1) }),
    badge: localize(language, `status.${heater.status}`).toLocaleUpperCase(localeOf(language)),
    headline: headlineOf(heater, context),
    subline: sublineOf(heater, context),
    fill: temperature === null || target <= 0 ? 0 : Math.min(1, Math.max(0, temperature / target)),
    tone: heater.status,
  };
}

/** The member shown: the one picked, else the viewer's own, else the first. */
export function selectedMember(heater: HeaterSnapshot, picked: string | undefined): MemberSnapshot | undefined {
  const wanted = picked ?? heater.me;
  return heater.members.find((member) => member.id === wanted) ?? heater.members[0];
}

/** Admins always (they add members from it); a member never; anyone else when there is a choice. */
export function showsAvatarRow(heater: HeaterSnapshot): boolean {
  const mode = viewMode(heater);
  if (mode === "admin") return true;
  return mode === "viewer" && heater.members.length > 1;
}

/** The member whose list is shown: a member always sees their own. */
export function shownMember(heater: HeaterSnapshot, picked: string | undefined): MemberSnapshot | undefined {
  return selectedMember(heater, viewMode(heater) === "member" ? undefined : picked);
}

/** Today's date in the house, "YYYY-MM-DD": the earliest last day away the card accepts. */
export function todayInHouse(context: ViewContext): string {
  return dayKey(context.now, context.timeZone);
}

export interface Sheet {
  time: string;
  weekdays: number[];
}

/** A new ready time starts at 07:00 on weekdays (mockup A). */
export function newSheet(): Sheet {
  return { time: "07:00", weekdays: [0, 1, 2, 3, 4] };
}

/** A new ready time needs a time and at least one day. */
export function sheetIsComplete(sheet: Sheet): boolean {
  return sheet.time !== "" && sheet.weekdays.length > 0;
}

export interface ReadyTimeRow {
  id: string;
  time: string;
  enabled: boolean;
  days: { letter: string; on: boolean }[];
}

/** A member's ready times as alarm-style rows, earliest first. */
export function readyTimeRows(member: MemberSnapshot, language: string): ReadyTimeRow[] {
  const letters = weekdayLetters(language);
  return [...member.ready_times]
    .sort((a, b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id))
    .map((ready) => ({
      id: ready.id,
      time: ready.time,
      enabled: ready.enabled,
      days: letters.map((letter, index) => ({ letter, on: ready.weekdays.includes(index) })),
    }));
}

export type ViewMode = "admin" | "member" | "viewer";

/** Admins see and edit the household; a member sees their own; anyone else sees it read-only. */
export function viewMode(heater: HeaterSnapshot): ViewMode {
  if (heater.is_admin) return "admin";
  return heater.me ? "member" : "viewer";
}

export interface AvatarView {
  id: string;
  name: string;
  initial: string;
  colour: string;
  /** A virtual member (Global, Guests). */
  star: boolean;
  /** Away. */
  faded: boolean;
  selected: boolean;
}

export function avatarViews(heater: HeaterSnapshot, selectedId: string | undefined): AvatarView[] {
  return heater.members.map((member) => ({
    id: member.id,
    name: member.name,
    initial: member.name.slice(0, 1).toLocaleUpperCase(),
    colour: member.colour,
    star: member.virtual,
    faded: member.away.on,
    selected: member.id === selectedId,
  }));
}

export function greeting(heater: HeaterSnapshot, language: string): string {
  const me = heater.members.find((member) => member.id === heater.me);
  return me ? localize(language, "greeting", { name: me.name }) : "";
}

function clock(iso: string, context: ViewContext): string {
  return new Intl.DateTimeFormat(localeOf(context.language), {
    timeZone: context.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

export interface TodayChip {
  name: string;
  time: string;
  colour: string;
  /** The viewer's own time, shown as "Você". */
  mine: boolean;
}

/** "Casa hoje": the house's ready times today, the member's own as "Você" (mockup A). */
export function houseTodayChips(heater: HeaterSnapshot, context: ViewContext, memberId: string): TodayChip[] {
  const members = membersById(heater);
  return heater.today.map((entry) => {
    const mine = entry.member === memberId;
    const member = members.get(entry.member);
    return {
      name: mine ? localize(context.language, "today.you") : (member?.name ?? "?"),
      time: clock(entry.at, context),
      colour: member?.colour ?? "",
      mine,
    };
  });
}

/** Over an admin's view of a member's list: their name and "3 horários", or what a virtual member is. */
export function listHeader(member: MemberSnapshot, language: string): { name: string; note: string } {
  const count = member.ready_times.length;
  let note = localize(language, "list.count", { count });
  if (member.virtual) note = localize(language, "list.virtual");
  else if (count === 1) note = localize(language, "list.count_one");
  return { name: member.name, note };
}

/** "4 de Novembro" or "4 November". Portuguese months are capitalised (spelling before 1990). */
function dayAndMonth(day: string, language: string): string {
  const moment = new Date(`${day}T12:00:00Z`);
  const locale = localeOf(language);
  const number = new Intl.DateTimeFormat(locale, { timeZone: "UTC", day: "numeric" }).format(moment);
  const month = new Intl.DateTimeFormat(locale, { timeZone: "UTC", month: "long" }).format(moment);
  if (pickLanguage(language) === "pt") {
    return `${number} de ${month.slice(0, 1).toLocaleUpperCase("pt-PT")}${month.slice(1)}`;
  }
  return `${number} ${month}`;
}

/** "Ausente", "Ausente até 4 de Novembro", or nothing while the member is home. */
export function awayLine(member: MemberSnapshot, context: Pick<ViewContext, "language">): string {
  if (!member.away.on) return "";
  if (!member.away.until) return localize(context.language, "away.line");
  return localize(context.language, "away.line_until", { date: dayAndMonth(member.away.until, context.language) });
}

export interface HeatNowAction {
  /** The websocket message the button sends; a cancel says whether it is everyone's request. */
  message: { type: typeof START } | { type: typeof CANCEL; all: boolean };
  label: TextKey;
  values: Record<string, string>;
  primary: boolean;
}

const START = "hot_water_ready/heat_now/start";
const CANCEL = "hot_water_ready/heat_now/cancel";

/**
 * "Aquecer agora"; "Cancelar" withdraws the viewer's own request; "Avisar-me também" joins
 * someone else's; "Cancelar pedido de Maria e Ana" ends everyone's, for who may (spec 2, 4.6).
 */
export function heatNowActions(heater: HeaterSnapshot, context: ViewContext): HeatNowAction[] {
  // Nobody can ask during a fault or while the heater is run by hand (the server refuses), but a
  // request already running can still be cancelled.
  const canAsk = heater.can_ask_heat_now && !heater.heat_now_blocked && heater.automatic;
  const ask = (label: TextKey): HeatNowAction => ({ message: { type: START }, label, values: {}, primary: true });
  const request = heater.heat_now;
  if (!request) return canAsk ? [ask("heat_now.start")] : [];
  const actions: HeatNowAction[] = [];
  if (request.asked) {
    actions.push({ message: { type: CANCEL, all: false }, label: "heat_now.cancel", values: {}, primary: true });
  } else if (canAsk) {
    actions.push(ask("heat_now.join"));
  }
  const othersAsked = request.requesters.length > (request.asked ? 1 : 0);
  const cancelAll = { message: { type: CANCEL, all: true }, primary: false } as const;
  if (request.can_cancel_all && othersAsked) {
    const names = joinNames(namesOf(heater, request.requesters, context), context.language);
    actions.push({ ...cancelAll, label: "heat_now.cancel_all", values: { names } });
  } else if (request.can_cancel_all && !request.asked) {
    actions.push({ ...cancelAll, label: "heat_now.cancel", values: {} }); // an automation's request
  }
  return actions;
}

/** The red banner (spec 4.8): one line per active fault. */
export function faultBanner(heater: HeaterSnapshot, language: string): string[] {
  return heater.faults.map((fault) => localize(language, `fault.${fault}`));
}

export const SETTINGS_COMMAND = "hot_water_ready/settings/set";

// The same limits and steps as the target and margin number entities; the margin moves in half
// degrees here, which is fine enough on a phone.
const TARGET = { min: 30, max: 75, step: 0.5 };
const MARGIN = { min: 0, max: 5, step: 0.5 };
const CANCEL_RULES: CancelRule[] = ["requesters", "people", "everyone"];

/** The value one step down and one step up, or null past a limit. */
export interface Stepper {
  shown: string;
  down: number | null;
  up: number | null;
}

function stepper(value: number, limits: { min: number; max: number; step: number }, language: string): Stepper {
  // Rounded to the step, so 42.3 set elsewhere moves to 42.0 or 42.5 rather than 41.8 or 42.8.
  const down = Math.ceil(value / limits.step - 1e-9) * limits.step - limits.step;
  const up = Math.floor(value / limits.step + 1e-9) * limits.step + limits.step;
  return {
    shown: formatNumber(value, language, 1),
    down: down >= limits.min - 1e-9 ? down : null,
    up: up <= limits.max + 1e-9 ? up : null,
  };
}

export interface SettingsView {
  target: Stepper;
  margin: Stepper;
  /** Where heating stops and restarts. */
  band: string;
  automatic: boolean;
  cancel: { rule: CancelRule; label: TextKey; selected: boolean }[];
  /** Whether the "people" rule is chosen, so the sheet shows its list. */
  listsPeople: boolean;
  /** Under that rule, Home Assistant's people and whether each may cancel. */
  people: { id: string; name: string; on: boolean }[];
  solar: string;
  /** Checks this heater cannot have, such as "not rising" on a thermostat that never says. */
  notes: string[];
}

/** The settings sheet (spec 6), for an administrator only. */
export function settingsView(heater: HeaterSnapshot, context: ViewContext): SettingsView | undefined {
  const { language } = context;
  const settings = heater.settings;
  if (!heater.is_admin || !settings) return undefined;
  return {
    target: stepper(heater.target, TARGET, language),
    margin: stepper(heater.margin, MARGIN, language),
    band: localize(language, "settings.band", {
      stop: formatNumber(heater.target + heater.margin, language, 1),
      restart: formatNumber(heater.target - heater.margin, language, 1),
    }),
    automatic: heater.automatic,
    cancel: CANCEL_RULES.map((rule) => ({ rule, label: `cancel.${rule}`, selected: rule === settings.cancel_rule })),
    listsPeople: settings.cancel_rule === "people",
    people:
      settings.cancel_rule === "people"
        ? Object.entries(context.people ?? {})
            .map(([id, name]) => ({ id, name, on: settings.cancel_people.includes(id) }))
            .sort((a, b) => a.name.localeCompare(b.name))
        : [],
    solar: solarLine(settings, language),
    notes: heater.not_rising_checked ? [] : [localize(language, "note.not_rising_skipped")],
  };
}

/** The people who may cancel once one box is ticked or cleared. */
export function cancelPeopleWith(people: SettingsView["people"], id: string, on: boolean): string[] {
  return people.filter((person) => (person.id === id ? on : person.on)).map((person) => person.id);
}

/** The solar comparison sentence (spec 7), and how the rule did where it was applied. */
export function solarLine(settings: AdminSettings, language: string): string {
  const { windows, on_time: onTime, minutes_saved: saved, kwh } = settings.solar;
  if (windows === 0) return localize(language, "solar.none");
  const tense = settings.solar_aware ? "did" : "would";
  let line = localize(language, `solar.${tense}`, { on_time: onTime, windows });
  if (saved !== 0) {
    line += localize(language, `solar.${tense}_${saved > 0 ? "less" : "more"}`, { minutes: Math.abs(saved) });
    if (kwh !== null) line += localize(language, "solar.kwh", { kwh: formatNumber(Math.abs(kwh), language, 1) });
  }
  line += ".";
  const { solar_windows: applied, solar_on_time: appliedOnTime } = settings.solar;
  if (applied > 0) {
    line += localize(language, "solar.applied", { applied, on_time: appliedOnTime });
  }
  return line;
}

// ---------------------------------------------------------------- the week (Semana tab)

const DAY_START = 5 * 60; // the bars run from 05h...
const DAY_END = 24 * 60; // ...to midnight

/** Minutes since midnight, and the calendar day, of a moment in the house's time zone. */
function wallClock(iso: string, timeZone: string): { day: string; minutes: number } {
  const moment = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(moment)
    .reduce<Record<string, string>>((all, part) => ({ ...all, [part.type]: part.value }), {});
  return { day: dayKey(moment, timeZone), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export interface WeekDay {
  key: string;
  label: string;
  today: boolean;
  /** Heating, as fractions of the 05h to 24h day: where it starts and how long it lasts. */
  bars: { from: number; length: number }[];
}

export interface WeekRow {
  id: string;
  name: string;
  colour: string;
  initial: string;
  /** Away the whole week. */
  away: boolean;
  /** "ausente", "virtual · 2" or "5 por semana". */
  note: string;
  /** For each day, Monday first: the member's times, earliest first, and whether they are away. */
  cells: { times: string[]; away: boolean }[];
}

export interface WeekView {
  days: WeekDay[];
  /** Hour labels beside the heating bars, at their fraction of the 05h to 24h day. */
  hours: { label: string; at: number }[];
  rows: WeekRow[];
  showers: number;
  windows: number;
  /** The day with most showers, or "" when there are none. */
  busiest: string;
}

/** The household week, people by day (spec 6), for an administrator only. */
export function weekView(heater: HeaterSnapshot, context: ViewContext): WeekView | undefined {
  const week = heater.week;
  if (!heater.is_admin || !week) return undefined;
  const labels = localize(context.language, "week.days").split(",");
  const keys = labels.map((_, index) => addDays(week.monday, index));
  const rows = heater.members.map((member) => weekRow(member, keys, context.language));
  const perDay = keys.map((_, day) =>
    rows.reduce((count, row) => {
      const cell = row.cells[day];
      return cell && !cell.away ? count + cell.times.length : count;
    }, 0),
  );
  const most = Math.max(0, ...perDay);
  return {
    days: keys.map((key, index) => ({
      key,
      label: labels[index] ?? key,
      today: key === week.today,
      bars: dayBars(key, week.windows, context.timeZone),
    })),
    hours: [6, 12, 18, 24].map((hour) => ({
      label: `${String(hour).padStart(2, "0")}h`,
      at: (hour * 60 - DAY_START) / (DAY_END - DAY_START),
    })),
    rows,
    showers: perDay.reduce((sum, count) => sum + count, 0),
    windows: week.windows.length,
    busiest: most > 0 ? (labels[perDay.indexOf(most)] ?? "") : "",
  };
}

function addDays(day: string, count: number): string {
  let key = day;
  for (let step = 0; step < count; step += 1) key = nextDayKey(key);
  return key;
}

/** Whether a member is away on a day: away and, with a last day, not past it (spec 3.3). */
function awayOn(member: MemberSnapshot, day: string): boolean {
  return member.away.on && (member.away.until === null || day <= member.away.until);
}

function weekRow(member: MemberSnapshot, days: string[], language: string): WeekRow {
  const enabled = member.ready_times.filter((ready) => ready.enabled);
  const cells = days.map((key, day) => ({
    times: enabled
      .filter((ready) => ready.weekdays.includes(day))
      .map((ready) => ready.time)
      .sort(),
    away: awayOn(member, key),
  }));
  const awayAllWeek = cells.every((cell) => cell.away);
  const count = cells.reduce((sum, cell) => sum + cell.times.length, 0);
  let note = localize(language, "week.per_week", { count });
  if (awayAllWeek) note = localize(language, "week.away");
  else if (member.virtual) note = localize(language, "week.virtual", { count });
  return {
    id: member.id,
    name: member.name,
    colour: member.colour,
    initial: member.virtual ? "★" : (member.name[0] ?? "?"),
    away: awayAllWeek,
    note,
    cells,
  };
}

/** The windows' share of one day, clipped to 05h to 24h; a window across midnight is split. */
function dayBars(day: string, windows: TimeSpan[], timeZone: string): WeekDay["bars"] {
  const span = DAY_END - DAY_START;
  const bars: WeekDay["bars"] = [];
  for (const window of windows) {
    const start = wallClock(window.start, timeZone);
    const end = wallClock(window.end, timeZone);
    if (start.day > day || end.day < day) continue;
    const from = Math.max(DAY_START, start.day < day ? 0 : start.minutes);
    const to = Math.min(DAY_END, end.day > day ? DAY_END : end.minutes);
    if (to > from) bars.push({ from: (from - DAY_START) / span, length: (to - from) / span });
  }
  return bars;
}

/** The warning for showers close together that the tank cannot carry (spec 4.5); "" without. */
export function clusterWarning(heater: HeaterSnapshot, context: ViewContext): string {
  const warning = heater.cluster_warning;
  if (!warning) return "";
  return localize(context.language, "cluster.warning", {
    when: describeWhen(warning.at, context),
    needed: formatNumber(warning.needed, context.language, 0),
    cap: formatNumber(warning.cap, context.language, 1),
  });
}
