// The Hot Water Ready card. Loaded by the integration on every dashboard (spec 6 and 8).

import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { localize, weekdayLetters } from "./i18n";
import { HeaterSubscription, fetchHeaters } from "./subscription";
import type { CardConfig, Hass, HeaterSnapshot, MemberSnapshot } from "./types";
import {
  heaterView,
  readyTimeRows,
  selectedMember,
  sheetIsComplete,
  showsAvatars,
  type Sheet,
  type ViewContext,
} from "./view";

const TAG = "hot-water-ready-card";
const RING_RADIUS = 38;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

export class HotWaterReadyCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _heater: { state: true },
    _missing: { state: true },
    _selected: { state: true },
    _sheet: { state: true },
    _error: { state: true },
  };

  hass?: Hass;
  private _config?: CardConfig;
  private _heater?: HeaterSnapshot;
  private _missing = false;
  private _selected: string | undefined;
  private _sheet: Sheet | undefined;
  private _error = "";
  private readonly _subscription = new HeaterSubscription(
    (snapshot) => {
      this._heater = snapshot;
      this._missing = false;
    },
    () => {
      this._missing = true;
    },
  );

  static async getStubConfig(hass: Hass): Promise<CardConfig> {
    const first = (await fetchHeaters(hass))[0];
    return first ? { type: `custom:${TAG}`, entry_id: first.entry_id } : { type: `custom:${TAG}` };
  }

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 6;
  }

  private get _language(): string {
    return this.hass?.locale?.language ?? this.hass?.language ?? "en";
  }

  private get _context(): ViewContext {
    return {
      language: this._language,
      timeZone: this.hass?.config?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      now: new Date(),
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._follow();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._subscription.stop();
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has("hass") || changed.has("_config")) this._follow();
  }

  private _follow(): void {
    if (this.hass && this._config && this.isConnected) {
      void this._subscription.follow(this.hass, this._config.entry_id);
    }
  }

  /** Send a command for this heater; true when it worked, else the error is shown. */
  private async _call(message: Record<string, unknown>): Promise<boolean> {
    if (!this.hass || !this._heater) return false;
    this._error = "";
    try {
      await this.hass.callWS({ entry_id: this._heater.entry_id, ...message });
      return true;
    } catch (err) {
      const text = err instanceof Error ? err.message : (err as { message?: string }).message;
      this._error = localize(this._language, "card.error", { message: text ?? String(err) });
      return false;
    }
  }

  private async _save(member: MemberSnapshot): Promise<void> {
    const sheet = this._sheet;
    if (!sheet || !sheetIsComplete(sheet)) return;
    const saved = await this._call({
      type: "hot_water_ready/ready_time/add",
      member_id: member.id,
      time: sheet.time,
      weekdays: [...sheet.weekdays].sort(),
    });
    if (saved) this._sheet = undefined; // on an error the sheet stays, with what was typed
  }

  protected override render(): unknown {
    const language = this._language;
    if (this._missing) {
      return html`<ha-card><div class="message">${localize(language, "card.no_heater")}</div></ha-card>`;
    }
    const heater = this._heater;
    if (!heater) {
      return html`<ha-card><div class="message">${localize(language, "card.loading")}</div></ha-card>`;
    }
    const member = selectedMember(heater, this._selected);
    return html`
      <ha-card>
        ${this._renderTop(heater)} ${this._renderAvatars(heater, member)}
        ${member ? this._renderList(member) : html`<div class="message">${localize(language, "members.none")}</div>`}
        ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
        ${member && this._sheet ? this._renderSheet(member, this._sheet) : nothing}
      </ha-card>
    `;
  }

  private _renderTop(heater: HeaterSnapshot): unknown {
    const view = heaterView(heater, this._context);
    return html`
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
          <div class="name">${heater.name}</div>
          <div class="headline ${view.tone}">${view.headline}</div>
          ${view.subline ? html`<div class="subline">${view.subline}</div>` : nothing}
        </div>
      </div>
    `;
  }

  private _renderAvatars(heater: HeaterSnapshot, selected: MemberSnapshot | undefined): unknown {
    if (!showsAvatars(heater)) return nothing;
    return html`
      <div class="avatars" role="tablist">
        ${heater.members.map(
          (member) => html`
            <button
              class="avatar ${member.id === selected?.id ? "selected" : ""}"
              role="tab"
              aria-selected=${member.id === selected?.id}
              @click=${() => {
                this._selected = member.id;
                this._sheet = undefined;
              }}
            >
              <span class="dot" style="background: var(--${member.colour}-color, var(--primary-color))"
                >${member.name.slice(0, 1).toUpperCase()}</span
              >
              <span class="label">${member.name}</span>
            </button>
          `,
        )}
      </div>
    `;
  }

  private _renderList(member: MemberSnapshot): unknown {
    const language = this._language;
    const rows = readyTimeRows(member, language);
    return html`
      <div class="list">
        ${rows.length === 0 ? html`<div class="empty">${localize(language, "list.empty")}</div>` : nothing}
        ${rows.map(
          (row) => html`
            <div class="row ${row.enabled ? "" : "off"}">
              <div class="time">${row.time}</div>
              <div class="days">
                ${row.days.map((day) => html`<span class="${day.on ? "on" : ""}">${day.letter}</span>`)}
              </div>
              ${member.can_edit
                ? html`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${localize(language, "list.switch")}
                      .checked=${row.enabled}
                      @change=${(event: Event) =>
                        this._call({
                          type: "hot_water_ready/ready_time/update",
                          member_id: member.id,
                          ready_time_id: row.id,
                          enabled: (event.target as HTMLInputElement).checked,
                        })}
                    />
                    <button
                      class="remove"
                      aria-label=${localize(language, "list.remove")}
                      @click=${() =>
                        this._call({
                          type: "hot_water_ready/ready_time/remove",
                          member_id: member.id,
                          ready_time_id: row.id,
                        })}
                    >
                      ×
                    </button>
                  `
                : nothing}
            </div>
          `,
        )}
        ${member.can_edit
          ? html`<button class="add" @click=${() => (this._sheet = { time: "07:00", weekdays: [...EVERY_DAY] })}>
              + ${localize(language, "list.add")}
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderSheet(member: MemberSnapshot, sheet: Sheet): unknown {
    const language = this._language;
    const letters = weekdayLetters(language);
    const toggle = (day: number) => {
      const weekdays = sheet.weekdays.includes(day)
        ? sheet.weekdays.filter((d) => d !== day)
        : [...sheet.weekdays, day];
      this._sheet = { ...sheet, weekdays };
    };
    return html`
      <div class="sheet" role="dialog" aria-label=${localize(language, "sheet.title")}>
        <div class="sheet-title">${localize(language, "sheet.title")}</div>
        <label class="field">
          ${localize(language, "sheet.time")}
          <input
            type="time"
            .value=${sheet.time}
            @input=${(event: Event) => {
              this._sheet = { ...sheet, time: (event.target as HTMLInputElement).value };
            }}
          />
        </label>
        <div class="field">
          ${localize(language, "sheet.days")}
          <div class="day-toggles">
            ${letters.map(
              (letter, day) =>
                html`<button
                  class="day ${sheet.weekdays.includes(day) ? "on" : ""}"
                  aria-pressed=${sheet.weekdays.includes(day)}
                  @click=${() => {
                    toggle(day);
                  }}
                >
                  ${letter}
                </button>`,
            )}
          </div>
        </div>
        <div class="actions">
          <button class="secondary" @click=${() => (this._sheet = undefined)}>${localize(language, "sheet.cancel")}</button>
          <button class="primary" ?disabled=${!sheetIsComplete(sheet)} @click=${() => this._save(member)}>
            ${localize(language, "sheet.save")}
          </button>
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      --hwr-ready: var(--success-color, #2e7d32);
      --hwr-heating: var(--warning-color, #ef6c00);
      --hwr-fault: var(--error-color, #c62828);
      --hwr-waiting: var(--info-color, #1565c0);
    }
    ha-card {
      position: relative;
      overflow: hidden;
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
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
    .name,
    .subline {
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
    .headline.heating {
      color: var(--hwr-heating);
    }
    .headline.fault {
      color: var(--hwr-fault);
    }
    .avatars {
      display: flex;
      gap: 14px;
      padding: 4px 16px 8px;
      overflow-x: auto;
    }
    .avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border: 0;
      background: none;
      padding: 0;
      min-width: 52px;
      opacity: 0.6;
    }
    .avatar.selected {
      opacity: 1;
    }
    .dot {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: var(--text-primary-color, #fff);
      font-weight: 700;
      font-size: 17px;
    }
    .avatar.selected .dot {
      box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 5px var(--primary-color);
    }
    .label {
      font-size: 12px;
    }
    .list {
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    }
    .row.off {
      opacity: 0.55;
    }
    .time {
      font-size: 26px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .days {
      flex: 1;
      display: flex;
      gap: 4px;
      font-size: 12px;
      color: var(--disabled-text-color, #9aa2ad);
    }
    .days .on {
      color: var(--primary-color);
      font-weight: 700;
    }
    .switch {
      width: 20px;
      height: 20px;
      accent-color: var(--primary-color);
    }
    .remove {
      border: 0;
      background: none;
      font-size: 20px;
      color: var(--secondary-text-color);
      min-width: 32px;
      min-height: 32px;
    }
    .add {
      min-height: 44px;
      border: 1px dashed var(--divider-color, #9aa2ad);
      border-radius: 12px;
      background: none;
      color: var(--primary-color);
      font-weight: 700;
    }
    .empty,
    .message {
      padding: 8px 0;
      color: var(--secondary-text-color);
    }
    .message {
      padding: 16px;
    }
    .error {
      margin: 0 16px 16px;
      color: var(--hwr-fault);
    }
    .sheet {
      margin: 0 16px 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-radius: 12px;
      border: 1px solid var(--divider-color, #ccc);
    }
    .sheet-title {
      font-weight: 700;
      font-size: 16px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .field input {
      font: inherit;
      font-size: 24px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, transparent);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 6px 8px;
    }
    .day-toggles {
      display: flex;
      gap: 6px;
    }
    .day {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, #ccc);
      background: none;
    }
    .day.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .actions button {
      min-height: 40px;
      padding: 0 16px;
      border-radius: 10px;
      border: 0;
      font-weight: 700;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .primary[disabled] {
      opacity: 0.5;
    }
    .secondary {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
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
