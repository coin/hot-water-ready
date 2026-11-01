// What the card shows, worked out from a heater snapshot without touching the DOM.

import { localeOf, localize, pickLanguage, weekdayLetters, type TextKey } from "./i18n";
import type { HeaterSnapshot, MemberSnapshot, Status } from "./types";

export interface ViewContext {
  language: string;
  /** The house's time zone (Home Assistant's), which ready times are in. */
  timeZone: string;
  now: Date;
}

export interface HeaterView {
  temperature: string;
  target: string;
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

export function heaterView(heater: HeaterSnapshot, context: ViewContext): HeaterView {
  const { language } = context;
  const { temperature, target } = heater;
  const subline =
    heater.status === "ready" && heater.next_ready
      ? localize(language, "subline.next_at", { when: describeWhen(heater.next_ready.at, context) })
      : "";
  return {
    temperature: temperature === null ? "–" : `${formatNumber(temperature, language, 1)}°`,
    target: localize(language, "ring.target", { target: formatNumber(target, language, 1) }),
    headline: headlineOf(heater, context),
    subline,
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

/** "Tiago 07:00 · José 07:30": everyone else's ready times today, read-only. */
export function houseToday(heater: HeaterSnapshot, context: ViewContext, exceptMemberId: string): string {
  const names = new Map(heater.members.map((member) => [member.id, member.name]));
  const others = heater.today.filter((entry) => entry.member !== exceptMemberId);
  if (others.length === 0) return localize(context.language, "today.nobody");
  return others.map((entry) => `${names.get(entry.member) ?? "?"} ${clock(entry.at, context)}`).join(" · ");
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
  command: "hot_water_ready/heat_now/start" | "hot_water_ready/heat_now/cancel";
  label: TextKey;
  primary: boolean;
}

const START = "hot_water_ready/heat_now/start";
const CANCEL = "hot_water_ready/heat_now/cancel";

/** "Aquecer agora"; "Cancelar" for who asked; "Avisar-me também" for anyone else (spec 4.6). */
export function heatNowActions(heater: HeaterSnapshot): HeatNowAction[] {
  // During a fault nobody can ask, but a request already running can still be cancelled.
  const canAsk = heater.can_ask_heat_now && !heater.heat_now_blocked;
  const request = heater.heat_now;
  if (!request) return canAsk ? [{ command: START, label: "heat_now.start", primary: true }] : [];
  if (request.asked) return [{ command: CANCEL, label: "heat_now.cancel", primary: true }];
  const actions: HeatNowAction[] = canAsk ? [{ command: START, label: "heat_now.join", primary: true }] : [];
  if (request.can_cancel) actions.push({ command: CANCEL, label: "heat_now.cancel", primary: false });
  return actions;
}

/** The red banner (spec 4.8): one line per active fault. */
export function faultBanner(heater: HeaterSnapshot, language: string): string[] {
  return heater.faults.map((fault) => localize(language, `fault.${fault}`));
}

/** Notes only an administrator needs, such as a check the heater cannot support. */
export function adminNotes(heater: HeaterSnapshot, language: string): string[] {
  if (!heater.is_admin) return [];
  return heater.not_rising_checked ? [] : [localize(language, "note.not_rising_skipped")];
}
