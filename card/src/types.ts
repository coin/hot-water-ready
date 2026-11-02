// Shapes the card receives from Home Assistant.

export type Status = "waiting" | "heating" | "ready" | "fault" | "manual";

export interface ReadyTimeSnapshot {
  id: string;
  /** "HH:MM", the house's wall-clock time. */
  time: string;
  /** Monday 0 to Sunday 6. */
  weekdays: number[];
  enabled: boolean;
}

export interface MemberSnapshot {
  id: string;
  name: string;
  colour: string;
  /** Whether the viewer may change this member's ready times (checked again on the server). */
  can_edit: boolean;
  /** A member with no person behind it, such as Global or Guests. */
  virtual: boolean;
  /** `until` is the last day away, "YYYY-MM-DD". */
  away: { on: boolean; until: string | null };
  /** ISO datetime of this member's next ready time. */
  next_ready: string | null;
  ready_times: ReadyTimeSnapshot[];
}

/** Who may cancel a heat-now request besides whoever asked (spec 2). */
export type CancelRule = "requesters" | "people" | "everyone";

/** The settings sheet, sent to administrators only. */
export interface AdminSettings {
  cancel_rule: CancelRule;
  /** The person entities the "people" rule adds. */
  cancel_people: string[];
  /** Whether the solar-aware rule is applied; off, it is only recorded (spec 4.3). */
  solar_aware: boolean;
  /**
   * The last 30 days (spec 7). `kwh` is null without a measure of energy; `solar_windows` are
   * the windows the rule was applied to, and `solar_on_time` how many of them were on time.
   */
  solar: {
    windows: number;
    on_time: number;
    minutes_saved: number;
    kwh: number | null;
    solar_windows: number;
    solar_on_time: number;
  };
}

/** What `hot_water_ready/subscribe` sends for one heater, as seen by the viewer. */
export interface HeaterSnapshot {
  entry_id: string;
  name: string;
  temperature: number | null;
  target: number;
  margin: number;
  status: Status;
  ready_in_minutes: number | null;
  /** When heating is planned to start next, within two days; null when nothing is planned. */
  next_heat_start: string | null;
  /** Whether the solar-aware rule is applied (spec 4.3). */
  solar_aware: boolean;
  next_ready: { at: string; members: string[] } | null;
  is_admin: boolean;
  /** The viewer's own member id, if the viewer is a member. */
  me: string | null;
  /** Active faults (spec 4.8); the card shows them in a red banner. */
  faults: ("sensor_unavailable" | "not_rising" | "no_consumption" | "relay_stuck")[];
  /** False for a thermostat without a heating indication: "not rising" is not checked. */
  not_rising_checked: boolean;
  /** A fault stops heating, so heat now is refused. */
  heat_now_blocked: boolean;
  /** Off: the heater is run by hand. */
  automatic: boolean;
  /** Whether this viewer may ask for heat now (members and admins). */
  can_ask_heat_now: boolean;
  /**
   * The heat-now request, if one is running. `requesters` are member ids or person entities (an
   * automation's request names nobody); `asked` is whether the viewer is one of them, and
   * `can_cancel_all` whether they may cancel everyone's (spec 2). Who asked may always withdraw.
   */
  heat_now: { requesters: string[]; asked: boolean; can_cancel_all: boolean } | null;
  /** The settings sheet; null unless the viewer is an administrator. */
  settings: AdminSettings | null;
  /** This week, Monday to Sunday, for the Semana tab; null unless the viewer is an administrator. */
  week: {
    /** "YYYY-MM-DD" of this week's Monday and of today, in the house's time zone. */
    monday: string;
    today: string;
    /** When the heater may heat. */
    windows: TimeSpan[];
  } | null;
  /**
   * The next cluster, within a day, that even the maximum temperature cannot carry (spec 4.5):
   * when it starts, the store temperature it needs, and the cap.
   */
  cluster_warning: { at: string; needed: number; cap: number } | null;
  /** Everyone's ready times today, earliest first. */
  today: { member: string; at: string }[];
  members: MemberSnapshot[];
}

/** A span of time, ISO datetimes. */
export interface TimeSpan {
  start: string;
  end: string;
}

export interface HeaterSummary {
  entry_id: string;
  name: string;
}

export interface CardConfig {
  type: string;
  entry_id?: string;
}

/** The part of Home Assistant's `hass` object the card uses. */
export interface Hass {
  locale?: { language: string };
  language?: string;
  config?: { time_zone?: string };
  states?: Record<string, { attributes: { friendly_name?: string } }>;
  connection: {
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
  };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}
