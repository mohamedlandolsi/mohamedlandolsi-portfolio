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

## P-07: No contact form, no analytics at launch
- **Decision:** `mailto:`, a copy-email button and LinkedIn. No analytics script at launch.
- **Why:** A form needs a backend and spam protection; recruiters use e-mail and LinkedIn anyway. No script means no cookie banner.
- **Trade-off:** No visit data. Revisit with Vercel Web Analytics if needed (new ADR).

## P-08: Git auto-deploy paused until launch
- **Context:** The site lives in the same GitHub repo the old site was deployed from. On Vercel, that repo's `main` branch deploys straight to the production domains. Pushing the half-built site would replace the live one and break the CV link.
- **Decision:** `vercel.json` sets `git.deploymentEnabled` to `false`, so no push creates a deployment.
- **Why:** The old site and `/Mohamed-Landolsi-CV.pdf` stay live through the build phases, and the repo can still be pushed after each phase.
- **Trade-off:** No preview deployments from pushes. Before `/ship`: delete `vercel.json` (or set the flag to `true`) and make sure the Vercel project that receives the repo uses the Next.js preset. The current project was created for a static site.
