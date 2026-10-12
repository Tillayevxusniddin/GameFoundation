// docs/06_TECHNICAL_ARCHITECTURE.md — qatlamli editor bulimining til
// proyeksiyasi. CodeMirror 6 til paketlari shu yerda yagona joyda tuziladi.

import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";

export type LanguageId = "html" | "css" | "javascript" | "plain";

export function languageExtension(language: LanguageId): Extension {
  switch (language) {
    case "html":
      return html();
    case "css":
      return css();
    case "javascript":
      return javascript();
    case "plain":
      return [];
  }
}