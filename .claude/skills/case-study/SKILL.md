---
name: case-study
description: Structure, MDX components and review steps for project case study pages on mohamedlandolsi.tech (/work/[slug]). Use when building the case study route, writing or editing an MDX case study, or adding a new project.
---

# Case study pages

Case studies live in `content/case-studies/<slug>.mdx` and render at `/work/<slug>`. The matching entry in `content/projects.json` holds the summary facts and metrics. Draft MDX files already exist: build the page around them, do not rewrite their facts.

## Page structure

1. Title (`.type-h1`) and the one-liner from `projects.json` (`.type-lead`).
2. `<ProjectFacts slug>`: role, period, status, stack, links, as a spec grid under the title (the 920px console layout has no margin column). The page renders it; the tag in the MDX marks its place.
3. **The problem**: one or two short paragraphs.
4. **What I built**: one redrawn diagram, then a short numbered list (only if the steps are a real sequence, which they are for pipelines).
5. **Decisions that mattered**: two or three `<Decision id>` blocks.
6. **What broke, and what I changed**: one to three short stories: symptom, cause, fix, evidence.
7. **Results**: `<MetricRow claims>`.
8. **What I would do next**: two bullets.
9. `<Links slug>`: repo, Loom, related decisions.

## MDX components to build (in `components/mdx/`)

| Component | Props | Renders |
|---|---|---|
| `ProjectFacts` | `slug` | Definition list from `projects.json` |
| `Metric` | `claim`, `inline?` | Block: `.type-metric` value with its label. Inline: the claim's `inline` phrase as text in the sentence, with a tooltip or footnote showing source and date |
| `MetricRow` | `claims` (comma-separated IDs) | 2 to 5 metrics in a row; 2 by 2 on mobile |
| `Decision` | `id` | Collapsed: ID and title. Expanded: context, decision, trade-offs, and a link to `/decisions#<id>`. Uses `<details>` so it works without JS; animate height only on user action |
| `Diagram` | `name`, `alt` | A drawing from `components/diagrams/<name>.tsx` (HTML and CSS, so text stays readable on a phone), wrapped in `<figure>` with the alt as the accessible name and a short visible caption |
| `Sieve` | `project` | The hero sieve, final state only (no animation inside case studies) |
| `Screenshot` | `project`, `id` | A redacted screenshot from the project's `screenshots` list in `projects.json` (file under `public/screenshots/`, alt text, caption), in a panel with a link to the full-size file. Place it beside the text it supports. Cover every prospect name with a solid block and crop browser chrome before the file enters `public/` (ADR P-12) |
| `Links` | `slug` | Repo, Loom, and related decisions. Hide any link whose value starts with `TODO` |

Register them in `mdx-components.tsx` (required by `@next/mdx` in the App Router).

## Diagrams to draw

| Name | Draw from |
|---|---|
| `gtm-engine-overview` | `docs/reference/gtm-engine-architecture.md` (first Mermaid diagram and the run order table) |
| `job-radar-overview` | `docs/reference/job-radar-spec.md` section 3 (as-built wiring) |
| `wavess-architecture` | `docs/reference/wavess/p69-069.png` (Figure 2.13). Redraw: Portal, Tropicc, Oceanss on top; Wavess-Core below; shared PostgreSQL, Redis, workers and LLM chain at the bottom. No client names |
| `wavess-llm-router` | Report section 3.2.2 and Table 3.2 (the three routing paths), with `docs/reference/wavess/p78-078.png` (Figure 2.18). Fallbacks are listed as a set: the report does not give their order |

Style: see the `design-system` skill (`sieve.md`, last section).

## Publishing

Frontmatter `published` and `updated` are ISO dates (`2026-10-08`). Set `published` when the page first goes live and change `updated` whenever its content changes: the sitemap, the `article:` tags and the structured data read them.

Frontmatter `status: draft` pages build but are excluded from navigation and sitemap and carry `noindex`. Switch to `status: published` only after the `content-guard` checklist passes and Mohamed has confirmed any `verify` notes. The Wavess case study was published on 8 October 2026, after he confirmed his share of the work (recorded in `content/claims.md`). It never names clients or people and shows no product screenshots.

## Metadata

Each case study exports `generateMetadata` with a specific title ("Personal GTM Engine: outbound with rules first") and a description from the one-liner. Its structured data (TechArticle, SoftwareSourceCode with the repository) comes from `lib/structured-data.ts`. OG image: generated with `next/og`, title plus the first metric of the project.
