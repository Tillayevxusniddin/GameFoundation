// docs/05_UI_UX_DESIGN.md — modal fokusni oladi, Tab fokusini ichida ushlab
// turadi, Escape bilan yopiladi va yopilganda fokus ochgan elementga qaytadi.
// docs/11_ACCESSIBILITY_AND_LOCALIZATION.md — klaviatura bilan to'liq boshqaruv.

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableWithin(container: HTMLElement | null): HTMLElement[] {
  if (container === null) {
    return [];
  }
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.offsetParent !== null || element.tabIndex >= 0);
}

export interface ModalFocusOptions {
  onClose: () => void;
  // Fokusni birinchi navbatda shu elementga beradi.
  initialFocusRef?: RefObject<HTMLElement>;
  // false bo'lsa tinglovchi/trap o'chadi (ustma-ust modal uchun).
  active?: boolean;
}

// Dialog elementiga ulanadigan ref qaytaradi.
export function useModalFocus({
  onClose,
  initialFocusRef,
  active = true,
}: ModalFocusOptions): RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const container = containerRef.current;
    const currentlyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (
      previousRef.current === null &&
      currentlyFocused !== null &&
      container?.contains(currentlyFocused) !== true
    ) {
      previousRef.current = currentlyFocused;
    }

    const target =
      initialFocusRef?.current ?? focusableWithin(container)[0] ?? container;
    target?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const items = focusableWithin(container);
      if (items.length === 0) {
        event.preventDefault();
        container?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const focused = document.activeElement;
      if (first === undefined || last === undefined) {
        return;
      }
      if (event.shiftKey && (focused === first || focused === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, initialFocusRef]);

  // Fokus faqat butunlay yopilganda (unmount) ochgan elementga qaytadi.
  useEffect(() => {
    return () => {
      previousRef.current?.focus();
    };
  }, []);

  return containerRef;
}
