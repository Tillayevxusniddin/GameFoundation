// docs/09_CONTENT_SCHEMA.md — manifest yuklash, runtime validatsiya va registry.
// Xato aniq fayl va maydon nomi bilan ContentError orqali qaytadi; missiya jim
// yo'qolmaydi. docs/04_LEVEL_DESIGN.md — 17 missiya zanjiri va old shartlar.

import type { LessonManifest, ModuleId } from "../types/content";
import { ContentError, validateLessonManifest } from "./schema";
import { intro01 } from "./lessons/intro-01";
import { html01 } from "./lessons/html-01";
import { html02 } from "./lessons/html-02";
import { html03 } from "./lessons/html-03";
import { html04 } from "./lessons/html-04";
import { css01 } from "./lessons/css-01";
import { css02 } from "./lessons/css-02";
import { css03 } from "./lessons/css-03";
import { css04 } from "./lessons/css-04";
import { css05 } from "./lessons/css-05";
import { js01 } from "./lessons/js-01";
import { js02 } from "./lessons/js-02";
import { js03 } from "./lessons/js-03";
import { js04 } from "./lessons/js-04";
import { js05 } from "./lessons/js-05";
import { js06 } from "./lessons/js-06";
import { project01 } from "./lessons/project-01";

export interface LessonSource {
  file: string;
  data: unknown;
}

// Manba fayllari aniq nom bilan yoziladi, shunda xato "fayl :: maydon" ko'rinishida chiqadi.
export const lessonSources: readonly LessonSource[] = [
  { file: "src/content/lessons/intro-01.ts", data: intro01 },
  { file: "src/content/lessons/html-01.ts", data: html01 },
  { file: "src/content/lessons/html-02.ts", data: html02 },
  { file: "src/content/lessons/html-03.ts", data: html03 },
  { file: "src/content/lessons/html-04.ts", data: html04 },
  { file: "src/content/lessons/css-01.ts", data: css01 },
  { file: "src/content/lessons/css-02.ts", data: css02 },
  { file: "src/content/lessons/css-03.ts", data: css03 },
  { file: "src/content/lessons/css-04.ts", data: css04 },
  { file: "src/content/lessons/css-05.ts", data: css05 },
  { file: "src/content/lessons/js-01.ts", data: js01 },
  { file: "src/content/lessons/js-02.ts", data: js02 },
  { file: "src/content/lessons/js-03.ts", data: js03 },
  { file: "src/content/lessons/js-04.ts", data: js04 },
  { file: "src/content/lessons/js-05.ts", data: js05 },
  { file: "src/content/lessons/js-06.ts", data: js06 },
  { file: "src/content/lessons/project-01.ts", data: project01 },
];

export interface LessonRegistryEntry {
  file: string;
  manifest: LessonManifest;
}

export interface LessonRegistry {
  readonly entries: readonly LessonRegistryEntry[];
  readonly lessons: readonly LessonManifest[];
  get(id: string): LessonManifest | undefined;
  require(id: string): LessonManifest;
  byModule(moduleId: ModuleId): readonly LessonManifest[];
  next(id: string): LessonManifest | undefined;
  previous(id: string): LessonManifest | undefined;
}

function indexEntries(
  entries: readonly LessonRegistryEntry[],
): Map<string, LessonManifest> {
  const byId = new Map<string, LessonManifest>();
  for (const entry of entries) {
    const existing = byId.get(entry.manifest.id);
    if (existing !== undefined) {
      throw new ContentError(
        entry.file,
        "id",
        `takrorlangan missiya id: ${entry.manifest.id}`,
      );
    }
    byId.set(entry.manifest.id, entry.manifest);
  }
  return byId;
}

function detectCycle(
  start: LessonManifest,
  byId: Map<string, LessonManifest>,
): void {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  const walk = (manifest: LessonManifest): void => {
    if (visited.has(manifest.id)) {
      return;
    }
    if (visiting.has(manifest.id)) {
      stack.push(manifest.id);
      throw new ContentError(
        `${manifest.id}`,
        "prerequisites",
        `old shartlar zanjirida aylanma (cycle) aniqlandi: ${stack.join(" -> ")}`,
      );
    }
    visiting.add(manifest.id);
    stack.push(manifest.id);
    for (const prereqId of manifest.prerequisites) {
      const prereq = byId.get(prereqId);
      if (prereq !== undefined) {
        walk(prereq);
      }
    }
    stack.pop();
    visiting.delete(manifest.id);
    visited.add(manifest.id);
  };

  walk(start);
}

export function validatePrerequisiteChain(
  entries: readonly LessonRegistryEntry[],
): void {
  const byId = indexEntries(entries);
  for (const entry of entries) {
    const manifest = entry.manifest;
    manifest.prerequisites.forEach((prereqId, index) => {
      if (prereqId === manifest.id) {
        throw new ContentError(
          entry.file,
          `prerequisites[${index}]`,
          "missiya o‘zini old shart qilib ko‘rsata olmaydi",
        );
      }
      const prereq = byId.get(prereqId);
      if (prereq === undefined) {
        throw new ContentError(
          entry.file,
          `prerequisites[${index}]`,
          `noma’lum old shart: ${prereqId}`,
        );
      }
      if (prereq.order >= manifest.order) {
        throw new ContentError(
          entry.file,
          "order",
          `old shart ${prereqId} (order ${prereq.order}) missiyadan keyin kelmasligi kerak (order ${manifest.order})`,
        );
      }
    });
    if (
      manifest.nextLessonId !== undefined &&
      !byId.has(manifest.nextLessonId)
    ) {
      throw new ContentError(
        entry.file,
        "nextLessonId",
        `noma’lum keyingi missiya: ${manifest.nextLessonId}`,
      );
    }
  }
  // Har bir tugun uchun aylanmani tekshiradi.
  for (const entry of entries) {
    detectCycle(entry.manifest, byId);
  }
}

function checkOrderUniqueness(entries: readonly LessonRegistryEntry[]): void {
  const seen = new Map<number, string>();
  for (const entry of entries) {
    const order = entry.manifest.order;
    const owner = seen.get(order);
    if (owner !== undefined) {
      throw new ContentError(
        entry.file,
        "order",
        `order ${order} allaqachon ${owner} faylida ishlatilgan`,
      );
    }
    seen.set(order, entry.file);
  }
}

export function buildLessonRegistry(
  sources: readonly LessonSource[],
): LessonRegistry {
  if (sources.length === 0) {
    throw new ContentError("src/content/loader.ts", "lessonSources", "kamida 1 ta missiya bo‘lishi shart");
  }
  const entries: LessonRegistryEntry[] = sources.map((source) => ({
    file: source.file,
    manifest: validateLessonManifest(source.data, source.file),
  }));
  validatePrerequisiteChain(entries);
  checkOrderUniqueness(entries);

  const sorted = [...entries].sort(
    (a, b) => a.manifest.order - b.manifest.order,
  );
  const byId = indexEntries(sorted);
  const lessons: readonly LessonManifest[] = sorted.map((e) => e.manifest);

  const indexOf = (id: string): number =>
    lessons.findIndex((lesson) => lesson.id === id);

  return {
    entries: sorted,
    lessons,
    get(id: string): LessonManifest | undefined {
      return byId.get(id);
    },
    require(id: string): LessonManifest {
      const found = byId.get(id);
      if (found === undefined) {
        throw new ContentError(
          "src/content/loader.ts",
          "id",
          `missiya topilmadi: ${id}`,
        );
      }
      return found;
    },
    byModule(moduleId: ModuleId): readonly LessonManifest[] {
      return lessons.filter((lesson) => lesson.moduleId === moduleId);
    },
    next(id: string): LessonManifest | undefined {
      const index = indexOf(id);
      if (index < 0) {
        return undefined;
      }
      return lessons[index + 1];
    },
    previous(id: string): LessonManifest | undefined {
      const index = indexOf(id);
      if (index <= 0) {
        return undefined;
      }
      return lessons[index - 1];
    },
  };
}

// Standart registry modul yuklanishida quriladi: kontent xatosi buildda darhol
// ko'rinadi, missiya jim yo'qolmaydi.
export const lessonRegistry: LessonRegistry =
  buildLessonRegistry(lessonSources);

export function getLesson(id: string): LessonManifest | undefined {
  return lessonRegistry.get(id);
}
