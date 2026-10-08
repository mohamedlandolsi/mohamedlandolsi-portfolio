# The sieve (hero visual)

A data visual of one real run: 377 YC companies enter, rule gates reject 354 into five labeled bins, 23 move on, and a dotted path leads through the next stages to a yellow "My review" mark. It is the only thing on the site that moves without being asked to.

## Data

Read everything from `content/projects.json` → `projects[slug=personal-gtm-engine].sieve`. Never hard-code counts. Assert at build time that `sum(rejected.count) + passed.value === input.value` and fail the build if not.

## Composition (desktop, about 1240 by 420)

```text
 source field            gate            passed       next stages                    review
 :::::::::::::::     |  ||  |          ::            . . . . . . . . . . . . . .     ( My review )
 :::::::::::::::  >  |  ||  |   >      ::     website   founders   drafts & checks     sunflower
 :::::::::::::::     |  ||  |          23                                            circle
        377          bins below the gate: halftone columns, height = count, label + count
                     timezone 234 | inactive 86 | size 27 | duplicate 5 | no website 2
```

- **Source field**: 377 dots (3px radius) in a 29 by 13 grid, with the number 377 above it in `.type-metric`. At rest the field is in `--color-ink-55`, so the 23 that passed are the only full-ink dots; in the start state it is full ink and drains to the light ink as each company leaves (design-critic review, phase 2).
- **Gate**: two vertical lines in `--color-ink-55`, 1px. Label above: "Rules, no AI" in `.type-meta`.
- **Bins**: five columns below the gate, the largest hanging straight off it, filled with halftone (CSS dots on whole pixels, so the screen stays crisp at every scale), height proportional to count (square-root scale so the 2 and 5 bins stay visible, minimum 8px). Each bin label: the count in tabular figures at text size (not a display numeral: 377 and 23 are the only display numbers) and the reason in sentence case.
- **Passed**: 23 dots in full ink, clustered, with "23" in `.type-metric` and the label "moved on to scoring".
- **Next stages**: a dotted line in `--color-ink-55` with the stage labels from `sieve.next` set into gaps in the line (no node dots: one dot means one company), ending in a 56px circle filled with `--color-marker`, text "My review" in `--color-overprint` at 14px. This circle is the only sunflower in the hero.
- **Caption** below: `sieve.caption`, `.type-meta`, plus a link "How the gates work" to the case study.

Below 1024px: rotate the flow to vertical. Source field on top (the same 29 by 13 grid, 2px radius), gate as horizontal lines, bins as horizontal bars listed under the gate with labels on the right (counts in a right-aligned column, reasons on one left edge), then passed, then the stages as a vertical list ending in the review mark.

## Motion (plays once per page view)

| Time | What happens |
|---|---|
| 0 ms | Server-rendered final state is visible. On hydration, if motion is allowed and the sieve is in the viewport, reset dots to the source field without a visible jump (they are already there in the final state for 354 + 23 dots, only positions change). |
| 300 to 1500 ms | Dots move right toward the gate in 6 waves, each wave delayed 120 ms, easing `cubic-bezier(.2,.7,.2,1)`. |
| 900 to 2000 ms | At the gate, rejected dots drop into their bins (color fades to `--color-ink-55`, then they dissolve into the halftone). Each bin's halftone and count grow only as its dots land (first landing about 1300 ms), so the counter is the data, not a count-up. |
| 1500 to 2100 ms | The 23 passed dots continue and settle. The dotted path draws left to right (`stroke-dashoffset`). |
| 2100 to 2400 ms | The review mark appears, scales from 0.85 to 1 and fills sunflower (it is not shown before the path reaches it). Done. Total at most 2.4 s. |

Implementation:

- The final state is server-rendered SVG. While the animation plays, the moving dots (one per company) are drawn on a temporary `<canvas>` over the drawing and removed at the end (`components/Sieve/play.ts`); CSS transforms on 377 SVG circles cost about 460 ms of blocking time on a throttled phone (see ADR P-06). No per-dot React state, no `motion` component per dot.
- One small client component (`components/Sieve/SieveAnimator.tsx`) sets `data-sieve` (`armed`, `play`, `done`); CSS animates the bins, path and review mark. A tiny inline script arms the start state before the first paint, so hydration causes no visible jump.
- Respect `prefers-reduced-motion: reduce`: no animation, final state only.
- If JavaScript is off, the final state is what everyone sees. That state must be complete and readable on its own.
- Pause nothing, loop nothing. No replay button.

## Interaction and accessibility

- Wrap in `<figure>` with a `<figcaption>`. The SVG has `role="img"` and an `aria-label` that states the whole result in one sentence, generated from the data ("377 companies screened in one run: 354 rejected by rules (timezone 234, inactive 86, size 27, duplicate 5, no website 2), 23 moved on to scoring, then founders, drafts and my review.").
- Also render a visually hidden `<table>` with the same counts.
- Each bin is focusable (`tabindex="0"`) and on hover or focus shows the gate rule from the config in a small tooltip: for example "Allowed UTC offsets: 0 to 4". Tooltip text lives in `projects.json` (add a `rule` field per bin; ask Mohamed if a rule is unclear).

## Other diagrams on the site

Case study diagrams are redrawn as inline SVG in the same language: ink lines (1.5px), ink-25 halftone fills for boxes, Archivo labels in `.type-meta`, square corners, and sunflower only on the step where a human decides. Never paste screenshots of draw.io or report figures. References to redraw from are in `docs/reference/`.
