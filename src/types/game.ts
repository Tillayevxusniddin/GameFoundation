// docs/02_GAME_DESIGN_DOCUMENT.md — o'yin holatlari.
// docs/06_TECHNICAL_ARCHITECTURE.md — Phaser va React typed event orqali aloqa qiladi.

import type { LessonStatus } from "./progress";

export type GameState =
  | "loading"
  | "map"
  | "mission_intro"
  | "coding"
  | "running"
  | "success"
  | "validation_error"
  | "paused"
  | "settings";

export const GAME_STATES: readonly GameState[] = [
  "loading",
  "map",
  "mission_intro",
  "coding",
  "running",
  "success",
  "validation_error",
  "paused",
  "settings",
] as const;

// Phaser <-> React typed event xaritasi.
// React Phaser obyektlarini bevosita boshqarmaydi; faqat shu eventlar orqali
// muloqot qiladi.
export type MoveDirection = "up" | "down" | "left" | "right";

export interface GameEventMap {
  "game:ready": { timestamp: string };
  "game:state-changed": { from: GameState; to: GameState };
  "map:mission-selected": { lessonId: string };
  "map:mission-open-requested": { lessonId: string };
  // Phaser qahramon missiya nuqtasiga yaqinlashganda yuboradi.
  // Matn (o'zbekcha) React overlay tomonidan registry asosida tuziladi.
  "map:mission-nearby": { lessonId: string; status: LessonStatus };
  "map:mission-left": { lessonId: string };
  // React progressni o'zgartirganda Phaser nuqta holatlarini yangilaydi.
  "map:states-updated": { states: Record<string, LessonStatus> };
  // Ekrandagi (on-screen) D-pad typed input protokoli.
  "input:direction-start": { direction: MoveDirection };
  "input:direction-stop": { direction: MoveDirection };
  "mission:started": { lessonId: string };
  "mission:completed": { lessonId: string; xp: number };
  "editor:run-requested": { lessonId: string };
  "preview:finished": { lessonId: string; success: boolean };
}

export type GameEventName = keyof GameEventMap;
