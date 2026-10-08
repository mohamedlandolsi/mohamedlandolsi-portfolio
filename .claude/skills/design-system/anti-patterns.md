# Anti-patterns: what makes this site look generated

Check every page against this list before calling it done. The console style already uses panels, mono labels and a dark palette on purpose; the items below are the ways that style turns into a template.

## Layout and components

- Panels with different radii, shadows or border colors. One panel style: `--color-panel`, 1px `--color-line-strong`, 3px radius.
- Drop shadows, glassmorphism or blur anywhere except the sticky nav.
- Glowing borders or neon outlines. Amber glow is reserved for status elements and stays soft.
- A bento grid of feature tiles, or sections that all repeat "heading, paragraph, three cards".
- A "tech stack" wall of logo icons, or icon packs (Lucide, Heroicons). The only icons are the inline moon and sun on the theme toggle.
- Pill-shaped buttons or chips (radius stays 3px).
- Skill bars, language meters or percentages that are not in `content/claims.json`.

## Type and copy chrome

- Monospace for paragraphs. Mono is for labels, tags, chips, buttons and navigation only.
- Capitals typed into the source. Tags are uppercased by CSS; the text stays sentence case.
- A gradient, italic or third color on part of a headline.
- Middle dots as separators ("2026 · n8n · Clay"), spaced long dashes, "→" appended to links or buttons, emoji.
- Typewriter effects, rotating job titles, "Hi, I'm Mohamed".
- Words: passionate, seamless, cutting-edge, leverage, unlock, empower, journey, innovative, robust (unless it is a measured claim), "I'm a ... who loves ...".

## Color

- A third accent (purple, pink, blue buttons). Cyan is data and links, amber is status and the human step.
- Amber used as decoration, or cyan used for status.
- Gradients on buttons, text or panels. The ambient light behind the page is the only gradient.
- Light-palette accents copied from the reference page without the contrast adjustment (see `tokens.md`).

## Motion

- Motion beyond the list in `tokens.md`: parallax, cursor followers, magnetic buttons, marquees, count-up animations outside the sieve.
- A reveal that depends on JavaScript (content must be visible without it).
- Anything that keeps moving under `prefers-reduced-motion: reduce`.

## Content

- Numbers without a claim ID, rounded or inflated numbers ("90%+", "thousands").
- Testimonials that are not real and attributed.
- Screenshots containing other companies' data or names of real prospects.

## Self-check questions

1. If I swap the name and the content, would this page work for any developer? If yes, the content is not doing the work. Make the numbers, decisions and failure stories carry the page.
2. Where is the one bold thing on this page? On the home page it is the sieve. If something else competes with it, quiet it.
3. Is every amber element a status or a human decision?
