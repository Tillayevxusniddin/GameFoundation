import { describe, expect, it } from "vitest";
import {
  MAX_TOTAL_CODE_BYTES,
  checkCodeSize,
  totalCodeBytes,
  utf8ByteLength,
} from "../../src/security/limits";
import { RateLimiter } from "../../src/security/rateLimiter";
import {
  CONTENT_SECURITY_POLICY,
  buildCspMetaTag,
  containsDangerousScriptClose,
  escapeScriptContent,
} from "../../src/security/csp";
import {
  IFRAME_SANDBOX,
  buildSandboxDocument,
  isSandboxSafe,
} from "../../src/security/sandboxBuilder";
import {
  SANDBOX_MESSAGE_KIND,
  isTrustedSandboxEvent,
  normalizeSandboxSnapshot,
  parseSandboxMessage,
} from "../../src/security/protocol";
import type { DraftCode } from "../../src/types/progress";
import type { SandboxSnapshot } from "../../src/types/sandbox";

const EMPTY_CODE: DraftCode = { html: "", css: "", javascript: "" };

function makeSnapshot(overrides?: Partial<SandboxSnapshot>): SandboxSnapshot {
  return {
    dom: "<h1>Salom</h1>",
    nodeCount: 1,
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

describe("security limitlari", () => {
  it("utf-8 bayt hajmini deterministik hisoblaydi", () => {
    expect(utf8ByteLength("abc")).toBe(3);
    expect(utf8ByteLength("o‘")).toBe(4);
    expect(utf8ByteLength("😀")).toBe(4);
  });

  it("100 KB dan oshgan jami kodni rad etadi", () => {
    const okCode: DraftCode = { html: "a".repeat(1000), css: "", javascript: "" };
    expect(checkCodeSize(okCode).ok).toBe(true);
    expect(totalCodeBytes(okCode)).toBe(1000);

    const tooLarge: DraftCode = {
      html: "a".repeat(MAX_TOTAL_CODE_BYTES),
      css: "b",
      javascript: "",
    };
    const result = checkCodeSize(tooLarge);
    expect(result.ok).toBe(false);
    expect(result.limit).toBe(MAX_TOTAL_CODE_BYTES);
  });

  it("minutiga 20 marta ishga tushirishga ruxsat beradi", () => {
    const now = 0;
    const limiter = new RateLimiter({ now: () => now });
    for (let index = 0; index < 20; index += 1) {
      expect(limiter.tryAcquire()).toBe(true);
    }
    expect(limiter.tryAcquire()).toBe(false);
    expect(limiter.remaining()).toBe(0);
  });

  it("vaqt oynasi o'tgach limitni tiklaydi", () => {
    let now = 0;
    const limiter = new RateLimiter({ now: () => now });
    for (let index = 0; index < 20; index += 1) {
      limiter.tryAcquire();
    }
    expect(limiter.tryAcquire()).toBe(false);
    now = 60_001;
    expect(limiter.tryAcquire()).toBe(true);
  });
});

describe("CSP va script escape", () => {
  it("qat'iy CSP siyosatini beradi", () => {
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'none'");
    expect(CONTENT_SECURITY_POLICY).toContain("connect-src 'none'");
    expect(buildCspMetaTag()).toContain("Content-Security-Policy");
  });

  it("`</script>` va `<!--` ni JS uchun xavfsiz qiladi", () => {
    const escaped = escapeScriptContent("var a = '</script><h1>x</h1>'; <!-- y -->");
    expect(escaped).not.toMatch(/<\/script/i);
    expect(containsDangerousScriptClose(escaped)).toBe(false);
    expect(containsDangerousScriptClose("ok</script>")).toBe(true);
  });
});

describe("iframe sandbox atributi", () => {
  it("faqat allow-scripts beriladi, xavfli tokenlar rad etiladi", () => {
    expect(IFRAME_SANDBOX).toBe("allow-scripts");
    expect(isSandboxSafe("allow-scripts")).toBe(true);
    expect(isSandboxSafe("allow-scripts allow-same-origin")).toBe(false);
    expect(isSandboxSafe("allow-forms")).toBe(false);
    expect(isSandboxSafe("")).toBe(false);
  });

  it("sandbox hujjatiga CSP va nonce qo'shadi, foydalanuvchi JS'ni escape qiladi", () => {
    const documentText = buildSandboxDocument({
      nonce: "nonce-1",
      html: "<h1>Salom</h1>",
      css: "h1 { color: blue; }",
      javascript: "console.log('</script>');",
      probes: { visual: [], behavior: [] },
    });
    expect(documentText).toContain("Content-Security-Policy");
    expect(documentText).toContain("nonce-1");
    expect(documentText).not.toMatch(/console\.log\('<\/script>/);
  });
});

describe("typed postMessage protokoli", () => {
  it("to'g'ri shakldagi xabarni qabul qiladi", () => {
    const message = {
      kind: SANDBOX_MESSAGE_KIND,
      version: 1,
      type: "result",
      nonce: "n1",
      snapshot: makeSnapshot(),
    };
    expect(parseSandboxMessage(message)).not.toBeNull();
    expect(parseSandboxMessage({ kind: "boshqa" })).toBeNull();
    expect(parseSandboxMessage({ ...message, snapshot: {} })).toBeNull();
  });

  it("noto'g'ri snapshotni normallashtirmaydi", () => {
    expect(normalizeSandboxSnapshot(null)).toBeNull();
    expect(normalizeSandboxSnapshot({ dom: 5 })).toBeNull();
    expect(normalizeSandboxSnapshot({ dom: "<p>x</p>" })?.dom).toBe("<p>x</p>");
  });

  it("manba va nonce mos kelgandagina ishonadi, origin'ga emas", () => {
    const contentWindow = { name: "iframe" };
    const message = {
      kind: SANDBOX_MESSAGE_KIND,
      version: 1,
      type: "result",
      nonce: "n1",
      snapshot: makeSnapshot(),
    };
    expect(
      isTrustedSandboxEvent({ source: contentWindow, data: message }, contentWindow, "n1"),
    ).toBe(true);
    // Noto'g'ri nonce.
    expect(
      isTrustedSandboxEvent({ source: contentWindow, data: message }, contentWindow, "n2"),
    ).toBe(false);
    // Noto'g'ri manba.
    expect(
      isTrustedSandboxEvent({ source: { name: "boshqa" }, data: message }, contentWindow, "n1"),
    ).toBe(false);
  });
});

describe("SandboxRunner guardlari", () => {
  it("bo'sh iframe va noto'g'ri holatlarda natija statusini beradi", async () => {
    const { SandboxRunner } = await import("../../src/security/sandboxRunner");
    const runner = new SandboxRunner({
      documentRef: document,
      setTimeoutFn: (handler: () => void) => {
        handler();
        return 1;
      },
      clearTimeoutFn: () => {},
    });

    const tooLarge = await runner.run(
      {
        lessonId: "intro-01",
        code: { html: "a".repeat(MAX_TOTAL_CODE_BYTES + 1), css: "", javascript: "" },
        probes: { visual: [], behavior: [] },
      },
      null,
    );
    expect(tooLarge.status).toBe("limit");

    const notReady = await runner.run(
      { lessonId: "intro-01", code: EMPTY_CODE, probes: { visual: [], behavior: [] } },
      null,
    );
    expect(notReady.status).toBe("not-ready");
  });
});
