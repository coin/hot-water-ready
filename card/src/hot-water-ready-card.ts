// The Hot Water Ready card. Loaded by the integration on every dashboard (spec 6 and 8).

import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { live } from "lit/directives/live.js";
import { localeOf, localize, weekdayLetters } from "./i18n";
import { HeaterSubscription, fetchHeaters } from "./subscription";
import type { CardConfig, Hass, HeaterSnapshot, MemberSnapshot } from "./types";
import {
  RATE_SEND_DELAY_MS,
  RECALCULATE_COMMAND,
  SETTINGS_COMMAND,
  SWITCH_OFF_COMMAND,
  avatarViews,
  awayLine,
  privacySwitch,
  VISIBILITY_COMMAND,
  clusterWarning,
  faultBanner,
  greeting,
  heatNowActions,
  choosesKeepTime,
  keepHotChoices,
  heatNowTargetField,
  heatNowTargetHint,
  heatNowTargetStart,
  heatNowTargetStepper,
  HOLD_MS,
  heaterView,
  houseTodayChips,
  listHeader,
  newSheet,
  editSheet,
  switchOffPeopleWith,
  peopleOf,
  readyTimeRows,
  openClock,
  dialMarks,
  dialMarkOn,
  dialHand,
  dialPick,
  dialStep,
  clockHalf,
  clockTime,
  switchClockMode,
  DIAL_SIZE,
  wallTime,
  type Clock,
  uses24Hours,
  weekHint,
  rateStepper,
  rateView,
  settingsView,
  type RateView,
  sheetIsComplete,
  switchOffSheet,
  switchOffShown,
  showsAvatarRow,
  shownMember,
  todayInHouse,
  viewMode,
  weekView,
  type SettingsView,
  type Sheet,
  type ReadyTimeRow,
  type Stepper,
  type ViewContext,
  type HeatNowAction,
  type WeekView,
} from "./view";

/** Material's "keyboard" and "schedule" icons, for the popup's switch between typing and the dial. */
const KEYBOARD_ICON = svg`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>`;
const CLOCK_ICON = svg`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`;

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
    _clock: { state: true },
    _settingsOpen: { state: true },
    _memberSettings: { state: true },
    _offOpen: { state: true },
    _keep: { state: true },
    _holding: { state: true },
    _tab: { state: true },
    _focus: { state: true },
    _error: { state: true },
    _rateDraft: { state: true },
    _recalc: { state: true },
  };

  hass?: Hass;
  private _config?: CardConfig;
  private _heater?: HeaterSnapshot;
  private _missing = false;
  private _selected: string | undefined;
  private _sheet: Sheet | undefined;
  /** The popup setting the sheet's time, over the sheet. */
  private _clock: Clock | undefined;
  private _settingsOpen = false;
  /** The member whose own settings (the "Privado" switch) are open, behind their ⚙. */
  private _memberSettings: string | undefined;
  /** The "Desligar o aquecimento?" confirmation is open. */
  private _offOpen = false;
  /** The choice of how long to keep it hot, open for the button that was held, and the time picked. */
  /** The keep-hot sheet: the action, the time picked and, for an admin, the temperature. */
  private _keep: { action: HeatNowAction; minutes: number; target?: number } | undefined;
  /** The button is being held: its fill runs while the hold lasts. */
  private _holding = false;
  private _holdTimer: number | undefined;
  /** The hold opened the choice, so the click that ends it must not also send the request. */
  private _held = false;
  private _tab: Tab = "people";
  /** The person highlighted on the week, if any. */
  private _focus: string | undefined;
  private _error = "";
  /** The fixed rate being stepped, sent once the taps stop (each change reloads the entry). */
  private _rateDraft: number | undefined;
  private _rateTimer: number | undefined;
  /** The recalculation from history: running, or what it found. */
  private _recalc: { busy: boolean; line: string } = { busy: false, line: "" };
  private readonly _subscription = new HeaterSubscription(
    (snapshot) => {
      this._heater = snapshot;
      this._missing = false;
      // The fixed rate stepped to has arrived: show the heater's value again.
      if (snapshot.settings?.rate.manual === this._rateDraft) this._rateDraft = undefined;
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

  private get _hour24(): boolean {
    return uses24Hours(this.hass?.locale?.time_format, this._language);
  }

  private get _context(): ViewContext {
    return {
      language: this._language,
      timeZone: this.hass?.config?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      now: new Date(),
      people: peopleOf(this.hass?.states),
      hour24: this._hour24,
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
    if (changed.has("_offOpen") && this._offOpen) {
      // Focus starts on "Cancelar", never on the action that cannot be undone.
      this.renderRoot.querySelector<HTMLButtonElement>(".off-keep")?.focus();
    }
    if (changed.has("_keep") && this._keep && !changed.get("_keep")) {
      this.renderRoot.querySelector<HTMLButtonElement>(".keep-chip.on")?.focus();
    }
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
      ...(sheet.id
        ? { type: "hot_water_ready/ready_time/update", ready_time_id: sheet.id }
        : { type: "hot_water_ready/ready_time/add" }),
      member_id: member.id,
      time: sheet.time,
      weekdays: [...sheet.weekdays].sort(),
    });
    if (saved) this._sheet = undefined; // on an error the sheet stays, with what was typed
  }

  /** Delete, from the sheet of a ready time being changed. */
  private async _remove(member: MemberSnapshot, readyTimeId: string): Promise<void> {
    const removed = await this._call({
      type: "hot_water_ready/ready_time/remove",
      member_id: member.id,
      ready_time_id: readyTimeId,
    });
    if (removed) this._sheet = undefined;
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
                ? html`${this._renderMemberSettings(member)}
                    <div class="panel">${this._renderListHead(member, mode === "member")} ${this._renderList(member)}</div>
                    ${this._sheet ? this._renderSheet(member, this._sheet) : nothing}
                    ${this._sheet && this._clock ? this._renderClock(this._clock) : nothing}`
                : html`<div class="message">${localize(language, "members.none")}</div>`}
            `}
        ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
        ${this._offOpen ? this._renderSwitchOff(heater) : nothing}
        ${this._keep ? this._renderKeepHot(heater, this._keep) : nothing}
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
          <span class="list-name">
            ${own ? localize(language, "list.mine") : head.name}
            ${member.can_set_visibility
              ? html`<button
                  class="member-settings-button"
                  aria-label=${localize(language, "member_settings.open")}
                  aria-expanded=${this._memberSettings === member.id}
                  @click=${() => (this._memberSettings = this._memberSettings === member.id ? undefined : member.id)}
                >
                  ⚙
                </button>`
              : nothing}
          </span>
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

  /** A member's own settings, behind the ⚙ by their list's title: the "Privado" switch (decision 15). */
  private _renderMemberSettings(member: MemberSnapshot): unknown {
    const language = this._language;
    const privacy = privacySwitch(member, language);
    if (!privacy || this._memberSettings !== member.id) return nothing;
    return html`<div class="sheet" role="dialog" aria-label=${localize(language, "member_settings.open")}>
      <div class="sheet-head">
        <div class="sheet-title">${localize(language, "member_settings.open")}</div>
        <button class="secondary" @click=${() => (this._memberSettings = undefined)}>
          ${localize(language, "settings.close")}
        </button>
      </div>
      <label class="setting">
        <span class="setting-text">
          <span>${privacy.label}</span>
          ${privacy.hint ? html`<span class="hint">${privacy.hint}</span>` : nothing}
        </span>
        <input
          type="checkbox"
          class="switch"
          .checked=${live(privacy.on)}
          @change=${(event: Event) => {
            const visibility = (event.target as HTMLInputElement).checked ? "private" : "public";
            void this._call({ type: VISIBILITY_COMMAND, member_id: member.id, visibility });
          }}
        />
      </label>
    </div>`;
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
        <div class="gauge ${view.tone === "heating" ? "glowing" : ""}">
          <span class="pulse"></span>
          <span class="orbit"></span>
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
        </div>
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
          ${view.element ? html`<div class="subline">${view.element}</div>` : nothing}
          ${view.keepHot ? html`<div class="subline">${view.keepHot}</div>` : nothing}
        </div>
        <div class="heat-now">
          ${switchOffShown(heater)
            ? html`<button class="switch-off-link" @click=${() => (this._offOpen = true)}>
                ${localize(this._language, "switch_off.link")}
              </button>`
            : nothing}
          ${heatNowActions(heater).map((item) =>
            choosesKeepTime(item)
              ? html`<button
                    class="keep-more"
                    aria-label=${localize(this._language, "keep_hot.more")}
                    title=${localize(this._language, "keep_hot.more")}
                    @click=${() => {
                      this._openKeep(item);
                    }}
                  >
                    ⋯
                  </button>
                  <button
                    class="primary holdable ${this._holding ? "holding" : ""}"
                    @pointerdown=${() => {
                      this._holdStart(item);
                    }}
                    @pointerup=${this._holdEnd}
                    @pointerleave=${this._holdEnd}
                    @pointercancel=${this._holdEnd}
                    @contextmenu=${(event: Event) => {
                      event.preventDefault();
                    }}
                    @click=${() => {
                      if (this._held) {
                        this._held = false;
                        return;
                      }
                      void this._call(item.message);
                    }}
                  >
                    ${localize(this._language, item.label)}
                  </button>`
              : html`<button
                  class="primary"
                  @click=${() => {
                    void this._call(item.message);
                  }}
                >
                  ${localize(this._language, item.label)}
                </button>`,
          )}
        </div>
      </div>
    `;
  }

  private _holdStart(action: HeatNowAction): void {
    this._held = false;
    this._holding = true;
    window.clearTimeout(this._holdTimer);
    this._holdTimer = window.setTimeout(() => {
      this._holding = false;
      this._held = true;
      this._openKeep(action);
    }, HOLD_MS);
  }

  private readonly _holdEnd = (): void => {
    window.clearTimeout(this._holdTimer);
    this._holding = false;
  };

  private _openKeep(action: HeatNowAction): void {
    if (!this._heater) return;
    const heater = this._heater;
    this._keep = heater.can_choose_heat_now_target
      ? { action, minutes: heater.keep_hot_minutes, target: heatNowTargetStart(heater) }
      : { action, minutes: heater.keep_hot_minutes };
  }

  /** How long to keep it hot after the message: the heater's time picked, the action's label to send. */
  private _renderKeepHot(
    heater: HeaterSnapshot,
    keep: { action: HeatNowAction; minutes: number; target?: number },
  ): unknown {
    const language = this._language;
    const close = () => {
      this._keep = undefined;
      // The finger that held may lift over the sheet, so the button never sees its click.
      this._held = false;
    };
    return html`
      <div
        class="off-overlay"
        @click=${(event: Event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keep-title"
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === "Escape") close();
          }}
        >
          ${keep.target === undefined ? nothing : this._renderHeatNowTarget(heater, keep, keep.target)}
          <div class="off-title" id="keep-title">${localize(language, "keep_hot.title")}</div>
          <p>${localize(language, "keep_hot.hint")}</p>
          <div class="keep-chips" role="radiogroup" aria-labelledby="keep-title">
            ${keepHotChoices(heater, language).map(
              (choice) => html`<button
                class="keep-chip ${choice.minutes === keep.minutes ? "on" : ""}"
                role="radio"
                aria-checked=${choice.minutes === keep.minutes}
                @click=${() => (this._keep = { ...keep, minutes: choice.minutes })}
              >
                ${choice.label}
              </button>`,
            )}
          </div>
          <button
            class="keep-start primary"
            @click=${async () => {
              const message = {
                ...keep.action.message,
                keep_minutes: keep.minutes,
                ...heatNowTargetField(heater, keep.target),
              };
              if (await this._call(message)) close();
            }}
          >
            ${localize(language, keep.action.label)}
          </button>
          <button class="off-keep" @click=${close}>${localize(language, "keep_hot.cancel")}</button>
        </div>
      </div>
    `;
  }

  /** An admin's own temperature for this request, degree by degree from the heater's (16). */
  private _renderHeatNowTarget(
    heater: HeaterSnapshot,
    keep: { action: HeatNowAction; minutes: number; target?: number },
    target: number,
  ): unknown {
    const language = this._language;
    const stepper = heatNowTargetStepper(target, language);
    const step = (to: number | null, key: "heat_now_target.down" | "heat_now_target.up", sign: string) =>
      html`<button
        class="step"
        aria-label=${localize(language, key)}
        ?disabled=${to === null}
        @click=${() => {
          if (to !== null) this._keep = { ...keep, target: to };
        }}
      >
        ${sign}
      </button>`;
    return html`<div class="off-title" id="target-title">${localize(language, "heat_now_target.title")}</div>
      <div class="target-value" role="group" aria-labelledby="target-title">
        ${step(stepper.down, "heat_now_target.down", "−")}
        <span class="value" aria-live="polite">${stepper.shown}</span>
        ${step(stepper.up, "heat_now_target.up", "+")}
      </div>
      <p>${heatNowTargetHint(heater, language)}</p>`;
  }

  /** The confirmation before switching off: who loses out, "Desligar" in red, focus on "Cancelar". */
  private _renderSwitchOff(heater: HeaterSnapshot): unknown {
    const language = this._language;
    const sheet = switchOffSheet(heater, this._context);
    const close = () => (this._offOpen = false);
    return html`
      <div class="off-overlay">
        <div
          class="off-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="off-title"
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === "Escape") close();
          }}
        >
          <div class="off-title" id="off-title">${sheet.title}</div>
          ${sheet.lines.map((line) => html`<p>${line}</p>`)}
          <button
            class="off-confirm"
            @click=${async () => {
              if (await this._call({ type: SWITCH_OFF_COMMAND })) close();
            }}
          >
            ${localize(language, "switch_off.confirm")}
          </button>
          <button class="off-keep" @click=${close}>${localize(language, "switch_off.keep")}</button>
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
        <div class="hint">${weekHint(language, this._hour24)}</div>
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
          <span>${localize(language, "settings.switch_off")}</span>
          <div class="people" role="group" aria-label=${localize(language, "settings.switch_off")}>
            <span class="hint">${localize(language, "settings.switch_off_hint")}</span>
            ${view.people.length === 0 ? html`<span class="hint">${localize(language, "settings.no_people")}</span>` : nothing}
            ${view.people.map(
              (person) => html`<label class="person">
                <input
                  type="checkbox"
                  .checked=${live(person.on)}
                  @change=${(event: Event) => {
                    const on = (event.target as HTMLInputElement).checked;
                    void set({ switch_off_people: switchOffPeopleWith(view.people, person.id, on) });
                  }}
                />
                ${person.name}
              </label>`,
            )}
            <span class="hint">${localize(language, "settings.own_cancel")}</span>
          </div>
        </div>
        ${this._renderRate(heater)}
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

  /** Fix the rate, or null for the learned one. A stepped value stays shown until it arrives. */
  private _setRate(rate: number | null): void {
    window.clearTimeout(this._rateTimer);
    void this._call({ type: SETTINGS_COMMAND, rate }).then((sent) => {
      if (!sent) this._rateDraft = undefined;
    });
  }

  /** One tap of the fixed rate's stepper: shown at once, sent when the taps stop. */
  private _stepRate(rate: number): void {
    this._rateDraft = rate;
    window.clearTimeout(this._rateTimer);
    this._rateTimer = window.setTimeout(() => {
      this._setRate(rate);
    }, RATE_SEND_DELAY_MS);
  }

  private async _recalculate(): Promise<void> {
    const heater = this._heater;
    if (!this.hass || !heater || this._recalc.busy) return;
    const language = this._language;
    this._recalc = { busy: true, line: "" };
    try {
      const found = await this.hass.callWS<{ runs: number; learned: number | null }>({
        type: RECALCULATE_COMMAND,
        entry_id: heater.entry_id,
      });
      const line =
        found.learned === null
          ? localize(language, "rate.found_too_few", { count: found.runs, needed: heater.settings?.rate.min_runs ?? 3 })
          : localize(language, "rate.found", {
              count: found.runs,
              rate: new Intl.NumberFormat(localeOf(language), { maximumFractionDigits: 1 }).format(found.learned),
            });
      this._recalc = { busy: false, line };
    } catch (err) {
      const text = err instanceof Error ? err.message : (err as { message?: string }).message;
      this._recalc = { busy: false, line: localize(language, "card.error", { message: text ?? String(err) }) };
    }
  }

  private _renderRate(heater: HeaterSnapshot): unknown {
    const language = this._language;
    const view: RateView | undefined = rateView(heater, this._context);
    if (!view) return nothing;
    const draft = this._rateDraft;
    const stepper = draft === undefined ? view.stepper : rateStepper(draft, language);
    const mode = (fixed: boolean, key: "rate.automatic" | "rate.fixed") => html`<button
      class=${fixed === view.fixed ? "mode on" : "mode"}
      aria-pressed=${fixed === view.fixed}
      @click=${() => {
        if (fixed !== view.fixed) this._setRate(fixed ? view.used : null);
      }}
    >
      ${localize(language, key)}
    </button>`;
    const step = (to: number | null, key: "rate.down" | "rate.up", sign: string) => html`<button
      class="step"
      aria-label=${localize(language, key)}
      ?disabled=${to === null}
      @click=${() => {
        if (to !== null) this._stepRate(to);
      }}
    >
      ${sign}
    </button>`;
    const suggestion = draft === undefined ? view.suggestion : null;
    return html`<div class="setting column rate">
      <div class="rate-head">
        <span>${localize(language, "rate.title")}</span>
        <div class="modes" role="group" aria-label=${localize(language, "rate.title")}>
          ${mode(false, "rate.automatic")}${mode(true, "rate.fixed")}
        </div>
      </div>
      ${view.fixed
        ? html`<div class="rate-value">
            ${step(stepper.down, "rate.down", "−")}
            <span class="value">${stepper.shown}</span>
            ${step(stepper.up, "rate.up", "+")}
            <span class="hint">${localize(language, "rate.unit")}</span>
          </div>`
        : html`<div class="rate-value">
            <span class="rate-big">${view.shown}</span>
            <span class="hint">${localize(language, "rate.unit")}</span>
          </div>`}
      <span class="hint">${view.source}</span>
      ${suggestion
        ? html`<div class="rate-suggestion">
            <span class="hint">${suggestion.line}</span>
            <button
              class="link"
              @click=${() => {
                this._setRate(suggestion.value);
              }}
            >
              ${localize(language, "rate.use")}
            </button>
          </div>`
        : nothing}
      ${view.runs.length
        ? html`<div class="rate-runs" role="list" aria-label=${localize(language, "rate.runs")}>
            ${view.runs.map(
              (run) =>
                html`<span class="rate-run" role="listitem"><span class="hint">${run.when}</span><b>${run.rate}</b></span>`,
            )}
          </div>`
        : nothing}
      ${view.example ? html`<span class="hint">${view.example}</span>` : nothing}
      ${view.physics ? html`<span class="hint">${view.physics}</span>` : nothing}
      ${view.check
        ? html`<span class=${view.check.warn ? "hint rate-warn" : "hint"} role=${view.check.warn ? "alert" : nothing}
            >${view.check.line}</span
          >`
        : nothing}
      <button
        class="recalc secondary"
        ?disabled=${this._recalc.busy}
        @click=${() => {
          void this._recalculate();
        }}
      >
        ${localize(language, this._recalc.busy ? "rate.recalculating" : "rate.recalculate")}
      </button>
      ${this._recalc.line ? html`<span class="hint" role="status">${this._recalc.line}</span>` : nothing}
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
    const rows = readyTimeRows(member, language, this._hour24);
    return html`
      <div class="list ${member.away.on ? "paused-list" : ""}">
        ${rows.length === 0 ? html`<div class="empty">${localize(language, "list.empty")}</div>` : nothing}
        ${rows.map(
          (row) => html`
            <div class="row ${row.enabled ? "" : "off"}">
              ${member.can_edit
                ? html`<button
                    class="row-text"
                    aria-label=${localize(language, "list.edit")}
                    @click=${() => {
                      this._sheet = editSheet(member, row.id);
                      this._clock = undefined;
                    }}
                  >
                    ${this._rowText(row)}
                  </button>`
                : html`<div class="row-text">${this._rowText(row)}</div>`}
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
                  `
                : nothing}
            </div>
          `,
        )}
        ${member.can_edit
          ? html`<button
              class="add"
              @click=${() => {
                this._sheet = newSheet();
                this._clock = openClock(this._sheet.time, true, this._hour24);
              }}
            >
              + ${localize(language, "list.add")}
            </button>`
          : nothing}
      </div>
    `;
  }

  private _rowText(row: ReadyTimeRow): unknown {
    return html`<div class="time">${row.time}</div>
      <div class="days">
        ${row.days.map((day) => html`<span class="${day.on ? "on" : ""}">${day.letter}</span>`)}
      </div>`;
  }

  private _renderSheet(member: MemberSnapshot, sheet: Sheet): unknown {
    const language = this._language;
    const letters = weekdayLetters(language);
    const title = localize(language, sheet.id ? "sheet.edit_title" : "sheet.title");
    const toggle = (day: number) => {
      const weekdays = sheet.weekdays.includes(day)
        ? sheet.weekdays.filter((d) => d !== day)
        : [...sheet.weekdays, day];
      this._sheet = { ...sheet, weekdays };
    };
    return html`
      <div class="sheet" role="dialog" aria-label=${title}>
        <div class="sheet-title">${title}</div>
        <div class="field">
          ${localize(language, "sheet.time")}
          <button
            class="sheet-time"
            aria-label=${localize(language, "clock.change")}
            @click=${() => (this._clock = openClock(sheet.time, false, this._hour24))}
          >
            ${wallTime(sheet.time, language, this._hour24)}
          </button>
        </div>
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
          ${sheet.id
            ? html`<button class="remove" @click=${() => this._remove(member, sheet.id ?? "")}>
                ${localize(language, "sheet.delete")}
              </button>`
            : nothing}
          <button class="secondary" @click=${() => (this._sheet = undefined)}>${localize(language, "sheet.cancel")}</button>
          <button class="primary" ?disabled=${!sheetIsComplete(sheet)} @click=${() => this._save(member)}>
            ${localize(language, "sheet.save")}
          </button>
        </div>
      </div>
    `;
  }

  /** A touch on the dial, from the pointer's place on the drawn circle. */
  private _dialAt(event: PointerEvent, clock: Clock): Clock {
    const box = (event.currentTarget as Element).getBoundingClientRect();
    const scale = DIAL_SIZE / box.width;
    return dialPick(clock, (event.clientX - box.left) * scale, (event.clientY - box.top) * scale, this._hour24);
  }

  /** OK: the time goes into the sheet and the popup closes. */
  private _clockDone(clock: Clock): void {
    const time = clockTime(clock, this._hour24);
    if (!time || !this._sheet) return;
    this._sheet = { ...this._sheet, time };
    this._clock = undefined;
  }

  /** Cancel: a ready time being added goes too, as an alarm does on Android. */
  private _clockCancel(clock: Clock): void {
    if (clock.fresh) this._sheet = undefined;
    this._clock = undefined;
  }

  private _renderClockInput(clock: Clock, part: "hour" | "minute", valid: boolean): unknown {
    const label = localize(this._language, part === "hour" ? "sheet.hour" : "sheet.minute");
    return html`<label class="clock-box">
      <input
        class="clock-input ${valid ? "" : "invalid"}"
        inputmode="numeric"
        maxlength="2"
        autocomplete="off"
        aria-label=${label}
        .value=${live(part === "hour" ? clock.hourText : clock.minuteText)}
        @input=${(event: Event) => {
          const value = (event.target as HTMLInputElement).value;
          this._clock = part === "hour" ? { ...clock, hourText: value } : { ...clock, minuteText: value };
        }}
        @keydown=${(event: KeyboardEvent) => {
          if (event.key === "Enter") this._clockDone(clock);
        }}
      />
      <span>${label}</span>
    </label>`;
  }

  private _renderClock(clock: Clock): unknown {
    const language = this._language;
    const hour24 = this._hour24;
    const keys = clock.mode === "keys";
    const valid = clockTime(clock, hour24) !== undefined;
    const title = localize(language, keys ? "clock.title_keys" : "clock.title");
    const half = hour24
      ? nothing
      : html`<div class="clock-half" role="group">
          ${([false, true] as const).map(
            (afternoon) =>
              html`<button
                class=${clock.hour >= 12 === afternoon ? "on" : ""}
                aria-pressed=${clock.hour >= 12 === afternoon}
                @click=${() => (this._clock = clockHalf(clock, afternoon))}
              >
                ${localize(language, afternoon ? "clock.pm" : "clock.am")}
              </button>`,
          )}
        </div>`;
    const header = keys
      ? html`<div class="clock-head">
            ${this._renderClockInput(clock, "hour", valid)}
            <span class="clock-colon">:</span>
            ${this._renderClockInput(clock, "minute", valid)} ${half}
          </div>
          ${valid ? nothing : html`<div class="clock-invalid" role="alert">${localize(language, "clock.invalid")}</div>`}`
      : html`<div class="clock-head">
          ${(["hour", "minute"] as const).map(
            (part, index) =>
              html`${index ? html`<span class="clock-colon">:</span>` : nothing}
                <button
                  class="clock-part ${clock.part === part ? "on" : ""}"
                  aria-pressed=${clock.part === part}
                  aria-label=${localize(language, part === "hour" ? "sheet.hour" : "sheet.minute")}
                  @click=${() => (this._clock = { ...clock, part })}
                >
                  ${part === "hour" ? clock.hourText : clock.minuteText}
                </button>`,
          )}
          ${half}
        </div>`;
    const hand = dialHand(clock, hour24);
    const centre = DIAL_SIZE / 2;
    const dial = keys
      ? nothing
      : html`<svg
          class="dial"
          viewBox="0 0 ${DIAL_SIZE} ${DIAL_SIZE}"
          role="slider"
          tabindex="0"
          aria-label=${localize(language, clock.part === "hour" ? "sheet.hour" : "sheet.minute")}
          aria-valuenow=${clock.part === "hour" ? clock.hour : clock.minute}
          aria-valuetext=${clock.part === "hour" ? clock.hourText : clock.minuteText}
          @pointerdown=${(event: PointerEvent) => {
            (event.currentTarget as Element).setPointerCapture(event.pointerId);
            this._clock = this._dialAt(event, clock);
          }}
          @pointermove=${(event: PointerEvent) => {
            if ((event.currentTarget as Element).hasPointerCapture(event.pointerId)) {
              this._clock = this._dialAt(event, this._clock ?? clock);
            }
          }}
          @pointerup=${() => {
            // As on Android, letting go of the hour moves on to the minutes.
            if (this._clock?.part === "hour") this._clock = { ...this._clock, part: "minute" };
          }}
          @keydown=${(event: KeyboardEvent) => {
            const step = ({ ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 } as Record<string, number>)[event.key];
            if (step === undefined) return;
            event.preventDefault();
            this._clock = dialStep(clock, step, hour24);
          }}
        >
          <circle class="dial-face" cx=${centre} cy=${centre} r=${centre} />
          <line class="dial-hand" x1=${centre} y1=${centre} x2=${hand.x} y2=${hand.y} />
          <circle class="dial-hand-dot" cx=${centre} cy=${centre} r="4" />
          <circle class="dial-knob" cx=${hand.x} cy=${hand.y} r="20" />
          ${dialMarks(clock.part, hour24).map(
            (mark) =>
              svg`<text class="dial-mark ${dialMarkOn(clock, mark, hour24) ? "on" : ""}" x=${mark.x} y=${mark.y}>${mark.label}</text>`,
          )}
        </svg>`;
    return html`
      <div
        class="clock-overlay"
        @click=${(event: Event) => {
          if (event.target === event.currentTarget) this._clockCancel(clock);
        }}
      >
        <div class="clock-dialog" role="dialog" aria-modal="true" aria-label=${title}>
          <div class="clock-title">${title}</div>
          ${header} ${dial}
          <div class="clock-actions">
            <button
              class="clock-mode"
              aria-label=${localize(language, keys ? "clock.to_dial" : "clock.to_keys")}
              title=${localize(language, keys ? "clock.to_dial" : "clock.to_keys")}
              @click=${() => (this._clock = switchClockMode(clock, hour24))}
            >
              ${keys ? CLOCK_ICON : KEYBOARD_ICON}
            </button>
            <button
              class="clock-text"
              @click=${() => {
                this._clockCancel(clock);
              }}
            >
              ${localize(language, "sheet.cancel")}
            </button>
            <button
              class="clock-text"
              ?disabled=${!valid}
              @click=${() => {
                this._clockDone(clock);
              }}
            >
              ${localize(language, "clock.ok")}
            </button>
          </div>
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
    /* The ring and the text side by side, the buttons on a full-width row under both. */
    .top {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      column-gap: 16px;
      row-gap: 4px;
      padding: 16px;
    }
    /*
     * Pinned to the top, so the ring stays put when the text beside it grows (heating adds a line
     * and the switch-off link), with room on every side for the halo and the start pulse.
     */
    .gauge {
      position: relative;
      flex: none;
      align-self: flex-start;
      width: 92px;
      height: 92px;
      margin: 8px;
      border-radius: 50%;
    }
    .ring {
      position: relative;
      width: 92px;
      height: 92px;
    }
    /*
     * Heating: a warm ring and halo, two soft pulses when it starts, and a soft band of light that
     * keeps circling slowly, so the card shows it is working. Still under reduced motion.
     */
    .gauge.glowing {
      box-shadow:
        0 0 0 2px var(--hwr-heating),
        0 0 16px 4px color-mix(in srgb, var(--hwr-heating) 30%, transparent);
    }
    .orbit {
      display: none;
      position: absolute;
      inset: -9px;
      border-radius: 50%;
      pointer-events: none;
      background: conic-gradient(
        from 0turn,
        transparent 0turn,
        color-mix(in srgb, var(--hwr-heating) 80%, transparent) 0.1turn,
        transparent 0.28turn,
        transparent 1turn
      );
      /* Only the band around the ring, not its middle. */
      mask: radial-gradient(circle, transparent 58%, #000 62%);
      filter: blur(5px);
    }
    /* The band fades in once the two start pulses (2 x 2.4s) are over, then keeps circling. */
    .gauge.glowing .orbit {
      display: block;
      animation:
        hwr-orbit-in 0.8s ease-in 4.8s both,
        hwr-orbit 6s linear 4.8s infinite;
    }
    @keyframes hwr-orbit-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes hwr-orbit {
      to {
        transform: rotate(1turn);
      }
    }
    .pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
    }
    .gauge.glowing .pulse {
      box-shadow: 0 0 16px 6px color-mix(in srgb, var(--hwr-heating) 55%, transparent);
      animation: hwr-pulse 2.4s ease-in-out 2;
    }
    @keyframes hwr-pulse {
      0%,
      100% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .gauge.glowing .pulse {
        animation: none;
      }
      .gauge.glowing .orbit {
        display: none;
      }
    }
    /* On the button's row, on the left, so heating does not add a line to the card. */
    .switch-off-link {
      margin-right: auto;
      text-align: left;
      min-height: 40px;
      border: 0;
      background: none;
      padding: 0 2px;
      color: var(--hwr-fault);
      font-weight: 500;
    }
    .off-overlay {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.32));
    }
    .off-sheet {
      width: 100%;
      max-width: 480px;
      box-sizing: border-box;
      padding: 20px 20px 28px;
      border-radius: 24px 24px 0 0;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .off-title {
      font-size: 20px;
      font-weight: 700;
    }
    .off-sheet p {
      margin: 0;
      font-size: 15px;
      line-height: 1.45;
    }
    .off-confirm,
    .off-keep {
      min-height: 48px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
    }
    .off-confirm {
      margin-top: 6px;
      border: 0;
      background: var(--hwr-fault);
      color: var(--text-primary-color, #fff);
    }
    .off-keep {
      border: 1px solid var(--divider-color, #c5cad1);
      background: none;
      color: var(--primary-text-color);
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
    .step {
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
    .rate-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 6px 10px;
    }
    .modes {
      display: inline-flex;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
    }
    .mode {
      min-height: 32px;
      padding: 0 12px;
      border: 0;
      background: none;
      color: var(--secondary-text-color);
      font-weight: 700;
    }
    .mode.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .rate-value,
    .rate-suggestion {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .rate-warn {
      color: var(--warning-color, #ffa600);
    }
    .rate-big {
      font-size: 28px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .rate-runs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .rate-run {
      display: inline-flex;
      gap: 6px;
      align-items: baseline;
      padding: 4px 8px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      font-variant-numeric: tabular-nums;
    }
    .recalc {
      align-self: flex-start;
      min-height: 36px;
      padding: 0 14px;
      border: 0;
      border-radius: 10px;
      font-weight: 700;
    }
    .recalc[disabled] {
      opacity: 0.6;
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
    .list-name {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .member-settings-button {
      border: 0;
      background: none;
      padding: 0 4px;
      font-size: 16px;
      min-width: 32px;
      min-height: 32px;
      color: var(--secondary-text-color);
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
    button.row-text {
      font: inherit;
      color: inherit;
      text-align: left;
      background: none;
      border: 0;
      padding: 0;
      cursor: pointer;
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
    /* Delete sits apart from Cancel and Save, on the left, as in Android's alarm editor. */
    .actions .remove {
      margin-right: auto;
      background: none;
      color: var(--error-color, #c62828);
      font-weight: 500;
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
    /* The time on the sheet, large as in Android's alarm list; a tap opens the popup. */
    .sheet-time {
      align-self: flex-start;
      padding: 0 4px;
      border: 0;
      background: none;
      font-size: 44px;
      font-weight: 300;
      line-height: 1.1;
      color: var(--primary-text-color);
    }
    /* The time popup: a small dialog in the middle of the screen, as Android's clock. */
    .clock-overlay {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.32));
    }
    .clock-dialog {
      width: 100%;
      max-width: 328px;
      box-sizing: border-box;
      padding: 24px 24px 12px;
      border-radius: 28px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .clock-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .clock-head {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 8px;
    }
    .clock-colon {
      font-size: 48px;
      line-height: 80px;
    }
    .clock-part,
    .clock-input {
      width: 96px;
      height: 80px;
      box-sizing: border-box;
      border-radius: 10px;
      border: 2px solid transparent;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      font: inherit;
      font-size: 48px;
      text-align: center;
    }
    .clock-part.on,
    .clock-input:focus {
      background: color-mix(in srgb, var(--primary-color) 22%, transparent);
      color: var(--primary-color);
      outline: none;
    }
    .clock-input:focus {
      border-color: var(--primary-color);
    }
    .clock-input.invalid {
      border-color: var(--error-color, #c62828);
    }
    .clock-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .clock-invalid {
      margin-top: -12px;
      text-align: center;
      font-size: 12px;
      color: var(--error-color, #c62828);
    }
    .clock-half {
      display: flex;
      flex-direction: column;
      height: 80px;
      border: 1px solid var(--divider-color, #c5cad1);
      border-radius: 10px;
      overflow: hidden;
    }
    .clock-half button {
      flex: 1;
      min-width: 52px;
      border: 0;
      background: none;
      font-weight: 500;
    }
    .clock-half button.on {
      background: color-mix(in srgb, var(--primary-color) 22%, transparent);
      color: var(--primary-color);
    }
    .dial {
      display: block;
      width: 100%;
      max-width: 256px;
      align-self: center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      cursor: pointer;
    }
    .dial:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 4px;
      border-radius: 50%;
    }
    .dial-face {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .dial-hand {
      stroke: var(--primary-color);
      stroke-width: 2;
    }
    .dial-hand-dot,
    .dial-knob {
      fill: var(--primary-color);
    }
    .dial-mark {
      fill: var(--primary-text-color);
      font-size: 15px;
      text-anchor: middle;
      dominant-baseline: central;
      pointer-events: none;
    }
    .dial-mark.on {
      fill: var(--text-primary-color, #fff);
    }
    .clock-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .clock-mode {
      margin-right: auto;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
    }
    .clock-text {
      min-height: 40px;
      padding: 0 12px;
      border: 0;
      border-radius: 20px;
      background: none;
      color: var(--primary-color);
      font-weight: 500;
    }
    .clock-text[disabled] {
      opacity: 0.4;
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
      grid-column: 1 / -1;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
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
    /* Held for HOLD_MS, the fill crosses the button and the choice of time opens. */
    .holdable {
      position: relative;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      touch-action: manipulation;
    }
    .holdable::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.3);
      transform: scaleX(0);
      transform-origin: left;
      pointer-events: none;
    }
    .holdable.holding::after {
      transform: scaleX(1);
      transition: transform 500ms linear;
    }
    .heat-now .keep-more {
      min-width: 40px;
      padding: 0 8px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      font-size: 18px;
      line-height: 1;
    }
    .target-value {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .keep-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .keep-chip {
      min-height: 44px;
      min-width: 64px;
      padding: 0 14px;
      border-radius: 22px;
      border: 1px solid var(--divider-color, #c5cad1);
      background: none;
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 500;
    }
    .keep-chip.on {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .keep-start {
      margin-top: 6px;
      min-height: 48px;
      border: 0;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
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
