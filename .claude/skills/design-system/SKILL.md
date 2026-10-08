---
name: design-system
description: The visual system for mohamedlandolsi.tech (two-ink risograph concept, Archivo type, tokens, layout, motion, the hero sieve). Use before any UI, layout, styling, typography, color or motion work, and before creating or editing any component or page.
---

# Design system: small batch

The site looks like a two-ink risograph print. One blue ink carries everything. One sunflower ink is reserved for human judgment: approval, review, and where the reader is (focus, hover, selection). The memorable element is the hero sieve. Everything else stays quiet.

Read the reference that matches the task:

| Task | Read |
|---|---|
| Setting up `globals.css`, colors, type, spacing | `tokens.md` |
| Building the hero sieve or any data diagram | `sieve.md` |
| Before finishing any page | `anti-patterns.md` |

## The rules that matter most

1. **Two inks only.** Blue ink (`--color-ink`) and its tints, sunflower (`--color-marker`), paper. No black, no grey that is not a blue tint, no third hue, no gradients.
2. **Sunflower means a human.** Use it for: the approval mark at the end of the sieve, hover and focus highlight on links, text selection, the "open" state of an expanded decision. Never as decoration, never for a heading.
3. **Overprint, do not layer.** When sunflower sits behind blue text, the text uses `--color-overprint` (the color blue ink makes when printed over yellow). Do not put plain ink text on marker below 24px.
4. **One family.** Archivo variable, using its width axis to create contrast: expanded and heavy for display and numbers, normal for body, condensed for metadata. Never add a second family. Never use monospace.
5. **Rows, not cards.** Content sits on the paper. Group with space and alignment. A border is allowed only when it encodes something (a gate line in a diagram, the edge of a table).
6. **Left aligned.** Text never centers except inside a diagram label. Reading width 60 to 70 characters.
7. **One motion moment.** The sieve plays once on load. Everything else moves only in response to the reader (expand, collapse, copy confirmation). No scroll-triggered fade-ins.
8. **Print texture, lightly.** One grain overlay on the page (opacity at most 0.05) and halftone dots inside diagrams. The wordmark has a 2px yellow plate offset (misregistration). Nowhere else.
9. **Numbers are the design.** Metrics use Archivo expanded, heavy, tabular figures, large. Labels under them are short, condensed, sentence case.
10. **Quality floor.** Responsive from 360px, visible focus, reduced motion respected, AA contrast, dark mode supported (see `tokens.md`).

## Before you write code for a page

State in a few lines: the sections, the components, the content files used, where (if anywhere) sunflower appears, and whether anything moves. If sunflower appears for a reason that is not "a human acts or decides here", remove it.

## After you build

Run the `visual-qa` skill. Compare screenshots to `anti-patterns.md`. Remove one decorative element before calling a page done.
