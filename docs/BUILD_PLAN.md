# Build plan

Eight phases. Paste each phase's prompt into Claude Code, let it finish, check the acceptance list yourself, then commit. Do not start a phase before the previous one passes. Expect 2 to 4 sessions per phase for the hero and the decision log; the others are shorter.

Tip: start each session with `/clear` and the phase prompt. The kit's `CLAUDE.md` and skills give Claude Code all the context it needs.

## Phase 0: scaffold

```text
Scaffold the project in this folder without overwriting the existing files (CLAUDE.md, .claude/, .mcp.json, .gitignore, content/, docs/).
Create a Next.js 16 app with TypeScript, the App Router, Tailwind CSS v4, ESLint and npm, using create-next-app in a temporary folder outside this repo, then copy the generated files in. Keep our .gitignore.
Then install @next/mdx, @mdx-js/loader, @mdx-js/react and @types/mdx and configure MDX for the App Router (next.config.ts and mdx-components.tsx). Install motion.
Remove all demo content and default styles. Run npm run build. Initialise git and commit "Scaffold".
```

Accept when: `npm run build` passes, the home page is blank, no Geist font, no create-next-app SVGs left in `public/`.

## Phase 1: foundation

```text
Use the design-system skill. Implement the tokens from tokens.md in app/globals.css, load Archivo with the wdth axis through next/font in app/layout.tsx, and build the layout shell: skip link, header (wordmark with the yellow plate offset, links Work, Decisions, CV, Contact), main, footer.
Create lib/content.ts with typed loaders for every file in content/ (profile, experience, projects, skills, decisions, claims) and a type for each.
Create scripts/check-content.mjs exactly as specified in the content-guard skill, and add "check:content" to package.json.
Create app/not-found.tsx using the 404 copy from the content-guard skill.
Then run visual-qa on the empty shell and the 404 page.
```

Accept when: `npm run check:content` passes; tabbing shows the skip link first; light and dark mode both render; the wordmark shows the offset yellow plate; no layout shift when the font loads.

## Phase 2: the sieve

```text
Use the design-system skill and read sieve.md fully. Build components/Sieve: a server component that renders the complete final state as SVG from content/projects.json, plus a small client SieveAnimator that plays the load animation once, exactly per the timing table. Desktop horizontal and mobile vertical layouts. Bins are focusable and show their rule. Include the aria-label sentence and the visually hidden table. Fail the build if the counts do not add up.
Put it on a temporary /sieve-test page. Run visual-qa at all three widths, with reduced motion, and with JavaScript disabled. Then ask design-critic for a review and fix what it finds.
```

Accept when: the animation is under 2.4 s and plays once; reduced motion and no-JS show the full final state; at 360px nothing overflows; the only sunflower is the review mark and focus states; Lighthouse performance on `/sieve-test` does not drop compared to the empty page.

## Phase 3: home page

```text
Build the home page per docs/BRIEF.md (Home page, in order) using the design-system and content-guard skills. Hero headline from profile.hero_headline_options at hero_headline_default. Work rows from projects.json (featured, ordered), linking to /work/[slug]. How I work: the four principles with their decision links. Decisions teaser with the live count from decisions.json. About, contact (with a copy-email button that confirms "Copied"), footer.
Remove /sieve-test. Run visual-qa, then design-critic, and fix.
```

Accept when: every number on the page comes from a claim ID; a stranger can tell you what Mohamed does after 10 seconds; nothing on the page is a card.

## Phase 4: case studies

```text
Use the case-study skill. Build app/work/[slug]/page.tsx with generateStaticParams from projects.json, the MDX components listed in the skill, and the three diagrams (gtm-engine-overview, job-radar-overview, wavess-architecture) redrawn in the console style of the design-system skill. Draft case studies are noindex and not linked from the home page. Run visual-qa on /work/personal-gtm-engine and /work/job-radar, then design-critic.
```

Accept when: the GTM Engine and Job Radar pages read well on a phone; every `<Metric>` shows its source on hover or focus; `<Decision>` works without JavaScript; Wavess stays draft until you fill its TODOs.

## Phase 5: decision log

```text
Build /decisions from content/decisions.json per docs/BRIEF.md: grouped by project, filter by project and status, free-text search, rows that expand on click (details/summary, height animation only on user action), deep links by hash that open and scroll to a decision, superseded entries linking to their replacement. Keep it fast with 77 entries: render server-side, filter client-side. Run visual-qa and design-critic.
```

Accept when: `/decisions#ADR-076` opens that decision; search for "fallback" finds the router decisions; the page is fully usable by keyboard.

## Phase 6: CV

```text
Build /cv as a one-page HTML CV from profile.json, experience.json and skills.json, with print styles that fit one A4 page, and a "Download CV (PDF)" link to /Mohamed-Landolsi-CV.pdf. No phone number. Run visual-qa including the print check.
```

Accept when: printing from the browser gives one clean A4 page; the content matches `content/` exactly.

Built: the PDF link is `profile.links.cv_pdf` (the PDF hosted from the separate CV repo), not a file in `public/`. The page also lists the two personal projects from `projects.json`. Facts still marked `TODO` (the Wavess job title) and highlights still marked `verify` are left out until Mohamed confirms them.

## Phase 7: metadata, performance, accessibility

```text
Add metadataBase, per-page titles and descriptions, OG images with next/og in the console style, app/sitemap.ts, app/robots.ts, and JSON-LD Person on the home page. Then do a performance and accessibility pass on every route and fix what you find. Record PageSpeed scores here after the first preview deploy.
```

Built: `metadataBase` and a title template (`lib/metadata.ts`), canonical URLs, Open Graph and X tags on every page, OG cards from `lib/og.tsx` for home, case studies, decisions and CV (static, rendered at build time from `assets/fonts/`), `app/icon.svg`, `app/sitemap.ts` (drafts left out), `app/robots.ts`, JSON-LD Person on the home page. Performance and accessibility findings and choices: ADR P-11.

Local checks on the production build (Lighthouse 13, mobile):

| Route | LCP, applied slow-4G throttling | CLS | Performance (simulated) | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|---|
| `/` | 1.6 s | 0 | 94 | 100 | 100 | 100 |
| `/work/personal-gtm-engine` | 1.5 s | 0 | 93 | 100 | 100 | 100 |
| `/work/job-radar` | 1.5 s | 0 | 95 | 100 | 100 | 100 |
| `/decisions` | 1.5 s | 0.001 | 95 | 100 | 100 | 100 |
| `/cv` | 1.5 s | 0.001 | 96 | 100 | 100 | 100 |

axe-core 4.10 (WCAG 2.2 AA and best practices): no violations on all routes, both palettes, at 360 and 1280 px.

Scores (fill in after the preview deploy):

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | | | | |
| `/work/personal-gtm-engine` | | | | |
| `/decisions` | | | | |

## Phase 8: ship

Run `/ship` and follow it. The domain move happens in the Vercel dashboard.

Shipped on 8 October 2026: production deployment `dpl_2sBoD22sSCFwxoXvadJdyxhvffkA` (commit `e82f9cc`) on the Vercel project `tech-ba-portfolio`, which already held the domains, so nothing moved. Checked on `https://www.mohamedlandolsi.tech`: every route prerendered and returning 200, OG images on the www host, the apex redirecting to www, `/Mohamed-Landolsi-CV.pdf` redirecting to the hosted CV, no `noindex` outside drafts and the 404. The previous production deployment (`dpl_Cj935kgNoPhUaGbaZXtPDYfytoSr`, the old site) is kept as the rollback target. PageSpeed scores in the phase 7 table are still to be filled in from pagespeed.web.dev.

## Phase 9: repositories, screenshots, favicon, search

Built on 8 October 2026, after the first deploy.

- **Repositories:** both project repositories are public and named in `content/projects.json`. They show in the facts grid and the link row of each case study, on the home work cards, and as `codeRepository` in each case study's structured data. The CV page is unchanged (it has to print on one A4 page).
- **Screenshots (GTM Engine):** five files in `public/screenshots/personal-gtm-engine/`, listed with alt text and captions in `content/projects.json` and placed with `<Screenshot project id>`: the three n8n canvases and the accounts tab under "What I built", the ops tab under "Results". Account IDs and company names are covered with solid blocks, and the browser chrome is cropped away (ADR P-12).
- **Held back:** the Discord review card. Even with the recipient's name and company covered it is the text of a draft written to a real person, which rule 2 names on its own. It goes in only if Mohamed decides the covered version is allowed.
- **Better captures wanted:** the engine canvas at 2x or more (its node labels are about 4 px tall in the current file), and the ops tab with its header row visible (the counters are unlabelled in the current file).
- **Favicon:** the orange M as `app/favicon.ico` (16, 32, 48), `app/icon.png` (192) and `app/apple-icon.png` (180, on the site's navy). It replaces `app/icon.svg`.
- **Search:** one schema.org graph per page (`lib/structured-data.ts`): WebSite, ProfilePage and Person on the home page; TechArticle and SoftwareSourceCode on each case study. Case studies carry `published` and `updated` dates in their frontmatter, used for `article:` tags, structured data and `lastmod` in the sitemap. The sitemap lists each case study's screenshots. Robots meta allows the large image preview and the full snippet. `/index.html` (the old site's only page) redirects to `/`.

Left for Mohamed, outside the repo: verify the domain in Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`; give both GitHub repositories a description, the case study address as website and topics.

Added after review: both `.dev` hosts now redirect every path to `www.mohamedlandolsi.tech` (`next.config.ts`), so the site is served from one address.
