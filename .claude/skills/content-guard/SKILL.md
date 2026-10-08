---
name: content-guard
description: Rules for every word and number on mohamedlandolsi.tech. Use before writing or editing any visible text (headings, copy, case studies, alt text, metadata, OG images, button labels, error and empty states) and before publishing a page.
---

# Content guard

The site's credibility is the product. One inflated number undoes every honest one.

## Facts

1. Facts come only from `content/`. Numbers come only from `content/claims.json`, rendered through the `<Metric>` / `<MetricRow>` components by claim ID. Never type a number into a component or an MDX sentence directly.
2. A claim with `status: "target"` is a goal. Render it with the word "goal" or "target" in the sentence or label. Never as a result.
3. A claim with `status: "self-reported"` is allowed but never in the hero or a metric row.
4. If a page needs a fact that is not in `content/`, stop, add a `TODO` in the content file, and tell Mohamed what is missing. Do not fill it from memory, the old site or the old CV. `content/claims.md` lists old CV phrases that are known to be wrong.
5. Dates use the format "8 October 2026" in prose and "Oct 2026" in tight metadata. Ranges use "to" ("December 2025 to May 2026").

## Privacy (never publish)

- Phone number, home address.
- Wavess client names, client data, or product screenshots. The report figures in `docs/reference/` are for redrawing only.
- Names, photos or LinkedIn URLs of prospects or their founders. Outreach drafts addressed to a real person.
- The only allowed prospect company name is "Twenty", only in the search-ambiguity story, never with a person's name.

## Voice

- First person, plain, specific. Short sentences. Present tense for what systems do, past tense for what happened.
- Say what the thing does, then the evidence. "It rejects 354 of 377 companies with rules before any AI call" beats "It leverages intelligent filtering".
- Name the failure and the fix. Failure stories are a feature of this site.
- Sentence case everywhere: headings, buttons, navigation, labels.
- Buttons and links say what happens: "Open the decision log", "Copy e-mail", "Download CV (PDF)". The same action keeps the same name everywhere.
- Error and empty states give direction, not mood. 404: "This page did not pass the gates." then links to Home and Work.

Banned words and patterns: passionate, seamless, cutting-edge, leverage, unlock, empower, journey, innovative, synergy, world-class, "I'm a ... who loves ...", "Hi, I'm", exclamation marks in body copy, emoji.

## Characters

- No em dash (U+2014) anywhere. Use a comma, colon, period or parentheses. En dash (U+2013) is also not used; write "to" for ranges.
- No arrows appended to links. No middle dots as separators.
- Use straight quotes in code, curly quotes are fine in prose.

## Before publishing a page, check

- [ ] Every number on the page is rendered from a claim ID, and `npm run check:content` passes.
- [ ] No `TODO` remains on the page (drafts with TODOs stay unlinked and `noindex`).
- [ ] No banned word, no em dash, no arrow suffix.
- [ ] Alt text describes what a diagram shows, in one or two sentences, from the reader's point of view.
- [ ] Page title and meta description are specific to the page (no "Portfolio | Mohamed Landolsi" on every page).

## `check:content` script (create in phase 1)

`scripts/check-content.mjs` should fail with a clear message when:

1. Any file in `content/`, `app/` or `components/` contains U+2014 or U+2013.
2. A claim ID used in MDX or JSON (`claim="X1"`, `claims="X1,X2"`, `"claim": "X1"`, `"claims": ["X1"]`) is missing from `content/claims.json`.
3. A `<Decision id>` used in MDX is missing from `content/decisions.json`.
4. The sieve counts do not add up.
5. A banned word from the list above appears in `content/` or in JSX text.
6. A published case study (frontmatter `status: published`) still contains `TODO`.
