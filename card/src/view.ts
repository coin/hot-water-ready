// What the card shows, worked out from a heater snapshot without touching the DOM.

import { localeOf, localize, pickLanguage, weekdayLetters, type TextKey } from "./i18n";
import type { AdminSettings, HeaterSnapshot, MemberSnapshot, RateInfo, Status, TimeSpan } from "./types";

export interface ViewContext {
  language: string;
  /** The house's time zone (Home Assistant's), which ready times are in. */
  timeZone: string;
  now: Date;
  /** Home Assistant's people, entity id to name: who asked for heat now, who may cancel. */
  people?: Record<string, string>;
  /** Whether the user reads times on a 24-hour clock (see `uses24Hours`); 24-hour when absent. */
  hour24?: boolean;
}

export interface HeaterView {
  temperature: string;
  target: string;
  /** The status in capitals, as a badge (mockup A). */
  badge: string;
  headline: string;
  subline: string;
  /** The heater on or off and what it draws, as version 1's card; empty when unknown. */
  element: string;
  /** "A manter a água quente até às 18:25" after a heat-now message; empty otherwise. */
  keepHot: string;
  /** Ring fill, 0 to 1. */
  fill: number;
  tone: Status;
}

/**
 * Whether the user reads times on a 24-hour clock, decided as Home Assistant decides it from the
 * time format in their profile: "24" or "12", or else what their language (or the browser) uses.
 */
export function uses24Hours(timeFormat: string | undefined, language: string | undefined): boolean {
  if (timeFormat === "24") return true;
  if (timeFormat === "12") return false;
  const locale = timeFormat === "system" ? undefined : language;
  return !new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(new Date(2023, 0, 1, 22)).includes("10");
}

/** An hour and minute as the user reads them: "07:30", or "7:30 am" on a 12-hour clock. */
function hourMinute(hour: number, minute: number, language: string, hour24: boolean): string {
  if (hour24) return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return new Intl.DateTimeFormat(localeOf(language), {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
  }).format(Date.UTC(2000, 0, 1, hour, minute));
}

/** A ready time's "HH:MM" as the user reads times. */
export function wallTime(time: string, language: string, hour24 = true): string {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  return hourMinute(hour, minute, language, hour24);
}

/** A whole hour on its own: "06h" (24 as the end of the day), or "6 am" on a 12-hour clock. */
export function hourLabel(hour: number, language: string, hour24 = true): string {
  if (hour24) return `${String(hour).padStart(2, "0")}h`;
  return new Intl.DateTimeFormat(localeOf(language), { timeZone: "UTC", hour: "numeric", hourCycle: "h12" })
    .format(Date.UTC(2000, 0, 1, hour % 24));
}

/** The week's hint, naming the hours the heating bars cover as the user reads times. */
export function weekHint(language: string, hour24 = true): string {
  return localize(language, "week.hint", {
    start: hourLabel(DAY_START / 60, language, hour24),
    end: hourLabel(DAY_END / 60, language, hour24),
  });
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

/** "Maria às 07:00 e Tiago às 07:30": the ready times the open window heats for. */
function readyTimesOf(heater: HeaterSnapshot, entries: HeaterSnapshot["heating_for"], context: ViewContext): string {
  const items = entries.map((entry) =>
    localize(context.language, "item.at", {
      name: namesOf(heater, [entry.member], context)[0] ?? "",
      time: clock(entry.at, context),
    }),
  );
  return joinNames(items, context.language);
}

/**
 * Under the headline: who asked while heating for them, or whose ready time it heats for, when
 * heating starts, or the next time.
 */
function sublineOf(heater: HeaterSnapshot, context: ViewContext): string {
  const { language } = context;
  const requesters = heater.heat_now?.requesters ?? [];
  if (heater.status === "heating" && requesters.length > 0) {
    const names = namesOf(heater, requesters, context);
    return names.length === 1
      ? localize(language, "subline.asked_by_one", { name: names[0] ?? "" })
      : localize(language, "subline.asked_by_many", { names: joinNames(names, language) });
  }
  if (heater.status === "heating" && heater.heating_for.length > 0) {
    return localize(language, "subline.for", { list: readyTimesOf(heater, heater.heating_for, context) });
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

function elementOf(heater: HeaterSnapshot, language: string): string {
  if (heater.element_on === null) return "";
  const state = localize(language, heater.element_on ? "element.on" : "element.off");
  if (heater.power_w === null) return state;
  return localize(language, "element.drawing", { state, watts: formatNumber(heater.power_w, language, 0) });
}

export function heaterView(heater: HeaterSnapshot, context: ViewContext): HeaterView {
  const { language } = context;
  const { temperature } = heater;
  // While the viewer's own heat now runs, the ring shows the temperature it heats to (16).
  const own = heater.heat_now?.asked ? heater.heat_now.target : null;
  const target = own ?? heater.target;
  return {
    temperature: temperature === null ? "–" : `${formatNumber(temperature, language, 1)}°`,
    target: localize(language, "ring.target", { target: formatNumber(target, language, 1) }),
    badge: localize(language, `status.${heater.status}`).toLocaleUpperCase(localeOf(language)),
    headline: headlineOf(heater, context),
    subline: sublineOf(heater, context),
    element: elementOf(heater, language),
    keepHot: keepHotLine(heater, context),
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
  /** The ready time being changed; absent for a new one. */
  id?: string;
}

/** A new ready time starts at 07:00 on weekdays (mockup A). */
export function newSheet(): Sheet {
  return { time: "07:00", weekdays: [0, 1, 2, 3, 4] };
}

/** A new ready time needs a time and at least one day. */
/** The sheet for changing one of a member's ready times, filled with what it is now. */
export function editSheet(member: MemberSnapshot, readyTimeId: string): Sheet | undefined {
  const ready = member.ready_times.find((entry) => entry.id === readyTimeId);
  return ready && { id: ready.id, time: ready.time, weekdays: [...ready.weekdays].sort() };
}

export function sheetIsComplete(sheet: Sheet): boolean {
  return sheet.time !== "" && sheet.weekdays.length > 0;
}

/**
 * The popup that sets a ready time, as Android's clock sets an alarm: a dial first, where the hour
 * is picked and then the minute, or the time typed in two boxes after the keyboard button.
 */
export interface Clock {
  hour: number;
  minute: number;
  part: "hour" | "minute";
  mode: "dial" | "keys";
  hourText: string;
  minuteText: string;
  /** Opened by "Add": cancelling it drops the new ready time as well. */
  fresh: boolean;
}

/** The dial's size, in the units of its viewBox, and the radius of each ring of numbers. */
export const DIAL_SIZE = 256;
const DIAL_OUTER = 104;
const DIAL_INNER = 68;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** The hour as the header shows it: "07", or "7" on a 12-hour clock. */
function clockHourText(hour: number, hour24: boolean): string {
  return hour24 ? pad(hour) : String(hour % 12 || 12);
}

function clockTexts(clock: Pick<Clock, "hour" | "minute">, hour24: boolean): { hourText: string; minuteText: string } {
  return { hourText: clockHourText(clock.hour, hour24), minuteText: pad(clock.minute) };
}

export function openClock(time: string, fresh: boolean, hour24 = true): Clock {
  const [hour = 7, minute = 0] = time.split(":").map(Number);
  return { hour, minute, part: "hour", mode: "dial", ...clockTexts({ hour, minute }, hour24), fresh };
}

export interface DialMark {
  value: number;
  label: string;
  x: number;
  y: number;
}

/** Where the twelfth `index` of a turn, from the top clockwise, lies on a ring. */
function onRing(index: number, radius: number): { x: number; y: number } {
  const angle = (index * Math.PI) / 6;
  return { x: DIAL_SIZE / 2 + radius * Math.sin(angle), y: DIAL_SIZE / 2 - radius * Math.cos(angle) };
}

/**
 * The numbers on the dial. Hours on a 24-hour clock are two rings, as Android's: 0 to 11 outside
 * and 12 to 23 inside; on a 12-hour clock one ring, 12 at the top. Minutes go in fives.
 */
export function dialMarks(part: Clock["part"], hour24 = true): DialMark[] {
  const twelve = Array.from({ length: 12 }, (_, index) => index);
  if (part === "minute") {
    return twelve.map((index) => ({ value: index * 5, label: pad(index * 5), ...onRing(index, DIAL_OUTER) }));
  }
  if (!hour24) return twelve.map((index) => ({ value: index, label: String(index || 12), ...onRing(index, DIAL_OUTER) }));
  return [
    ...twelve.map((index) => ({ value: index, label: String(index), ...onRing(index, DIAL_OUTER) })),
    ...twelve.map((index) => ({ value: index + 12, label: String(index + 12), ...onRing(index, DIAL_INNER) })),
  ];
}

/** Whether a mark is the one the clock holds (on a 12-hour clock, the hour's place on the ring). */
export function dialMarkOn(clock: Clock, mark: DialMark, hour24 = true): boolean {
  if (clock.part === "minute") return clock.minute === mark.value;
  return (hour24 ? clock.hour : clock.hour % 12) === mark.value;
}

/** Where the hand ends for what the clock holds now. */
export function dialHand(clock: Clock, hour24 = true): { x: number; y: number } {
  if (clock.part === "minute") {
    const angle = (clock.minute * Math.PI) / 30;
    return { x: DIAL_SIZE / 2 + DIAL_OUTER * Math.sin(angle), y: DIAL_SIZE / 2 - DIAL_OUTER * Math.cos(angle) };
  }
  return onRing(clock.hour % 12, hour24 && clock.hour >= 12 ? DIAL_INNER : DIAL_OUTER);
}

/**
 * The clock after a touch on the dial at (x, y) in viewBox units. Hours snap to the nearest number
 * and, on a 24-hour clock, to the ring touched; on a 12-hour clock they keep the morning or the
 * afternoon. Minutes take any of the sixty.
 */
export function dialPick(clock: Clock, x: number, y: number, hour24 = true): Clock {
  const dx = x - DIAL_SIZE / 2;
  const dy = y - DIAL_SIZE / 2;
  const turn = (Math.atan2(dx, -dy) / (2 * Math.PI) + 1) % 1;
  if (clock.part === "minute") {
    const minute = Math.round(turn * 60) % 60;
    return { ...clock, minute, minuteText: pad(minute) };
  }
  const index = Math.round(turn * 12) % 12;
  const afternoon = hour24 ? Math.hypot(dx, dy) < (DIAL_OUTER + DIAL_INNER) / 2 : clock.hour >= 12;
  const hour = index + (afternoon ? 12 : 0);
  return { ...clock, hour, hourText: clockHourText(hour, hour24) };
}

/** One step of the dial by keyboard: an hour or a minute forward or back, round the clock. */
export function dialStep(clock: Clock, step: number, hour24 = true): Clock {
  if (clock.part === "minute") {
    const minute = (clock.minute + step + 60) % 60;
    return { ...clock, minute, minuteText: pad(minute) };
  }
  const hour = (clock.hour + step + 24) % 24;
  return { ...clock, hour, hourText: clockHourText(hour, hour24) };
}

/** Morning or afternoon on a 12-hour clock, keeping the hour's place on the dial. */
export function clockHalf(clock: Clock, afternoon: boolean): Clock {
  return { ...clock, hour: (clock.hour % 12) + (afternoon ? 12 : 0) };
}

/** What the two boxes say, as "HH:MM"; undefined while they do not make a time. */
export function typedTime(clock: Clock, hour24 = true): string | undefined {
  if (!/^\d{1,2}$/.test(clock.hourText) || !/^\d{1,2}$/.test(clock.minuteText)) return undefined;
  const typed = Number(clock.hourText);
  const minute = Number(clock.minuteText);
  if (minute > 59) return undefined;
  if (hour24) return typed > 23 ? undefined : `${pad(typed)}:${pad(minute)}`;
  if (typed < 1 || typed > 12) return undefined;
  return `${pad((typed % 12) + (clock.hour >= 12 ? 12 : 0))}:${pad(minute)}`;
}

/** The time the popup gives on OK: the dial's, or what was typed. */
export function clockTime(clock: Clock, hour24 = true): string | undefined {
  return clock.mode === "keys" ? typedTime(clock, hour24) : `${pad(clock.hour)}:${pad(clock.minute)}`;
}

/** Between the dial and the boxes; what was typed carries to the dial when it makes a time. */
export function switchClockMode(clock: Clock, hour24 = true): Clock {
  if (clock.mode === "dial") return { ...clock, mode: "keys", ...clockTexts(clock, hour24) };
  const [hour = clock.hour, minute = clock.minute] = typedTime(clock, hour24)?.split(":").map(Number) ?? [];
  return { ...clock, mode: "dial", part: "hour", hour, minute, ...clockTexts({ hour, minute }, hour24) };
}

export interface ReadyTimeRow {
  id: string;
  time: string;
  enabled: boolean;
  days: { letter: string; on: boolean }[];
}

/** A member's ready times as alarm-style rows, earliest first. */
export function readyTimeRows(member: MemberSnapshot, language: string, hour24 = true): ReadyTimeRow[] {
  const letters = weekdayLetters(language);
  return [...member.ready_times]
    .sort((a, b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id))
    .map((ready) => ({
      id: ready.id,
      time: wallTime(ready.time, language, hour24),
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
  const { minutes } = wallClock(iso, context.timeZone);
  return hourMinute(Math.floor(minutes / 60), minutes % 60, context.language, context.hour24 ?? true);
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

export const VISIBILITY_COMMAND = "hot_water_ready/visibility/set";

/**
 * The "Privado" switch (decision 15): shown only to whoever may set it, the member themselves or
 * an admin for a virtual member. While on, a line says who still sees the times.
 */
export function privacySwitch(
  member: MemberSnapshot,
  language: string,
): { label: string; on: boolean; hint: string } | null {
  if (!member.can_set_visibility) return null;
  const on = member.visibility === "private";
  const hint = on ? localize(language, member.virtual ? "visibility.hint_virtual" : "visibility.hint_own") : "";
  return { label: localize(language, "visibility.private"), on, hint };
}

/** "Ausente", "Ausente até 4 de Novembro", or nothing while the member is home. */
export function awayLine(member: MemberSnapshot, context: Pick<ViewContext, "language">): string {
  if (!member.away.on) return "";
  if (!member.away.until) return localize(context.language, "away.line");
  return localize(context.language, "away.line_until", { date: dayAndMonth(member.away.until, context.language) });
}

export interface HeatNowAction {
  /** The websocket message the button sends. */
  message: { type: typeof START | typeof CANCEL };
  label: TextKey;
}

const START = "hot_water_ready/heat_now/start";
const CANCEL = "hot_water_ready/heat_now/cancel";

/**
 * The heat-now button (spec 4.6): "Aquecer agora" while not heating; "Avisar-me quando estiver
 * quente" while it heats and the viewer has not asked; "Cancelar" for the only one who asked, and
 * "Não me avisar" for one of several (an automation counts), who leaves while it heats on.
 */
export function heatNowActions(heater: HeaterSnapshot): HeatNowAction[] {
  // Nobody can ask during a fault or while the heater is run by hand (the server refuses), but a
  // request already running can still be cancelled.
  const canAsk = heater.can_ask_heat_now && !heater.heat_now_blocked && heater.automatic;
  const request = heater.heat_now;
  if (request?.asked) {
    const alone = request.requesters.length === 1 && !request.unnamed;
    return [{ message: { type: CANCEL }, label: alone ? "heat_now.cancel" : "heat_now.leave" }];
  }
  if (!canAsk) return [];
  // Heating for the viewer's own ready time: they are told anyway.
  if (request === null && heater.heating_for.some((entry) => entry.member === heater.me)) return [];
  const heating = heater.status === "heating" || request !== null;
  return [{ message: { type: START }, label: heating ? "heat_now.join" : "heat_now.start" }];
}

/** Holding "Aquecer agora" (or "Avisar-me") opens the choice of how long to keep it hot. */
export function choosesKeepTime(action: HeatNowAction): boolean {
  return action.message.type === START;
}

/** How long a press must last to open the choice; Home Assistant's own hold is about this. */
export const HOLD_MS = 500;

/** The times offered after a hold, in minutes; the heater's default joins them if missing. */
export const KEEP_HOT_CHOICES = [5, 15, 30, 60, 120];

export interface KeepHotChoice {
  minutes: number;
  label: string;
  /** The heater's own time, picked when the choice opens. */
  isDefault: boolean;
}

export function keepHotChoices(heater: HeaterSnapshot, language: string): KeepHotChoice[] {
  const fallback = heater.keep_hot_minutes;
  const minutes = [...new Set([...KEEP_HOT_CHOICES, fallback])].sort((a, b) => a - b);
  return minutes.map((value) => ({
    minutes: value,
    label:
      value >= 60 && value % 60 === 0
        ? localize(language, "keep_hot.hours", { n: formatNumber(value / 60, language, 0) })
        : localize(language, "keep_hot.minutes", { n: formatNumber(value, language, 0) }),
    isDefault: value === fallback,
  }));
}

/** The temperatures an admin may ask heat now for (decision 16), as the server allows. */
export const HEAT_NOW_MIN_TARGET = 30;
export const HEAT_NOW_MAX_TARGET = 45;

export interface HeatNowTargetStepper {
  value: number;
  shown: string;
  /** The value one degree down or up, or null at the end of the range. */
  down: number | null;
  up: number | null;
}

/** Where the temperature starts: the heater's target, brought inside 30 to 45 °C. */
export function heatNowTargetStart(heater: HeaterSnapshot): number {
  return Math.min(Math.max(heater.target, HEAT_NOW_MIN_TARGET), HEAT_NOW_MAX_TARGET);
}

/** The − and + around a chosen temperature, one degree at a time. */
export function heatNowTargetStepper(value: number, language: string): HeatNowTargetStepper {
  const down = Math.max(Math.ceil(value) - 1, HEAT_NOW_MIN_TARGET);
  const up = Math.min(Math.floor(value) + 1, HEAT_NOW_MAX_TARGET);
  return {
    value,
    shown: `${formatNumber(value, language, Number.isInteger(value) ? 0 : 1)} °C`,
    down: down < value ? down : null,
    up: up > value ? up : null,
  };
}

/** What heat now sends for a chosen temperature: nothing when it is the heater's own target,
 * so the request goes on following the heater's target. */
export function heatNowTargetField(heater: HeaterSnapshot, value: number | undefined): { target?: number } {
  return value === undefined || value === heater.target ? {} : { target: value };
}

/** The line under the temperature: it is for this request only. */
export function heatNowTargetHint(heater: HeaterSnapshot, language: string): string {
  const digits = Number.isInteger(heater.target) ? 0 : 1;
  return localize(language, "heat_now_target.hint", { target: formatNumber(heater.target, language, digits) });
}

function keepHotLine(heater: HeaterSnapshot, context: ViewContext): string {
  const until = heater.heat_now?.keep_until;
  return until ? localize(context.language, "keep_hot.until", { time: clock(until, context) }) : "";
}

export const SWITCH_OFF_COMMAND = "hot_water_ready/switch_off";

/**
 * "Desligar o aquecimento…" shows to admins and the people they chose while it heats, and while
 * a heat-now request waits without heating (a fault, automatic control off), to end it.
 */
export function switchOffShown(heater: HeaterSnapshot): boolean {
  const waiting = (heater.heat_now?.requesters.length ?? 0) > 0 || Boolean(heater.heat_now?.unnamed);
  return heater.can_switch_off && (heater.status === "heating" || waiting);
}

/**
 * The confirmation before switching off: who loses out, the viewer left out, and when a ready
 * time is skipped (the viewer's own included), that it comes back on by itself.
 */
export function switchOffSheet(heater: HeaterSnapshot, context: ViewContext): { title: string; lines: string[] } {
  const { language } = context;
  const asked = (heater.heat_now?.requesters ?? []).filter((id) => id !== heater.viewer);
  const skipped = heater.heating_for.filter((entry) => entry.member !== heater.viewer);
  const lines: string[] = [];
  if (asked.length > 0) {
    const names = joinNames(namesOf(heater, asked, context), language);
    lines.push(localize(language, asked.length === 1 ? "switch_off.asked_one" : "switch_off.asked_many", { names }));
  }
  if (skipped.length > 0) {
    const list = readyTimesOf(heater, skipped, context);
    lines.push(localize(language, skipped.length === 1 ? "switch_off.skipped_one" : "switch_off.skipped_many", { list }));
  }
  if (lines.length === 0) lines.push(localize(language, "switch_off.nobody"));
  if (heater.heating_for.length > 0) lines.push(localize(language, "switch_off.back"));
  return { title: localize(language, "switch_off.title"), lines };
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
  /** Home Assistant's people, and whether each may switch off for everyone besides admins. */
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
    people: Object.entries(context.people ?? {})
      .map(([id, name]) => ({ id, name, on: settings.switch_off_people.includes(id) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    solar: solarLine(settings, language),
    notes: heater.not_rising_checked ? [] : [localize(language, "note.not_rising_skipped")],
  };
}

export const RATE_LIMITS = { min: 0.5, max: 60, step: 0.1 };
export const RECALCULATE_COMMAND = "hot_water_ready/rate/recalculate";
/** How long after the last tap a fixed rate is sent: each change reloads the heater. */
export const RATE_SEND_DELAY_MS = 1000;
/** How far the rate in use may be from physics before the card says something is wrong. */
export const PHYSICS_TOLERANCE = 0.25;

export interface RateView {
  /** The rate in use, "5,3". */
  shown: string;
  /** The rate in use to a tenth, what "Fixo" fixes it at. */
  used: number;
  fixed: boolean;
  /** Where the rate comes from, in a sentence. */
  source: string;
  /** The clean runs of the learning window, newest first. */
  runs: { when: string; rate: string }[];
  /** How the lead works out from the water now; null without a reading. */
  example: string | null;
  physics: string | null;
  /** The rate as the volume it amounts to heating, and whether it is too far from physics. */
  check: { line: string; warn: boolean } | null;
  /** One step either side of the fixed value; null limits as in `Stepper`. */
  stepper: Stepper;
  /** A value to fix instead, while fixed and different: learned, else physics, else default. */
  suggestion: { value: number; line: string } | null;
}

const tenth = (value: number): number => Math.round(value * 10) / 10;

/** "2 Nov, 04:10": when a heating run ended, in the house's time zone. */
function runWhen(iso: string, context: ViewContext): string {
  const moment = new Date(iso);
  const { language, timeZone } = context;
  // Separately: together, Portuguese gives "2/11".
  const day = new Intl.DateTimeFormat(localeOf(language), { timeZone, day: "numeric" }).format(moment);
  const month = new Intl.DateTimeFormat(localeOf(language), { timeZone, month: "short" }).format(moment).replace(".", "");
  return `${day} ${month.slice(0, 1).toLocaleUpperCase()}${month.slice(1)}, ${clock(iso, context)}`;
}

function rateSource(rate: RateInfo, language: string): string {
  if (rate.source === "manual") return localize(language, "rate.manual");
  if (rate.source === "learned") {
    return localize(language, "rate.learned", { count: rate.runs.length, days: rate.window_days });
  }
  const missing = Math.max(1, rate.min_runs - rate.runs.length);
  return localize(language, missing === 1 ? "rate.default_one" : "rate.default_many", {
    count: missing,
    days: rate.window_days,
  });
}

function rateExample(heater: HeaterSnapshot, rate: RateInfo, language: string): string | null {
  const water = heater.temperature;
  if (water === null) return null;
  const from = formatNumber(water, language, 1);
  const degrees = heater.target - water;
  if (degrees <= 0) return localize(language, "rate.example_warm", { from });
  const minutes = degrees * rate.used;
  const raw = minutes + rate.lead_margin_minutes;
  const lead = Math.min(rate.lead_cap_minutes, raw);
  return (
    localize(language, "rate.example", {
      from,
      to: formatNumber(heater.target, language, 1),
      degrees: formatNumber(degrees, language, 1),
      rate: formatNumber(rate.used, language, 1),
      minutes: Math.round(minutes),
      margin: rate.lead_margin_minutes,
      lead: Math.round(lead),
    }) + (raw > rate.lead_cap_minutes ? localize(language, "rate.example_cap") : "")
  );
}

/**
 * The rate as the volume it amounts to heating, warning when it is outside what physics allows:
 * from only the water above the element to the whole tank, with the tolerance either side.
 */
function physicsCheck(rate: RateInfo, language: string): RateView["check"] {
  if (rate.physics === null || rate.tank_litres === null) return null;
  const fast = rate.physics_fast ?? rate.physics;
  let line = localize(language, "rate.volume", {
    litres: Math.round((rate.tank_litres * rate.used) / rate.physics),
    tank: formatNumber(rate.tank_litres, language, 0),
  });
  const below = rate.used < fast * (1 - PHYSICS_TOLERANCE);
  const above = rate.used > rate.physics * (1 + PHYSICS_TOLERANCE);
  if (below || above) {
    const ratio = rate.used / (below ? fast : rate.physics);
    line += localize(language, below ? "rate.far_below" : "rate.far_above", {
      percent: Math.round(Math.abs(ratio - 1) * 100),
    });
  }
  return { line, warn: below || above };
}

function physicsLine(rate: RateInfo, language: string): string | null {
  if (rate.physics === null) return null;
  const slow = formatNumber(rate.physics, language, 1);
  const fast = formatNumber(rate.physics_fast ?? rate.physics, language, 1);
  return fast === slow
    ? localize(language, "rate.physics", { rate: slow })
    : localize(language, "rate.physics_range", { fast, slow });
}

function rateSuggestion(rate: RateInfo, language: string): RateView["suggestion"] {
  if (rate.source !== "manual") return null;
  const [value, key] =
    rate.learned !== null
      ? [rate.learned, "rate.suggested_learned" as const]
      : rate.physics !== null
        ? [rate.physics, "rate.suggested_physics" as const]
        : [rate.default, "rate.suggested_default" as const];
  const suggested = tenth(value);
  if (rate.manual !== null && tenth(rate.manual) === suggested) return null;
  return { value: suggested, line: localize(language, key, { rate: formatNumber(suggested, language, 1) }) };
}

/** One step either side of a fixed rate, within the settings page's limits. */
export function rateStepper(value: number, language: string): Stepper {
  const rounded = tenth(value);
  const down = tenth(rounded - RATE_LIMITS.step);
  const up = tenth(rounded + RATE_LIMITS.step);
  return {
    shown: formatNumber(rounded, language, 1),
    down: down >= RATE_LIMITS.min ? down : null,
    up: up <= RATE_LIMITS.max ? up : null,
  };
}

/** The heating speed section of the settings sheet: the rate, why, and what it means now. */
export function rateView(heater: HeaterSnapshot, context: ViewContext): RateView | undefined {
  const { language } = context;
  const rate = heater.settings?.rate;
  if (!heater.is_admin || !rate) return undefined;
  return {
    shown: formatNumber(rate.used, language, 1),
    used: tenth(rate.used),
    fixed: rate.source === "manual",
    source: rateSource(rate, language),
    runs: [...rate.runs]
      .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
      .map((run) => ({ when: runWhen(run.at, context), rate: formatNumber(run.rate, language, 1) })),
    example: rateExample(heater, rate, language),
    physics: physicsLine(rate, language),
    check: physicsCheck(rate, language),
    stepper: rateStepper(rate.used, language),
    suggestion: rateSuggestion(rate, language),
  };
}

/** The people who may switch off for everyone once one box is ticked or cleared. */
export function switchOffPeopleWith(people: SettingsView["people"], id: string, on: boolean): string[] {
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
  const rows = heater.members.map((member) => weekRow(member, keys, context.language, context.hour24 ?? true));
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
      label: hourLabel(hour, context.language, context.hour24 ?? true),
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

function weekRow(member: MemberSnapshot, days: string[], language: string, hour24: boolean): WeekRow {
  const enabled = member.ready_times.filter((ready) => ready.enabled);
  const cells = days.map((key, day) => ({
    times: enabled
      .filter((ready) => ready.weekdays.includes(day))
      .map((ready) => ready.time)
      .sort()
      .map((time) => wallTime(time, language, hour24)),
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
