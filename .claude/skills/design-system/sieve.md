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

- **Source field**: 377 dots (3px radius, `--color-ink`) in a 29 by 13 grid. The number 377 under it in `.type-metric`.
- **Gate**: two vertical lines in `--color-ink-55`, 1px. Label above: "Rules, no AI" in `.type-meta`.
- **Bins**: five columns below the gate, filled with halftone in `--color-ink-25`, height proportional to count (use a square-root scale so the 2 and 5 bins stay visible, minimum 8px). Each bin label: reason in sentence case and the count in tabular figures.
- **Passed**: 23 dots in full ink, clustered, with "23" in `.type-metric` and the label "moved on to scoring".
- **Next stages**: a dotted line in `--color-ink-55` with the four labels from `sieve.next`, ending in a 56px circle filled with `--color-marker`, text "My review" in `--color-overprint`. This circle is the only sunflower in the hero.
- **Caption** below: `sieve.caption`, `.type-meta`, plus a link "How the gates work" to the case study.

Mobile (under 768px): rotate the flow to vertical. Source field on top (17 by 23 dots, 2px radius), gate as horizontal lines, bins as horizontal bars listed under the gate with labels on the right, then passed, then the stages as a vertical list ending in the review mark.

## Motion (plays once per page view)

| Time | What happens |
|---|---|
| 0 ms | Server-rendered final state is visible. On hydration, if motion is allowed and the sieve is in the viewport, reset dots to the source field without a visible jump (they are already there in the final state for 354 + 23 dots, only positions change). |
| 300 to 1500 ms | Dots move right toward the gate in 6 waves, each wave delayed 120 ms, easing `cubic-bezier(.2,.7,.2,1)`. |
| 900 to 1900 ms | At the gate, rejected dots drop into their bins (color fades to `--color-ink-55`, then they dissolve into the halftone). Bin counts tick up to their final value. |
| 1500 to 2100 ms | The 23 passed dots continue and settle. The dotted path draws left to right (`stroke-dashoffset`). |
| 2100 to 2400 ms | The review mark scales from 0.85 to 1 and fills sunflower. Done. Total at most 2.4 s. |

Implementation:

- SVG with one `<circle>` per dot; positions via CSS custom properties (`--x0 --y0 --x1 --y1 --delay`) and CSS transforms. No per-dot React state, no `motion` component per dot.
- One small client component (`components/Sieve/SieveAnimator.tsx`) toggles a `data-play` attribute; CSS does the rest.
- Respect `prefers-reduced-motion: reduce`: no animation, final state only.
- If JavaScript is off, the final state is what everyone sees. That state must be complete and readable on its own.
- Pause nothing, loop nothing. No replay button.

## Interaction and accessibility

- Wrap in `<figure>` with a `<figcaption>`. The SVG has `role="img"` and an `aria-label` that states the whole result in one sentence, generated from the data ("377 companies screened in one run: 354 rejected by rules (timezone 234, inactive 86, size 27, duplicate 5, no website 2), 23 moved on to scoring, then founders, drafts and my review.").
- Also render a visually hidden `<table>` with the same counts.
- Each bin is focusable (`tabindex="0"`) and on hover or focus shows the gate rule from the config in a small tooltip: for example "Allowed UTC offsets: 0 to 4". Tooltip text lives in `projects.json` (add a `rule` field per bin; ask Mohamed if a rule is unclear).

## Other diagrams on the site

Case study diagrams are redrawn as inline SVG in the same language: ink lines (1.5px), ink-25 halftone fills for boxes, Archivo labels in `.type-meta`, square corners, and sunflower only on the step where a human decides. Never paste screenshots of draw.io or report figures. References to redraw from are in `docs/reference/`.
