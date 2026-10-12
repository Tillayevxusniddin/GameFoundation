// docs/03_CURRICULUM.md — validator deterministik va tabiiy o'zbekcha xabar
// beradi. Regex faqat cheklangan yordamchi (commonErrors) uchun; asosiy
// tekshiruv real DOM/execution natijasi (snapshot) ustida bajariladi.

import type {
  LessonManifest,
  ValidationIssue,
  ValidationResult,
  ValidationRule,
  ValidatorType,
} from "../types/content";
import type { ValidationContext } from "../types/sandbox";
import { uz } from "../i18n/uz";

const ISSUE_WHY: Record<ValidatorType, string> = {
  structural: uz.issueWhyStructural,
  value: uz.issueWhyValue,
  visual: uz.issueWhyVisual,
  behavioral: uz.issueWhyBehavioral,
  educational: uz.issueWhyEducational,
};

const ISSUE_NEXT: Record<ValidatorType, string> = {
  structural: uz.issueNextStructural,
  value: uz.issueNextValue,
  visual: uz.issueNextVisual,
  behavioral: uz.issueNextBehavioral,
  educational: uz.issueNextEducational,
};

function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}

function queryRendered(context: ValidationContext, selector: string): boolean {
  const rendered = parseHtml(context.snapshot.dom);
  try {
    return rendered.querySelector(selector) !== null;
  } catch {
    return false;
  }
}

function queryRaw(context: ValidationContext, selector: string): boolean {
  const raw = parseHtml(context.code.html);
  try {
    return raw.querySelector(selector) !== null;
  } catch {
    return false;
  }
}

function elementInAnyDocument(
  context: ValidationContext,
  selector: string,
): boolean {
  return queryRaw(context, selector) || queryRendered(context, selector);
}

function hasVisibleTextInDocuments(
  context: ValidationContext,
  selector: string,
): boolean {
  const tryDocument = (html: string): boolean => {
    const doc = parseHtml(html);
    const element = doc.querySelector(selector);
    return element !== null && (element.textContent ?? "").trim().length > 0;
  };
  try {
    return (
      tryDocument(context.code.html) || tryDocument(context.snapshot.dom)
    );
  } catch {
    return false;
  }
}

export interface ParsedValueTarget {
  selector: string;
  attr: string | null;
  expected: string | null;
}

export function parseValueTarget(target: string): ParsedValueTarget {
  const raw = target.trim();
  if (raw.startsWith("text:")) {
    return { selector: raw.slice("text:".length).trim(), attr: null, expected: null };
  }
  const atIndex = raw.lastIndexOf("@");
  if (atIndex <= 0) {
    return { selector: raw, attr: null, expected: null };
  }
  const selector = raw.slice(0, atIndex).trim();
  const rest = raw.slice(atIndex + 1);
  const eqIndex = rest.indexOf("=");
  if (eqIndex === -1) {
    return { selector, attr: rest.trim(), expected: null };
  }
  return {
    selector,
    attr: rest.slice(0, eqIndex).trim(),
    expected: rest.slice(eqIndex + 1).trim(),
  };
}

function checkValueRule(
  context: ValidationContext,
  rule: ValidationRule,
): boolean {
  const parsed = parseValueTarget(rule.target);
  if (parsed.selector.length === 0) {
    return false;
  }
  if (parsed.attr === null) {
    return hasVisibleTextInDocuments(context, parsed.selector);
  }
  const attr = parsed.attr;
  const expected = parsed.expected;
  const tryDocument = (html: string): boolean => {
    const doc = parseHtml(html);
    const element = doc.querySelector(parsed.selector);
    if (element === null || !element.hasAttribute(attr)) {
      return false;
    }
    if (expected === null) {
      return true;
    }
    return element.getAttribute(attr) === expected;
  };
  try {
    return tryDocument(context.code.html) || tryDocument(context.snapshot.dom);
  } catch {
    return false;
  }
}

const NAMED_COLORS: Record<string, string> = {
  blue: "rgb(0,0,255)",
  red: "rgb(255,0,0)",
  green: "rgb(0,128,0)",
  black: "rgb(0,0,0)",
  white: "rgb(255,255,255)",
  gray: "rgb(128,128,128)",
  grey: "rgb(128,128,128)",
  yellow: "rgb(255,255,0)",
  purple: "rgb(128,0,128)",
  orange: "rgb(255,165,0)",
};

function normalizeCssValue(value: string): string {
  const trimmed = value.trim().toLowerCase().replace(/,\s+/g, ",");
  return NAMED_COLORS[trimmed] ?? trimmed;
}

function isVisible(
  properties: Record<string, string> | null | undefined,
): boolean {
  if (properties === null || properties === undefined) {
    return false;
  }
  const display = (properties["display"] ?? "").trim();
  const visibility = (properties["visibility"] ?? "").trim();
  const opacity = (properties["opacity"] ?? "").trim();
  if (display === "none" || visibility === "hidden") {
    return false;
  }
  if (opacity === "0" || opacity === "0.0") {
    return false;
  }
  return true;
}

function checkVisualRule(
  context: ValidationContext,
  rule: ValidationRule,
): boolean {
  const probe = context.snapshot.visual[rule.id];
  if (probe === null || probe === undefined) {
    return false;
  }
  const parsed = parseValueTarget(rule.target);
  if (parsed.attr === null || parsed.attr.length === 0) {
    return isVisible(probe);
  }
  const actual = probe[parsed.attr];
  if (actual === undefined) {
    return false;
  }
  if (parsed.expected === null) {
    return actual.trim().length > 0;
  }
  return normalizeCssValue(actual) === normalizeCssValue(parsed.expected);
}

function checkBehavioralRule(
  context: ValidationContext,
  rule: ValidationRule,
): boolean {
  if (rule.target === "preview-run") {
    const snapshot = context.snapshot;
    return (
      snapshot.errors.length === 0 &&
      snapshot.securityViolations.length === 0 &&
      !snapshot.truncated &&
      !snapshot.timedOut
    );
  }
  if (rule.target.startsWith("console:")) {
    const expected = rule.target.slice("console:".length).trim();
    return context.snapshot.console.some((entry) =>
      entry.text.includes(expected),
    );
  }
  const observation = context.snapshot.behavior[rule.id];
  if (observation === null || observation === undefined) {
    return false;
  }
  return observation.changed;
}

function checkEducationalRule(
  context: ValidationContext,
  rule: ValidationRule,
): boolean {
  const target = rule.target.trim();
  if (target.length === 0 || target === "any") {
    return true;
  }
  return hasVisibleTextInDocuments(context, target);
}

function checkRule(
  context: ValidationContext,
  rule: ValidationRule,
): boolean {
  switch (rule.type) {
    case "structural":
      if (rule.target === "doctype") {
        return parseHtml(context.code.html).doctype !== null;
      }
      return elementInAnyDocument(context, rule.target);
    case "value":
      return checkValueRule(context, rule);
    case "visual":
      return checkVisualRule(context, rule);
    case "behavioral":
      return checkBehavioralRule(context, rule);
    case "educational":
      return checkEducationalRule(context, rule);
  }
}

// Regex faqat cheklangan yordamchi; ReDoS xavfi bo'lgan naqshlar rad etiladi.
// Xavfsizlik: naqsh va matn hajmi cheklangan.
const SAFE_PATTERN_MAX_LENGTH = 120;
const INPUT_GUARD_MAX_LENGTH = 200_000;

function compileSafePattern(pattern: string): RegExp | null {
  if (pattern.length === 0 || pattern.length > SAFE_PATTERN_MAX_LENGTH) {
    return null;
  }
  // Qattiq kvantor zanjiri (ReDoS) texnomasi.
  if (/[([]([^()[\]]*[+*][^()[\]]*)[\]|)][+*{]/.test(pattern)) {
    return null;
  }
  try {
    return new RegExp(pattern, "i");
  } catch {
    return null;
  }
}

function checkCommonErrors(
  manifest: LessonManifest,
  context: ValidationContext,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const haystack = (
    context.code.html +
    "\n" +
    context.code.css +
    "\n" +
    context.code.javascript
  ).slice(0, INPUT_GUARD_MAX_LENGTH);
  manifest.commonErrors.forEach((commonError, index) => {
    const pattern = compileSafePattern(commonError.pattern);
    if (pattern === null) {
      return;
    }
    try {
      if (!pattern.test(haystack)) {
        return;
      }
    } catch {
      return;
    }
    issues.push({
      ruleId: `common-errors[${index}]`,
      what: commonError.explanation,
      why: `Matn namunasi mos tushdi: "${commonError.pattern}"`,
      nextStep: commonError.fix,
    });
  });
  return issues;
}

export function validateLesson(
  manifest: LessonManifest,
  context: ValidationContext,
): ValidationResult {
  const issues: ValidationIssue[] = checkCommonErrors(manifest, context);

  for (const violation of context.snapshot.securityViolations) {
    issues.push({
      ruleId: "sandbox-security",
      what: violation,
      why: uz.issueWhySandbox,
      nextStep: uz.issueNextSandbox,
    });
  }
  if (context.snapshot.truncated && !context.snapshot.timedOut) {
    issues.push({
      ruleId: "sandbox-flood",
      what: uz.limitSandboxFlood,
      why: uz.issueWhySandbox,
      nextStep: uz.issueNextSandbox,
    });
  }

  for (const rule of manifest.validation) {
    if (checkRule(context, rule)) {
      continue;
    }
    issues.push({
      ruleId: rule.id,
      what: rule.messageUz,
      why: ISSUE_WHY[rule.type],
      nextStep: ISSUE_NEXT[rule.type],
    });
  }

  return {
    success: issues.length === 0,
    lessonId: manifest.id,
    issues,
    checkedAt: new Date().toISOString(),
  };
}