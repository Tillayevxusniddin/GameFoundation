import { describe, expect, it } from "vitest";
import { ContentError, validateLessonManifest } from "../../src/content/schema";
import {
  buildLessonRegistry,
  lessonRegistry,
  validatePrerequisiteChain,
} from "../../src/content/loader";

const EXPECTED_ORDER: readonly string[] = [
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
];

function rawManifest(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id: "test-01",
    moduleId: "html",
    title: "Sinov missiyasi",
    order: 1,
    difficulty: 1,
    prerequisites: [],
    learningObjectives: ["Maqsad"],
    story: "Hikoya",
    explanation: "Izoh",
    starterCode: { html: "<div></div>", css: "", javascript: "" },
    steps: [{ id: "s1", text: "Qadam" }],
    hints: ["birinchi", "ikkinchi", "uchinchi"],
    validation: [
      { id: "v1", type: "structural", target: "div", messageUz: "Xabar" },
    ],
    commonErrors: [{ pattern: "p", explanation: "e", fix: "f" }],
    successMessage: "Ajoyib",
    reflectionQuestion: "Nega?",
    rewardXp: 100,
    ...overrides,
  };
}

function captureError(run: () => void): unknown {
  try {
    run();
    return null;
  } catch (error) {
    return error;
  }
}

describe("content registry", () => {
  it("17 ta missiya manifesti validatsiyadan o'tadi", () => {
    expect(lessonRegistry.lessons).toHaveLength(17);
    for (const lesson of lessonRegistry.lessons) {
      expect(lesson.id.length).toBeGreaterThan(0);
      expect(lesson.hints).toHaveLength(3);
      expect(lesson.validation.length).toBeGreaterThan(0);
      expect(lesson.commonErrors.length).toBeGreaterThan(0);
    }
  });

  it("missiya ketma-ketligi va old shart zanjiri to'g'ri", () => {
    const ids = lessonRegistry.lessons.map((lesson) => lesson.id);
    expect(ids).toEqual(EXPECTED_ORDER);
    lessonRegistry.lessons.forEach((lesson, index) => {
      const previousId = EXPECTED_ORDER[index - 1];
      if (index === 0) {
        expect(lesson.prerequisites).toEqual([]);
        return;
      }
      expect(lesson.prerequisites).toEqual([previousId]);
      expect(lesson.order).toBe(index + 1);
    });
  });

  it("modul bo'yicha missiyalar soni to'g'ri (1+4+5+6+1)", () => {
    expect(lessonRegistry.byModule("intro")).toHaveLength(1);
    expect(lessonRegistry.byModule("html")).toHaveLength(4);
    expect(lessonRegistry.byModule("css")).toHaveLength(5);
    expect(lessonRegistry.byModule("js")).toHaveLength(6);
    expect(lessonRegistry.byModule("project")).toHaveLength(1);
  });

  it("keyingi/oldingi missiya zanjiri izchil (nextLessonId bilan mos)", () => {
    const lessons = lessonRegistry.lessons;
    lessons.forEach((lesson, index) => {
      const next = lessons[index + 1];
      if (next === undefined) {
        expect(lesson.nextLessonId).toBeUndefined();
      } else {
        expect(lesson.nextLessonId).toBe(next.id);
      }
      if (index > 0) {
        expect(lessonRegistry.previous(lesson.id)?.id).toBe(
          lessons[index - 1]?.id,
        );
      }
    });
    expect(lessonRegistry.require("intro-01").moduleId).toBe("intro");
  });
});

describe("content validation errors", () => {
  it("bo'sh title fayl va maydon nomi bilan ContentError beradi", () => {
    const error = captureError(() =>
      validateLessonManifest(rawManifest({ title: "" }), "bad-lesson.ts"),
    );
    expect(error).toBeInstanceOf(ContentError);
    const contentError = error as ContentError;
    expect(contentError.file).toBe("bad-lesson.ts");
    expect(contentError.field).toBe("title");
    expect(contentError.message).toContain("bad-lesson.ts");
    expect(contentError.message).toContain("title");
  });

  it("maslahatlar aynan 3 ta bo'lmasa hints maydonida xato beradi", () => {
    const error = captureError(() =>
      validateLessonManifest(rawManifest({ hints: ["faqat bitta"] }), "h.ts"),
    );
    expect(error).toBeInstanceOf(ContentError);
    expect((error as ContentError).field).toBe("hints");
  });

  it("validator turi ruxsat etilmagan bo'lsa xato beradi", () => {
    const error = captureError(() =>
      validateLessonManifest(
        rawManifest({
          validation: [
            { id: "v1", type: "nomalum", target: "div", messageUz: "X" },
          ],
        }),
        "v.ts",
      ),
    );
    expect(error).toBeInstanceOf(ContentError);
    expect((error as ContentError).field).toBe("validation[0].type");
  });

  it("noma'lum old shart aniq maydon bilan xato beradi", () => {
    const error = captureError(() =>
      buildLessonRegistry([
        { file: "a.ts", data: rawManifest({ id: "a-01", order: 1 }) },
        {
          file: "b.ts",
          data: rawManifest({
            id: "b-01",
            order: 2,
            prerequisites: ["yoq-01"],
          }),
        },
      ]),
    );
    expect(error).toBeInstanceOf(ContentError);
    expect((error as ContentError).file).toBe("b.ts");
    expect((error as ContentError).field).toBe("prerequisites[0]");
  });

  it("missiya o'zini old shart qilib ko'rsata olmaydi", () => {
    const error = captureError(() =>
      validatePrerequisiteChain([
        {
          file: "self.ts",
          manifest: validateLessonManifest(
            rawManifest({ id: "self-01", prerequisites: ["self-01"] }),
            "self.ts",
          ),
        },
      ]),
    );
    expect(error).toBeInstanceOf(ContentError);
    expect((error as ContentError).field).toBe("prerequisites[0]");
  });

  it("takrorlangan missiya id aniqlanadi", () => {
    const error = captureError(() =>
      buildLessonRegistry([
        { file: "one.ts", data: rawManifest({ id: "dup-01", order: 1 }) },
        { file: "two.ts", data: rawManifest({ id: "dup-01", order: 2 }) },
      ]),
    );
    expect(error).toBeInstanceOf(ContentError);
    expect((error as ContentError).field).toBe("id");
  });
});
