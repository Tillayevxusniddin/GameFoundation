// docs/01_PRODUCT_REQUIREMENTS.md, docs/11_ACCESSIBILITY_AND_LOCALIZATION.md —
// 768 px dan kichik ekranlarda kontent yo'qolmaydi, lekin kattaroq ekran
// tavsiya etiladi. Banner yopiladi va bu tanlov eslab qolinadi.

import { uz } from "../i18n/uz";
import { IconInfo } from "./icons";

export interface SmallScreenNoticeProps {
  onDismiss: () => void;
}

export function SmallScreenNotice({
  onDismiss,
}: SmallScreenNoticeProps): JSX.Element {
  return (
    <div className="wn-small-screen" role="note">
      <IconInfo className="wn-icon" />
      <div className="wn-small-screen__text">
        <strong>{uz.smallScreenNoticeTitle}</strong>
        <p>{uz.smallScreenNoticeBody}</p>
      </div>
      <button type="button" className="wn-btn" onClick={onDismiss}>
        {uz.smallScreenNoticeDismiss}
      </button>
    </div>
  );
}
