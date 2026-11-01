import { describe, expect, it } from "vitest";
import { heaterView } from "../src/view";
import { translations } from "../src/i18n";
import type { HeaterSnapshot } from "../src/types";

const cold: HeaterSnapshot = {
  entry_id: "abc",
  name: "Cilindro",
  temperature: 39.6,
  target: 42,
  status: "waiting",
};

describe("heaterView", () => {
  it("shows the temperature with a Portuguese decimal comma", () => {
    expect(heaterView(cold, "pt").temperature).toBe("39,6°");
  });

  it("shows the temperature with an English decimal point", () => {
    expect(heaterView(cold, "en").temperature).toBe("39.6°");
  });

  it("names the target", () => {
    expect(heaterView(cold, "pt").target).toBe("alvo 42 °C");
    expect(heaterView(cold, "en").target).toBe("target 42 °C");
  });

  it("says the water is waiting when below target", () => {
    expect(heaterView(cold, "pt").headline).toBe("Em espera");
  });

  it("says the water is ready at target", () => {
    const view = heaterView({ ...cold, temperature: 42.3, status: "ready" }, "pt");
    expect(view.headline).toBe("Pronta");
    expect(view.tone).toBe("ready");
  });

  it("fills the ring in proportion to the target, never past full", () => {
    expect(heaterView(cold, "en").fill).toBeCloseTo(39.6 / 42);
    expect(heaterView({ ...cold, temperature: 55 }, "en").fill).toBe(1);
  });

  it("shows a dash and an empty ring without a reading", () => {
    const view = heaterView({ ...cold, temperature: null }, "pt");
    expect(view.temperature).toBe("–");
    expect(view.fill).toBe(0);
  });

  it("falls back to English for other languages", () => {
    expect(heaterView(cold, "de").headline).toBe("Waiting");
  });

  it("uses European Portuguese for Brazilian Portuguese too", () => {
    expect(heaterView(cold, "pt-BR").headline).toBe("Em espera");
  });
});

describe("translations", () => {
  it("has every English text in Portuguese", () => {
    expect(Object.keys(translations.pt).sort()).toEqual(Object.keys(translations.en).sort());
  });
});
