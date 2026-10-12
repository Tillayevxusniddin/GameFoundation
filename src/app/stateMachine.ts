// docs/02_GAME_DESIGN_DOCUMENT.md — o'yin holatlari aniq ajratiladi.
// Noto'g'ri o'tish jim yutilmaydi: go() false qaytaradi, holat o'zgarmaydi.

import type { GameState } from "../types/game";

const ALLOWED: Record<GameState, readonly GameState[]> = {
  loading: ["map"],
  map: ["mission_intro", "settings", "paused"],
  mission_intro: ["coding", "map"],
  coding: ["running", "map", "paused"],
  running: ["success", "validation_error"],
  success: ["map", "mission_intro"],
  validation_error: ["coding"],
  paused: ["map", "coding"],
  settings: ["map"],
};

export function isAllowedTransition(from: GameState, to: GameState): boolean {
  return ALLOWED[from].includes(to);
}

export interface StateMachine {
  get(): GameState;
  go(to: GameState): boolean;
}

export function createStateMachine(initial: GameState = "loading"): StateMachine {
  let current: GameState = initial;
  return {
    get(): GameState {
      return current;
    },
    go(to: GameState): boolean {
      if (!isAllowedTransition(current, to)) {
        return false;
      }
      current = to;
      return true;
    },
  };
}
