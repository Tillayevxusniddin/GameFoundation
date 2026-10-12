// docs/01_PRODUCT_REQUIREMENTS.md — ism kiritish ixtiyoriy, serverga
// yuborilmaydi, faqat lokal saqlanadi.
// docs/05_UI_UX_DESIGN.md — modal fokusni oladi va yopilganda qaytaradi.

import { useRef, useState, type FormEvent } from "react";
import { uz } from "../i18n/uz";
import { useModalFocus } from "./useModalFocus";
import { IconUser } from "./icons";

export interface WelcomeDialogProps {
  initialName: string;
  onSaveName: (name: string) => void;
  onSkip: () => void;
}

export function WelcomeDialog({
  initialName,
  onSaveName,
  onSkip,
}: WelcomeDialogProps): JSX.Element {
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useModalFocus({ onClose: onSkip, initialFocusRef: inputRef });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSaveName(name.trim());
  };

  return (
    <div className="wn-backdrop">
      <div
        ref={dialogRef}
        className="wn-welcome"
        role="dialog"
        aria-modal="true"
        aria-label={uz.welcomeTitle}
        tabIndex={-1}
      >
        <h2 className="wn-welcome__title">
          <IconUser className="wn-icon" />
          <span>{uz.welcomeTitle}</span>
        </h2>
        <p className="wn-welcome__body">{uz.welcomeBody}</p>
        <form onSubmit={handleSubmit}>
          <label className="wn-settings__label" htmlFor="wn-player-name">
            {uz.playerNameLabel}
          </label>
          <input
            ref={inputRef}
            id="wn-player-name"
            className="wn-text-input"
            type="text"
            maxLength={40}
            autoComplete="off"
            placeholder={uz.playerNamePlaceholder}
            value={name}
            onChange={(event): void => setName(event.target.value)}
          />
          <div className="wn-welcome__actions">
            <button type="submit" className="wn-btn wn-btn--primary">
              {uz.playerNameSave}
            </button>
            <button type="button" className="wn-btn" onClick={onSkip}>
              {uz.playerNameSkip}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
