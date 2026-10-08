# mohamedlandolsi.tech

Personal portfolio for Mohamed Landolsi, GTM automation and integration engineer. Replaces an old BA-oriented HTML site on the same domain. Hosted on Vercel.

The site has one job: a hiring manager or a founder lands, understands in 10 seconds what Mohamed builds, and can verify it in 5 minutes (case studies, decisions, repo, Loom).

## Read before working

| When | Read |
|---|---|
| Any UI, layout, styling or motion work | Invoke the `design-system` skill. Do not style from memory. |
| Writing or editing any visible text | Invoke the `content-guard` skill. |
| Building or editing a case study page | Invoke the `case-study` skill. |
| After building or changing a page | Invoke the `visual-qa` skill, then ask the `design-critic` subagent for a review. |
| Deploying | Run `/ship` (manual only). |
| Product scope and page specs | `docs/BRIEF.md` |
| Phase-by-phase plan | `docs/BUILD_PLAN.md` |
| Why the stack is what it is | `docs/ADR.md` |

## Stack

- Next.js 16 (App Router, TypeScript strict, React Server Components, every route statically generated)
- Tailwind CSS v4 (CSS-first config: tokens live in `app/globals.css` under `@theme`)
- `motion` (import from `motion/react`) only for the hero sieve and for user-triggered expand/collapse
- MDX for case studies via `@next/mdx`
- Fonts via `next/font/google`: Archivo variable with the `wdth` axis. No other font family.
- OG images via `next/og`
- npm. No other package manager.

Not allowed without an ADR entry in `docs/ADR.md`: UI kits (shadcn/ui, MUI, Chakra, DaisyUI), icon packs, animation libraries other than `motion`, CSS-in-JS, a CMS, a database, a contact form backend, client-side data fetching.

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build      # must pass with zero errors and zero type errors
npm run lint
npm run check:content   # validates content/*.json and scans for banned characters and claims (create this script in phase 1)
```

## Content: single source of truth

- All facts live in `content/`: `profile.json`, `experience.json`, `projects.json`, `skills.json`, `decisions.json`, `claims.md`, and `content/case-studies/*.mdx`.
- Pages render from these files. Never hard-code a fact, number, date, name or link in a component.
- Never invent or round a number. Every number shown must exist in `content/claims.md` with its source and date. If a number is missing, leave a visible `TODO` and tell Mohamed.
- If `content/` contradicts anything else (an old CV, the old site, your memory), `content/` wins.

## Hard rules

1. No em dashes (the character U+2014) anywhere: copy, alt text, metadata, comments. Use commas, colons, periods or parentheses.
2. Never publish: phone number, home address, client names from the Wavess internship, names or LinkedIn URLs of prospects or their founders, outreach draft text addressed to a real person, screenshots with third-party company data. The only allowed prospect company name is "Twenty", and only in the search-ambiguity story.
3. Images from the PFE report in `docs/reference/` are references for redrawing. Never copy them into `public/`.
4. Accessibility floor: semantic landmarks, one `h1` per page, visible keyboard focus, color contrast AA (4.5:1 body, 3:1 large text), every interactive element reachable by keyboard, `prefers-reduced-motion` fully respected, text alternatives for every diagram.
5. Performance budget per route: LCP under 2.0 s on a mid-range phone, CLS under 0.05, total JS under 120 KB gzip on content pages. The hero sieve is the only heavy client component and must not block LCP (render the static final state on the server, animate after hydration).
6. Copy is sentence case. No ALL-CAPS labels, no text eyebrows above headings, no "→" appended to links, no emoji.
7. Keep components small and server-first. A component is a client component only if it needs state or motion.

## Project layout (target)

```text
app/
  layout.tsx            fonts, metadata, skip link, header, footer
  page.tsx              home
  work/[slug]/page.tsx  case studies (MDX)
  decisions/page.tsx    decision log
  cv/page.tsx           print-friendly CV
  not-found.tsx
  globals.css           @theme tokens from the design-system skill
components/             one folder per component; Sieve/ is the hero visual
content/                facts (see above)
lib/content.ts          typed loaders for content/*.json
public/                 cv.pdf, og images, redacted screenshots only
docs/                   brief, plan, ADRs, references (not deployed content)
```

## Working style

- Before writing code for a page, state the plan in 5 to 10 lines: sections, components, data used, motion (if any). Then build.
- Work one page at a time. After each page: `npm run build`, then `visual-qa`, then `design-critic`. Fix before moving on.
- Prefer deleting a decorative element over adding one.
- When unsure about a fact, ask. When unsure about a design choice, pick the quieter option and note it.
- Commit after each passing page with a plain message (`Add decisions page`). Do not push unless asked.
