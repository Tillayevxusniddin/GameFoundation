// docs/09_CONTENT_SCHEMA.md — 4-bosqichda to'ldiriladigan skelet manifest.
// Har bir skelet to'liq validatsiyadan o'tadi, shuning uchun 17 missiya
// zanjiri va prerequisite tekshiruvi hozirdan ishlaydi.

import type { Difficulty, LessonManifest, ModuleId } from "../../types/content";

export interface SkeletonInput {
  id: string;
  moduleId: ModuleId;
  order: number;
  title: string;
  topic: string;
  prerequisites: readonly string[];
  difficulty?: Difficulty;
  nextLessonId?: string;
  badgeId?: string;
  rewardXp?: number;
}

export function createSkeletonManifest(input: SkeletonInput): LessonManifest {
  const manifest: LessonManifest = {
    id: input.id,
    moduleId: input.moduleId,
    title: input.title,
    order: input.order,
    difficulty: input.difficulty ?? 2,
    prerequisites: [...input.prerequisites],
    learningObjectives: [
      `${input.topic} bo‘yicha asosiy ko‘nikmani mustahkamlash`,
    ],
    story: `${input.title} hikoyasi 4-bosqichda to‘liq yoziladi. Hozircha bu skelet missiya zanjirini ulab turadi.`,
    explanation: `${input.topic} tushuntirishi 4-bosqichda batafsil qo‘shiladi.`,
    starterCode: {
      html:
        `<!-- ${input.topic}: tayyorlanmoqda -->\n` +
        `<div class="skeleton">${input.id}</div>\n`,
      css: "",
      javascript: "",
    },
    steps: [
      {
        id: `${input.id}-step-1`,
        text: `${input.topic} vazifasi 4-bosqichda qo‘shiladi.`,
      },
    ],
    hints: [
      `Avval ${input.topic} nima uchun kerakligini o‘ylab ko‘r.`,
      `${input.topic} bilan bog‘liq element yoki xususiyat nomini esla.`,
      `Minimal namunani 4-bosqichda ko‘rasan: ${input.id}.`,
    ],
    validation: [
      {
        id: `${input.id}-structural`,
        type: "structural",
        target: input.id,
        messageUz: `${input.topic} tekshiruvi 4-bosqichda aniqlanadi.`,
      },
    ],
    commonErrors: [
      {
        pattern: `${input.id} uchun xato namunasi`,
        explanation:
          "Bu missiyaning keng tarqalgan xatolari 4-bosqichda yoziladi.",
        fix: "Hozircha qadamlar va maslahatlarga tayan; to‘liq kontent keyin qo‘shiladi.",
      },
    ],
    successMessage: `${input.title} nishoni 4-bosqichda faollashadi. Hozircha missiya zanjiri to‘g‘ri ulanganini tekshirdik.`,
    reflectionQuestion: `${input.topic} nima uchun foydali bo‘lishini o‘z so‘zlaring bilan tushuntir.`,
    rewardXp: input.rewardXp ?? 100,
  };
  if (input.badgeId !== undefined) {
    manifest.badgeId = input.badgeId;
  }
  if (input.nextLessonId !== undefined) {
    manifest.nextLessonId = input.nextLessonId;
  }
  return manifest;
}
