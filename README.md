# mohamedlandolsi.tech: Claude Code build kit

Everything Claude Code needs to build the new portfolio: instructions, skills, a design system, verified content and a phased plan. The site itself does not exist yet; Claude Code builds it in this folder.

## What is here

| Path | What it is |
|---|---|
| `CLAUDE.md` | Project instructions Claude Code loads every session: stack, hard rules, when to use which skill |
| `.claude/skills/design-system/` | The visual system: two-ink risograph concept, tokens, the hero sieve spec, anti-patterns |
| `.claude/skills/content-guard/` | Facts, privacy and voice rules, and the spec for the `check:content` script |
| `.claude/skills/case-study/` | Case study page structure, MDX components, diagrams to redraw |
| `.claude/skills/visual-qa/` | Screenshot, responsive, keyboard and accessibility checks with Playwright |
| `.claude/skills/ship/` | Pre-launch checklist and Vercel domain move (manual: `/ship`) |
| `.claude/agents/design-critic.md` | A reviewer subagent that judges screenshots against the brief |
| `.claude/settings.json` | Permissions: npm and git allowed, push and deploy ask first, `.env` reads blocked |
| `.mcp.json` | Playwright MCP server so Claude Code can screenshot its own work |
| `content/` | All facts: profile, experience, projects, skills, 77 decisions, the claim ledger, three case study drafts |
| `docs/BRIEF.md` | Audience, positioning, concept, sitemap, page specs, success criteria |
| `docs/BUILD_PLAN.md` | Eight phases with the exact prompt to paste for each |
| `docs/ADR.md` | Why Next.js, why no CMS, why the claim ledger, and more |
| `docs/reference/` | Source material for redrawing diagrams (never published as-is) |

## Start

```bash
mkdir -p ~/projects/mohamedlandolsi-tech && cd ~/projects/mohamedlandolsi-tech
unzip ~/Downloads/portfolio-claude-kit.zip -d .
claude
```

On first launch, approve the project MCP server (Playwright) when asked. Then paste the Phase 0 prompt from `docs/BUILD_PLAN.md`.

## Before you publish

- Fill the `TODO`s in `content/` (Wavess title, your share of the Wavess work, repo and Loom links).
- Put your updated CV at `public/Mohamed-Landolsi-CV.pdf`. The old CV has claims that `content/claims.md` marks as unsupported, and it shows your phone number.
