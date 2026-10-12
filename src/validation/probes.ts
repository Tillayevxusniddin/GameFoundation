// docs/09_CONTENT_SCHEMA.md — validator qoidalaridan sandbox problari
// deterministik kompilyatsiya qilinadi. Sandbox hech qachon namuna kodni
// o'zi o'ylab bajarmaydi; faqat shu so'ralgan problarni bajaradi.

import type { LessonManifest } from "../types/content";
import {
  type BehaviorProbe,
  type ProbeSpec,
  type VisualProbe,
} from "../types/sandbox";

const VISIBLE_PROPERTIES: readonly string[] = [
  "display",
  "visibility",
  "opacity",
];

export interface ParsedVisualTarget {
  selector: string;
  prop: string | null;
  expected: string | null;
}

export interface ParsedBehavioralTarget {
  selector: string;
  action: "click" | "input";
  observe: "text" | "value";
}

export function parseVisualTarget(target: string): ParsedVisualTarget {
  let raw = target.trim();
  if (raw.startsWith("visible:")) {
    raw = raw.slice("visible:".length);
  }
  const atIndex = raw.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === raw.length - 1) {
    return { selector: raw, prop: null, expected: null };
  }
  const selector = raw.slice(0, atIndex).trim();
  const rest = raw.slice(atIndex + 1);
  const eqIndex = rest.indexOf("=");
  if (eqIndex === -1) {
    return { selector, prop: rest.trim(), expected: null };
  }
  return {
    selector,
    prop: rest.slice(0, eqIndex).trim(),
    expected: rest.slice(eqIndex + 1).trim(),
  };
}

export function parseBehavioralTarget(
  target: string,
): ParsedBehavioralTarget | null {
  if (target === "preview-run" || target.startsWith("console:")) {
    return null;
  }
  const clickPrefix = "click:";
  const inputPrefix = "input:";
  if (target.startsWith(clickPrefix)) {
    const selector = target.slice(clickPrefix.length).trim();
    return selector.length === 0
      ? null
      : { selector, action: "click", observe: "text" };
  }
  if (target.startsWith(inputPrefix)) {
    const selector = target.slice(inputPrefix.length).trim();
    return selector.length === 0
      ? null
      : { selector, action: "input", observe: "value" };
  }
  const plain = target.trim();
  return plain.length === 0 ? null : { selector: plain, action: "click", observe: "text" };
}

export function compileProbes(manifest: LessonManifest): ProbeSpec {
  const visual: VisualProbe[] = [];
  const behavior: BehaviorProbe[] = [];
  for (const rule of manifest.validation) {
    if (rule.type === "visual") {
      const parsed = parseVisualTarget(rule.target);
      if (parsed.selector.length === 0) {
        continue;
      }
      const properties = [...VISIBLE_PROPERTIES];
      if (parsed.prop !== null && !properties.includes(parsed.prop)) {
        properties.push(parsed.prop);
      }
      visual.push({ id: rule.id, selector: parsed.selector, properties });
    } else if (rule.type === "behavioral") {
      const parsed = parseBehavioralTarget(rule.target);
      if (parsed === null) {
        continue;
      }
      behavior.push({
        id: rule.id,
        selector: parsed.selector,
        action: parsed.action,
        observe: parsed.observe,
      });
    }
  }
  return { visual, behavior };
}