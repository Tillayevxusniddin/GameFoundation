// docs/05_UI_UX_DESIGN.md — yuqori navigatsiya.
// Har bir tugmada belgi + o'zbekcha matn va ko'rinadigan :focus-visible halqasi.

import { useRef, type ChangeEvent } from "react";
import { uz } from "../i18n/uz";
import {
  IconBadge,
  IconDownload,
  IconMap,
  IconSettings,
  IconStar,
  IconUpload,
} from "./icons";

export interface TopNavProps {
  totalXp: number;
  badgesCount: number;
  showBackToMap: boolean;
  onBackToMap: () => void;
  onOpenSettings: () => void;
  onExport: () => void;
  onImportJson: (json: string) => void;
}

export function TopNav({
  totalXp,
  badgesCount,
  showBackToMap,
  onBackToMap,
  onOpenSettings,
  onExport,
  onImportJson,
}: TopNavProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file === undefined) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (): void => {
      const result = reader.result;
      onImportJson(typeof result === "string" ? result : "");
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <nav className="wn-nav" aria-label={uz.navPrimaryLabel}>
      <span className="wn-nav__brand">{uz.appTitle}</span>
      <span className="wn-nav__spacer" />
      <span className="wn-stat" aria-label={uz.xpLabel}>
        <IconStar className="wn-icon" />
        <span className="wn-stat__value">{totalXp}</span>
        <span className="wn-stat__unit">{uz.xpShort}</span>
      </span>
      <span className="wn-stat" aria-label={uz.badgeLabel}>
        <IconBadge className="wn-icon" />
        <span className="wn-stat__value">{badgesCount}</span>
        <span className="wn-stat__unit">{uz.badgeShort}</span>
      </span>
      {showBackToMap ? (
        <button type="button" className="wn-btn" onClick={onBackToMap}>
          <IconMap className="wn-icon" />
          <span>{uz.backToMap}</span>
        </button>
      ) : null}
      <button type="button" className="wn-btn" onClick={onOpenSettings}>
        <IconSettings className="wn-icon" />
        <span>{uz.openSettings}</span>
      </button>
      <button type="button" className="wn-btn" onClick={onExport}>
        <IconDownload className="wn-icon" />
        <span>{uz.exportProgress}</span>
      </button>
      <button
        type="button"
        className="wn-btn"
        onClick={(): void => fileInputRef.current?.click()}
      >
        <IconUpload className="wn-icon" />
        <span>{uz.importProgress}</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="wn-visually-hidden"
        aria-label={uz.importFileLabel}
        onChange={handleFileChange}
      />
    </nav>
  );
}
