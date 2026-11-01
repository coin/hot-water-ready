// Keeps one live `hot_water_ready/subscribe` per card, however often `hass` changes.

import type { Hass, HeaterSnapshot, HeaterSummary } from "./types";

export function fetchHeaters(hass: Hass): Promise<HeaterSummary[]> {
  return hass.callWS<HeaterSummary[]>({ type: "hot_water_ready/heaters" });
}

export class HeaterSubscription {
  private entryId: string | undefined;
  /** The heater picked when the card names none; looked up once. */
  private defaultEntryId: Promise<string | undefined> | undefined;
  private stopSubscription: Promise<() => Promise<void>> | undefined;
  /** Bumped by every subscribe and stop, so late replies from older calls are ignored. */
  private generation = 0;

  constructor(
    private readonly onSnapshot: (snapshot: HeaterSnapshot) => void,
    private readonly onMissing: () => void,
  ) {}

  async follow(hass: Hass, configuredEntryId: string | undefined): Promise<void> {
    const generation = this.generation;
    let entryId = configuredEntryId;
    if (entryId === undefined) {
      this.defaultEntryId ??= fetchHeaters(hass).then((heaters) => heaters[0]?.entry_id);
      entryId = await this.defaultEntryId;
      if (generation !== this.generation) return; // stopped or moved on while waiting
      if (entryId === undefined) {
        this.defaultEntryId = undefined; // look again next time; a heater may be added
        this.onMissing();
        return;
      }
    }
    if (entryId === this.entryId) return;
    this.stop();
    const current = this.generation;
    this.entryId = entryId;
    this.stopSubscription = hass.connection.subscribeMessage<HeaterSnapshot>(
      (snapshot) => {
        if (current === this.generation) this.onSnapshot(snapshot);
      },
      { type: "hot_water_ready/subscribe", entry_id: entryId },
    );
    this.stopSubscription.catch(() => {
      if (current !== this.generation) return;
      this.entryId = undefined;
      this.onMissing();
    });
  }

  stop(): void {
    this.generation++;
    const stopping = this.stopSubscription;
    this.stopSubscription = undefined;
    this.entryId = undefined;
    void stopping?.then((stop) => stop()).catch(() => undefined);
  }
}
