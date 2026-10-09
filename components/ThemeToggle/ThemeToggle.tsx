"use client";

import type { MouseEvent } from "react";

/**
 * Switches between the dark and light palettes. The first view follows the system setting
 * (CSS media query); the choice lasts for the visit, like the reference design. Where the browser
 * can, the two palettes cross-fade; the icon that appears fades in (CSS, on [data-switched]).
 */
export function ThemeToggle() {
  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const apply = () => {
      root.dataset.theme = current === "light" ? "dark" : "light";
    };
    event.currentTarget.dataset.switched = "";
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still && typeof document.startViewTransition === "function") document.startViewTransition(apply);
    else apply();
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle light and dark mode" data-print="hide">
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
