// docs/05_UI_UX_DESIGN.md — tasdiq oynasi fokusni oladi, Escape bilan yopiladi
// va yopilganda fokus avvalgi elementga qaytariladi.

import { useEffect, useRef } from "react";
import { uz } from "../i18n/uz";

export interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    cancelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previous?.focus();
    };
  }, [onCancel]);

  return (
    <div className="wn-backdrop">
      <div
        className="wn-confirm"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h2 className="wn-confirm__title">{title}</h2>
        <p className="wn-confirm__body">{body}</p>
        <div className="wn-confirm__actions">
          <button
            ref={cancelRef}
            type="button"
            className="wn-btn"
            onClick={onCancel}
          >
            {uz.cancel}
          </button>
          <button
            type="button"
            className="wn-btn wn-btn--danger"
            onClick={onConfirm}
          >
            {confirmLabel ?? uz.confirmReset}
          </button>
        </div>
      </div>
    </div>
  );
}