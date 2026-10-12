// docs/07_CODE_EXECUTION_SECURITY.md — typed postMessage bridge.
// Opaque origin sabab `event.origin` yolg'iz tekshiruv emas: event.source
// iframe.contentWindow BO'LISHI VA bir martalik nonce mos kelishi kerak.

import type {
  SandboxConsoleEntry,
  SandboxConsoleLevel,
  SandboxSnapshot,
} from "../types/sandbox";

export const SANDBOX_MESSAGE_KIND = "wn:sandbox";
export const SANDBOX_MESSAGE_VERSION = 1;

export interface SandboxResultMessage {
  kind: typeof SANDBOX_MESSAGE_KIND;
  version: typeof SANDBOX_MESSAGE_VERSION;
  type: "result";
  nonce: string;
  snapshot: SandboxSnapshot;
}

export interface SandboxErrorMessage {
  kind: typeof SANDBOX_MESSAGE_KIND;
  version: typeof SANDBOX_MESSAGE_VERSION;
  type: "error";
  nonce: string;
  message: string;
}

export type SandboxMessage = SandboxResultMessage | SandboxErrorMessage;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const CONSOLE_LEVELS: readonly SandboxConsoleLevel[] = [
  "log",
  "debug",
  "info",
  "warn",
  "error",
];

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function asConsole(value: unknown): SandboxConsoleEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item["text"] !== "string") {
      return [];
    }
    const level = item["level"];
    if (typeof level !== "string" || !CONSOLE_LEVELS.includes(level as SandboxConsoleLevel)) {
      return [];
    }
    const entry: SandboxConsoleEntry = {
      level: level as SandboxConsoleLevel,
      text: item["text"],
    };
    return [entry];
  });
}

function asVisualMap(
  value: unknown,
): SandboxSnapshot["visual"] {
  if (!isRecord(value)) {
    return {};
  }
  const result: Record<string, Record<string, string> | null> = {};
  for (const [key, props] of Object.entries(value)) {
    if (props === null) {
      result[key] = null;
      continue;
    }
    if (isRecord(props)) {
      const normalized: Record<string, string> = {};
      for (const [prop, propValue] of Object.entries(props)) {
        if (typeof propValue === "string") {
          normalized[prop] = propValue;
        }
      }
      result[key] = normalized;
    }
  }
  return result;
}

function asBehaviorMap(
  value: unknown,
): SandboxSnapshot["behavior"] {
  if (!isRecord(value)) {
    return {};
  }
  const result: Record<string, SandboxSnapshot["behavior"][string]> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (raw === null) {
      result[key] = null;
      continue;
    }
    if (
      isRecord(raw) &&
      typeof raw["selector"] === "string" &&
      typeof raw["before"] === "string" &&
      typeof raw["after"] === "string"
    ) {
      result[key] = {
        selector: raw["selector"],
        action: raw["action"] === "input" ? "input" : "click",
        before: raw["before"],
        after: raw["after"],
        changed: raw["changed"] === true,
      };
    }
  }
  return result;
}

// Noto'g'ri shakldagi snapshot kelganda default qaytarmaydi (null), chunki
// bu soxta message bo'lishi mumkin.
export function normalizeSandboxSnapshot(
  value: unknown,
): SandboxSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }
  const dom = value["dom"];
  if (typeof dom !== "string") {
    return null;
  }
  const nodeCount = value["nodeCount"];
  const durationMs = value["durationMs"];
  return {
    dom,
    nodeCount: typeof nodeCount === "number" && Number.isFinite(nodeCount) ? Math.floor(nodeCount) : 0,
    console: asConsole(value["console"]),
    errors: asStringArray(value["errors"]),
    securityViolations: asStringArray(value["securityViolations"]),
    visual: asVisualMap(value["visual"]),
    behavior: asBehaviorMap(value["behavior"]),
    truncated: value["truncated"] === true,
    timedOut: value["timedOut"] === true,
    durationMs: typeof durationMs === "number" && Number.isFinite(durationMs) ? Math.floor(durationMs) : 0,
  };
}

export function parseSandboxMessage(data: unknown): SandboxMessage | null {
  if (!isRecord(data)) {
    return null;
  }
  if (
    data["kind"] !== SANDBOX_MESSAGE_KIND ||
    data["version"] !== SANDBOX_MESSAGE_VERSION
  ) {
    return null;
  }
  const nonce = data["nonce"];
  if (typeof nonce !== "string" || nonce.length === 0) {
    return null;
  }
  const type = data["type"];
  if (type === "result") {
    const snapshot = normalizeSandboxSnapshot(data["snapshot"]);
    if (snapshot === null) {
      return null;
    }
    return { kind: SANDBOX_MESSAGE_KIND, version: SANDBOX_MESSAGE_VERSION, type: "result", nonce, snapshot };
  }
  if (type === "error") {
    const message = data["message"];
    if (typeof message !== "string") {
      return null;
    }
    return { kind: SANDBOX_MESSAGE_KIND, version: SANDBOX_MESSAGE_VERSION, type: "error", nonce, message };
  }
  return null;
}

// source (WindowProxy) va nonce birgalikda, `origin`ga ishonilmaydi.
export function isTrustedSandboxEvent(
  event: { source: unknown; data: unknown },
  contentWindow: unknown,
  nonce: string,
): boolean {
  if (contentWindow === null || contentWindow === undefined) {
    return false;
  }
  if (event.source !== contentWindow) {
    return false;
  }
  const message = parseSandboxMessage(event.data);
  if (message === null) {
    return false;
  }
  return message.nonce === nonce && message.nonce.length > 0;
}

export interface SandboxChannelOptions {
  contentWindow: Window | null;
  nonce: string;
  onResult: (snapshot: SandboxSnapshot) => void;
  onError?: (message: string) => void;
}

export function attachSandboxChannel(
  options: SandboxChannelOptions,
): () => void {
  const listener = (event: MessageEvent): void => {
    if (
      !isTrustedSandboxEvent(event, options.contentWindow, options.nonce)
    ) {
      return;
    }
    const message = parseSandboxMessage(event.data);
    if (message === null) {
      return;
    }
    if (message.type === "result") {
      options.onResult(message.snapshot);
    } else {
      options.onError?.(message.message);
    }
  };
  window.addEventListener("message", listener);
  return (): void => {
    window.removeEventListener("message", listener);
  };
}

function randomHex(bytes: number): string {
  const values = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
}

// Har bir run uchun bir martalik nonce (session/run token).
export function createNonce(): string {
  return `wn-${Date.now().toString(36)}-${randomHex(8)}`;
}