# Tokens

The source of truth is `app/globals.css` (Tailwind v4, CSS-first `@theme`). This file explains it.

## Color

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--color-bg` | `#0E1420` | `#EEEFEA` | Page background |
| `--color-panel` | `#151C2C` | `#E4E6DF` | Panels, chips, buttons, number cells |
| `--color-panel-2` | `#1B2438` | `#D9DBD3` | Hover fill, spec cells, tooltips, nested surfaces |
| `--color-text` | `#E8E6DE` | `#171A22` | Headings and primary text |
| `--color-dim` | `#8D96AA` | `#4C5364` | Running text, descriptions, mono nav |
| `--color-faint` | `#7C869B` | `#585F6E` | Tags, labels under numbers, footnote, the sieve's source field |
| `--color-cyan` | `#6FE3C9` | `#0A6A5B` | Links, numbers, data, passed companies |
| `--color-amber` | `#FFB300` | `#865108` | Status, kickers, period badges, the human review step, focus outline |
| `--color-line` | text at 10% | text at 10% | Section rules, rows inside panels, the background grid |
| `--color-line-strong` | text at 18% | text at 18% | Panel borders, cell separators |

Contrast notes: the reference page used `#5E6779` / `#767E8F` for faint text and `#B8730A` / `#0E7C6B` for light-mode amber and cyan. Those fail 4.5:1 for small text, so the values above are the same hues moved just far enough to pass on `bg`, `panel` and `panel-2`. Check any new pairing before using it.

Older token names (`--color-paper`, `--color-ink`, `--color-ink-85`, `--color-ink-55`, `--color-ink-25`, `--color-ink-12`, `--color-marker`, `--color-overprint`) are aliases onto this palette, kept for the sieve. New code uses the names above.

The palette switches in two places that must stay in sync: `@media (prefers-color-scheme: light)` for `:root:not([data-theme="dark"])`, and `:root[data-theme="light"]` (set by `components/ThemeToggle`).

## Type

Loaded in `app/layout.tsx` with `next/font/google` (self-hosted at build time):

| Family | Variable | Weights | Role |
|---|---|---|---|
| Space Grotesk | `--font-display` | 500, 600, 700 | Headings, numbers, the nav mark |
| IBM Plex Sans | `--font-sans` | 400, 500, 600 | Running text (body default) |
| IBM Plex Mono | `--font-mono` | 400, 500 | Labels, tags, nav links, chips, buttons, code |

| Class | Spec |
|---|---|
| `.type-display` | Space Grotesk 700, `clamp(2.4rem, 5.6vw, 4rem)`, line-height 1.04, -0.02em. The hero h1 (name, then the role in `--color-faint` via `.hero-faint`) |
| `.type-h1` | Space Grotesk 700, `clamp(2rem, 6vw, 3.35rem)`. Page titles other than the hero |
| `.sec-title`, `.type-h2` | Space Grotesk 600, 1.5rem |
| `.type-h3` | Space Grotesk 600, 1.12rem, balanced |
| `.project-name` | Space Grotesk 700, 1.4rem |
| `.thesis`, `.type-lead`, `.lead` | Plex Sans 1.04 to 1.08rem, `--color-dim` |
| `.type-meta` | Plex Mono 0.78rem, `--color-dim` |
| `.sec-tag`, `.spec-label`, `.matrix-head`, `.bg-kicker`, `.eyebrow` | Plex Mono 0.72 to 0.78rem, 0.06 to 0.08em tracking, uppercased by CSS |
| `.proof-num`, `.type-metric` | Space Grotesk 700, cyan, 1.6rem in strips |
| `.role-line`, `.project-sub` | Plex Mono, cyan |

Body text is 1rem with line-height 1.55. Paragraph width: `.measure` (64ch) or the component's own `max-width` (56 to 66ch).

## Layout

| Token | Value |
|---|---|
| Content width | `.shell`: 920px max, `--page-margin` 28px (20px under 400px) |
| Sections | `.section`: 72px block padding (56px under 720px), 1px `--color-line` bottom rule; the last one adds `.section-last` |
| Hero | `.hero`: 88px top, 76px bottom (64 / 52 on phones) |
| Radius | `--radius` 3px everywhere; 50% only for the status dot and the review mark |
| Nav | Sticky, 56px tall, `--nav-bg` (bg at 86%) with 10px backdrop blur, 1px bottom line |

## Components (classes in `globals.css`)

| Pattern | Classes |
|---|---|
| Background | `.bg-grid` (fixed 64px grid, masked to fade down) and `body::before` (ambient light) |
| Nav | `.topnav`, `.nav-inner`, `.nav-mark`, `.nav-links` (current page filled cyan), `.theme-toggle` |
| Hero | `.hero`, `.eyebrow` + `.dot`, `.hero-faint`, `.role-line`, `.thesis`, `.hero-meta`, `.chip`, `.chip-status`, `.cv-link` |
| Section head | `components/SectionHead` (`.sec-head`, `.sec-title`, `.sec-tag`) |
| Panels | `.panel` (+ `.lift` for the 2px hover lift) |
| Cell grids | `.cells` + `.cell`, with `.proof-strip` / `.proof-item` / `.proof-num` / `.proof-label`, `.spec-grid` / `.spec-cell` / `.spec-label` / `.spec-value`, `.matrix` / `.matrix-col` / `.matrix-head` / `.matrix-text` / `.evidence-link` |
| Project card | `.project-card`, `.project-top`, `.project-name`, `.project-sub`, `.status-badge`, `.project-desc`, `.project-links`, `.project-link-btn` |
| Background panels | `.bg-panel`, `.bg-kicker`, `.edu-item` (`.edu-degree`, `.edu-school`, `.edu-period`), `.lang-row` (`.lang-name`, `.lang-level`) |
| Buttons | `.button`, `.button-primary` (cyan fill), `.button-row` |
| Contact | `.contact`, `.contact-title`, `.contact-note` |
| Footer | `.foot-note` |
| Tooltips | `[data-tip-host]` + `.tip` (CSS only; Escape handled by `components/TooltipDismiss`) |
| Decisions | `.decision` (details/summary panel), `.decision-id` (amber mono), `.decision-title` (cyan mono), `.decision-content` |
| Reveal | `.reveal` (scroll-driven, CSS only, off under reduced motion) |

## Motion

| Element | Motion |
|---|---|
| Ambient light | 22 s drift, alternate |
| Status dot | 3.2 s pulse |
| Availability chip, period badges | Soft amber glow, 4.5 to 5 s |
| Panels, buttons, nav links | 1 to 2px lift on hover, 0.15 to 0.25 s |
| `.reveal` | Fade and 14px rise as it enters the viewport (scroll-driven) |
| Sieve | Once on load, see `sieve.md` |

`prefers-reduced-motion: reduce` turns all of it off, including the ambient light.
