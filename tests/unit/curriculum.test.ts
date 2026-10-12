// docs/10_TESTING_STRATEGY.md — kontent sifati testlari:
//  1) har bir missiya uchun namunaviy (reference) yechim validatordan o'tadi;
//  2) har bir missiyaning boshlang'ich kodi (yoki ataylab xato kod) o'tmaydi;
//  3) validatsiya xatolari 3 qismli (what/why/nextStep) bo'ladi;
//  4) manifest matnlarida placeholder/skelet qolmagan va o'/g' to'g'ri yozilgan.

import { describe, expect, it } from "vitest";
import { lessonRegistry } from "../../src/content/loader";
import { validateLesson } from "../../src/validation/engine";
import type { LessonManifest } from "../../src/types/content";
import type { DraftCode } from "../../src/types/progress";
import { runReferenceSandbox } from "../helpers/referenceSandbox";
import {
  REFERENCE_SOLUTIONS,
  TEMPLATE_STARTERS,
  WRONG_CODE,
} from "../helpers/referenceSolutions";

function evaluate(
  lesson: LessonManifest,
  code: DraftCode,
): ReturnType<typeof validateLesson> {
  const { snapshot } = runReferenceSandbox(lesson, code);
  return validateLesson(lesson, { code, snapshot });
}

describe("curriculum: namunaviy yechimlar", () => {
  for (const lesson of lessonRegistry.lessons) {
    it(`${lesson.id} namunaviy yechim bilan o'tadi`, () => {
      const solution = REFERENCE_SOLUTIONS[lesson.id];
      expect(solution, `reference solution yo'q: ${lesson.id}`).toBeDefined();
      const result = evaluate(lesson, solution ?? WRONG_CODE);
      expect(result.success, JSON.stringify(result.issues)).toBe(true);
    });
  }
});

describe("curriculum: boshlang'ich kod o'tmaydi", () => {
  for (const lesson of lessonRegistry.lessons) {
    if (TEMPLATE_STARTERS.has(lesson.id)) {
      continue;
    }
    it(`${lesson.id} boshlang'ich kodi rad etiladi`, () => {
      const result = evaluate(lesson, lesson.starterCode);
      expect(result.success, JSON.stringify(result.issues)).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  }
});

describe("curriculum: ataylab xato kod 3 qismli xato beradi", () => {
  for (const lesson of lessonRegistry.lessons) {
    it(`${lesson.id} xato kodni rad etadi`, () => {
      const result = evaluate(lesson, WRONG_CODE);
      expect(result.success, JSON.stringify(result.issues)).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      for (const issue of result.issues) {
        expect(issue.what.length).toBeGreaterThan(0);
        expect(issue.why.length).toBeGreaterThan(0);
        expect(issue.nextStep.length).toBeGreaterThan(0);
      }
    });
  }
});

describe("curriculum: matn tozaligi", () => {
  const PLACEHOLDER_PATTERNS: readonly RegExp[] = [
    /skelet manifest/i,
    /placeholder/i,
    /tayyorlanmoqda/i,
    /4-bosqich/i,
    /to‘ldirilishi kerak/i,
  ];
  const STRAIGHT_APOSTROPHE: RegExp = /[oOgG]'/;

  for (const lesson of lessonRegistry.lessons) {
    it(`${lesson.id} placeholder matnsiz`, () => {
      const serialized = JSON.stringify(lesson);
      for (const pattern of PLACEHOLDER_PATTERNS) {
        expect(pattern.test(serialized), `${lesson.id}: ${pattern}`).toBe(
          false,
        );
      }
    });

    it(`${lesson.id} o' va g' to'g'ri yozilgan`, () => {
      const serialized = JSON.stringify(lesson);
      expect(
        serialized,
        `${lesson.id}: to'g'ri o‘/g‘ o'rniga ' ishlatilgan`,
      ).not.toMatch(STRAIGHT_APOSTROPHE);
    });
  }
});
