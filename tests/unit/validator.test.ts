import { describe, expect, it } from "vitest";
import type { LessonManifest, ValidationRule } from "../../src/types/content";
import type { DraftCode } from "../../src/types/progress";
import type { SandboxSnapshot } from "../../src/types/sandbox";
import { validateLesson } from "../../src/validation/engine";
import { compileProbes } from "../../src/validation/probes";
import { html01 } from "../../src/content/lessons/html-01";
import { intro01 } from "../../src/content/lessons/intro-01";

function makeManifest(validation: ValidationRule[]): LessonManifest {
  return {
    id: "test-01",
    moduleId: "html",
    title: "Sinov missiyasi",
    order: 1,
    difficulty: 1,
    prerequisites: [],
    learningObjectives: ["sinov"],
    story: "hikoya",
    explanation: "tushuntirish",
    starterCode: { html: "", css: "", javascript: "" },
    steps: [{ id: "s1", text: "qadam" }],
    hints: ["birinchi", "ikkinchi", "uchinchi"],
    validation,
    commonErrors: [],
    successMessage: "bajarildi",
    reflectionQuestion: "savol",
    rewardXp: 100,
  };
}

function makeSnapshot(overrides?: Partial<SandboxSnapshot>): SandboxSnapshot {
  return {
    dom: "",
    nodeCount: 0,
    console: [],
    errors: [],
    securityViolations: [],
    visual: {},
    behavior: {},
    truncated: false,
    timedOut: false,
    durationMs: 0,
    ...overrides,
  };
}

function code(partial: Partial<DraftCode>): DraftCode {
  return { html: "", css: "", javascript: "", ...partial };
}

describe("deterministik validator", () => {
  it("intro-01 to'g'ri kodni muvaffaqiyatli deb baholaydi", () => {
    const result = validateLesson(intro01, {
      code: code({ html: "<h1>Salom, Web Ninja!</h1>" }),
      snapshot: makeSnapshot({ dom: "<h1>Salom, Web Ninja!</h1>", nodeCount: 1 }),
    });
    expect(result.success).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("intro-01 noto'g'ri kodda uch qismli xabar beradi", () => {
    const result = validateLesson(intro01, {
      code: code({ html: "<p>sarlavha yo'q</p>" }),
      snapshot: makeSnapshot({ dom: "<p>sarlavha yo'q</p>" }),
    });
    expect(result.success).toBe(false);
    const issue = result.issues.find(
      (item) => item.ruleId === "intro-structural-h1",
    );
    expect(issue).toBeDefined();
    expect(issue?.what.length).toBeGreaterThan(0);
    expect(issue?.why.length).toBeGreaterThan(0);
    expect(issue?.nextStep.length).toBeGreaterThan(0);
  });

  it("behavioral preview-run xatolarni aniqlaydi", () => {
    const result = validateLesson(intro01, {
      code: code({ html: "<h1>Salom</h1>" }),
      snapshot: makeSnapshot({ dom: "<h1>Salom</h1>", errors: ["Boom"] }),
    });
    expect(result.success).toBe(false);
    expect(
      result.issues.some((item) => item.ruleId === "intro-behavioral-run"),
    ).toBe(true);
  });

  it("html-01 doctype va tuzilma qoidalarini tekshiradi", () => {
    const good = validateLesson(html01, {
      code: code({
        html:
          "<!doctype html><html><head><title>t</title></head><body><h1>Salom</h1></body></html>",
      }),
      snapshot: makeSnapshot({ dom: "<h1>Salom</h1>" }),
    });
    expect(good.success).toBe(true);

    const bad = validateLesson(html01, {
      code: code({ html: "<h1>Salom</h1>" }),
      snapshot: makeSnapshot({ dom: "<h1>Salom</h1>" }),
    });
    expect(bad.success).toBe(false);
    expect(bad.issues.length).toBeGreaterThan(0);
  });

  it("visual qoidani snapshot computed stillari asosida baholaydi", () => {
    const manifest = makeManifest([
      { id: "v1", type: "visual", target: "h1@color=blue", messageUz: "rang" },
    ]);
    const success = validateLesson(manifest, {
      code: code({ html: "<h1>x</h1>" }),
      snapshot: makeSnapshot({ visual: { v1: { color: "rgb(0, 0, 255)", display: "block" } } }),
    });
    expect(success.success).toBe(true);

    const failure = validateLesson(manifest, {
      code: code({ html: "<h1>x</h1>" }),
      snapshot: makeSnapshot({ visual: { v1: { color: "rgb(255, 0, 0)", display: "block" } } }),
    });
    expect(failure.success).toBe(false);
  });

  it("ko'rinmas elementni visual qoidada rad etadi", () => {
    const manifest = makeManifest([
      { id: "v1", type: "visual", target: "h1", messageUz: "ko'rinish" },
    ]);
    const result = validateLesson(manifest, {
      code: code({ html: "<h1>x</h1>" }),
      snapshot: makeSnapshot({ visual: { v1: { display: "none" } } }),
    });
    expect(result.success).toBe(false);
  });

  it("xavfsizlik buzilishini xato sifatida ko'rsatadi", () => {
    const manifest = makeManifest([]);
    const result = validateLesson(manifest, {
      code: code({ html: "<h1>x</h1>" }),
      snapshot: makeSnapshot({ securityViolations: ["fetch() bloklandi"] }),
    });
    expect(result.success).toBe(false);
    expect(
      result.issues.some((item) => item.ruleId === "sandbox-security"),
    ).toBe(true);
  });

  it("problarni manifest qoidalaridan kompilyatsiya qiladi", () => {
    const probes = compileProbes(
      makeManifest([
        { id: "v1", type: "visual", target: "h1@color=blue", messageUz: "rang" },
        { id: "b1", type: "behavioral", target: "click:button", messageUz: "bosish" },
        { id: "s1", type: "structural", target: "h1", messageUz: "sarlavha" },
      ]),
    );
    expect(probes.visual.map((probe) => probe.id)).toEqual(["v1"]);
    expect(probes.visual[0]?.properties).toContain("color");
    expect(probes.behavior.map((probe) => probe.id)).toEqual(["b1"]);
    expect(probes.behavior[0]?.action).toBe("click");
  });
});
