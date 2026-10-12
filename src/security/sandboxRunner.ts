// docs/07_CODE_EXECUTION_SECURITY.md — SandboxRunner: size/rate-limit/timeout
// tekshiruvarini iframe srcdoc bilan birlashtiradi; natija nonce orqali keladi.

import type {
  CodeRunner,
  SandboxRunOutcome,
  SandboxRunRequest,
  SandboxSnapshot,
} from "../types/sandbox";
import { EXECUTION_TIMEOUT_MS, checkCodeSize } from "./limits";
import { RateLimiter } from "./rateLimiter";
import {
  applySandboxAttributes,
  buildSandboxDocument,
  isSandboxSafe,
} from "./sandboxBuilder";
import { attachSandboxChannel, createNonce } from "./protocol";
import { uz } from "../i18n/uz";

export interface SandboxRunnerOptions {
  documentRef?: Document;
  now?: () => number;
  setTimeoutFn?: (handler: () => void, timeout: number) => number;
  clearTimeoutFn?: (handle: number) => void;
  rateLimiter?: RateLimiter;
  nonceFactory?: () => string;
}

export function resetIframe(target: HTMLIFrameElement): void {
  // Infinite loop/yopilgan ssenariyda srcdocni bo'shatish bajarilishni to'xtatadi.
  target.srcdoc = "";
  target.removeAttribute("srcdoc");
}

export class SandboxRunner implements CodeRunner {
  private readonly now: () => number;
  private readonly setTimeoutFn: (handler: () => void, timeout: number) => number;
  private readonly clearTimeoutFn: (handle: number) => void;
  private readonly rateLimiter: RateLimiter;
  private readonly nonceFactory: () => string;

  constructor(options?: SandboxRunnerOptions) {
    const existingDocument =
      options?.documentRef ??
      (typeof document !== "undefined" ? document : undefined);
    if (existingDocument === undefined) {
      throw new Error("SandboxRunner faqat Document mavjud muhitda ishlaydi");
    }
    this.now = options?.now ?? ((): number => Date.now());
    this.setTimeoutFn =
      options?.setTimeoutFn ??
      ((handler: () => void, timeout: number): number =>
        window.setTimeout(handler, timeout));
    this.clearTimeoutFn =
      options?.clearTimeoutFn ??
      ((handle: number): void => window.clearTimeout(handle));
    this.rateLimiter = options?.rateLimiter ?? new RateLimiter();
    this.nonceFactory = options?.nonceFactory ?? createNonce;
  }

  run(
    request: SandboxRunRequest,
    target: HTMLIFrameElement | null,
  ): Promise<SandboxRunOutcome> {
    const size = checkCodeSize(request.code);
    if (!size.ok) {
      return Promise.resolve({
        status: "limit",
        snapshot: null,
        message: `${uz.limitCodeTooLarge} (${size.bytes}/${size.limit} bayt)`,
      });
    }
    if (!this.rateLimiter.tryAcquire()) {
      return Promise.resolve({
        status: "rate-limited",
        snapshot: null,
        message: uz.limitTooManyRuns,
      });
    }
    if (target === null || target === undefined) {
      return Promise.resolve({
        status: "not-ready",
        snapshot: null,
        message: uz.previewNotReady,
      });
    }

    return new Promise<SandboxRunOutcome>((resolve) => {
      const startedAt = this.now();
      const nonce = this.nonceFactory();
      const contentWindow = target.contentWindow;
      let settled = false;
      let timeoutReference: number | null = null;
      let detach: () => void = (): void => {};

      const clearTimeoutRef = (): void => {
        if (timeoutReference !== null) {
          this.clearTimeoutFn(timeoutReference);
          timeoutReference = null;
        }
      };

      const onResult = (snapshot: SandboxSnapshot): void => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeoutRef();
        detach();
        snapshot.durationMs = this.now() - startedAt;
        resolve({ status: "ok", snapshot, message: null });
      };

      const onError = (message: string): void => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeoutRef();
        detach();
        resolve({ status: "error", snapshot: null, message });
      };

      detach = attachSandboxChannel({ contentWindow, nonce, onResult, onError });

      timeoutReference = this.setTimeoutFn((): void => {
        if (contentWindow !== null) {
          resetIframe(target);
        }
        if (!settled) {
          settled = true;
          clearTimeoutRef();
          detach();
          resolve({ status: "timeout", snapshot: null, message: uz.limitTimeout });
        }
      }, EXECUTION_TIMEOUT_MS);

      if (!isSandboxSafe(target.getAttribute("sandbox") ?? "")) {
        applySandboxAttributes(target);
      }
      target.srcdoc = buildSandboxDocument({
        nonce,
        html: request.code.html,
        css: request.code.css,
        javascript: request.code.javascript,
        probes: request.probes,
      });
    });
  }
}

export { EXECUTION_TIMEOUT_MS };