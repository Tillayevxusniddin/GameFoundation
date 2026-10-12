// docs/08_DATA_MODEL.md — lokal progress modeli.
// Saqlash ProgressRepository orqali abstraktlanadi (remote adapter kelajakda).

export type LessonStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export interface DraftCode {
  html: string;
  css: string;
  javascript: string;
}

export interface LessonProgress {
  status: LessonStatus;
  xp: number;
  hintsUsed: number;
  draftCode: DraftCode;
  updatedAt: string;
}

export interface PlayerProgress {
  schemaVersion: number;
  playerName?: string;
  totalXp: number;
  badges: string[];
  lessons: Record<string, LessonProgress>;
}

export interface ProgressRepository {
  load(): PlayerProgress;
  save(progress: PlayerProgress): void;
  clear(): void;
  // Modul tugaganda badgeId berilad (takrorlanmaydi).
  completeLesson(
    lessonId: string,
    hintsUsed: number,
    badgeId?: string,
  ): PlayerProgress;
  saveDraft(lessonId: string, draft: DraftCode): PlayerProgress;
  // Ixtiyoriy ismni saqlaydi (serverga yuborilmaydi).
  setPlayerName(name: string): PlayerProgress;
  // Barcha progress, XP, nishon va ismni tozalab, boshlang'ich holat qaytaradi.
  resetAll(): PlayerProgress;
  exportJson(): string;
  importJson(json: string): PlayerProgress;
  // Oxirgi ogohlantirish (masalan: buzilgan JSON tiklandi).
  // Ogohlantirish bo'lmasa null.
  getWarning(): string | null;
}
