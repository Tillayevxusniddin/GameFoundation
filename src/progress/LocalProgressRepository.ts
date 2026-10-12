// docs/08_DATA_MODEL.md — versionlangan localStorage adapteri.
// docs/02_GAME_DESIGN_DOCUMENT.md — 100 XP / maslahat bilan 80 XP.

import { uz } from "../i18n/uz";
import type {
  DraftCode,
  LessonProgress,
  PlayerProgress,
  ProgressRepository,
} from "../types/progress";

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = "web-ninja:progress:v1";

export const BASE_XP = 100;
export const XP_WITH_HINT = 80;

// 1 intro + 4 html + 5 css + 6 js + 1 project = 17 ta missiya.
export const LESSON_IDS: readonly string[] = [
  "intro-01",
  "html-01",
  "html-02",
  "html-03",
  "html-04",
  "css-01",
  "css-02",
  "css-03",
  "css-04",
  "css-05",
  "js-01",
  "js-02",
  "js-03",
  "js-04",
  "js-05",
  "js-06",
  "project-01",
] as const;

export function calculateXp(hintsUsed: number): number {
  return hintsUsed <= 0 ? BASE_XP : XP_WITH_HINT;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidStatus(value: unknown): value is LessonProgress["status"] {
  return (
    value === "locked" ||
    value === "available" ||
    value === "in_progress" ||
    value === "completed"
  );
}

function emptyDraft(): DraftCode {
  return { html: "", css: "", javascript: "" };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createInitialProgress(nowIso: string): PlayerProgress {
  const lessons: Record<string, LessonProgress> = {};
  for (const id of LESSON_IDS) {
    lessons[id] = {
      status: id === "intro-01" ? "available" : "locked",
      xp: 0,
      hintsUsed: 0,
      draftCode: emptyDraft(),
      updatedAt: nowIso,
    };
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    totalXp: 0,
    badges: [],
    lessons,
  };
}

// Kelajakdagi schema versiyalar uchun migratsiya skeletoni.
// Hozir faqat v1 bor; eski/noma'lum shakl kelsa xavfsiz default qaytadi.
function migrate(raw: unknown, nowIso: string): PlayerProgress | null {
  if (!isRecord(raw)) {
    return null;
  }
  const version = raw["schemaVersion"];
  if (version !== SCHEMA_VERSION) {
    return null;
  }
  const lessonsRaw = raw["lessons"];
  if (!isRecord(lessonsRaw)) {
    return null;
  }
  const fallback = createInitialProgress(nowIso);
  for (const id of LESSON_IDS) {
    const entry: unknown = lessonsRaw[id];
    if (!isRecord(entry)) {
      continue;
    }
    const status: unknown = entry["status"];
    const xp: unknown = entry["xp"];
    const hintsUsed: unknown = entry["hintsUsed"];
    const draft: unknown = entry["draftCode"];
    const target = fallback.lessons[id];
    if (target === undefined) {
      continue;
    }
    if (isValidStatus(status)) {
      target.status = status;
    }
    if (typeof xp === "number" && Number.isFinite(xp) && xp >= 0) {
      target.xp = Math.floor(xp);
    }
    if (
      typeof hintsUsed === "number" &&
      Number.isFinite(hintsUsed) &&
      hintsUsed >= 0
    ) {
      target.hintsUsed = Math.floor(hintsUsed);
    }
    if (isRecord(draft)) {
      const html = draft["html"];
      const css = draft["css"];
      const javascript = draft["javascript"];
      target.draftCode = {
        html: typeof html === "string" ? html : "",
        css: typeof css === "string" ? css : "",
        javascript: typeof javascript === "string" ? javascript : "",
      };
    }
    const updatedAt: unknown = entry["updatedAt"];
    target.updatedAt =
      typeof updatedAt === "string" ? updatedAt : nowIso;
  }
  const totalXp: unknown = raw["totalXp"];
  fallback.totalXp =
    typeof totalXp === "number" && Number.isFinite(totalXp) && totalXp >= 0
      ? Math.floor(totalXp)
      : Object.values(fallback.lessons).reduce((sum, l) => sum + l.xp, 0);
  const badges: unknown = raw["badges"];
  fallback.badges = Array.isArray(badges)
    ? badges.filter((b): b is string => typeof b === "string")
    : [];
  const playerName: unknown = raw["playerName"];
  if (typeof playerName === "string" && playerName.length > 0) {
    fallback.playerName = playerName;
  }
  return fallback;
}

function resolveStorage(explicit: StorageLike | null | undefined): {
  storage: StorageLike | null;
  unavailable: boolean;
} {
  if (explicit === null) {
    return { storage: null, unavailable: true };
  }
  if (explicit !== undefined) {
    return { storage: explicit, unavailable: false };
  }
  try {
    const holder = globalThis as unknown as {
      localStorage?: StorageLike;
    };
    const candidate = holder.localStorage;
    if (
      candidate !== undefined &&
      candidate !== null &&
      typeof candidate.getItem === "function" &&
      typeof candidate.setItem === "function" &&
      typeof candidate.removeItem === "function"
    ) {
      candidate.getItem(STORAGE_KEY);
      return { storage: candidate, unavailable: false };
    }
  } catch {
    // localStorage mavjud emas yoki bloklangan — quyida fallback.
  }
  return { storage: null, unavailable: true };
}

export class LocalProgressRepository implements ProgressRepository {
  private readonly storage: StorageLike | null;
  private readonly now: () => string;
  private warning: string | null;

  constructor(storage?: StorageLike | null, now?: () => string) {
    const resolved = resolveStorage(storage);
    this.storage = resolved.storage;
    this.now = now ?? (() => new Date().toISOString());
    this.warning = resolved.unavailable ? uz.storageUnavailable : null;
  }

  getWarning(): string | null {
    return this.warning;
  }

  load(): PlayerProgress {
    const nowIso = this.now();
    if (this.storage === null) {
      if (this.warning === null) {
        this.warning = uz.storageUnavailable;
      }
      return createInitialProgress(nowIso);
    }
    let rawText: string | null = null;
    try {
      rawText = this.storage.getItem(STORAGE_KEY);
    } catch {
      this.warning = uz.storageSaveFailed;
      return createInitialProgress(nowIso);
    }
    if (rawText === null) {
      return createInitialProgress(nowIso);
    }
    try {
      const parsed: unknown = JSON.parse(rawText) as unknown;
      const migrated = migrate(parsed, nowIso);
      if (migrated === null) {
        this.warning = uz.progressCorrupted;
        return createInitialProgress(nowIso);
      }
      return migrated;
    } catch {
      this.warning = uz.progressCorrupted;
      return createInitialProgress(nowIso);
    }
  }

  save(progress: PlayerProgress): void {
    if (this.storage === null) {
      this.warning = uz.storageUnavailable;
      return;
    }
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(progress));
      this.warning = null;
    } catch {
      this.warning = uz.storageSaveFailed;
    }
  }

  clear(): void {
    if (this.storage === null) {
      this.warning = uz.storageUnavailable;
      return;
    }
    try {
      this.storage.removeItem(STORAGE_KEY);
      this.warning = null;
    } catch {
      this.warning = uz.storageSaveFailed;
    }
  }

  completeLesson(
    lessonId: string,
    hintsUsed: number,
    badgeId?: string,
  ): PlayerProgress {
    const current = this.load();
    const next: PlayerProgress = clone(current);
    const lesson = next.lessons[lessonId];
    if (lesson === undefined) {
      return current;
    }
    if (lesson.status !== "completed") {
      lesson.xp = calculateXp(hintsUsed);
    }
    lesson.hintsUsed = Math.max(lesson.hintsUsed, Math.max(0, hintsUsed));
    lesson.status = "completed";
    lesson.updatedAt = this.now();
    if (
      badgeId !== undefined &&
      badgeId.trim().length > 0 &&
      !next.badges.includes(badgeId)
    ) {
      next.badges.push(badgeId);
    }
    const index = LESSON_IDS.indexOf(lessonId);
    if (index >= 0) {
      const nextId = LESSON_IDS[index + 1];
      if (nextId !== undefined) {
        const nextLesson = next.lessons[nextId];
        if (nextLesson !== undefined && nextLesson.status === "locked") {
          nextLesson.status = "available";
          nextLesson.updatedAt = this.now();
        }
      }
    }
    next.totalXp = Object.values(next.lessons).reduce(
      (sum, l) => sum + l.xp,
      0,
    );
    this.save(next);
    return clone(next);
  }

  saveDraft(lessonId: string, draft: DraftCode): PlayerProgress {
    const current = this.load();
    const next: PlayerProgress = clone(current);
    const lesson = next.lessons[lessonId];
    if (lesson === undefined) {
      return current;
    }
    lesson.draftCode = { ...draft };
    if (lesson.status === "available") {
      lesson.status = "in_progress";
    }
    lesson.updatedAt = this.now();
    this.save(next);
    return clone(next);
  }

  setPlayerName(name: string): PlayerProgress {
    const current = this.load();
    const next: PlayerProgress = clone(current);
    const trimmed = name.trim().slice(0, 40);
    if (trimmed.length === 0) {
      delete next.playerName;
    } else {
      next.playerName = trimmed;
    }
    this.save(next);
    return clone(next);
  }

  resetAll(): PlayerProgress {
    this.clear();
    const fresh = createInitialProgress(this.now());
    this.save(fresh);
    return clone(fresh);
  }

  exportJson(): string {
    return JSON.stringify(this.load());
  }

  importJson(json: string): PlayerProgress {
    const current = this.load();
    let parsed: unknown;
    try {
      parsed = JSON.parse(json) as unknown;
    } catch {
      this.warning = uz.progressImportInvalid;
      return current;
    }
    const migrated = migrate(parsed, this.now());
    if (migrated === null) {
      this.warning = uz.progressImportInvalid;
      return current;
    }
    this.save(migrated);
    if (this.warning === uz.progressImportInvalid) {
      this.warning = null;
    }
    return clone(migrated);
  }
}
