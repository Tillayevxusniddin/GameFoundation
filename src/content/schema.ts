// docs/09_CONTENT_SCHEMA.md — manifest runtime validatori.
// Xato aniq fayl va maydon nomi bilan qaytadi; missiya jim yo'qolmaydi.

import type {
  Difficulty,
  LessonManifest,
  LessonStep,
  ModuleId,
  StarterCode,
  ValidationRule,
} from "../types/content";

const MODULE_IDS: readonly ModuleId[] = [
  "intro",
  "html",
  "css",
  "js",
  "project",
];

const VALIDATOR_TYPES: readonly ValidationRule["type"][] = [
  "structural",
  "value",
  "visual",
  "behavioral",
  "educational",
];

export class ContentError extends Error {
  readonly file: string;
  readonly field: string;

  constructor(file: string, field: string, message: string) {
    super(`${file} :: ${field}: ${message}`);
    this.name = "ContentError";
    this.file = file;
    this.field = field;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function needNonEmptyString(
  file: string,
  field: string,
  value: unknown,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ContentError(file, field, "bo'sh bo'lmagan matn bo'lishi shart");
  }
  return value;
}

function needStringArray(
  file: string,
  field: string,
  value: unknown,
  minLength: number,
): string[] {
  if (!Array.isArray(value) || value.length < minLength) {
    throw new ContentError(
      file,
      field,
      `kamida ${minLength} ta element bo'lishi shart`,
    );
  }
  return value.map((item, index) => {
    if (typeof item !== "string" || item.trim().length === 0) {
      throw new ContentError(
        file,
        `${field}[${index}]`,
        "bo'sh bo'lmagan matn bo'lishi shart",
      );
    }
    return item;
  });
}

function checkModuleId(file: string, value: unknown): ModuleId {
  if (typeof value !== "string") {
    throw new ContentError(file, "moduleId", "matn bo'lishi shart");
  }
  const found = MODULE_IDS.find((m) => m === value);
  if (found === undefined) {
    throw new ContentError(
      file,
      "moduleId",
      `ruxsat etilgan qiymatlardan biri bo'lishi shart: ${MODULE_IDS.join(", ")}`,
    );
  }
  return found;
}

function checkDifficulty(file: string, value: unknown): Difficulty {
  if (value !== 1 && value !== 2 && value !== 3) {
    throw new ContentError(file, "difficulty", "1, 2 yoki 3 bo'lishi shart");
  }
  return value;
}

function checkStarterCode(file: string, value: unknown): StarterCode {
  if (!isRecord(value)) {
    throw new ContentError(file, "starterCode", "obyekt bo'lishi shart");
  }
  return {
    html: needNonEmptyString(file, "starterCode.html", value["html"]),
    css: typeof value["css"] === "string" ? value["css"] : "",
    javascript:
      typeof value["javascript"] === "string" ? value["javascript"] : "",
  };
}

function checkSteps(file: string, value: unknown): LessonStep[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ContentError(file, "steps", "kamida 1 ta qadam bo'lishi shart");
  }
  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new ContentError(file, `steps[${index}]`, "obyekt bo'lishi shart");
    }
    return {
      id: needNonEmptyString(file, `steps[${index}].id`, item["id"]),
      text: needNonEmptyString(file, `steps[${index}].text`, item["text"]),
    };
  });
}

function checkHints(file: string, value: unknown): LessonManifest["hints"] {
  if (!Array.isArray(value) || value.length !== 3) {
    throw new ContentError(file, "hints", "aynan 3 ta maslahat bo'lishi shart");
  }
  const checked = value.map((item, index) =>
    needNonEmptyString(file, `hints[${index}]`, item),
  );
  const first = checked[0];
  const second = checked[1];
  const third = checked[2];
  if (first === undefined || second === undefined || third === undefined) {
    throw new ContentError(file, "hints", "aynan 3 ta maslahat bo'lishi shart");
  }
  return [first, second, third];
}

function checkValidation(
  file: string,
  value: unknown,
): ValidationRule[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ContentError(
      file,
      "validation",
      "kamida 1 ta validator qoidasi bo'lishi shart",
    );
  }
  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new ContentError(
        file,
        `validation[${index}]`,
        "obyekt bo'lishi shart",
      );
    }
    const type = item["type"];
    if (typeof type !== "string") {
      throw new ContentError(
        file,
        `validation[${index}].type`,
        "matn bo'lishi shart",
      );
    }
    const found = VALIDATOR_TYPES.find((t) => t === type);
    if (found === undefined) {
      throw new ContentError(
        file,
        `validation[${index}].type`,
        `ruxsat etilgan tur bo'lishi shart: ${VALIDATOR_TYPES.join(", ")}`,
      );
    }
    return {
      id: needNonEmptyString(file, `validation[${index}].id`, item["id"]),
      type: found,
      target: needNonEmptyString(
        file,
        `validation[${index}].target`,
        item["target"],
      ),
      messageUz: needNonEmptyString(
        file,
        `validation[${index}].messageUz`,
        item["messageUz"],
      ),
    };
  });
}

export function validateLessonManifest(
  data: unknown,
  file = "unknown.ts",
): LessonManifest {
  if (!isRecord(data)) {
    throw new ContentError(file, "(root)", "manifest obyekt bo'lishi shart");
  }
  const prerequisites = needStringArray(
    file,
    "prerequisites",
    data["prerequisites"],
    0,
  );
  const rewardXp = data["rewardXp"];
  if (typeof rewardXp !== "number" || !Number.isFinite(rewardXp) || rewardXp < 0) {
    throw new ContentError(file, "rewardXp", "0 dan kichik bo'lmagan son bo'lishi shart");
  }
  const order = data["order"];
  if (typeof order !== "number" || !Number.isInteger(order) || order < 1) {
    throw new ContentError(file, "order", "1 dan boshlanadigan butun son bo'lishi shart");
  }
  const badgeId = data["badgeId"];
  const nextLessonId = data["nextLessonId"];
  const manifest: LessonManifest = {
    id: needNonEmptyString(file, "id", data["id"]),
    moduleId: checkModuleId(file, data["moduleId"]),
    title: needNonEmptyString(file, "title", data["title"]),
    order,
    difficulty: checkDifficulty(file, data["difficulty"]),
    prerequisites,
    learningObjectives: needStringArray(
      file,
      "learningObjectives",
      data["learningObjectives"],
      1,
    ),
    story: needNonEmptyString(file, "story", data["story"]),
    explanation: needNonEmptyString(file, "explanation", data["explanation"]),
    starterCode: checkStarterCode(file, data["starterCode"]),
    steps: checkSteps(file, data["steps"]),
    hints: checkHints(file, data["hints"]),
    validation: checkValidation(file, data["validation"]),
    commonErrors: checkCommonErrors(file, data["commonErrors"]),
    successMessage: needNonEmptyString(
      file,
      "successMessage",
      data["successMessage"],
    ),
    reflectionQuestion: needNonEmptyString(
      file,
      "reflectionQuestion",
      data["reflectionQuestion"],
    ),
    rewardXp: Math.floor(rewardXp),
  };
  if (typeof badgeId === "string" && badgeId.length > 0) {
    manifest.badgeId = badgeId;
  }
  if (typeof nextLessonId === "string" && nextLessonId.length > 0) {
    manifest.nextLessonId = nextLessonId;
  }
  return manifest;
}

function checkCommonErrors(
  file: string,
  value: unknown,
): LessonManifest["commonErrors"] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ContentError(
      file,
      "commonErrors",
      "kamida 1 ta keng tarqalgan xato bo'lishi shart",
    );
  }
  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new ContentError(
        file,
        `commonErrors[${index}]`,
        "obyekt bo'lishi shart",
      );
    }
    return {
      pattern: needNonEmptyString(
        file,
        `commonErrors[${index}].pattern`,
        item["pattern"],
      ),
      explanation: needNonEmptyString(
        file,
        `commonErrors[${index}].explanation`,
        item["explanation"],
      ),
      fix: needNonEmptyString(file, `commonErrors[${index}].fix`, item["fix"]),
    };
  });
}
