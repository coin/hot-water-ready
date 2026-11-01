// On-screen texts. English and European Portuguese; Portuguese (any region) gets pt.

const en = {
  "status.waiting": "Waiting",
  "status.heating": "Heating",
  "status.ready": "Ready",
  "status.fault": "Fault",
  "status.manual": "Manual",
  "ring.target": "target {target} °C",
  "card.no_heater": "No Hot Water Ready heater is set up yet.",
  "card.loading": "Loading…",
};

export type TextKey = keyof typeof en;

const pt: Record<TextKey, string> = {
  "status.waiting": "Em espera",
  "status.heating": "A aquecer",
  "status.ready": "Pronta",
  "status.fault": "Avaria",
  "status.manual": "Manual",
  "ring.target": "alvo {target} °C",
  "card.no_heater": "Ainda não há nenhum aquecedor do Hot Water Ready configurado.",
  "card.loading": "A carregar…",
};

export const translations: Record<"en" | "pt", Record<TextKey, string>> = { en, pt };

export type Language = keyof typeof translations;

export function pickLanguage(language: string | undefined): Language {
  return language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function localize(
  language: string | undefined,
  key: TextKey,
  values: Record<string, string | number> = {},
): string {
  const text = translations[pickLanguage(language)][key];
  return text.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
