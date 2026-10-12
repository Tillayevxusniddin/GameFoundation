import { describe, expect, it } from "vitest";
import {
  LESSON_IDS,
  LocalProgressRepository,
  calculateXp,
  type StorageLike,
} from "../../src/progress/LocalProgressRepository";
import { uz } from "../../src/i18n/uz";

function createMemoryStorage(initial?: Record<string, string>): StorageLike {
  const map = new Map<string, string>(Object.entries(initial ?? {}));
  return {
    getItem(key: string): string | null {
      return map.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      map.set(key, value);
    },
    removeItem(key: string): void {
      map.delete(key);
    },
  };
}

const FIXED_NOW = "2026-01-01T00:00:00.000Z";
const now = (): string => FIXED_NOW;

describe("progress repository", () => {
  it("dastlab faqat intro-01 available, qolgan 16 tasi locked", () => {
    const repo = new LocalProgressRepository(createMemoryStorage(), now);
    const progress = repo.load();
    expect(LESSON_IDS).toHaveLength(17);
    expect(progress.lessons["intro-01"]?.status).toBe("available");
    const locked = LESSON_IDS.filter((id) => id !== "intro-01").every(
      (id) => progress.lessons[id]?.status === "locked",
    );
    expect(locked).toBe(true);
    expect(progress.schemaVersion).toBe(1);
    expect(progress.totalXp).toBe(0);
  });

  it("draft saqlash va qayta o'qishda saqlanib qoladi", () => {
    const storage = createMemoryStorage();
    const repo = new LocalProgressRepository(storage, now);
    repo.saveDraft("intro-01", {
      html: "<h1>Salom</h1>",
      css: "h1 { color: red; }",
      javascript: "console.log('salom');",
    });
    const again = new LocalProgressRepository(storage, now);
    const loaded = again.load();
    expect(loaded.lessons["intro-01"]?.draftCode.html).toBe("<h1>Salom</h1>");
    expect(loaded.lessons["intro-01"]?.status).toBe("in_progress");
  });

  it("maslahatsiz yakunlash 100 XP beradi va keyingi missiyani ochadi", () => {
    const repo = new LocalProgressRepository(createMemoryStorage(), now);
    expect(calculateXp(0)).toBe(100);
    const after = repo.completeLesson("intro-01", 0);
    expect(after.lessons["intro-01"]?.status).toBe("completed");
    expect(after.lessons["intro-01"]?.xp).toBe(100);
    expect(after.lessons["html-01"]?.status).toBe("available");
    expect(after.totalXp).toBe(100);
  });

  it("maslahat bilan yakunlash 80 XP beradi", () => {
    const repo = new LocalProgressRepository(createMemoryStorage(), now);
    expect(calculateXp(2)).toBe(80);
    const after = repo.completeLesson("intro-01", 2);
    expect(after.lessons["intro-01"]?.xp).toBe(80);
    expect(after.totalXp).toBe(80);
  });

  it("qayta yakunlash XP ni ikki marta qo'shmaydi", () => {
    const repo = new LocalProgressRepository(createMemoryStorage(), now);
    repo.completeLesson("intro-01", 0);
    const again = repo.completeLesson("intro-01", 0);
    expect(again.totalXp).toBe(100);
  });

  it("JSON export/import roundtrip ishlaydi", () => {
    const storage = createMemoryStorage();
    const repo = new LocalProgressRepository(storage, now);
    repo.completeLesson("intro-01", 0);
    const json = repo.exportJson();
    const other = new LocalProgressRepository(createMemoryStorage(), now);
    const imported = other.importJson(json);
    expect(imported.lessons["intro-01"]?.status).toBe("completed");
    expect(imported.totalXp).toBe(100);
    expect(other.getWarning()).toBeNull();
  });

  it("buzilgan JSON da xavfsiz default va o'zbekcha ogohlantirish qaytadi", () => {
    const storage = createMemoryStorage({
      "web-ninja:progress:v1": "bu-json-emas{{{",
    });
    const repo = new LocalProgressRepository(storage, now);
    const loaded = repo.load();
    expect(loaded.lessons["intro-01"]?.status).toBe("available");
    expect(loaded.totalXp).toBe(0);
    expect(repo.getWarning()).toBe(uz.progressCorrupted);
  });

  it("yaroqsiz import joriy holatni saqlab qoladi", () => {
    const repo = new LocalProgressRepository(createMemoryStorage(), now);
    const before = repo.load();
    const after = repo.importJson("not-json");
    expect(after.totalXp).toBe(before.totalXp);
    expect(repo.getWarning()).toBe(uz.progressImportInvalid);
  });

  it("localStorage ishlamasa tushunarli xabar beradi", () => {
    const repo = new LocalProgressRepository(null, now);
    const loaded = repo.load();
    expect(loaded.lessons["intro-01"]?.status).toBe("available");
    expect(repo.getWarning()).toBe(uz.storageUnavailable);
  });
});
