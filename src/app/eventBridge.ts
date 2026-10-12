// docs/06_TECHNICAL_ARCHITECTURE.md — React va Phaser typed event/callback
// adapter orqali aloqa qiladi; bir-birining ichki state'iga kirmaydi.

import type { GameEventMap, GameEventName } from "../types/game";

export type EventHandler<TPayload> = (payload: TPayload) => void;

export class EventBridge<TMap extends object> {
  private readonly listeners = new Map<string, Set<(payload: unknown) => void>>();

  subscribe<K extends keyof TMap & string>(
    event: K,
    handler: EventHandler<TMap[K]>,
  ): () => void {
    let set = this.listeners.get(event);
    if (set === undefined) {
      set = new Set();
      this.listeners.set(event, set);
    }
    const wrapped = handler as (payload: unknown) => void;
    set.add(wrapped);
    return () => {
      const current = this.listeners.get(event);
      if (current !== undefined) {
        current.delete(wrapped);
        if (current.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  emit<K extends keyof TMap & string>(event: K, payload: TMap[K]): void {
    const set = this.listeners.get(event);
    if (set === undefined) {
      return;
    }
    for (const handler of Array.from(set)) {
      handler(payload as unknown);
    }
  }

  listenerCount<K extends keyof TMap & string>(event: K): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}

export function createEventBridge(): EventBridge<GameEventMap> {
  return new EventBridge<GameEventMap>();
}

export type { GameEventName };
