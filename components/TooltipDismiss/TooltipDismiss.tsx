"use client";

import { useEffect } from "react";

/**
 * Escape hides an open tooltip without moving focus or the pointer (WCAG 1.4.13). Tooltips are
 * CSS-only (hover and focus on an element with data-tip-host); this only adds the dismissal.
 */
export function TooltipDismiss() {
  useEffect(() => {
    const root = document.documentElement;
    let dismissed: Element | null = null;
    const hostOf = (target: EventTarget | null) => (target instanceof Element ? target.closest("[data-tip-host]") : null);

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      dismissed = hostOf(document.activeElement) ?? document.querySelector("[data-tip-host]:hover");
      if (dismissed) root.dataset.tip = "off";
    };
    // Moving to another host (or away) brings tooltips back.
    const onMove = (event: Event) => {
      if (!dismissed || hostOf(event.target) === dismissed) return;
      dismissed = null;
      delete root.dataset.tip;
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onMove);
    document.addEventListener("pointerover", onMove);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onMove);
      document.removeEventListener("pointerover", onMove);
    };
  }, []);

  return null;
}
