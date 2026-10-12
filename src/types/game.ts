// docs/02_GAME_DESIGN_DOCUMENT.md — o'yin holatlari.
// docs/06_TECHNICAL_ARCHITECTURE.md — Phaser va React typed event orqali aloqa qiladi.

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
export interface GameEventMap {
  "game:ready": { timestamp: string };
  "game:state-changed": { from: GameState; to: GameState };
  "map:mission-selected": { lessonId: string };
  "mission:started": { lessonId: string };
  "mission:completed": { lessonId: string; xp: number };
  "editor:run-requested": { lessonId: string };
  "preview:finished": { lessonId: string; success: boolean };
}

export type GameEventName = keyof GameEventMap;
