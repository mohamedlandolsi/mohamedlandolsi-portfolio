---
name: visual-qa
description: Screenshot-based visual, responsive and accessibility check for mohamedlandolsi.tech using the Playwright MCP server. Use after building or changing any page or component, and before committing UI work.
---

# Visual QA

Look at what you built. A screenshot catches what the code review misses.

## Setup

The Playwright MCP server is configured in `.mcp.json`. The dev server must be running (`npm run dev`, port 3000). Save screenshots to `qa/screenshots/<page>-<width>.png` (the folder is git-ignored).

## For each changed page

1. **Widths**: screenshot at 360, 768 and 1440 pixels wide, full page.
2. **Look at every screenshot yourself** (Read the PNG). For each one, write down:
   - Is the one bold element on this page obvious? Is anything competing with it?
   - Does anything match an item in the design-system skill's `anti-patterns.md`?
   - Any text over 70 characters per line, any orphaned single word on a heading, any overlap or clipping?
   - Is amber used anywhere that is not a status or a human decision? Is cyan used for anything but data and links?
3. **Overflow**: evaluate `document.documentElement.scrollWidth <= window.innerWidth` at 360px. Must be true.
4. **Keyboard**: press Tab through the page. Every interactive element must show a visible focus state in order, and nothing invisible may take focus. The skip link must appear first.
5. **Accessibility snapshot**: one `h1`, headings in order, landmarks present (`header`, `nav`, `main`, `footer`), every image and SVG diagram has a name.
6. **Console**: no errors or hydration warnings.
7. **Reduced motion and no-JS** (home page only): confirm the sieve shows its complete final state when animation is skipped.
8. **Both palettes**: emulate `prefers-color-scheme: dark` and `light`, screenshot the page at 1440 in each, and check contrast and the accents. Content marked `.reveal` stays hidden below the fold until scrolled into view, so disable that animation (or scroll) before taking full-page captures.
9. **Print** (`/cv` only): if the tool can save a PDF, confirm it fits on one A4 page.

## Then

- Fix everything you found.
- Ask the `design-critic` subagent to review the screenshot paths (pass it the file list and the page's purpose from `docs/BRIEF.md`). Treat its findings as a to-do list, not a verdict to argue with. If you disagree with one, tell Mohamed why.
- Re-run steps 1 and 2 after fixes.

## Before launch (once)

Run Lighthouse on a Vercel preview URL (PageSpeed Insights at pagespeed.web.dev, mobile). Targets: Performance 95 or more, Accessibility 100, Best Practices 100, SEO 100. Record the four scores in `docs/BUILD_PLAN.md` under phase 7.
