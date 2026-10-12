// docs/09_CONTENT_SCHEMA.md — manifest va validator turlari.
// docs/03_CURRICULUM.md — uch bosqichli maslahat, ekvivalent yechimlar qabul qilinadi.

export type ModuleId = "intro" | "html" | "css" | "js" | "project";

export type Difficulty = 1 | 2 | 3;

// Uch darajali maslahat: 1) tushuncha, 2) teg/selector/funksiya nomi,
// 3) minimal kod namunasi. Har doim aynan 3 ta element.
export type HintTuple = readonly [string, string, string];

export type ValidatorType =
  | "structural"
  | "value"
  | "visual"
  | "behavioral"
  | "educational";

export interface StarterCode {
  html: string;
  css: string;
  javascript: string;
}

export interface LessonStep {
  id: string;
  text: string;
}

export interface ValidationRule {
  id: string;
  type: ValidatorType;
  // Qaysi tushuncha/element tekshiriladi (masalan: "h1", "button", "color").
  target: string;
  // O'quvchiga ko'rsatiladigan yo'naltiruvchi xabar (o'zbekcha).
  messageUz: string;
}

export interface CommonError {
  pattern: string;
  explanation: string;
  fix: string;
}

export interface LessonManifest {
  id: string;
  moduleId: ModuleId;
  title: string;
  order: number;
  difficulty: Difficulty;
  prerequisites: string[];
  learningObjectives: string[];
  story: string;
  explanation: string;
  starterCode: StarterCode;
  steps: LessonStep[];
  hints: HintTuple;
  validation: ValidationRule[];
  commonErrors: CommonError[];
  successMessage: string;
  rewardXp: number;
  badgeId?: string;
  nextLessonId?: string;
}

// docs/06_TECHNICAL_ARCHITECTURE.md — validator natijasi typed uzatiladi.
export interface ValidationIssue {
  ruleId: string;
  // Nima bo'ldi.
  what: string;
  // Nega bo'ldi.
  why: string;
  // Keyingi qadam.
  nextStep: string;
}

export interface ValidationResult {
  success: boolean;
  lessonId: string;
  issues: ValidationIssue[];
  checkedAt: string;
}
