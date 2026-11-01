// What the card shows, worked out from a heater snapshot without touching the DOM.

import { localize, pickLanguage } from "./i18n";
import type { HeaterSnapshot, Status } from "./types";

export interface HeaterView {
  temperature: string;
  target: string;
  headline: string;
  /** Ring fill, 0 to 1. */
  fill: number;
  tone: Status;
}

function formatNumber(value: number, language: string, digits: number): string {
  return new Intl.NumberFormat(pickLanguage(language) === "pt" ? "pt-PT" : "en", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function heaterView(heater: HeaterSnapshot, language: string): HeaterView {
  const { temperature, target } = heater;
  return {
    temperature: temperature === null ? "–" : `${formatNumber(temperature, language, 1)}°`,
    target: localize(language, "ring.target", { target: formatNumber(target, language, 1) }),
    headline: localize(language, `status.${heater.status}`),
    fill: temperature === null || target <= 0 ? 0 : Math.min(1, Math.max(0, temperature / target)),
    tone: heater.status,
  };
}
