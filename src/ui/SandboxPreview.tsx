// docs/05_UI_UX_DESIGN.md — preview iframe sandbox atributi va titul bilan
// chiziladi. Tarkibni SandboxRunner boshqaradi; bu yerda faqat ko'rinish.

import type { RefObject } from "react";
import { IFRAME_SANDBOX } from "../security/sandboxBuilder";
import { uz } from "../i18n/uz";

export interface SandboxPreviewProps {
  iframeRef: RefObject<HTMLIFrameElement>;
}

export function SandboxPreview({
  iframeRef,
}: SandboxPreviewProps): JSX.Element {
  return (
    <div className="wn-sandbox-wrap">
      <iframe
        ref={iframeRef}
        className="wn-sandbox"
        title={uz.previewTitle}
        // Sandbox atributi remornat: faqat allow-scripts.
        sandbox={IFRAME_SANDBOX}
      />
    </div>
  );
}