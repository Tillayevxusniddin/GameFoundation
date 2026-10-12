// docs/07_CODE_EXECUTION_SECURITY.md — input limitlari.
// Jami kod 100 KB, DOM va console flood limitlari; timeout 2 soniya.

import type { DraftCode } from "../types/progress";

export const MAX_TOTAL_CODE_BYTES = 100 * 1024;
export const MAX_DOM_NODES = 1500;
export const MAX_CONSOLE_MESSAGES = 100;
export const EXECUTION_TIMEOUT_MS = 2000;
export const RATE_WINDOW_MS = 60_000;
export const MAX_RUNS_PER_MINUTE = 20;

export interface CodeSizeCheck {
  ok: boolean;
  bytes: number;
  limit: number;
}

// UTF-8 bayt hajmi (TextEncoder berilmasa ham deterministik ishlaydi).
export function utf8ByteLength(text: string): number {
  let bytes = 0;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    if (code < 0x80) {
      bytes += 1;
    } else if (code < 0x800) {
      bytes += 2;
    } else if (code >= 0xd800 && code <= 0xdbff) {
      bytes += 4;
      index += 1;
    } else {
      bytes += 3;
    }
  }
  return bytes;
}

export function totalCodeBytes(code: DraftCode): number {
  return (
    utf8ByteLength(code.html) +
    utf8ByteLength(code.css) +
    utf8ByteLength(code.javascript)
  );
}

export function checkCodeSize(code: DraftCode): CodeSizeCheck {
  const bytes = totalCodeBytes(code);
  return {
    ok: bytes <= MAX_TOTAL_CODE_BYTES,
    bytes,
    limit: MAX_TOTAL_CODE_BYTES,
  };
}