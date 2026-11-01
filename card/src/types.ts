// Shapes the card receives from Home Assistant.

export type Status = "waiting" | "heating" | "ready" | "fault" | "manual";

/** What `hot_water_ready/subscribe` sends for one heater. */
export interface HeaterSnapshot {
  entry_id: string;
  name: string;
  temperature: number | null;
  target: number;
  status: Status;
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
  connection: {
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
  };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}
