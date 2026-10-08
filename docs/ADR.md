# Decisions for the portfolio site

Add a new entry before adding a dependency, a third-party script or a new kind of page.

## P-01: Next.js over Astro, SvelteKit or React Router
- **Context:** A content site with a few interactive parts (the sieve, the decision log filters, copy buttons), built mostly by an AI coding agent, hosted on Vercel.
- **Options:** Astro is purpose-built for content sites and ships no JavaScript by default. SvelteKit is lean and fast. React Router (the successor to Remix) is solid for data-heavy apps. Plain React with Vite has no routing, metadata or static generation out of the box.
- **Decision:** Next.js 16 with the App Router, every route statically generated, server components by default.
- **Why:** AI agents produce the most reliable code for Next.js, Vercel deploys it with no configuration, and server components keep JavaScript off content pages, which closes most of Astro's performance advantage.
- **Trade-off:** More framework than a five-page site strictly needs. Mitigated by the 120 KB JS budget and the rule that only components with state or motion are client components.

## P-02: Content as files, no CMS
- **Decision:** JSON and MDX in `content/`, versioned with the code.
- **Why:** One author, infrequent edits, and every number must be reviewable in a diff. A CMS would hide changes from review.
- **Trade-off:** Editing needs a commit. Acceptable for one author.

## P-03: Claim ledger for every number
- **Decision:** Numbers render only from `content/claims.json` by ID, each with a source, date and status. `check:content` fails the build on an unknown ID.
- **Why:** The site's credibility depends on numbers matching the run logs. The old CV had unsupported claims (see `content/claims.md`).
- **Trade-off:** Writing copy is slower. That is the point.

## P-04: No UI kit, no icon pack, one font family
- **Decision:** Hand-built components on Tailwind tokens. Archivo only, using its width axis.
- **Why:** UI kits and their defaults are the strongest signal of a generated site. One variable family keeps the font payload small and the voice consistent.
- **Trade-off:** More components to write, all of them small.

## P-05: Two-ink risograph concept
- **Decision:** One blue ink, one sunflower ink reserved for human judgment, paper. No black, no gradients.
- **Why:** Ties the look to the work (small batches, reviewed by hand) and avoids the common generated palettes.
- **Trade-off:** Blue body text is unusual; it is chosen at 6.8:1 contrast so readability holds.

## P-06: The sieve as CSS-animated SVG
- **Options:** Canvas, WebGL, one `motion` component per dot, CSS transforms on SVG circles.
- **Decision:** Server-rendered SVG final state, CSS transforms driven by custom properties, one small client component to start it.
- **Why:** Works without JavaScript, is accessible as an image with a text alternative, costs almost no JavaScript, and does not block LCP.
- **Trade-off:** Less physical motion than a canvas simulation. Not needed.
- **Update (phase 2, measured):** CSS transforms on 377 SVG circles made Chrome restyle and repaint the whole SVG every frame: Lighthouse mobile TBT went from 50 ms to 510 ms on `/sieve-test`. The moving dots are now drawn on a temporary `<canvas>` over the drawing for the 2.4 s of play (same timing and easing), then removed. Everything else holds: the final state is server-rendered SVG, the path, labels and review mark animate with CSS, the bin fills and counts follow the dots that have landed, and no-JS and reduced motion see the final state. TBT after the change: 50 ms, the same as an empty page.

## P-07: No contact form, no analytics at launch
- **Decision:** `mailto:`, a copy-email button and LinkedIn. No analytics script at launch.
- **Why:** A form needs a backend and spam protection; recruiters use e-mail and LinkedIn anyway. No script means no cookie banner.
- **Trade-off:** No visit data. Revisit with Vercel Web Analytics if needed (new ADR).

## P-08: Git auto-deploy paused until launch
- **Context:** The site lives in the same GitHub repo the old site was deployed from. On Vercel, that repo's `main` branch deploys straight to the production domains. Pushing the half-built site would replace the live one and break the CV link.
- **Decision:** `vercel.json` sets `git.deploymentEnabled` to `false`, so no push creates a deployment.
- **Why:** The old site and `/Mohamed-Landolsi-CV.pdf` stay live through the build phases, and the repo can still be pushed after each phase.
- **Trade-off:** No preview deployments from pushes. Before `/ship`: delete `vercel.json` (or set the flag to `true`) and make sure the Vercel project that receives the repo uses the Next.js preset. The current project was created for a static site.
- **Closed in phase 8:** the receiving project is `tech-ba-portfolio` (the repo was renamed from `tech-ba-portfolio`; Vercel follows the rename). It already holds `www.mohamedlandolsi.tech` (primary), `mohamedlandolsi.tech` (redirects to www) and the `mohamedlandolsi.dev` pair, so no domain had to move. Its preset was switched from static to Next.js, and `vercel.json` now turns git deploys back on and names the framework. The old site's last deployment stays in the project for an instant rollback.

## P-09: remark-frontmatter for case study files
- **Context:** Case studies in `content/case-studies/*.mdx` open with a YAML frontmatter block (slug, title, summary, status). `@next/mdx` does not understand frontmatter, so the block would render as text on the page.
- **Options:** Move the metadata into an `export const meta` in each MDX file (changes the content format and `check:content`); strip the block with a custom loader; the `remark-frontmatter` plugin.
- **Decision:** `remark-frontmatter` (part of the unified ecosystem MDX already runs on), passed to `@next/mdx` by name so Turbopack can use it. It only parses the block so it is left out of the output. The page reads status and title from the same block with a small parser in `lib/case-studies.ts`.
- **Why:** The content files stay as they are, and one small, stable plugin does one job at build time. Nothing ships to the browser.
- **Trade-off:** One more build dependency.
## P-10: Visual style from the reference page (supersedes P-04 and P-05 for the UI)
- **Context:** Mohamed found the two-ink risograph look unappealing and supplied a reference page whose design he wants the site to follow exactly (UI only, not its content).
- **Decision:** Dark navy by default with a light palette (system preference, plus a toggle for the visit), grid texture and soft ambient light, Space Grotesk for headings, IBM Plex Sans for text, IBM Plex Mono for labels and navigation, cyan for links and data, amber for status and the human review step, bordered panels with 1px cell grids, a sticky blurred nav, mono uppercase section tags.
- **Kept from the old rules:** content rules (claims, sentence case in the source, no emoji, no arrows in copy), AA contrast (the reference's faint grey and its light-mode amber and cyan are adjusted to pass 4.5:1), reduced motion, no-JS rendering, the sieve and its data.
- **Trade-off:** Three font families instead of one (still self-hosted through next/font). The design-system skill, its tokens and anti-pattern list, and CLAUDE.md still describe the old system and need updating before more UI work.
## P-11: Performance choices for phase 7 (fonts not preloaded, CSS not inlined, the JS floor)
- **Context:** Measured with Lighthouse mobile against the production build on localhost, once with simulated throttling (the PageSpeed default) and once with applied throttling (slow 4G: 150 ms RTT, 1.6 Mbps, 4x CPU). With applied throttling the case study's LCP was 2.2 s, over the 2.0 s budget: the stylesheets (render-blocking) and the four preloaded font files all started at about 0.6 s and shared the slow link, so the last stylesheet arrived at about 2.0 s.
- **Options measured (applied throttling, LCP on home, CV, decisions, GTM case study):** all fonts preloaded (as before): 1.8, 1.6, 1.6, 2.2 s. `experimental.inlineCss`: 1.0, 0.9, 1.0, 1.0 s, but every page's HTML grew 2.5 to 3 times (home from 17 to 46 KB gzip), because Next inlines the CSS twice (style tag and RSC payload), and the CSS is no longer cached across pages. Only the heading font preloaded: 1.8, 1.6, 1.6, 1.6 s. No font preloaded: 1.5 s on every route.
- **Decision:** No font is preloaded (`preload: false` in `app/layout.tsx`); CSS stays external. Text paints in next/font's size-adjusted fallback and swaps when the font arrives. A layout shift that the swap exposed on `/decisions` (a section tag that wrapped beside the title in one font and below it in the other, CLS 0.042) is fixed by always putting the tag on its own line under 480 px. CLS is now 0.001 or less on every route.
- **Simulated scores:** Lighthouse's simulation on localhost counts every request that finished before LCP, and on localhost everything finishes first, so it reports LCP of 2.6 to 3.0 s and Performance 93 to 96 for both this setup and the old one. The applied-throttling numbers above are the ones to trust locally; PageSpeed on the first preview deploy is the real check (phase 7 table in `docs/BUILD_PLAN.md`).
- **JavaScript budget:** every route loads 136 to 139 KB gzip of JavaScript (the `noModule` polyfill is skipped by modern browsers and not counted). Next.js 16.4 and React 19.3 are about 133 KB of that on every route; the site's own code is 4 to 7 KB (navigation, theme toggle, sieve, copy button, decision filters). Rule 5's 120 KB total cannot be met on this stack. **Open for Mohamed:** keep the rule and accept the framework floor, or restate it as "site code under 20 KB gzip per route on top of the framework".
