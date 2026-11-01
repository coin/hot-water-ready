// The Hot Water Ready card. Loaded by the integration on every dashboard (spec 6 and 8).

import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { localize } from "./i18n";
import type { CardConfig, Hass, HeaterSnapshot, HeaterSummary } from "./types";
import { heaterView } from "./view";

const TAG = "hot-water-ready-card";
const RING_RADIUS = 38;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export class HotWaterReadyCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _heater: { state: true },
    _missing: { state: true },
  };

  hass?: Hass;
  private _config?: CardConfig;
  private _heater?: HeaterSnapshot;
  private _missing = false;
  private _unsubscribe: Promise<() => Promise<void>> | undefined;
  private _subscribedTo: string | undefined;

  static async getStubConfig(hass: Hass): Promise<CardConfig> {
    const heaters = await hass.callWS<HeaterSummary[]>({ type: "hot_water_ready/heaters" });
    const first = heaters[0];
    return first ? { type: `custom:${TAG}`, entry_id: first.entry_id } : { type: `custom:${TAG}` };
  }

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 3;
  }

  private get _language(): string {
    return this.hass?.locale?.language ?? this.hass?.language ?? "en";
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void this._subscribe();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeNow();
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has("hass") || changed.has("_config")) void this._subscribe();
  }

  private _unsubscribeNow(): void {
    const unsubscribe = this._unsubscribe;
    this._unsubscribe = undefined;
    this._subscribedTo = undefined;
    void unsubscribe?.then((stop) => stop()).catch(() => undefined);
  }

  private async _subscribe(): Promise<void> {
    const hass = this.hass;
    if (!hass || !this._config || !this.isConnected) return;
    let entryId = this._config.entry_id;
    if (!entryId) {
      const heaters = await hass.callWS<HeaterSummary[]>({ type: "hot_water_ready/heaters" });
      entryId = heaters[0]?.entry_id;
      this._missing = entryId === undefined;
      if (!entryId) return;
    }
    if (this._subscribedTo === entryId) return;
    this._unsubscribeNow();
    this._subscribedTo = entryId;
    this._unsubscribe = hass.connection.subscribeMessage<HeaterSnapshot>(
      (heater) => {
        this._heater = heater;
        this._missing = false;
      },
      { type: "hot_water_ready/subscribe", entry_id: entryId },
    );
    this._unsubscribe.catch(() => {
      this._missing = true;
      this._subscribedTo = undefined;
    });
  }

  protected override render(): unknown {
    const language = this._language;
    if (this._missing) {
      return html`<ha-card><div class="message">${localize(language, "card.no_heater")}</div></ha-card>`;
    }
    if (!this._heater) {
      return html`<ha-card><div class="message">${localize(language, "card.loading")}</div></ha-card>`;
    }
    const view = heaterView(this._heater, language);
    return html`
      <ha-card>
        <div class="top">
          <svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${view.temperature} ${view.target}">
            <circle class="track" cx="46" cy="46" r=${RING_RADIUS}></circle>
            ${view.fill > 0
              ? svg`<circle class="fill ${view.tone}" cx="46" cy="46" r=${RING_RADIUS}
                  stroke-dasharray="${view.fill * RING_LENGTH} ${RING_LENGTH}"
                  transform="rotate(-90 46 46)"></circle>`
              : nothing}
            <text class="temperature" x="46" y="44">${view.temperature}</text>
            <text class="target" x="46" y="61">${view.target}</text>
          </svg>
          <div class="text">
            <div class="name">${this._heater.name}</div>
            <div class="headline ${view.tone}">${view.headline}</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  static override styles = css`
    :host {
      --hwr-ready: var(--success-color, #2e7d32);
      --hwr-heating: var(--warning-color, #ef6c00);
      --hwr-fault: var(--error-color, #c62828);
      --hwr-waiting: var(--info-color, #1565c0);
    }
    .top {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }
    .ring {
      width: 92px;
      height: 92px;
      flex: none;
    }
    .ring circle {
      fill: none;
      stroke-width: 9;
    }
    .track {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .fill {
      stroke-linecap: round;
      stroke: var(--hwr-waiting);
    }
    .fill.ready {
      stroke: var(--hwr-ready);
    }
    .fill.heating {
      stroke: var(--hwr-heating);
    }
    .fill.fault {
      stroke: var(--hwr-fault);
    }
    .temperature,
    .target {
      text-anchor: middle;
      fill: var(--primary-text-color);
    }
    .temperature {
      font-size: 20px;
      font-weight: 700;
    }
    .target {
      font-size: 11px;
      fill: var(--secondary-text-color);
    }
    .text {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .name {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .headline {
      font-size: 17px;
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .headline.ready {
      color: var(--hwr-ready);
    }
    .headline.fault {
      color: var(--hwr-fault);
    }
    .message {
      padding: 16px;
      color: var(--secondary-text-color);
    }
  `;
}

// The card is loaded both as a Lovelace resource and as an extra module (2026.10), so the
// second load must not define the element again.
if (!customElements.get(TAG)) {
  customElements.define(TAG, HotWaterReadyCard);
  const registry = window as unknown as { customCards?: unknown[] };
  registry.customCards = registry.customCards ?? [];
  registry.customCards.push({
    type: TAG,
    name: "Hot Water Ready",
    description: "Water temperature, ready times and heat now.",
    preview: true,
  });
}
