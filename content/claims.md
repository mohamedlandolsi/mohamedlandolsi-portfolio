# Claim ledger

Every number or factual claim shown on the site must have a row here. Components reference claims by ID (for example `<Metric claim="G1" />`). If a claim is not in this table, it does not go on the site.

Status values: `verified` (checked against a primary record), `self-reported` (Mohamed's statement, no record attached), `target` (a design goal, never present it as a result).

## Personal GTM Engine

| ID | Claim | Value | Source | Date | Status |
|---|---|---|---|---|---|
| G1 | YC directory companies screened in one run | 377 | `ops` tab, yc stats `rows=377` | 2026-10-08 | verified |
| G2 | Companies that passed the source gates in that run | 23 | same row, `returned=23` | 2026-10-08 | verified |
| G3 | Rejection breakdown of that run | timezone 234, inactive 86, size 27, duplicate 5, no website 2 | same row: `tz_out=234 inactive=86 size=27 dup=5 no_site=2` | 2026-10-08 | verified |
| G4 | Hacker News "Who is hiring" posts screened per run, and kept | 495 screened, 14 kept | same row, hn stats `top_level=495 returned=14` | 2026-10-08 | verified |
| G5 | Accounts in the sheet, each with a score breakdown | 48 | `accounts` tab row count | 2026-10-08 | verified |
| G6 | Founders found from YC company pages | 19 people at 10 companies, 0 search credits | `contact_results` rows with `provider=yc_directory` | 2026-10-07 | verified |
| G7 | Drafts in the latest run accepted by the validator | 8 of 8, none fell back to the template | `outreach_queue` rows 38 to 45, `llm_provider` column | 2026-10-08 | verified |
| G8 | LLM calls in the latest run | 27 calls, 19 retries after a validator rejection or a rate-limit wait | `ops` tab `llm_calls=27 llm_failures=19` | 2026-10-08 | verified |
| G9 | Messages sent by the system without approval | 0 | design (no send path exists) and `send_status` column | ongoing | verified |
| G10 | Workflow size | 3 workflows: 59, 13 and 14 nodes | workflow exports | 2026-10-08 | verified |
| G11 | Architecture decisions written down | 66 | repo `docs/ADR.md` | 2026-10-08 | verified |
| G12 | Monthly running cost | $0 | free tiers only (n8n self-hosted, Sheets, Groq, Gemini, Tavily free credits, Discord) | 2026-10 | verified |
| G13 | Validator rejections before it was relaxed | 28 of 35 LLM calls rejected in one run | `ops` tab `llm_calls=35 llm_failures=28` | 2026-10-07 | verified |
| G14 | Founder lookups resolved from YC pages after the precision fix | 10 of 10 | `YC Founders` node stats, first run after the patch | 2026-10-07 | verified |
| G15 | Search mismatch before the fix | wrong people attached at 5 companies with common-word names (one is Twenty) | manual review of `contacts` | 2026-10-07 | verified |

## Job Radar

| ID | Claim | Value | Source | Date | Status |
|---|---|---|---|---|---|
| J1 | Job sources | 12 wired, 11 enabled | workflow export (41 nodes) and `config` tab (`remocate_enabled=FALSE`) | 2026-10 | verified |
| J2 | Postings merged per full run | 466 to 617 | `ops` tab, full runs 2026-09-09 to 2026-09-21 | 2026-09 | verified |
| J3 | Maximum postings sent to the LLM per run | 15 (`slice_cap`, config v4; earlier runs used 25) | `config` tab | 2026-10 | verified |
| J4 | Scoring formula | 0.40 match + 0.25 filter fit + 0.20 feasibility + 0.15 recency; pass at 65, priority at 80 | SPEC v3.2 section 8 | 2026-09 | verified |
| J5 | Fallback held during a provider outage | Groq returned 401 and one Gemini model 404; the remaining route scored 24 of 24 postings | `ops` tab row 2026-09-15 09:33 | 2026-09-15 | verified |
| J6 | Recovery after an n8n update blocked env access | failed run at 09:11, fixed and re-run with 25 of 25 scored at 09:25 (14 minutes) | `ops` tab rows 2026-09-21 | 2026-09-21 | verified |
| J7 | Infrastructure | Docker on a GCP e2-micro Always Free VM, daily schedule 07:00 Africa/Tunis, $0 | SPEC v3.2 sections 1 and 2 | 2026-09 | verified |
| J8 | Workflow size | 41 nodes | workflow export | 2026-10 | verified |

## Wavess internship (source: end-of-studies report, printed page numbers)

| ID | Claim | Value | Source | Status |
|---|---|---|---|---|
| W1 | Clients | 6 B2B clients in Germany, the UK and the Czech Republic (4 content, 2 GTM intelligence) | report p.10 to 11 | verified (do not name them) |
| W2 | Platform shape | 4 parts: Portal, Tropicc, Oceanss, Wavess-Core; federated coarse-grained SOA; one Supabase PostgreSQL with a schema per service | report p.52 to 54, p.65 | verified |
| W3 | Requirements | 46 functional, 11 non-functional, 15 user stories, two-way traceability matrix | report tables 2.5 to 2.9, A.3 | verified (46 is a count of the tables) |
| W4 | LLM router | 6 routes across 4 providers (Groq, Cerebras, Gemini, NVIDIA NIM); a provider is skipped at 95% of its daily cap | report p.67 to 68 | verified |
| W5 | Free-tier goal | more than 90% of requests served within free tiers | report p.42 (NFR-COST-01) | target, not a result |
| W6 | GTM engine data model | 39 tables in 13 logical clusters | report p.137 | verified |
| W7 | Delivery | 6 sprints, February to May 2026 | report p.28 | verified |
| W8 | Content service rebuild | about 90% refactored or rebuilt | report p.27 | verified (report uses passive voice: confirm your share) |
| W9 | Enrichment | Apify and Tavily, run in ARQ background workers on Redis | report p.62 to 63, p.121 to 123 | verified |

## Other

| ID | Claim | Value | Source | Status |
|---|---|---|---|---|
| O1 | Rugby club admin time saved | about 3 hours per week | CV | self-reported |

## Do not use (found unsupported during the content audit)

| Phrase from the old CV | Problem | Use instead |
|---|---|---|
| "keeping >90% of API costs within free-tier limits" | The report states >90% of requests, and only as a target | W5, labeled as a goal |
| "processing thousands of daily market signals" | No support in the report (1 scan per day per organization) | Omit |
| "quota-aware fallback across 6 LLM providers" | 6 routes, 4 providers | W4 |
| Job Radar "9 job sources", "Cerebras to Groq" | Outdated | J1; chain is Groq then Gemini |
| GTM Engine "discovering B2B accounts via Apollo", "waterfall enrichment using Clay and Apollo" | Outdated: Apollo is off; discovery is YC, HN and seeds; founders come from YC pages and Tavily; Clay adds optional summaries | G1 to G6 |
