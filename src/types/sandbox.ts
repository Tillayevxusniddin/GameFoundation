// docs/06_TECHNICAL_ARCHITECTURE.md — sandbox va validator typed uzatiladi.
// docs/07_CODE_EXECUTION_SECURITY.md — snapshot va problar cheklangan,
// deterministik validator asosiy tekshiruvni execution natijasi orqali bajaradi.

import type { DraftCode } from "./progress";

export type SandboxConsoleLevel =
  | "log"
  | "debug"
  | "info"
  | "warn"
  | "error";

export interface SandboxConsoleEntry {
  level: SandboxConsoleLevel;
  text: string;
}

export interface BehaviorObservation {
  selector: string;
  action: "click" | "input";
  before: string;
  after: string;
  changed: boolean;
}

// Sandbox ichida bajarilgan kod natijasining deterministik snapshot'i.
// Validator engine shu snapshot + foydalanuvchi kodi ustida ishlaydi.
export interface SandboxSnapshot {
  // Rendered body innerHTML (execution natijasi).
  dom: string;
  nodeCount: number;
  console: SandboxConsoleEntry[];
  errors: string[];
  securityViolations: string[];
  // Probe id -> hisoblangan stillar (element topilmasa null).
  visual: Record<string, Record<string, string> | null>;
  // Probe id -> xulqiy kuzatuv (element topilmasa null).
  behavior: Record<string, BehaviorObservation | null>;
  truncated: boolean;
  timedOut: boolean;
  durationMs: number;
}

// Problar validator qoidalaridan deterministik tarzda kompilyatsiya qilinadi;
// sandbox faqat so'ralgan problarni bajaradi (donmiy kod bajarilmaydi).
export interface VisualProbe {
  id: string;
  selector: string;
  properties: string[];
}

export interface BehaviorProbe {
  id: string;
  selector: string;
  action: "click" | "input";
  observe: "text" | "value" | "class";
}

export interface ProbeSpec {
  visual: VisualProbe[];
  behavior: BehaviorProbe[];
}

export type SandboxRunStatus =
  | "ok"
  | "timeout"
  | "limit"
  | "rate-limited"
  | "error"
  | "not-ready";

export interface SandboxRunRequest {
  lessonId: string;
  code: DraftCode;
  probes: ProbeSpec;
}

export interface SandboxRunOutcome {
  status: SandboxRunStatus;
  snapshot: SandboxSnapshot | null;
  message: string | null;
}

// Validation engine uchun zarur kontekst.
export interface ValidationContext {
  code: DraftCode;
  snapshot: SandboxSnapshot;
}

// Agar sandbox iframe endi mavjud bo'lmasa (masalan, preview hali chizilmagan).
export interface CodeRunner {
  run(
    request: SandboxRunRequest,
    target: HTMLIFrameElement | null,
  ): Promise<SandboxRunOutcome>;
}