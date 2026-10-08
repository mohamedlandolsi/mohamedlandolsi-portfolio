"use client";

import { useEffect, useLayoutEffect } from "react";
import type { Sieve } from "@/lib/content";
import { play } from "./play";

// The figure renders its final state on the server. data-sieve then moves through:
//   final  server default, no JS, or not yet decided
//   armed  start state, set before the first paint when motion is allowed and the sieve is in view
//   play   the timing table runs once: CSS for bins, path and mark, a canvas for the moving dots
//   done   back to the final state
//   skip   reduced motion, out of view, or JS arrived too late: the final state stays

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Runs while the HTML is parsed on a full page load, so the start state is what paints first. */
function armScript(id: string): string {
  return `(function(){var f=document.getElementById(${JSON.stringify(id)});if(!f)return;var r=f.getBoundingClientRect();f.dataset.sieve=matchMedia(${JSON.stringify(MOTION_OK)}).matches&&r.top<innerHeight&&r.bottom>0?"armed":"skip";setTimeout(function(){if(f.dataset.sieve==="armed")f.dataset.sieve="skip"},4000)})()`;
}

function inView(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function SieveAnimator({ id, sieve }: { id: string; sieve: Sieve }) {
  useLayoutEffect(() => {
    const figure = document.getElementById(id);
    if (!figure) return;
    // Client-side navigations do not run the inline script, so decide here, still before paint.
    if (figure.dataset.sieve === "final") {
      figure.dataset.sieve = window.matchMedia(MOTION_OK).matches && inView(figure) ? "armed" : "skip";
    }
    if (figure.dataset.sieve !== "armed") return;

    figure.dataset.sieve = "play";
    const stop = play(figure, sieve, () => {
      figure.dataset.sieve = "done";
    });
    return () => {
      stop();
      figure.dataset.sieve = "final";
    };
  }, [id, sieve]);

  // Escape hides an open rule tooltip without moving focus or the pointer (WCAG 1.4.13).
  useEffect(() => {
    const figure = document.getElementById(id);
    if (!figure) return;
    let dismissed: Element | null = null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      dismissed = document.activeElement?.closest("[data-bin]") ?? figure.querySelector("[data-bin]:hover");
      if (dismissed) figure.dataset.tip = "off";
    };
    const onEnter = (event: Event) => {
      const bin = (event.target as Element).closest("[data-bin]");
      if (bin && bin !== dismissed) {
        dismissed = null;
        delete figure.dataset.tip;
      }
    };
    const onFocus = () => {
      dismissed = null;
      delete figure.dataset.tip;
    };
    document.addEventListener("keydown", onKey);
    figure.addEventListener("pointerover", onEnter);
    figure.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKey);
      figure.removeEventListener("pointerover", onEnter);
      figure.removeEventListener("focusin", onFocus);
    };
  }, [id]);

  // On the server this renders as a running script; on the client it is inert text, so React
  // neither warns nor runs it twice.
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: armScript(id) }}
    />
  );
}
