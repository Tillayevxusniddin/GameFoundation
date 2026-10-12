// docs/05_UI_UX_DESIGN.md — audio va reduced-motion afzalliklari.
// docs/11_ACCESSIBILITY_AND_LOCALIZATION.md — foydalanuvchi boshqaradigan
// qulaylik sozlamalari. Progressdan ajratilgan kichik localStorage kaliti.

import type { StorageLike } from "./LocalProgressRepository";

export interface UiPreferences {
  // Audio sukut bo'yicha o'chiq (autoplay qilinmaydi).
  audioEnabled: boolean;
  // Manual reduced-motion; prefers-reduced-motion media query bilan birga ishlaydi.
  reducedMotion: boolean;
  // Kirish oynasi (ism) ko'rsatilgan/yoqilgan.
  introSeen: boolean;
  smallScreenNoticeDismissed: boolean;
}

export const UI_PREF_KEY = "web-ninja:ui-prefs:v1";

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  audioEnabled: false,
  reducedMotion: false,
  introSeen: false,
  smallScreenNoticeDismissed: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boolOr(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function sanitize(value: unknown): UiPreferences {
  if (!isRecord(value)) {
    return { ...DEFAULT_UI_PREFERENCES };
  }
  return {
    audioEnabled: boolOr(value["audioEnabled"], DEFAULT_UI_PREFERENCES.audioEnabled),
    reducedMotion: boolOr(value["reducedMotion"], DEFAULT_UI_PREFERENCES.reducedMotion),
    introSeen: boolOr(value["introSeen"], DEFAULT_UI_PREFERENCES.introSeen),
    smallScreenNoticeDismissed: boolOr(
      value["smallScreenNoticeDismissed"],
      DEFAULT_UI_PREFERENCES.smallScreenNoticeDismissed,
    ),
  };
}

function resolveStorage(
  explicit: StorageLike | null | undefined,
): StorageLike | null {
  if (explicit === null) {
    return null;
  }
  if (explicit !== undefined) {
    return explicit;
  }
  try {
    const holder = globalThis as unknown as { localStorage?: StorageLike };
    const candidate = holder.localStorage;
    if (
      candidate !== undefined &&
      candidate !== null &&
      typeof candidate.getItem === "function" &&
      typeof candidate.setItem === "function"
    ) {
      return candidate;
    }
  } catch {
    // localStorage mavjud emas — xotirasiz rejim.
  }
  return null;
}

export class UiPreferencesStore {
  private readonly storage: StorageLike | null;
  private cache: UiPreferences | null = null;

  constructor(storage?: StorageLike | null) {
    this.storage = resolveStorage(storage);
  }

  load(): UiPreferences {
    if (this.cache !== null) {
      return { ...this.cache };
    }
    if (this.storage === null) {
      this.cache = { ...DEFAULT_UI_PREFERENCES };
      return { ...this.cache };
    }
    try {
      const raw = this.storage.getItem(UI_PREF_KEY);
      const parsed: unknown = raw === null ? null : JSON.parse(raw);
      this.cache = sanitize(parsed);
    } catch {
      this.cache = { ...DEFAULT_UI_PREFERENCES };
    }
    return { ...this.cache };
  }

  save(preferences: UiPreferences): void {
    this.cache = sanitize(preferences);
    if (this.storage === null) {
      return;
    }
    try {
      this.storage.setItem(UI_PREF_KEY, JSON.stringify(this.cache));
    } catch {
      // Saqlab bo'lmasa ham xotiradagi qiymat ishlatiladi.
    }
  }

  update(patch: Partial<UiPreferences>): UiPreferences {
    const next: UiPreferences = { ...this.load(), ...patch };
    this.save(next);
    return next;
  }
}
