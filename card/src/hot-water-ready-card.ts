// The Hot Water Ready card. Loaded by the integration on every dashboard (spec 6 and 8).

import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { live } from "lit/directives/live.js";
import { localize, weekdayLetters } from "./i18n";
import { HeaterSubscription, fetchHeaters } from "./subscription";
import type { CardConfig, Hass, HeaterSnapshot, MemberSnapshot } from "./types";
import {
  SETTINGS_COMMAND,
  avatarViews,
  awayLine,
  clusterWarning,
  faultBanner,
  greeting,
  heatNowActions,
  heaterView,
  houseTodayChips,
  listHeader,
  newSheet,
  cancelPeopleWith,
  peopleOf,
  readyTimeRows,
  settingsView,
  sheetIsComplete,
  showsAvatarRow,
  shownMember,
  todayInHouse,
  viewMode,
  weekView,
  type SettingsView,
  type Sheet,
  type Stepper,
  type ViewContext,
  type WeekView,
} from "./view";

const TAG = "hot-water-ready-card";

type Tab = "people" | "week";
const RING_RADIUS = 38;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export class HotWaterReadyCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _heater: { state: true },
    _missing: { state: true },
    _selected: { state: true },
    _sheet: { state: true },
    _settingsOpen: { state: true },
    _tab: { state: true },
    _focus: { state: true },
    _error: { state: true },
  };

  hass?: Hass;
  private _config?: CardConfig;
  private _heater?: HeaterSnapshot;
  private _missing = false;
  private _selected: string | undefined;
  private _sheet: Sheet | undefined;
  private _settingsOpen = false;
  private _tab: Tab = "people";
  /** The person highlighted on the week, if any. */
  private _focus: string | undefined;
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
      people: peopleOf(this.hass?.states),
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
    const mode = viewMode(heater);
    const member = shownMember(heater, this._selected);
    const week = weekView(heater, this._context);
    return html`
      <ha-card>
        ${faultBanner(heater, language).map((line) => html`<div class="banner fault" role="alert">${line}</div>`)}
        ${heater.automatic ? nothing : html`<div class="banner manual">${localize(language, "manual")}</div>`}
        ${heater.cluster_warning
          ? html`<div class="banner warning" role="alert">${clusterWarning(heater, this._context)}</div>`
          : nothing}
        ${this._renderTop(heater)}
        ${this._renderSettings(heater)}
        ${this._renderTabs(heater)}
        ${week && this._tab === "week"
          ? this._renderWeek(week)
          : html`
              ${mode === "member"
                ? html`<div class="greeting">${greeting(heater, language)}</div>`
                : this._renderAvatars(heater, member)}
              ${mode === "member" && member ? this._renderToday(heater, member) : nothing}
              ${member
                ? html`<div class="panel">${this._renderListHead(member, mode === "member")} ${this._renderList(member)}</div>
                    ${this._sheet ? this._renderSheet(member, this._sheet) : nothing}`
                : html`<div class="message">${localize(language, "members.none")}</div>`}
            `}
        ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
      </ha-card>
    `;
  }

  /** Over the list: whose it is (or "Os meus horários"), and the away switch on the right (mockup A). */
  private _renderListHead(member: MemberSnapshot, own: boolean): unknown {
    const language = this._language;
    const head = listHeader(member, language);
    const line = awayLine(member, this._context);
    const set = (away: boolean, until: string | null) =>
      this._call({ type: "hot_water_ready/away/set", member_id: member.id, away, until });
    return html`
      <div class="list-head">
        <div class="list-title">
          <span>${own ? localize(language, "list.mine") : head.name}</span>
          ${own ? nothing : html`<span class="hint">${head.note}</span>`}
        </div>
        ${member.can_edit
          ? html`<label class="away-toggle">
              ${line || localize(language, "away.line")}
              <input
                type="checkbox"
                class="switch"
                .checked=${live(member.away.on)}
                @change=${(event: Event) => {
                  void set((event.target as HTMLInputElement).checked, null);
                }}
              />
            </label>`
          : line
            ? html`<span class="hint">${line}</span>`
            : nothing}
      </div>
      ${member.away.on
        ? html`<div class="paused">
            <span>${localize(language, "away.paused")}</span>
            ${member.can_edit
              ? html`<label class="until">
                  ${localize(language, "away.until_label")}
                  <input
                    type="date"
                    min=${todayInHouse(this._context)}
                    .value=${live(member.away.until ?? "")}
                    @change=${(event: Event) => {
                      void set(true, (event.target as HTMLInputElement).value || null);
                    }}
                  />
                </label>`
              : nothing}
          </div>`
        : nothing}
    `;
  }

  private _renderToday(heater: HeaterSnapshot, member: MemberSnapshot): unknown {
    const language = this._language;
    const chips = houseTodayChips(heater, this._context, member.id);
    return html`<div class="today">
      <span class="today-label">${localize(language, "today.label")}</span>
      ${chips.length === 0
        ? html`<span>${localize(language, "today.nobody")}</span>`
        : chips.map(
            (chip) => html`<span
              class="chip ${chip.mine ? "mine" : ""}"
              style=${chip.mine ? "" : `--chip: var(--${chip.colour}-color, var(--primary-color))`}
              >${chip.name} ${chip.time}</span
            >`,
          )}
    </div>`;
  }

  private _openIntegration(): void {
    // Members and the rarer settings live in the integration's own pages.
    history.pushState(null, "", "/config/integrations/integration/hot_water_ready");
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
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
          <div class="name-row">
            <div class="name">${heater.name}</div>
            <span class="badge ${view.tone}">${view.badge}</span>
            ${heater.settings
              ? html`<button
                  class="settings-button"
                  aria-label=${localize(this._language, "settings.open")}
                  aria-expanded=${this._settingsOpen}
                  @click=${() => (this._settingsOpen = !this._settingsOpen)}
                >
                  ⚙
                </button>`
              : nothing}
          </div>
          <div class="headline ${view.tone}">${view.headline}</div>
          ${view.subline ? html`<div class="subline">${view.subline}</div>` : nothing}
          <div class="heat-now">
            ${heatNowActions(heater, this._context).map(
              (item) => html`<button
                class=${item.primary ? "primary" : "secondary"}
                @click=${() => {
                  void this._call(item.message);
                }}
              >
                ${localize(this._language, item.label, item.values)}
              </button>`,
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderTabs(heater: HeaterSnapshot): unknown {
    if (!heater.week) return nothing; // the week is for administrators
    const tab = (name: Tab) => html`<button
      class="tab ${this._tab === name ? "on" : ""}"
      role="tab"
      aria-selected=${this._tab === name}
      @click=${() => (this._tab = name)}
    >
      ${localize(this._language, `tabs.${name}`)}
    </button>`;
    return html`<div class="tabs" role="tablist">${tab("people")}${tab("week")}</div>`;
  }

  private _renderWeek(week: WeekView): unknown {
    const language = this._language;
    const focus = this._focus;
    return html`
      <div class="week">
        <div class="totals">
          <div><b>${week.showers}</b><span>${localize(language, "week.showers")}</span></div>
          <div><b>${week.windows}</b><span>${localize(language, "week.windows")}</span></div>
          <div><b>${week.busiest || "-"}</b><span>${localize(language, "week.busiest")}</span></div>
        </div>
        <div class="grid">
          <span></span>
          ${week.days.map((day) => html`<span class="head ${day.today ? "is-today" : ""}">${day.label}</span>`)}
          ${week.rows.map(
            (row) => html`
              <button
                class="who ${row.away ? "away" : ""} ${focus && focus !== row.id ? "dim" : ""}"
                aria-pressed=${focus === row.id}
                @click=${() => (this._focus = focus === row.id ? undefined : row.id)}
              >
                <span class="mini" style="background: var(--${row.colour}-color, var(--primary-color))"
                  >${row.initial}</span
                >
                <span class="who-text"><span>${row.name}</span><span class="hint">${row.note}</span></span>
              </button>
              ${row.cells.map(
                (cell, index) => html`<div
                  class="cell ${week.days[index]?.today ? "is-today" : ""} ${focus && focus !== row.id ? "dim" : ""}"
                >
                  ${cell.times.map(
                    (time) => html`<span
                      class="tag ${cell.away ? "away" : ""}"
                      style=${cell.away ? "" : `background: var(--${row.colour}-color, var(--primary-color))`}
                      >${time}</span
                    >`,
                  )}
                </div>`,
              )}
            `,
          )}
          <span class="heating-label">${localize(language, "week.heating")}</span>
          <div class="hours">
            ${week.hours.map(
              (hour) => html`<span class="hint" style="top: ${(hour.at * 100).toFixed(1)}%">${hour.label}</span>`,
            )}
          </div>
          ${week.days.map(
            (day) => html`<div class="bar ${day.today ? "is-today" : ""}">
              ${day.bars.map(
                (bar) =>
                  html`<span
                    class="heat"
                    style="top: ${(bar.from * 100).toFixed(1)}%; height: max(3px, ${(bar.length * 100).toFixed(1)}%)"
                  ></span>`,
              )}
            </div>`,
          )}
        </div>
        <div class="hint">${localize(language, "week.hint")}</div>
      </div>
    `;
  }

  private _renderSettings(heater: HeaterSnapshot): unknown {
    const language = this._language;
    const view = this._settingsOpen ? settingsView(heater, this._context) : undefined;
    if (!view) return nothing;
    const set = (changes: Record<string, unknown>) => this._call({ type: SETTINGS_COMMAND, ...changes });
    return html`
      <div class="sheet settings" role="dialog" aria-label=${localize(language, "settings.open")}>
        <div class="sheet-head">
          <div class="sheet-title">${localize(language, "settings.open")}</div>
          <button class="secondary" @click=${() => (this._settingsOpen = false)}>
            ${localize(language, "settings.close")}
          </button>
        </div>
        ${this._renderStepper(
          view.target,
          `${view.target.shown} °C`,
          localize(language, "settings.target"),
          localize(language, "settings.target_hint"),
          ["settings.target_down", "settings.target_up"],
          (target) => set({ target }),
        )}
        ${this._renderStepper(
          view.margin,
          `± ${view.margin.shown}`,
          localize(language, "settings.margin"),
          view.band,
          ["settings.margin_down", "settings.margin_up"],
          (margin) => set({ margin }),
        )}
        <label class="setting">
          <span class="setting-text">
            <span>${localize(language, "settings.automatic")}</span>
            <span class="hint">${localize(language, "settings.automatic_hint")}</span>
          </span>
          <input
            type="checkbox"
            class="switch"
            .checked=${live(view.automatic)}
            @change=${(event: Event) => set({ automatic: (event.target as HTMLInputElement).checked })}
          />
        </label>
        <div class="setting column">
          <span>${localize(language, "settings.cancel")}</span>
          <div class="choices" role="radiogroup">
            ${view.cancel.map(
              (option) => html`<button
                class="choice ${option.selected ? "on" : ""}"
                role="radio"
                aria-checked=${option.selected}
                @click=${() => set({ cancel_rule: option.rule })}
              >
                ${localize(language, option.label)}
              </button>`,
            )}
          </div>
          ${view.listsPeople
            ? html`<div class="people" role="group" aria-label=${localize(language, "settings.cancel_people")}>
                <span class="hint">${localize(language, "settings.cancel_people")}</span>
                ${view.people.length === 0 ? html`<span class="hint">${localize(language, "settings.no_people")}</span>` : nothing}
                ${view.people.map(
                  (person) => html`<label class="person">
                    <input
                      type="checkbox"
                      .checked=${live(person.on)}
                      @change=${(event: Event) => {
                        const on = (event.target as HTMLInputElement).checked;
                        void set({ cancel_people: cancelPeopleWith(view.people, person.id, on) });
                      }}
                    />
                    ${person.name}
                  </label>`,
                )}
              </div>`
            : nothing}
        </div>
        ${this._renderSolar(view)}
        <button
          class="link"
          @click=${() => {
            this._openIntegration();
          }}
        >
          ${localize(language, "settings.more")}</button>
      </div>
    `;
  }

  private _renderStepper(
    stepper: Stepper,
    shown: string,
    label: string,
    hint: string,
    names: ["settings.target_down" | "settings.margin_down", "settings.target_up" | "settings.margin_up"],
    change: (value: number) => Promise<boolean>,
  ): unknown {
    const button = (value: number | null, name: (typeof names)[number], sign: string) => html`<button
      class="step"
      aria-label=${localize(this._language, name)}
      ?disabled=${value === null}
      @click=${() => (value === null ? undefined : change(value))}
    >
      ${sign}
    </button>`;
    return html`<div class="setting">
      <span class="setting-text"><span>${label}</span><span class="hint">${hint}</span></span>
      ${button(stepper.down, names[0], "−")}
      <span class="value">${shown}</span>
      ${button(stepper.up, names[1], "+")}
    </div>`;
  }

  private _renderSolar(view: SettingsView): unknown {
    const language = this._language;
    return html`<div class="setting column solar">
      <span>${localize(language, "solar.title")}</span>
      <span class="hint">${view.solar}</span>
      ${view.notes.map((note) => html`<span class="hint">${note}</span>`)}
    </div>`;
  }

  private _renderAvatars(heater: HeaterSnapshot, selected: MemberSnapshot | undefined): unknown {
    if (!showsAvatarRow(heater)) return nothing;
    const canAddMembers = viewMode(heater) === "admin";
    return html`
      <div class="avatars" role="tablist">
        ${avatarViews(heater, selected?.id).map(
          (avatar) => html`
            <button
              class="avatar ${avatar.selected ? "selected" : ""} ${avatar.faded ? "faded" : ""}"
              role="tab"
              aria-selected=${avatar.selected}
              @click=${() => {
                this._selected = avatar.id;
                this._sheet = undefined;
              }}
            >
              <span class="dot" style="background: var(--${avatar.colour}-color, var(--primary-color))"
                >${avatar.initial}${avatar.star ? html`<span class="star">★</span>` : nothing}</span
              >
              <span class="label">${avatar.name}</span>
            </button>
          `,
        )}
        ${canAddMembers
          ? html`<button
              class="avatar add-member"
              @click=${() => {
                this._openIntegration();
              }}
            >
              <span class="dot plus">+</span>
              <span class="label">${localize(this._language, "members.add")}</span>
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderList(member: MemberSnapshot): unknown {
    const language = this._language;
    const rows = readyTimeRows(member, language);
    return html`
      <div class="list ${member.away.on ? "paused-list" : ""}">
        ${rows.length === 0 ? html`<div class="empty">${localize(language, "list.empty")}</div>` : nothing}
        ${rows.map(
          (row) => html`
            <div class="row ${row.enabled ? "" : "off"}">
              <div class="row-text">
                <div class="time">${row.time}</div>
                <div class="days">
                  ${row.days.map((day) => html`<span class="${day.on ? "on" : ""}">${day.letter}</span>`)}
                </div>
              </div>
              ${member.can_edit
                ? html`
                    <input
                      type="checkbox"
                      class="switch"
                      aria-label=${localize(language, "list.switch")}
                      .checked=${live(row.enabled)}
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
          ? html`<button class="add" @click=${() => (this._sheet = newSheet())}>
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
      font-size: 10px; /* "target 42.5 °C" must fit inside the ring */
      fill: var(--secondary-text-color);
    }
    .text {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .tabs {
      display: flex;
      gap: 6px;
      padding: 0 16px 10px;
    }
    .tab {
      flex: 1;
      min-height: 36px;
      border: 0;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      font-weight: 700;
    }
    .tab.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .week {
      padding: 0 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .totals {
      display: flex;
      gap: 8px;
    }
    .totals div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 4px;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      font-size: 11px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .totals b {
      font-size: 18px;
      color: var(--primary-text-color);
    }
    .grid {
      display: grid;
      /* Fixed person column, so a long name never pushes Sunday off a phone screen. */
      grid-template-columns: 58px repeat(7, minmax(0, 1fr));
      gap: 3px;
      align-items: stretch;
      font-size: 11px;
    }
    .head {
      text-align: center;
      font-weight: 700;
      padding: 2px 0;
      border-radius: 6px;
    }
    .head.is-today {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .who {
      display: flex;
      align-items: center;
      gap: 4px;
      border: 0;
      background: none;
      padding: 2px 0;
      text-align: left;
      min-width: 0;
    }
    .who-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }
    .who-text span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mini {
      flex: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: var(--text-primary-color, #fff);
      font-weight: 700;
    }
    .who.away,
    .dim {
      opacity: 0.35;
    }
    .cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
      min-width: 0;
      padding: 2px 0;
      border-radius: 6px;
    }
    .cell.is-today,
    .bar.is-today {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    }
    .tag {
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      font-size: 9.5px;
      padding: 1px 2px;
      border-radius: 4px;
      color: var(--text-primary-color, #fff);
      font-variant-numeric: tabular-nums;
    }
    .tag.away {
      color: var(--secondary-text-color);
      text-decoration: line-through;
    }
    .heating-label {
      grid-column: 1 / -1;
      font-weight: 700;
      padding-top: 6px;
    }
    .hours {
      position: relative;
    }
    .hours span {
      position: absolute;
      right: 4px;
      transform: translateY(-50%);
      font-size: 10px;
    }
    .bar {
      position: relative;
      height: 150px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .heat {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: 3px;
      background: var(--hwr-heating);
    }
    .name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .badge {
      margin-left: auto;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--text-primary-color, #fff);
      background: var(--hwr-waiting);
    }
    .badge.ready {
      background: var(--hwr-ready);
    }
    .badge.heating {
      background: var(--hwr-heating);
    }
    .badge.fault {
      background: var(--hwr-fault);
    }
    .badge.manual {
      background: var(--secondary-text-color);
    }
    .settings-button {
      border: 0;
      background: none;
      font-size: 20px;
      min-width: 40px;
      min-height: 40px;
      color: var(--secondary-text-color);
    }
    .sheet-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sheet-head button,
    .step,
    .choice {
      min-height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      border: 0;
      font-weight: 700;
    }
    .setting {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }
    .setting.column {
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
    }
    .setting-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .step {
      min-width: 40px;
      padding: 0;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .step[disabled] {
      opacity: 0.4;
    }
    .value {
      min-width: 64px;
      text-align: center;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .choices {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .choice {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      font-weight: 400;
    }
    .choice.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .link {
      align-self: flex-start;
      border: 0;
      background: none;
      padding: 0;
      color: var(--primary-color);
      font-weight: 700;
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
    .avatar.faded .dot {
      opacity: 0.4;
    }
    .dot {
      position: relative;
    }
    .star {
      position: absolute;
      right: -4px;
      top: -4px;
      font-size: 13px;
      color: var(--warning-color, #ef6c00);
    }
    .dot.plus {
      background: none;
      border: 2px dashed var(--divider-color, #9aa2ad);
      color: var(--secondary-text-color);
      box-sizing: border-box;
    }
    .add-member {
      opacity: 1;
    }
    .greeting {
      padding: 0 16px 8px;
      font-size: 18px;
      font-weight: 700;
    }
    .today {
      margin: 0 16px 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }
    .away-toggle,
    .until {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .until input {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, transparent);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 4px 6px;
    }
    .panel {
      margin: 0 16px 16px;
      padding: 16px 16px 4px;
      border-radius: 20px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .list-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .list-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 17px;
      font-weight: 800;
      min-width: 0;
    }
    .paused {
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--warning-color, #ef6c00) 14%, transparent);
    }
    .paused-list .row {
      opacity: 0.45;
    }
    .chip {
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 13px;
      color: var(--text-primary-color, #fff);
      background: var(--chip, var(--primary-color));
      font-variant-numeric: tabular-nums;
    }
    .chip.mine {
      background: none;
      color: var(--primary-color);
      box-shadow: inset 0 0 0 2px var(--primary-color);
      font-weight: 700;
    }
    .people {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 4px;
    }
    .person {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .today-label {
      font-weight: 700;
      color: var(--primary-text-color);
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
      margin-top: 8px;
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }
    .row-text {
      flex: 1;
      min-width: 0;
    }
    .row.off {
      opacity: 0.55;
    }
    .time {
      font-size: 38px;
      font-weight: 500;
      line-height: 1;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }
    .days {
      display: flex;
      gap: 4px;
      margin-top: 8px;
    }
    .days span {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--disabled-text-color, #9aa2ad);
    }
    .days .on {
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
    }
    /* An on/off toggle drawn on a checkbox, as in mockup A. */
    .switch {
      appearance: none;
      -webkit-appearance: none;
      position: relative;
      flex: none;
      margin: 0;
      width: 46px;
      height: 28px;
      border-radius: 14px;
      cursor: pointer;
      background: var(--switch-unchecked-track-color, var(--disabled-text-color, #9aa2ad));
      transition: background 0.15s;
    }
    .switch::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--switch-unchecked-button-color, #fff);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      transition: left 0.15s;
    }
    .switch:checked {
      background: var(--switch-checked-track-color, var(--primary-color));
    }
    .switch:checked::before {
      left: 21px;
      background: var(--switch-checked-button-color, #fff);
    }
    .away-toggle .switch:checked {
      background: var(--warning-color, #ef6c00);
    }
    .row .switch {
      width: 52px;
      height: 32px;
      border-radius: 16px;
    }
    .row .switch::before {
      top: 4px;
      left: 4px;
      width: 24px;
      height: 24px;
    }
    .row .switch:checked::before {
      left: 24px;
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
      margin: 12px 0;
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
    .banner {
      margin: 12px 16px 0;
      padding: 10px 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
    }
    .banner.fault {
      background: var(--hwr-fault);
      color: var(--text-primary-color, #fff);
    }
    .banner.warning {
      background: var(--hwr-heating);
      color: var(--text-primary-color, #fff);
    }
    .banner.manual {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .heat-now {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .heat-now button {
      min-height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      border: 0;
      font-weight: 700;
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
