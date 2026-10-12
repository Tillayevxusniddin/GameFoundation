// docs/06_TECHNICAL_ARCHITECTURE.md — Phaser canvas va scene lifecycle.
// Bu modul faqat brauzerda, PhaserGame tomonidan dinamik import qilinadi.
// docs/14_ASSET_GUIDE.md — tashqi rasm yo'q; grafika protseduraviy.

import * as Phaser from "phaser";
import type { EventBridge } from "../app/eventBridge";
import type { GameEventMap } from "../types/game";
import type { LessonStatus } from "../types/progress";
import { MapScene } from "./scenes/MapScene";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./mapData";

export interface GameHandle {
  destroy(): void;
}

export interface CreatePhaserGameOptions {
  container: HTMLElement;
  bridge: EventBridge<GameEventMap>;
  states: Record<string, LessonStatus>;
}

export function createPhaserGame(
  options: CreatePhaserGameOptions,
): GameHandle {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: options.container,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    backgroundColor: "#11131a",
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
        gravity: { x: 0, y: 0 },
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    scene: [MapScene],
    callbacks: {
      postBoot: (booted: Phaser.Game): void => {
        booted.registry.set("wn-bridge", options.bridge);
        booted.registry.set("wn-states", options.states);
      },
    },
  });

  return {
    destroy(): void {
      game.destroy(true);
    },
  };
}
