// docs/10_TESTING_STRATEGY.md — validatsiya testlari uchun deterministik
// "reference sandbox": o‘quvchi kodini jsdom ichida bajarib, SandboxSnapshot
// shaklidagi natijani yasaydi. Sandbox iframe/postMessage talab qilinmaydi.

import type { LessonManifest } from "../../src/types/content";
import type { DraftCode } from "../../src/types/progress";
import type {
  BehaviorObservation,
  SandboxConsoleEntry,
  SandboxConsoleLevel,
  SandboxSnapshot,
} from "../../src/types/sandbox";
import { compileProbes } from "../../src/validation/probes";

interface CssRule {
  selector: string;
  declarations: Record<string, string>;
}

function parseCssRules(css: string): CssRule[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: CssRule[] = [];
  const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
  let match = blockPattern.exec(withoutComments);
  while (match !== null) {
    const selector = (match[1] ?? "").trim();
    const body = match[2] ?? "";
    const declarations: Record<string, string> = {};
    for (const part of body.split(";")) {
      const colon = part.indexOf(":");
      if (colon === -1) {
        continue;
      }
      const property = part.slice(0, colon).trim().toLowerCase();
      const value = part.slice(colon + 1).trim();
      if (property.length > 0 && value.length > 0) {
        declarations[property] = value;
      }
    }
    if (selector.length > 0) {
      rules.push({ selector, declarations });
    }
    match = blockPattern.exec(withoutComments);
  }
  return rules;
}

function queryOne(doc: Document, selector: string): Element | null {
  try {
    return doc.querySelector(selector);
  } catch {
    return null;
  }
}

function matchesSelector(element: Element, selector: string): boolean {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function computeVisual(
  doc: Document,
  rules: readonly CssRule[],
  selector: string,
  properties: readonly string[],
): Record<string, string> | null {
  const element = queryOne(doc, selector);
  if (element === null) {
    return null;
  }
  const computed: Record<string, string> = {
    display: "block",
    visibility: "visible",
    opacity: "1",
  };
  const inlineStyle = (element as HTMLElement).style;
  for (const property of properties) {
    const inline = inlineStyle.getPropertyValue(property);
    if (inline.length > 0) {
      computed[property] = inline;
    }
  }
  for (const rule of rules) {
    if (!matchesSelector(element, rule.selector)) {
      continue;
    }
    for (const property of properties) {
      const value = rule.declarations[property];
      if (value !== undefined) {
        computed[property] = value;
      }
    }
  }
  return computed;
}

function stringifyConsoleArg(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value === null || value === undefined) {
    return String(value);
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function makeFakeConsole(entries: SandboxConsoleEntry[]): Console {
  const record = (
    level: SandboxConsoleLevel,
  ): ((...args: unknown[]) => void) => {
    return (...args: unknown[]): void => {
      entries.push({ level, text: args.map(stringifyConsoleArg).join(" ") });
    };
  };
  return {
    log: record("log"),
    debug: record("debug"),
    info: record("info"),
    warn: record("warn"),
    error: record("error"),
  } as unknown as Console;
}

function observe(element: Element, observeKind: string): string {
  if (observeKind === "value") {
    return (element as HTMLInputElement).value ?? "";
  }
  if (observeKind === "class") {
    return element.className;
  }
  return element.textContent ?? "";
}

export interface ReferenceSandboxResult {
  snapshot: SandboxSnapshot;
}

export function runReferenceSandbox(
  manifest: LessonManifest,
  code: DraftCode,
): ReferenceSandboxResult {
  const doc = document.implementation.createHTMLDocument("reference");
  doc.body.innerHTML = code.html;
  const style = doc.createElement("style");
  style.textContent = code.css;
  doc.head.appendChild(style);
  const rules = parseCssRules(code.css);

  const consoleEntries: SandboxConsoleEntry[] = [];
  const errors: string[] = [];
  if (code.javascript.trim().length > 0) {
    try {
      const execute = new Function(
        "document",
        "console",
        code.javascript,
      ) as unknown as (documentRef: Document, consoleRef: Console) => void;
      execute(doc, makeFakeConsole(consoleEntries));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  const probes = compileProbes(manifest);
  const visual: SandboxSnapshot["visual"] = {};
  for (const probe of probes.visual) {
    visual[probe.id] = computeVisual(doc, rules, probe.selector, probe.properties);
  }

  const dom = doc.body.innerHTML;
  const nodeCount = doc.body.querySelectorAll("*").length;

  const behavior: SandboxSnapshot["behavior"] = {};
  for (const probe of probes.behavior) {
    const element = queryOne(doc, probe.selector);
    if (element === null) {
      behavior[probe.id] = null;
      continue;
    }
    const before = observe(element, probe.observe);
    if (probe.action === "input") {
      (element as HTMLInputElement).value = "sinov";
      element.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      element.dispatchEvent(new Event("click", { bubbles: true }));
    }
    const after = observe(element, probe.observe);
    const observation: BehaviorObservation = {
      selector: probe.selector,
      action: probe.action,
      before,
      after,
      changed: before !== after,
    };
    behavior[probe.id] = observation;
  }

  return {
    snapshot: {
      dom,
      nodeCount,
      console: consoleEntries,
      errors,
      securityViolations: [],
      visual,
      behavior,
      truncated: false,
      timedOut: false,
      durationMs: 0,
    },
  };
}
