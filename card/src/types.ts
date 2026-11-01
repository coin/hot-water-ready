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

/** What `hot_water_ready/subscribe` sends for one heater, as seen by the viewer. */
export interface HeaterSnapshot {
  entry_id: string;
  name: string;
  temperature: number | null;
  target: number;
  margin: number;
  status: Status;
  ready_in_minutes: number | null;
  next_ready: { at: string; members: string[] } | null;
  is_admin: boolean;
  /** The viewer's own member id, if the viewer is a member. */
  me: string | null;
  /** The heat-now request, if one is running: who asked, and what this viewer may do. */
  heat_now: { requesters: string[]; asked: boolean; can_cancel: boolean } | null;
  /** Everyone's ready times today, earliest first. */
  today: { member: string; at: string }[];
  members: MemberSnapshot[];
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
  connection: {
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
  };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}
