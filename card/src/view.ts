// What the card shows, worked out from a heater snapshot without touching the DOM.

import { localeOf, localize, weekdayLetters } from "./i18n";
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

/** "07:00", "07:00 de amanhã" or "07:30 de quinta-feira", in the house's time zone. */
export function describeWhen(iso: string, context: ViewContext): string {
  const { language, timeZone, now } = context;
  const moment = new Date(iso);
  const time = new Intl.DateTimeFormat(localeOf(language), {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(moment);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  if (dayKey(moment, timeZone) === dayKey(now, timeZone)) return localize(language, "when.today", { time });
  if (dayKey(moment, timeZone) === dayKey(tomorrow, timeZone)) {
    return localize(language, "when.tomorrow", { time });
  }
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

/** The member the card opens on: the viewer's own, else the first. */
export function defaultMemberId(heater: HeaterSnapshot): string | undefined {
  return heater.me ?? heater.members[0]?.id;
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
