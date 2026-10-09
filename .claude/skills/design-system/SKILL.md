---
name: design-system
description: The visual system for mohamedlandolsi.tech (dark console style, Space Grotesk / IBM Plex Sans / IBM Plex Mono, cyan and amber, panels, the hero sieve). Use before any UI, layout, styling, typography, color or motion work, and before creating or editing any component or page.
---

# Design system: engineering console

The site looks like a quiet engineering console: a dark navy page with a faint grid and soft ambient light, bordered panels, mono labels, and two accents with fixed jobs. Cyan is data and links. Amber is status and human judgment (availability, the "My review" step). A light palette exists for readers whose system asks for it, and a toggle switches it for the visit. The memorable element is still the hero sieve: one real run of the GTM Engine.

This style comes from a reference page Mohamed supplied (ADR P-10 in `docs/ADR.md`). It replaced the earlier two-ink risograph system.

Read the reference that matches the task:

| Task | Read |
|---|---|
| Colors, type, spacing, components, `globals.css` | `tokens.md` |
| Building the hero sieve or any data diagram | `sieve.md` |
| Before finishing any page | `anti-patterns.md` |

## The rules that matter most

1. **Two accents with jobs.** Cyan (`--color-cyan`): links, numbers, data, anything that passed a check. Amber (`--color-amber`): status (availability chip, period badges, section kickers in panels) and the human step (the "My review" mark, the review step in diagrams, focus outlines). No third accent, no gradients on text or buttons. The only gradients are the ambient light behind the page and the halftone dots of the sieve.
2. **Three families, three jobs.** Space Grotesk for headings and numbers. IBM Plex Sans for running text. IBM Plex Mono for labels, tags, navigation, chips, buttons and metadata. Never mono for paragraphs.
3. **Panels, not floating cards.** Content groups sit in panels: `--color-panel` fill, 1px `--color-line-strong` border, 3px radius. Related cells share one panel separated by 1px lines (`.cells`: number strips, spec grids, matrices). No shadows except the soft amber glow on status elements.
4. **Section scaffold.** Each home section: `.section` (72px block padding, 1px bottom line), a `.sec-head` with the title (Space Grotesk 600) left and a mono uppercase tag right. Width: `.shell`, 920px max with 28px gutters.
5. **Sentence case in the source.** Mono tags, kickers and the hero eyebrow are uppercased by CSS (`text-transform`), never typed in capitals. Headings, buttons and copy stay sentence case.
6. **Motion is small and optional.** The sieve plays once on load. The pulsing status dot, the soft glow on the availability chip and period badges, 1 to 2px lifts on hover, a CSS-only scroll reveal (`.reveal`, scroll-driven animation, visible without JS) and four short interaction effects (press, page switch, palette switch, copy confirmation; see `tokens.md`) are the only other motion. Everything stops under `prefers-reduced-motion`.
7. **Numbers are data.** Metrics use Space Grotesk 700 in cyan with a mono label under them, inside a number strip. Every number still comes from a claim ID (content-guard).
8. **Quality floor.** Responsive from 360px, visible amber focus outline, AA contrast in both palettes (the faint grey and the light-mode accents are tuned for 4.5:1, see `tokens.md`), links inside running text underlined, no-JS readable.

## Before you write code for a page

State in a few lines: the sections, the components, the content files used, where amber appears and why (status or a human step), and whether anything moves.

## After you build

Run the `visual-qa` skill in both palettes (emulate `prefers-color-scheme` dark and light). Compare screenshots to `anti-patterns.md`.
