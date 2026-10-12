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
  completeLesson(lessonId: string, hintsUsed: number): PlayerProgress;
  saveDraft(lessonId: string, draft: DraftCode): PlayerProgress;
  exportJson(): string;
  importJson(json: string): PlayerProgress;
  // Oxirgi ogohlantirish (masalan: buzilgan JSON tiklandi).
  // Ogohlantirish bo'lmasa null.
  getWarning(): string | null;
}
