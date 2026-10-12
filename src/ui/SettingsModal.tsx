// docs/05_UI_UX_DESIGN.md — "Sozlamalar va progress" modali: ism, qulaylik,
// eksport/import, tozalash. Fokus ichida qoladi, Escape bilan yopiladi.
// docs/08_DATA_MODEL.md — eksport/import progress JSON ko'rinishida.
// docs/11_ACCESSIBILITY_AND_LOCALIZATION.md — holatlar rangga bog'liq emas;
// xatolar nima/sabab/keyingi qadam bilan o'zbekcha beriladi.

import { useRef, useState, type ChangeEvent } from "react";
import type { PlayerProgress } from "../types/progress";
import { uz } from "../i18n/uz";
import { ConfirmDialog } from "./ConfirmDialog";
import { useModalFocus } from "./useModalFocus";
import { IconClose, IconInfo } from "./icons";

export interface ImportErrorInfo {
  what: string;
  why: string;
  nextStep: string;
}

export interface SettingsModalProps {
  progress: PlayerProgress;
  progressJson: string;
  warning: string | null;
  audioEnabled: boolean;
  reducedMotion: boolean;
  importError: ImportErrorInfo | null;
  importSuccess: boolean;
  onSaveName: (name: string) => void;
  onToggleAudio: (enabled: boolean) => void;
  onToggleReducedMotion: (enabled: boolean) => void;
  onExport: () => void;
  onImport: (json: string) => void;
  onResetAll: () => void;
  onClose: () => void;
}

export function SettingsModal({
  progress,
  progressJson,
  warning,
  audioEnabled,
  reducedMotion,
  importError,
  importSuccess,
  onSaveName,
  onToggleAudio,
  onToggleReducedMotion,
  onExport,
  onImport,
  onResetAll,
  onClose,
}: SettingsModalProps): JSX.Element {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [name, setName] = useState(progress.playerName ?? "");
  const [importText, setImportText] = useState("");
  const [showReset, setShowReset] = useState(false);

  const dialogRef = useModalFocus({
    onClose,
    initialFocusRef: closeRef,
    active: !showReset,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file === undefined) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (): void => {
      const result = reader.result;
      const text = typeof result === "string" ? result : "";
      setImportText(text);
      onImport(text);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleResetConfirm = (): void => {
    setShowReset(false);
    onResetAll();
    onClose();
  };

  return (
    <div className="wn-settings-backdrop">
      <aside
        ref={dialogRef}
        className="wn-settings"
        role="dialog"
        aria-modal="true"
        aria-label={uz.settingsTitle}
        tabIndex={-1}
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

        {warning !== null ? (
          <p className="wn-settings__warning" role="status">
            <IconInfo className="wn-icon" />
            <span>{warning}</span>
          </p>
        ) : null}

        <section className="wn-settings__section" aria-label={uz.settingsNameSection}>
          <h3>{uz.settingsNameSection}</h3>
          <label className="wn-settings__label" htmlFor="wn-settings-name">
            {uz.playerNameLabel}
          </label>
          <input
            id="wn-settings-name"
            className="wn-text-input"
            type="text"
            maxLength={40}
            autoComplete="off"
            placeholder={uz.playerNamePlaceholder}
            value={name}
            onChange={(event): void => setName(event.target.value)}
          />
          <button
            type="button"
            className="wn-btn wn-btn--primary"
            onClick={(): void => onSaveName(name.trim())}
          >
            {uz.playerNameSave}
          </button>
        </section>

        <section
          className="wn-settings__section"
          aria-label={uz.settingsAccessibilitySection}
        >
          <h3>{uz.settingsAccessibilitySection}</h3>
          <label className="wn-toggle">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(event): void => onToggleAudio(event.target.checked)}
            />
            <span>{uz.audioToggleLabel}</span>
          </label>
          <p className="wn-settings__hint">{uz.audioToggleDescription}</p>
          <label className="wn-toggle">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event): void =>
                onToggleReducedMotion(event.target.checked)
              }
            />
            <span>{uz.reducedMotionToggleLabel}</span>
          </label>
          <p className="wn-settings__hint">{uz.reducedMotionToggleDescription}</p>
        </section>

        <section className="wn-settings__section">
          <p>{uz.exportDescription}</p>
          <label className="wn-settings__label" htmlFor="wn-progress-json">
            {uz.progressJsonLabel}
          </label>
          <textarea
            id="wn-progress-json"
            className="wn-settings__json"
            readOnly
            value={progressJson}
          />
          <button type="button" className="wn-btn" onClick={onExport}>
            {uz.exportButton}
          </button>

          <p>{uz.importDescription}</p>
          <label className="wn-settings__label" htmlFor="wn-import-json">
            {uz.importTextLabel}
          </label>
          <textarea
            id="wn-import-json"
            className="wn-settings__json"
            value={importText}
            onChange={(event): void => setImportText(event.target.value)}
          />
          <div className="wn-settings__actions">
            <button
              type="button"
              className="wn-btn wn-btn--primary"
              onClick={(): void => onImport(importText)}
            >
              {uz.importButton}
            </button>
            <label className="wn-btn" htmlFor="wn-settings-import-file">
              {uz.importFileButton}
            </label>
            <input
              id="wn-settings-import-file"
              type="file"
              accept="application/json,.json"
              className="wn-visually-hidden"
              aria-label={uz.importFileButton}
              onChange={handleFileChange}
            />
          </div>

          {importSuccess ? (
            <p className="wn-settings__success" role="status">
              {uz.importSuccess}
            </p>
          ) : null}

          {importError !== null ? (
            <div className="wn-import-error" role="alert">
              <p className="wn-import-error__title">{uz.importErrorTitle}</p>
              <dl className="wn-issue__detail">
                <dt>{uz.issueWhatLabel}</dt>
                <dd>{importError.what}</dd>
                <dt>{uz.issueWhyLabel}</dt>
                <dd>{importError.why}</dd>
                <dt>{uz.issueNextStepLabel}</dt>
                <dd>{importError.nextStep}</dd>
              </dl>
            </div>
          ) : null}
        </section>

        <section className="wn-settings__section">
          <button
            type="button"
            className="wn-btn wn-btn--danger"
            onClick={(): void => setShowReset(true)}
          >
            {uz.resetAllLabel}
          </button>
          <p className="wn-settings__hint">{uz.resetAllDescription}</p>
        </section>
      </aside>

      {showReset ? (
        <ConfirmDialog
          title={uz.resetAllTitle}
          body={uz.resetAllBody}
          confirmLabel={uz.confirmResetAll}
          onConfirm={handleResetConfirm}
          onCancel={(): void => setShowReset(false)}
        />
      ) : null}
    </div>
  );
}
