// docs/05_UI_UX_DESIGN.md — modal fokusni oladi va yopilganda qaytaradi.
// docs/08_DATA_MODEL.md — export/import progress JSON ko'rinishida.

import { useEffect, useRef } from "react";
import { uz } from "../i18n/uz";
import { IconClose } from "./icons";

export interface SettingsPanelProps {
  warning: string | null;
  progressJson: string;
  onClose: () => void;
}

export function SettingsPanel({
  warning,
  progressJson,
  onClose,
}: SettingsPanelProps): JSX.Element {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="wn-settings-backdrop">
      <aside
        className="wn-settings"
        role="dialog"
        aria-modal="true"
        aria-label={uz.settingsTitle}
      >
        <div className="wn-settings__head">
          <h2>{uz.settingsTitle}</h2>
          <button
            ref={closeRef}
            type="button"
            className="wn-btn wn-btn--icon"
            onClick={onClose}
            aria-label={uz.closeSettings}
          >
            <IconClose className="wn-icon" />
          </button>
        </div>
        <p>{uz.exportDescription}</p>
        <p>{uz.importDescription}</p>
        {warning !== null ? (
          <p className="wn-settings__warning" role="status">
            {warning}
          </p>
        ) : null}
        <label className="wn-settings__label" htmlFor="wn-progress-json">
          {uz.progressJsonLabel}
        </label>
        <textarea
          id="wn-progress-json"
          className="wn-settings__json"
          readOnly
          value={progressJson}
        />
        <button type="button" className="wn-btn" onClick={onClose}>
          {uz.closeSettings}
        </button>
      </aside>
    </div>
  );
}
