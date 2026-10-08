import type { Sieve } from "@/lib/content";
import { narrowLayout, wideLayout } from "./geometry";
import { TIMING, WIDE_QUERY } from "./timing";

// Draws the run on a temporary canvas over the drawing, then removes it. CSS transforms on 377
// SVG circles repaint the whole SVG every frame (about 170 ms per frame on a throttled phone);
// a canvas costs well under a frame. The SVG underneath holds the final state.
//
// Each company starts as a full-ink dot in the source field and leaves a light-ink dot behind.
// Rejected ones drop into their bin; the bin's halftone and count grow only as dots land.

/** cubic-bezier(0.2, 0.7, 0.2, 1), the sieve's easing, as a lookup table. */
const EASE = (() => {
  const curve = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  const size = 256;
  const table = new Float32Array(size + 1);
  let t = 0;
  for (let i = 0; i <= size; i++) {
    const x = i / size;
    while (t < 1 && curve(0.2, 0.2, t) < x) t += 1 / 2048;
    table[i] = curve(0.7, 1, t);
  }
  return (x: number) => table[Math.round(Math.min(1, Math.max(0, x)) * size)];
})();

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Rejected: 600 ms to the gate, 400 ms drop. Passed: 600 ms to the gate, 600 ms on to the cluster. */
const REJECTED = { duration: 1000, gate: 0.6 };
const PASSED = { duration: 1200, gate: 0.5 };

function rgb(hex: string): number[] {
  const value = hex.trim().replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

/** Starts the animation; returns a function that stops it and restores the final state. */
export function play(figure: HTMLElement, sieve: Sieve, onDone: () => void): () => void {
  const wide = window.matchMedia(WIDE_QUERY).matches;
  const layout = (wide ? wideLayout : narrowLayout)(sieve);
  const host = figure.querySelector<HTMLElement>(`[data-composition="${wide ? "wide" : "narrow"}"]`);
  const svg = host?.querySelector("svg");
  const context = document.createElement("canvas").getContext("2d");
  if (!host || !svg || !context) return () => {};

  const fills = [...host.querySelectorAll<HTMLElement>("[data-bin-fill]")];
  const counts = [...figure.querySelectorAll<HTMLElement>("[data-count]")];
  const travelers = layout.travelers();
  const totals = sieve.rejected.map((bin) => bin.count);

  const { canvas } = context;
  const box = svg.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.className = "sieve-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.width = Math.round(box.width * ratio);
  canvas.height = Math.round(box.height * ratio);
  svg.after(canvas);
  const scale = (box.width / layout.width) * ratio;
  context.setTransform(scale, 0, 0, scale, 0, 0);

  const style = getComputedStyle(figure);
  const ink = rgb(style.getPropertyValue("--color-ink"));
  const light = rgb(style.getPropertyValue("--color-ink-55"));
  const inkFill = `rgb(${ink})`;
  const lightFill = `rgb(${light})`;
  const dot = (x: number, y: number) => {
    context.beginPath();
    context.arc(x, y, layout.dot, 0, Math.PI * 2);
    context.fill();
  };

  let start = 0;
  let frame = 0;
  const shown = totals.map(() => -1);

  const draw = (now: number) => {
    start ||= now;
    const elapsed = now - start;
    const landed = totals.map(() => 0);
    context.clearRect(0, 0, layout.width, layout.height);

    // What the run left behind in the source field.
    context.globalAlpha = 1;
    context.fillStyle = lightFill;
    for (const t of travelers) if (elapsed >= t.delay) dot(t.x + t.sx, t.y + t.sy);

    for (const t of travelers) {
      const passed = t.bin === -1;
      const { duration, gate } = passed ? PASSED : REJECTED;
      const progress = clamp((elapsed - t.delay) / duration);
      if (!passed && progress >= 1) {
        landed[t.bin]++;
        continue;
      }
      const [fromX, fromY, toX, toY, local] =
        progress < gate
          ? [t.x + t.sx, t.y + t.sy, t.x + t.gx, t.y + t.gy, progress / gate]
          : [t.x + t.gx, t.y + t.gy, t.x, t.y, (progress - gate) / (1 - gate)];
      const eased = EASE(local);
      context.globalAlpha = 1;
      context.fillStyle = inkFill;
      if (!passed && progress >= gate) {
        // Fades to the light ink on the way down, then dissolves into the halftone.
        context.fillStyle = `rgb(${ink.map((channel, index) => Math.round(lerp(channel, light[index], clamp(local * 2))))})`;
        context.globalAlpha = 1 - clamp(local * 2 - 1);
      }
      dot(lerp(fromX, toX, eased), lerp(fromY, toY, eased));
    }

    landed.forEach((value, index) => {
      if (value === shown[index]) return;
      shown[index] = value;
      const share = value / totals[index];
      const open = `${(1 - share) * 100}%`;
      fills[index]?.style.setProperty("clip-path", wide ? `inset(${open} 0 0 0)` : `inset(0 ${open} 0 0)`);
      for (const count of counts) if (count.dataset.index === String(index)) count.textContent = String(value);
    });

    if (elapsed < TIMING.end) frame = requestAnimationFrame(draw);
    else {
      stop();
      onDone();
    }
  };

  function stop() {
    cancelAnimationFrame(frame);
    canvas.remove();
    for (const fill of fills) fill.style.removeProperty("clip-path");
    for (const count of counts) count.textContent = count.dataset.count ?? "";
  }

  frame = requestAnimationFrame(draw);
  return stop;
}
