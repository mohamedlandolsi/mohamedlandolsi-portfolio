# Tokens

## Color

| Token | Light | Dark | Use | Contrast on paper |
|---|---|---|---|---|
| `--color-paper` | `#FBFBF9` | `#101A38` | Page background | |
| `--color-ink` | `#3255A4` | `#E6ECF7` | All text, lines, dots | 6.8:1 light, 14.4:1 dark |
| `--color-ink-85` | `#506EB1` | `#A6ADBE` | Secondary text (meta, captions) | 4.8:1 light, 7.6:1 dark |
| `--color-ink-55` | `#8CA0CA` | `#868EA1` | Graphics only: rejected dots, gate lines | not for text |
| `--color-ink-25` | `#C9D2E4` | `#2F3B5C` | Graphics only: halftone fields, table rules | not for text |
| `--color-ink-12` | `#E3E7EF` | `#1A2547` | Graphics only: subtle fills, code background | not for text |
| `--color-marker` | `#FFB511` | `#FFB511` | Human judgment: approval mark, hover, focus, selection, open state | 1.7:1, never text |
| `--color-overprint` | `#323C0B` | `#101A38` | Text sitting on marker | 6.6:1 on marker light, 9.7:1 dark |

Light ink is Riso "Medium Blue" and the marker is Riso "Sunflower". `--color-overprint` is blue multiplied over yellow, so a highlighted word looks printed, not painted.

## globals.css (Tailwind v4, CSS-first)

```css
@import "tailwindcss";

@theme {
  --color-paper: #FBFBF9;
  --color-ink: #3255A4;
  --color-ink-85: #506EB1;
  --color-ink-55: #8CA0CA;
  --color-ink-25: #C9D2E4;
  --color-ink-12: #E3E7EF;
  --color-marker: #FFB511;
  --color-overprint: #323C0B;

  --font-sans: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;

  --text-meta: 0.875rem;   /* 14 */
  --text-small: 1rem;      /* 16 */
  --text-body: 1.125rem;   /* 18 */
  --text-lead: 1.3125rem;  /* 21 */
  --text-h3: 1.5rem;       /* 24 */
  --text-h2: 2.25rem;      /* 36 */
  --text-h1: 3.75rem;      /* 60 */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-paper: #101A38;
    --color-ink: #E6ECF7;
    --color-ink-85: #A6ADBE;
    --color-ink-55: #868EA1;
    --color-ink-25: #2F3B5C;
    --color-ink-12: #1A2547;
    --color-overprint: #101A38;
  }
}

html { background: var(--color-paper); color: var(--color-ink); }
body { font-family: var(--font-sans); font-size: var(--text-body); line-height: 1.6; font-kerning: normal; }
::selection { background: var(--color-marker); color: var(--color-overprint); }

a { color: inherit; text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; }
a:hover { background: var(--color-marker); color: var(--color-overprint); text-decoration-color: transparent; }
:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 3px; }
a:focus-visible { background: var(--color-marker); color: var(--color-overprint); }

/* Width-axis type roles. Archivo wdth range on Google Fonts is 62 to 125; verify and clamp if it differs. */
.type-display { font-variation-settings: "wdth" 118; font-weight: 780; font-size: clamp(2.75rem, 7.2vw, 6rem); line-height: 0.95; letter-spacing: -0.025em; }
.type-h1      { font-variation-settings: "wdth" 112; font-weight: 720; font-size: clamp(2.25rem, 5vw, var(--text-h1)); line-height: 1.0; letter-spacing: -0.02em; }
.type-h2      { font-variation-settings: "wdth" 118; font-weight: 680; font-size: clamp(1.75rem, 3vw, var(--text-h2)); line-height: 1.1; letter-spacing: -0.01em; }
.type-h3      { font-variation-settings: "wdth" 100; font-weight: 650; font-size: var(--text-h3); line-height: 1.25; }
.type-lead    { font-size: var(--text-lead); line-height: 1.5; font-weight: 420; }
.type-meta    { font-variation-settings: "wdth" 80; font-weight: 520; font-size: var(--text-meta); line-height: 1.4; color: var(--color-ink-85); }
.type-metric  { font-variation-settings: "wdth" 125; font-weight: 820; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 0.9; font-variant-numeric: tabular-nums lining-nums; letter-spacing: -0.02em; }
.measure      { max-width: 54ch; } /* Archivo's zero is wide: 54ch holds about 66 characters */

/* Halftone for diagram fills only */
.halftone { background-image: radial-gradient(var(--color-ink-55) 1px, transparent 1.3px); background-size: 6px 6px; }

/* Grain: one fixed overlay for the whole page */
body::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.05;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

/* Wordmark: the only misregistration on the site */
.wordmark { position: relative; isolation: isolate; }
.wordmark::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; color: var(--color-marker); transform: translate(2px, 1.5px); }

@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }

@media print {
  html { background: #fff; }
  body::after, header nav, footer, [data-print="hide"] { display: none !important; }
  a { text-decoration: none; }
}
```

## Font loading (`app/layout.tsx`)

```ts
import { Archivo } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],          // variable weight is included; width must be requested
  variable: "--font-archivo",
  display: "swap",
});
// <html lang="en" className={archivo.variable}>
```

## Layout

| Token | Value |
|---|---|
| Grid | 12 columns, max width 1240px, gutter 24px |
| Page margins | 20px under 640px, 40px under 1024px, 72px above |
| Section spacing | 128px desktop, 80px mobile |
| Work row spacing | 56px |
| Reading width | `.measure` (54ch, about 66 characters of Archivo) for all running text |
| Case study | Facts in columns 1 to 3 (sticky on desktop), text in columns 4 to 10, diagrams span 1 to 12 |
| Border radius | 0 everywhere, except the circular approval mark |

Wireframe, home (desktop):

```text
| ML wordmark                                   Work  Decisions  CV  Contact |
|                                                                            |
| Mohamed Landolsi                                                           |
| I build outbound systems that filter hard,                                 |
| write carefully and wait for a human.                     (display, cols 1-9)
| GTM automation engineer. n8n, Clay, APIs, LLM routing.     (lead, cols 1-6) |
|                                                                            |
| [ 377 dots ] ==gate== [ 23 ] ....... website, founders, drafts ( my review )|
| [ bins: timezone 234 | inactive 86 | size 27 | duplicate 5 | no site 2 ]   |
| One run of the YC directory source, 8 October 2026.          (meta)        |
|                                                                            |
| Work                                                         (h2)          |
| Personal GTM Engine   one-liner .................   377   23   19   0       |
| Job Radar             one-liner .................   11  466 to 617  15  $0 |
| Wavess GTM platform   one-liner .................   6    4    57    6       |
```

Mobile: everything stacks in one column; metrics become a 2 by 2 grid under each one-liner; the sieve turns vertical (see `sieve.md`).

## Photo (optional)

If `public/portrait.jpg` exists, render it as a duotone (ink to paper) with an SVG `feColorMatrix` or a pre-processed image, 280px wide on desktop, in the About section only. No photo in the hero.
