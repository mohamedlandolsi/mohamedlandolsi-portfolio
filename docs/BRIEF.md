# Brief: mohamedlandolsi.tech

## Who it is for

| Reader | Arrives from | Needs to leave with |
|---|---|---|
| Hiring manager or GTM/RevOps lead at a B2B startup | LinkedIn, an application, a cold message from Mohamed | "He builds real GTM systems, documents his decisions, and is honest about numbers." A reason to book a call. |
| Founder who might hire a contractor | A cold LinkedIn note sent by the GTM Engine itself | Proof that the message they got came from a careful system, not a spam tool. A one-click way to reply. |
| Technical reviewer | The GitHub repo or Loom | Architecture, decisions and failure stories they can check against the repo. |

## Positioning

GTM automation and integration engineer. n8n, Clay, APIs, LLM routing. Remote, UTC+1, EU-hours overlap.

The differentiator is not the tools (everyone lists n8n and Clay). It is the discipline: rules before models, provider fallback, telemetry before rewrites, a written decision before a workflow, and a human approving anything that reaches a customer. The site proves this with real run data and real bugs.

## Concept: small batch

The site is designed like a two-ink risograph print: one blue ink for everything, one sunflower-yellow ink reserved for human judgment (approval, review, the reader's current focus). Riso is a small-batch print process, which is the point: Mohamed's systems screen hundreds of companies so that a few carefully reviewed messages go out, the opposite of mass outreach.

The one memorable element is the **sieve** in the hero: 377 real companies from one real run fall through real rule gates, and 23 move on, ending at a yellow "my review" mark. Everything else on the site is quiet.

## Sitemap

| Route | Purpose | Content source |
|---|---|---|
| `/` | Hero with the sieve, work, how I work, decisions teaser, about, contact | `profile.json`, `projects.json`, `decisions.json` |
| `/work/personal-gtm-engine` | Case study | `case-studies/personal-gtm-engine.mdx` |
| `/work/job-radar` | Case study | `case-studies/job-radar.mdx` |
| `/work/wavess` | Internship case study (publish only after Mohamed fills the TODOs) | `case-studies/wavess.mdx` |
| `/decisions` | Searchable decision log across projects, deep-linkable by ID | `decisions.json` |
| `/cv` | One-page HTML CV, print-ready, plus a PDF download | `profile.json`, `experience.json`, `skills.json` |
| `/404` | "This page did not pass the gates." plus links home and to work | |

No blog at launch. No `/about` page (about lives on the home page). No contact form: `mailto:` and LinkedIn.

## Home page, in order

1. **Header**: wordmark (name), links: Work, Decisions, CV, Contact (anchor). Nothing else.
2. **Hero**: name, one headline (from `profile.hero_headline_options`, default index 0), one line of role and tools, availability in one short sentence. Then the sieve with its caption naming the run and date.
3. **Work**: three full-width rows, not cards: title, one-liner, four metrics, stack in small condensed type. Whole row links to the case study.
4. **How I work**: four short principles, each ending with a link to the decision that shows it in practice (deep link to `/decisions#ADR-...`). Not numbered: they are not a sequence.
   - Rules before models (ADR-004)
   - Every provider has a fallback (ADR-034 or ADR-072)
   - Telemetry before rewriting (ADR-JR-17)
   - A person approves what leaves (ADR-005)
5. **Decisions teaser**: one sentence with the count from `decisions.json` and a link to the log.
6. **About**: the three paragraphs from `profile.about`, languages, education in one line each, optional duotone photo.
7. **Contact**: availability text, e-mail (copy button plus `mailto:`), LinkedIn, GitHub, CV.
8. **Footer**: name, year, "Built with Next.js, set in Archivo." Source link to the site repo.

## Case study page

Summary facts (role, period, status, stack, links) in a margin column on desktop, above the text on mobile. Then: the problem, what I built (with a redrawn two-ink diagram), decisions that mattered (embedded, expandable, linked to `/decisions`), what broke and what changed, results (metric row), what I would do next, links.

## Decision log

All decisions from `decisions.json`, grouped by project, newest project first. Filter by project and status, free-text search over title, context and decision. Each row collapsed shows ID and title; expanding shows context, decision and trade-offs. URL hash opens and scrolls to a decision. Superseded decisions show what replaced them.

## Success criteria

| Criterion | Check |
|---|---|
| A first-time visitor can say what Mohamed builds after 10 seconds | Hallway test with 2 people |
| Every number on the site traces to `content/claims.json` | `npm run check:content` |
| Looks unlike a template | `design-critic` review passes; nobody can name the template |
| Fast | Lighthouse mobile: Performance 95+, Accessibility 100, Best Practices 100, SEO 100 |
| Works without JavaScript | Home, case studies and CV readable with JS disabled; sieve shows its final state |
| Prints | `/cv` prints to one A4 page |

## Open items for Mohamed

- Exact Wavess job title (internship certificate wins over CV and old site).
- Your personal share of each Wavess item marked `verify` in `content/experience.json`.
- Repo URLs for both projects, Loom link.
- Optional: a photo for the About section (rendered as a blue and yellow duotone).
- Your updated CV PDF in `public/` (the old CV has claims that `content/claims.md` marks as unsupported).
