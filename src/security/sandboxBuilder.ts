// docs/07_CODE_EXECUTION_SECURITY.md — iframe sandbox atributi va srcdoc qurish.
// allow-same-origin/forms/popups/top-navigation/modals/downloads QAT'IYAN berilmaydi.
// O'quvchi kodi CSP meta + runtime guard ichida bajariladi; natija faqat nonce
// bilan typed postMessage orqali o'tadi.

import type { ProbeSpec } from "../types/sandbox";
import { uz } from "../i18n/uz";
import {
  MAX_CONSOLE_MESSAGES,
  MAX_DOM_NODES,
} from "./limits";
import { buildCspMetaTag, escapeScriptContent } from "./csp";

export const IFRAME_SANDBOX = "allow-scripts";

export const FORBIDDEN_SANDBOX_TOKENS: readonly string[] = [
  "allow-same-origin",
  "allow-forms",
  "allow-popups",
  "allow-top-navigation",
  "allow-top-navigation-by-user-activation",
  "allow-modals",
  "allow-downloads",
  "allow-presentation",
  "allow-pointer-lock",
  "allow-orientation-lock",
  "allow-popups-to-escape-sandbox",
] as const;

export function isSandboxSafe(sandboxAttribute: string): boolean {
  const tokens = sandboxAttribute
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
  if (tokens.length === 0) {
    return false;
  }
  for (const token of tokens) {
    if (FORBIDDEN_SANDBOX_TOKENS.includes(token)) {
      return false;
    }
  }
  return true;
}

export function applySandboxAttributes(iframe: HTMLIFrameElement): void {
  iframe.setAttribute("sandbox", IFRAME_SANDBOX);
}

export interface SandboxBuildOptions {
  nonce: string;
  html: string;
  css: string;
  javascript: string;
  probes: ProbeSpec;
}

// Into runtime guard: console, eval/Function, tarmoq, parent/top navigatsiya.
// Qolgan himoya (CSP, sandbox atributi, opaque origin, 2s parent timeout)
// runtime darajasida ham, brauzer darajasida ham qo'llanadi.
function buildRuntimeScript(options: SandboxBuildOptions): string {
  const messages: Record<string, string> = {
    eval: uz.sandboxBlockedEval,
    function: uz.sandboxBlockedEval,
    network: uz.sandboxBlockedNetwork,
    worker: uz.sandboxBlockedWorker,
    storage: uz.sandboxBlockedStorage,
    parent: uz.sandboxBlockedParent,
    open: uz.sandboxBlockedOpen,
    consoleFlood: uz.limitConsoleFlood,
  };
  const config = JSON.stringify({
    nonce: options.nonce,
    css: options.css,
    domLimit: MAX_DOM_NODES,
    consoleLimit: MAX_CONSOLE_MESSAGES,
    probes: options.probes,
    messages,
  });

  return [
    "(function(){",
    '"use strict";',
    "var OPTIONS = " + config + ";",
    "var t0 = Date.now();",
    "var violations = [];",
    "var consoleEntries = [];",
    "var consoleTruncated = false;",
    "var nativeConsole = window.console;",
    "function safeString(value) {",
    "  try {",
    "    if (value instanceof Error) { return value.message || String(value); }",
    '    if (typeof value === "string") { return value; }',
    '    if (value === undefined) { return "undefined"; }',
    "    return JSON.stringify(value);",
    "  } catch (error) {",
    "    return String(value);",
    "  }",
    "}",
    "function securityViolation(message) { violations.push(message); }",
    "function blocked(message) {",
    "  return function () {",
    "    securityViolation(message);",
    "    throw new Error(message);",
    "  };",
    "}",
    "try {",
    '  var styleEl = document.createElement("style");',
    '  styleEl.setAttribute("type", "text/css");',
    "  styleEl.textContent = OPTIONS.css;",
    "  var head = document.head || document.documentElement;",
    "  if (head) { head.appendChild(styleEl); }",
    "} catch (error) {",
    "  // CSS qo'llash xatosiz davom etishi kerak.",
    "}",
    "function wrapConsole(level) {",
    "  nativeConsole[level] = function () {",
    "    if (consoleEntries.length >= OPTIONS.consoleLimit) {",
    "      consoleTruncated = true;",
    "      return;",
    "    }",
    "    var parts = [];",
    "    for (var i = 0; i < arguments.length; i += 1) {",
    "      parts.push(safeString(arguments[i]));",
    "    }",
    "    consoleEntries.push({ level: level, text: parts.join(' ') });",
    "  };",
    "}",
    '["log", "info", "debug", "warn", "error"].forEach(wrapConsole);',
    "window.eval = blocked(OPTIONS.messages.eval);",
    "window.Function = blocked(OPTIONS.messages.eval);",
    "window.fetch = blocked(OPTIONS.messages.network);",
    "window.XMLHttpRequest = blocked(OPTIONS.messages.network);",
    "window.WebSocket = blocked(OPTIONS.messages.network);",
    "window.Notification = blocked(OPTIONS.messages.network);",
    "window.Worker = blocked(OPTIONS.messages.worker);",
    "window.open = blocked(OPTIONS.messages.open);",
    "try {",
    "  Object.defineProperty(window, 'top', {",
    "    get: function () { securityViolation(OPTIONS.messages.parent); throw new Error(OPTIONS.messages.parent); },",
    "    configurable: true",
    "  });",
    "} catch (error) {",
    "  // Yuqoridagi kabi.",
    "}",
    "try {",
    "  Object.defineProperty(window, 'localStorage', {",
    "    get: function () { securityViolation(OPTIONS.messages.storage); throw new Error(OPTIONS.messages.storage); },",
    "    configurable: true",
    "  });",
    "} catch (error) {",
    "  // Opaque origin localStorage'ni o'zi ham cheklaydi.",
    "}",
    "try {",
    "  Object.defineProperty(window, 'sessionStorage', {",
    "    get: function () { securityViolation(OPTIONS.messages.storage); throw new Error(OPTIONS.messages.storage); },",
    "    configurable: true",
    "  });",
    "} catch (error) {",
    "  // Yuqoridagi kabi.",
    "}",
    "function readObservation(target, observe) {",
    '  if (observe === "text") { return target.textContent || ""; }',
    '  if (observe === "value") { return "value" in target ? String(target.value) : ""; }',
    '  return target.className ? String(target.className) : "";',
    "}",
    "function collect() {",
    "  var result = {",
    "    dom: '',",
    "    nodeCount: 0,",
    "    console: consoleEntries,",
    "    errors: [],",
    "    securityViolations: violations,",
    "    visual: {},",
    "    behavior: {},",
    "    truncated: false,",
    "    timedOut: false,",
    "    durationMs: Date.now() - t0",
    "  };",
    "  try {",
    "    result.dom = document.body ? document.body.innerHTML : '';",
    '    result.nodeCount = document.querySelectorAll("*").length;',
    "  } catch (error) {",
    "    result.errors.push(safeString(error));",
    "  }",
    "  OPTIONS.probes.visual.forEach(function (probe) {",
    "    var element = document.querySelector(probe.selector);",
    "    if (!element) { result.visual[probe.id] = null; return; }",
    "    var style = window.getComputedStyle(element);",
    "    var props = {};",
    "    probe.properties.forEach(function (property) {",
    "      try { props[property] = style.getPropertyValue(property) || ''; } catch (error) { props[property] = ''; }",
    "    });",
    "    result.visual[probe.id] = props;",
    "  });",
    "  OPTIONS.probes.behavior.forEach(function (probe) {",
    "    var element = document.querySelector(probe.selector);",
    "    if (!element) { result.behavior[probe.id] = null; return; }",
    "    var observation = {",
    "      selector: probe.selector,",
    "      action: probe.action,",
    "      before: '',",
    "      after: '',",
    "      changed: false",
    "    };",
    "    observation.before = readObservation(element, probe.observe);",
    "    try {",
    '      if (probe.action === "click") { element.click(); }',
    "      else {",
    '        var event = new Event("input", { bubbles: true });',
    "        element.dispatchEvent(event);",
    "      }",
    "    } catch (error) {",
    "      // Xulqiy urinish xatosiz davom etadi.",
    "    }",
    "    observation.after = readObservation(element, probe.observe);",
    "    observation.changed = observation.before !== observation.after;",
    "    result.behavior[probe.id] = observation;",
    "  });",
    "  result.truncated = consoleTruncated || result.nodeCount > OPTIONS.domLimit;",
    "  window.parent.postMessage(",
    '    { kind: "wn:sandbox", version: 1, type: "result", nonce: OPTIONS.nonce, snapshot: result },',
    '    "*"',
    "  );",
    "}",
    "setTimeout(collect, 0);",
    "})();",
  ].join("\n");
}

function buildRuntimeTag(options: SandboxBuildOptions): string {
  return `<script>\n${buildRuntimeScript(options)}\n</script>`;
}

function buildUserScriptTag(javascript: string): string {
  const evaluated = escapeScriptContent(javascript);
  return `<script>\n${evaluated}\n</script>`;
}

function afterTagOpen(documentText: string, tagName: string): number | null {
  const pattern = new RegExp(`<${tagName}[\\s>]`, "i");
  const match = pattern.exec(documentText);
  if (match === null || match.index === undefined) {
    return null;
  }
  const end = documentText.indexOf(">", match.index);
  if (end === -1) {
    return null;
  }
  return end + 1;
}

function injectAfterHead(documentText: string, addition: string): string {
  const headEnd = afterTagOpen(documentText, "head");
  if (headEnd !== null) {
    return (
      documentText.slice(0, headEnd) + addition + documentText.slice(headEnd)
    );
  }
  const htmlEnd = afterTagOpen(documentText, "html");
  if (htmlEnd !== null) {
    return (
      documentText.slice(0, htmlEnd) + addition + documentText.slice(htmlEnd)
    );
  }
  return `<head>${addition}</head>${documentText}`;
}

function injectAfterBodyOpen(documentText: string, addition: string): string {
  const bodyEnd = afterTagOpen(documentText, "body");
  if (bodyEnd !== null) {
    return (
      documentText.slice(0, bodyEnd) + addition + documentText.slice(bodyEnd)
    );
  }
  return injectBeforeBodyClose(documentText, addition);
}

function injectBeforeBodyClose(documentText: string, addition: string): string {
  const closeBody = /<\/body\s*>/i.exec(documentText);
  if (closeBody !== null && closeBody.index !== undefined) {
    return (
      documentText.slice(0, closeBody.index) +
      addition +
      documentText.slice(closeBody.index)
    );
  }
  const closeHtml = /<\/html\s*>/i.exec(documentText);
  if (closeHtml !== null && closeHtml.index !== undefined) {
    return (
      documentText.slice(0, closeHtml.index) +
      addition +
      documentText.slice(closeHtml.index)
    );
  }
  return documentText + addition;
}

function isFullDocument(html: string): boolean {
  return /<!doctype/i.test(html) || /<html[\s>]/i.test(html);
}

// O'quvchi HTML to'liq hujjat bo'lsa uni asos qilib, aks holda xavfsiz
// wrapper ichida ishga tushuramiz. CSP meta doim head ichida turadi.
export function buildSandboxDocument(options: SandboxBuildOptions): string {
  const cspMeta = buildCspMetaTag();
  const runtimeTag = buildRuntimeTag(options);
  const userTag =
    options.javascript.trim().length === 0
      ? ""
      : buildUserScriptTag(options.javascript);

  if (isFullDocument(options.html)) {
    let documentText = options.html;
    documentText = injectAfterHead(documentText, cspMeta);
    documentText = injectAfterBodyOpen(documentText, runtimeTag);
    documentText = injectBeforeBodyClose(documentText, userTag);
    return documentText;
  }

  return (
    "<!doctype html>\n" +
    '<html lang="uz">\n' +
    "<head>\n" +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    `${cspMeta}\n` +
    "</head>\n" +
    "<body>\n" +
    `${runtimeTag}\n` +
    `${options.html}\n` +
    `${userTag}\n` +
    "</body>\n" +
    "</html>\n"
  );
}