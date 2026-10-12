// docs/06_TECHNICAL_ARCHITECTURE.md — React faqat canvas konteyneri va overlay.
// docs/14_ASSET_GUIDE.md — resurs yuklanmasa tushunarli fallback xabar.
// Phaser faqat useEffect ichida, dinamik import orqali ishga tushiriladi;
// jsdom/test muhitida Phaser import qilinmaydi.

import { useEffect, useRef, useState } from "react";
import type { EventBridge } from "../app/eventBridge";
import type { GameEventMap } from "../types/game";
import type { LessonStatus } from "../types/progress";
import { uz } from "../i18n/uz";

export interface GameHandle {
  destroy(): void;
}

export interface GameFactoryOptions {
  container: HTMLElement;
  bridge: EventBridge<GameEventMap>;
  states: Record<string, LessonStatus>;
}

export type GameFactory = (
  options: GameFactoryOptions,
) => GameHandle | Promise<GameHandle>;

async function defaultGameFactory(
  options: GameFactoryOptions,
): Promise<GameHandle> {
  const mod = await import("./createGame");
  return mod.createPhaserGame(options);
}

export interface PhaserGameProps {
  bridge: EventBridge<GameEventMap>;
  states: Record<string, LessonStatus>;
  gameFactory?: GameFactory;
}

export function PhaserGame({
  bridge,
  states,
  gameFactory,
}: PhaserGameProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bridgeRef = useRef(bridge);
  bridgeRef.current = bridge;
  const gameFactoryRef = useRef(gameFactory);
  gameFactoryRef.current = gameFactory;
  const statesRef = useRef(states);
  statesRef.current = states;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return;
    }
    let handle: GameHandle | null = null;
    let cancelled = false;
    const factory = gameFactoryRef.current ?? defaultGameFactory;
    const created = factory({
      container,
      bridge: bridgeRef.current,
      states: statesRef.current,
    });
    Promise.resolve(created)
      .then((value) => {
        if (cancelled) {
          value.destroy();
          return;
        }
        handle = value;
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
      if (handle !== null) {
        handle.destroy();
        handle = null;
      }
    };
  }, []);

  return (
    <div className="wn-phaser" role="group" aria-label={uz.mapCanvasLabel}>
      <div className="wn-phaser__canvas" ref={containerRef} />
      {failed ? (
        <p className="wn-phaser__fallback" role="status">
          {uz.mapUnavailable}
        </p>
      ) : null}
    </div>
  );
}
