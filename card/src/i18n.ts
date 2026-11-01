// On-screen texts. English and European Portuguese; Portuguese (any region) gets pt.

const en = {
  "status.waiting": "Waiting",
  "status.heating": "Heating",
  "status.ready": "Ready",
  "status.fault": "Fault",
  "status.manual": "Manual",
  "headline.heating_for": "Heating: ready in about {minutes} min",
  "headline.ready_at": "Ready at {when}",
  "subline.next_at": "Next at {when}",
  "when.today": "{time}",
  "when.tomorrow": "{time} tomorrow",
  "when.weekday": "{time} on {weekday}",
  "ring.target": "target {target} °C",
  "weekday.letters": "M,T,W,T,F,S,S",
  "members.none": "No members yet. An administrator adds them in the integration's settings.",
  "list.empty": "No ready times yet.",
  "list.add": "Add a ready time",
  "list.remove": "Remove",
  "list.switch": "On or off",
  "sheet.title": "New ready time",
  "sheet.time": "Time",
  "sheet.days": "Days",
  "sheet.save": "Save",
  "sheet.cancel": "Cancel",
  "fault.sensor_unavailable": "Fault: the water temperature sensor gives no readings. Heating has stopped.",
  "fault.not_rising": "Fault: the water is not getting hotter. Heating has stopped; see Repairs.",
  "fault.no_consumption": "Fault: the heater draws no power. Heating has stopped; see Repairs.",
  "fault.relay_stuck": "Fault: the heater draws power while switched off. Check the relay.",
  "manual": "Automatic control is off: the heater is run by hand.",
  "note.not_rising_skipped": "The thermostat does not say when it is heating, so the \"water not getting hotter\" and \"heater draws no power\" checks are not made.",
  "heat_now.start": "Heat now",
  "heat_now.cancel": "Cancel",
  "heat_now.join": "Tell me too",
  "greeting": "Hello, {name}",
  "today.label": "House today",
  "today.nobody": "Nobody else today",
  "away.until_label": "Until (optional)",
  "away.line": "Away",
  "away.line_until": "Away until {date}",
  "members.add": "Member",
  "card.no_heater": "No Hot Water Ready heater is set up yet.",
  "card.loading": "Loading…",
  "card.error": "That did not work: {message}",
};

export type TextKey = keyof typeof en;

const pt: Record<TextKey, string> = {
  "status.waiting": "Em espera",
  "status.heating": "A aquecer",
  "status.ready": "Pronta",
  "status.fault": "Avaria",
  "status.manual": "Manual",
  "headline.heating_for": "A aquecer: pronta em cerca de {minutes} min",
  "headline.ready_at": "Pronta às {when}",
  "subline.next_at": "Próxima às {when}",
  "when.today": "{time}",
  "when.tomorrow": "{time} de amanhã",
  "when.weekday": "{time} de {weekday}",
  "ring.target": "alvo {target} °C",
  "weekday.letters": "S,T,Q,Q,S,S,D",
  "members.none": "Ainda não há membros. Um administrador acrescenta-os nas definições da integração.",
  "list.empty": "Ainda não há horários.",
  "list.add": "Acrescentar um horário",
  "list.remove": "Remover",
  "list.switch": "Ligar ou desligar",
  "sheet.title": "Novo horário",
  "sheet.time": "Hora",
  "sheet.days": "Dias",
  "sheet.save": "Guardar",
  "sheet.cancel": "Cancelar",
  "fault.sensor_unavailable": "Avaria: o sensor da temperatura da água não dá leituras. O aquecimento parou.",
  "fault.not_rising": "Avaria: a água não aquece. O aquecimento parou; veja as Reparações.",
  "fault.no_consumption": "Avaria: o aquecedor não consome energia. O aquecimento parou; veja as Reparações.",
  "fault.relay_stuck": "Avaria: o aquecedor consome energia com o relé desligado. Verifique o relé.",
  "manual": "O controlo automático está desligado: o aquecedor está a ser comandado manualmente.",
  "note.not_rising_skipped": "O termóstato não indica quando está a aquecer, por isso as verificações \"a água não aquece\" e \"o aquecedor não consome energia\" não são feitas.",
  "heat_now.start": "Aquecer agora",
  "heat_now.cancel": "Cancelar",
  "heat_now.join": "Avisar-me também",
  "greeting": "Olá, {name}",
  "today.label": "Casa hoje",
  "today.nobody": "Mais ninguém hoje",
  "away.until_label": "Até (opcional)",
  "away.line": "Ausente",
  "away.line_until": "Ausente até {date}",
  "members.add": "Membro",
  "card.no_heater": "Ainda não há nenhum aquecedor do Hot Water Ready configurado.",
  "card.loading": "A carregar…",
  "card.error": "Não foi possível: {message}",
};

export const translations: Record<"en" | "pt", Record<TextKey, string>> = { en, pt };

export type Language = keyof typeof translations;

export function pickLanguage(language: string | undefined): Language {
  return language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

/** The locale used for numbers, times and weekday names. */
export function localeOf(language: string | undefined): string {
  return pickLanguage(language) === "pt" ? "pt-PT" : "en-GB";
}

/** One letter per weekday, Monday first. */
export function weekdayLetters(language: string | undefined): string[] {
  return localize(language, "weekday.letters").split(",");
}

export function localize(
  language: string | undefined,
  key: TextKey,
  values: Record<string, string | number> = {},
): string {
  const text = translations[pickLanguage(language)][key];
  return text.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
