# PROJECT 1 SPEC: "Job Radar" (v3.2 · Production-Deployed, Calibration Phase)
Personal job-intelligence engine · $0 budget · self-hosted n8n (Docker, GCP Always Free VM)
Portfolio Artifact #0. Governing scope document: FRs/NFRs/ADRs here override generic advice.

## 0. Vision & dogfooding frame
One pipeline: ingest free job sources → deterministic hard filters → LLM extraction/scoring only where data is fuzzy → ranked, explainable match list used daily by its owner.
Architecture mirrors Oceanss (ICP config → ingestion → explainable scoring) with myself as tenant. Heritage: Wavess PFE (wavess-core LLM router, Oceanss scoring, Tropicc pipelines).

## 1. Status snapshot
| Phase | Status | Note |
| --- | --- | --- |
| Sprint 1: ingestion→normalize→dedupe→filters→slice | GREEN ✅ | Verified live |
| Sprint 2: router instrumentation + transport pivot | GREEN ✅ | Groq/Gemini chain via `this.helpers.httpRequest` |
| Sprint 3: Discord digest, schedule, closeouts | GREEN ✅ | Digest tested, Schedule Trigger active, calibration rows disposed |
| Sprint 4: dynamic config (ADR-JR-08) | GREEN ✅ | `config` tab + Load Config coercion layer |
| Source Expansion: 10 sources (ADR-JR-09, ADR-JR-14) | GREEN ✅ | All wired, error-policy compliant, first full run completed |
| Deployment: GCP Always Free VM | GREEN ✅ | e2-micro, Docker, 07:00 Africa/Tunis daily, SSH-tunnel access |
| **Sprint 5: Calibration & Tuning** | **ACTIVE 🔄** | Pipeline complete; remaining work = output quality tuning via config levers (§12) |

## 2. Stack & credentials (as-built)
n8n self-hosted on GCP Always Free (`e2-micro`, `us-central1-a`, Debian 12, Docker Compose, `restart: unless-stopped`, 2 GB swap, port bound to `127.0.0.1` only: SSH-tunnel access). All orchestration in ONE workflow (ADR-JR-01).
Google Sheets = record (Service Account; sheet shared with `client_email` as Editor; By URL; Map Automatically). Tabs: `matches` (gid=0), `seen` (gid=1239869599), `ops` (gid=804256075), `config` (gid=906377785).
Env vars (`.env` on VM; `docker compose down && up -d` after changes): `GROQ_API_KEY`, `GEMINI_API_KEY`, `DISCORD_WEBHOOK_URL` (`CEREBRAS_API_KEY` parked).
LLM chain (Code-node router, ADR-JR-02 rev3): Groq `openai/gpt-oss-120b` → Gemini `gemini-3.5-flash-lite` → Gemini `gemini-2.5-flash` → provider `'none'` + errors.
Transport: `this.helpers.httpRequest` (fetch pivot, OQ-06).
Notify: Discord webhook via Code node (rich embeds; green ≥80, amber ≥65; grey heartbeat; ≤max_embeds).
Backup routine: weekly workflow JSON export → GitHub push; monthly VM tar backup (per Deployment Guide §27).

## 3. As-built wiring (v3.2)
```
[Manual/Schedule Trigger 07:00 Africa/Tunis]
   ├→ [Fetch Config](Sheets config tab, Execute Once) → [Load Config] ─┐
   ├→ [HTTP RemoteOK](UA header)   → [RemoteOK Mapper]  ─ (drops items w/o id+company = disclaimer)
   ├→ [HTTP Remotive]              → [Remotive Mapper]  ─┤
   ├→ [HTTP Arbeitnow]             → [Arbeitnow Mapper] ─ (epoch s×1000; visa boolean kept)
   ├→ [RSS WWR Programming]        → [WWR Mapper]       ─
   ├→ [RSS n8n Community Jobs]     → [n8n Comm Mapper]  ─┤ ([for hire] veto)
   ├→ [HTTP Jobicy]                → [Jobicy Mapper]    ─┤ (region regex veto: americas/apac/latam…)
   ├→ [RSS WWR Marketing]          → [WWR Mktg Mapper]  ─┤
   ├→ [Code HN Who is Hiring]      ──────────────────────┤ (Algolia monthly thread, ≤40 comments)
   ├→ [Code Himalayas]             ──────────────────────┤ (config-driven queries)
   ├→ [HTTP RevOps Roles]          → [RevOps Mapper]    ─┤ (structured API, synthesized desc, deterministic vetoes)
                                                       ↓
                                                [Merge append ×10]
                                                       ↓
                                     [Fetch Seen URLs] (ExecOnce) ←┘ (Load Config order-guard edge)
                                                       ↓
                                     [Dedupe & Hard Filters] (CFG-driven, reads $('Merge'))
                                                       ↓
                                     [Batch Slice ≤ CFG.slice_cap] (skill-keyword heuristic sort)
                                        ├→ [Build Prompts] → [LLM Router] → [Gate & Score]
                                        │     ├→ [Filter: url exists] → [Append Matches]   (sentinel drop)
                                        │     └→ [Run Stats] → [Append Ops] → [Discord Digest]
                                        └→ [Seen Rows] → [Append Seen]   (parallel; runs even if matches=0)
```
Name-locked nodes ($() refs): Merge, Batch Slice, LLM Router, Load Config, Run Stats, Gate & Score.

## 4. ADR log
- ADR-JR-01 Router inlined (build lacks sub-workflow trigger). Extraction deferred to Project 2.
- ADR-JR-02 rev3 Router = single Code node using `this.helpers.httpRequest`. Direct port of wavess-core router pattern. Temperature passed only when numeric.
- ADR-JR-03 Credentials: Service Account + env vars (OAuth2 7-day expiry rejected).
- ADR-JR-04 Seen-branch parallel from Batch Slice (seen store updates even when matches=0).
- ADR-JR-08 Dynamic config: `config` tab (key,value) + Load Config coercion (num/bool/list/obj/str with DEFAULTS fallback + warnings[]).
- ADR-JR-09 9-source expansion with per-source deterministic pre-filters BEFORE merge.
- ADR-JR-10 Empty-halt sentinel: Gate & Score emits `{__empty:true}` when 0 matches; native Filter drops it pre-Append.
- ADR-JR-11 Arbeitnow visa restriction moved from API query param to config gate (`arbeitnow_visa_only`).
- ADR-JR-14 RevOps Roles (Source #10): Public JSON API, synthesized description, deterministic vetoes pre-slice. Guardrails: 1 req/day, identified UA, `revops_enabled` kill-switch. Vercel WAF handled via `On Error → Continue` + cooldown.
- ADR-JR-16 (NEW) Deployment: GCP Always Free e2-micro + Docker over any paid VPS; localhost-only port binding + SSH tunnel over public exposure; budget alert $1 as alarm. Zero-cost constraint enforced at infrastructure layer.
- ADR-JR-17 (NEW) Calibration-as-data: all output-quality tuning happens in the `config` tab with `rev` bumps: never in node code. Each change = one variable, one rev, one ops row as evidence (acceptance criterion of ADR-JR-08, now operating procedure).

## 5. Functional requirements → node → status
| ID | Requirement | Node | Status |
| --- | --- | --- | --- |
| FR-JR-01 | 10-source ingestion w/ per-source accommodations | HTTP×5 + RSS×3 + Code×2 + Mappers | ✅ |
| FR-JR-02 | Normalize (HTML strip, 6k trunc, epoch fix) + dedupe by URL | Mappers + Dedupe | ✅ |
| FR-JR-03 | Hard filters: window, remote-only, Arbeitnow visa, senior-title veto, banned phrases | Dedupe (CFG) | ✅ |
| FR-JR-04 | profile.json built once, reused | Build Prompts | ✅ |
| FR-JR-11 | ≤slice_cap LLM calls/run | Batch Slice | ✅ |
| FR-JR-05 | Strict-JSON extraction per JD | LLM Router | ✅ |
| FR-JR-06 | Explainable score + why + red flags + confidence | Gate & Score | ✅ |
| FR-JR-08 | Groq→Gemini fallback on 4xx/5xx/timeout/parse | LLM Router | ✅ |
| FR-JR-09 | Persist matches/seen/ops | Sheets appends | ✅ |
| FR-JR-10 | Discord digest w/ color-coded embeds + heartbeat | Discord Digest | ✅ tested |
| FR-JR-12 | Dynamic config w/ typed coercion + warnings | Fetch Config + Load Config | ✅ |
| FR-JR-13 | Per-run ops telemetry incl. config rev + failures | Run Stats + Append Ops | ✅ |
| FR-JR-14 (NEW) | Scheduled autonomous daily operation (07:00) on $0 infra | Schedule Trigger + GCP VM | ✅ |
| FR-JR-15 (NEW) | Output quality tunable without code edits (calibration loop) | config tab + rev audit trail | 🔄 Sprint 5 |

## 6. NFRs & verification
- NFR-COST-01 (≤slice_cap LLM calls, free tiers): structurally enforced ✅; ops rows confirm daily. Infra cost: $0 (Always Free tier + $1 budget alarm).
- NFR-REL-01 (fallback activates): observable via `providers` column in ops on any Groq quota day; destructive drill now optional (deferred: production runs provide organic evidence).
- NFR-REL-02 (single-source failure must not kill run): ✅ (On Error = Continue on all sources; proven during Vercel 429 cooldown period).
- NFR-DATA-01 (no HTML/disclaimer in LLM context): ✅.
- NFR-OPS-01 (NEW): unattended daily operation: VM auto-restarts container (`unless-stopped`), schedule fires regardless of local machine state. ✅.

## 7. Schemas
Common job item: `{source,id,title,company,url,location_raw,work_policy,posted_date,description_text,visa_sponsorship,heuristic_score}`
Router output: `{job, provider:'groq'|'gemini-*'|'none', llm|null, errors{...}}`
LLM strict JSON: `{match_score, why_match, red_flags[], confidence, extracted{seniority, work_policy, location_constraint, languages_required[], visa_mention, visa_confidence, contract_friendly, company_size_hint, salary}}`
Sheets headers: matches: `run_date,source,title,company,url,location_raw,work_policy,posted_date,final_score,priority,why_match,red_flags,seniority,languages_required,visa_mention,visa_confidence,contract_friendly,company_size_hint,salary,confidence,provider,status`
seen: `url`
ops: `run_at,merged,survivors,llm_calls,providers,failures,matches_written,source_errors,errors_sample,config_rev`
config tab (key,value): `rev, window_days, slice_cap, min_score, priority_score, max_embeds, require_remote, arbeitnow_visa_only, strict, weights, seniority_ok, junior_bonus, lang_block, loc_black, loc_wide, banned_phrases, skills, title_senior, title_junior, himalayas_queries, revops_enabled, revops_categories`
`status` column vocabulary (human-in-the-loop, NEW): `new → good | false_positive | applied | rejected`. Every reviewed row gets a verdict: this is the calibration ground truth.

## 8. Gate & scoring (config-driven; DEFAULTS in Load Config)
Gate: strict? seniority ∈ seniority_ok; work_policy remote/unknown; no lang_block hit; no loc_black hit unless loc_wide hit.
Score = 0.40×match + 0.25×filterFit + 0.20×feasibility + 0.15×recency; pass ≥ min_score(65); priority ≥ priority_score(80).
feasibility = visa? visa_confidence : (contract?65:(wide?55:25)); recency ≤2d=100/≤7d=80/≤14d=60/else 40.
Dedupe gates: seen-URL, window_days, require_remote, arbeitnow_visa_only, senior-title veto (title_senior && !title_junior), banned_phrases.

## 9. Telemetry baseline & calibration register
First verified 10-source production run: COMPLETE. Baseline telemetry chain recorded: `merged → survivors → llm(providers) → failures → matches_written + config_rev`.
Calibration register (append one row per tuning change: the experiment log):
| rev | date | change (one variable) | hypothesis | merged/survivors/matches | verdict |
| --- | --- | --- | --- | --- | --- |
| v1 |: | production defaults | baseline | (first run) | baseline |

## 10. Open-question register
- OQ-06 (CLOSED): router double-failure → helpers.httpRequest + new model IDs.
- OQ-07 (OPEN): Remotive default cap; test `?limit=` during a tuning session.
- OQ-08 (CLOSED): config drift → Load Config parses all typed keys.
- OQ-09 (CLOSED): source-level error policy + observability.
- OQ-10 (CLOSED): Cerebras parked; Groq/Gemini chain live.
- OQ-11 (CLOSED): Vercel WAF cooldown elapsed; RevOps Roles ran or degraded gracefully via kill-switch; monitor `source_errors` for recurring 429s.
- OQ-12 (NEW): false-positive/false-negative rate after 7 days of reviewed matches: drives Sprint 5 tuning direction.

## 11. Sprint plan (re-cut)
- S1-S4: CLOSED ✅ (all build sprints).
- Deployment: CLOSED ✅ (GCP Always Free, schedule active, backup routine defined).
- **Sprint 5: Calibration & Tuning (ACTIVE)**:
  1. Calibration run (`strict=false`, `min_score=0`, rev bump) → capture score distribution → revert.
  2. Set `min_score` at the distribution elbow; `priority_score` ≈ top decile.
  3. 7-day observation window: review every match row daily, assign `status` verdicts.
  4. Weekly tuning cycles: one variable per change, rev bump, ops row as evidence (§12 playbook).
  5. Portfolio polish (post-stabilization): repo sync, README/diagram updates, 3-min Loom re-record with live ops history.

## 12. Calibration & tuning playbook (NEW: current phase)
Rule: every tweak is a `config` tab edit + `rev` bump. Never touch node code for output quality.

| Observed symptom | Diagnosis | Lever (config key) | Direction |
| --- | --- | --- | --- |
| Too many irrelevant matches (false positives) | Gate too loose | `min_score` | ↑ by 5 |
| Senior roles leaking through | Title veto gap | `title_senior` | add pattern |
| Same bad phrase recurring | Veto gap | `banned_phrases` | append |
| US-only/APAC jobs passing | Location gate gap | `loc_black` | append |
| Language-blocked jobs passing | Extraction caught a language | `lang_block` | append |
| LLM match_score too generous | Weight imbalance | `weights` | ↓match (0.40→0.35), ↑filterFit |
| Good jobs missing (false negatives) | Slice never surfaced them | `skills` | append keywords (drives heuristic sort) |
| Junior/entry roles gated out | Seniority list gap | `seniority_ok` / `junior_bonus` | append |
| Relevant borderline jobs cut | Threshold too high | `min_score` | ↓ by 5 |
| Fresh roles not appearing | Window too short | `window_days` | 7→10 |
| Stale jobs ranking high | Recency underweighted | `weights.recency` | 0.15→0.20 (rebalance others) |
| Too many embeds/noise in Discord | Delivery cap | `max_embeds` | ↓ |
| RevOps 429s recurring | WAF pressure | `revops_enabled` | false (kill-switch) |

Protocol per change: ① bump `rev` ② change ONE variable ③ next run ④ read ops row + review new matches ⑤ log row in calibration register (§9) ⑥ keep or revert.

## 13. n8n pitfalls (lived, version-specific)
Per-item execution → quota explosions (Execute Once on static-param nodes) · renames break $() refs · return `{json:{...}}` (reserved key) · epoch s vs ms · missing "Put Output in Field"/sub-workflow trigger · Sheets per-minute read quota · empty output halts downstream (sentinel+Filter pattern, ADR-JR-10) · HTTP/RSS default On Error = STOP (set Continue-error-output on all sources) · autoMapInputData silently DROPS input keys with no matching sheet column · dangling reference nodes need explicit order-guard edge · Vercel WAF/429: 1 req/day, identified UA, cooldown, kill-switch · `.env` changes require `docker compose down && up -d`.

## 14. Troubleshooting quick table
| Symptom | Cause | Fix |
| --- | --- | --- |
| Sheets "too many requests" | node ran per input item | Execute Once ON |
| "Referenced node doesn't exist" | rename or node didn't run | fix $() name / add order-guard edge |
| router all 'none' | env/auth/model | read errors object + errors_sample first |
| run dies on one dead source | On Error = Stop | Continue (error output) |
| gate 0 items, no error | gate/threshold working | calibration run (§12) |
| ops missing config_rev | autoMap drops unmatched keys | add sheet column |
| providers all 'gemini' | Groq key invalid/quota | verify key |
| RevOps Roles 429 / Red | Vercel WAF IP ban | Wait 1h; if persistent, `revops_enabled=false` |
| localhost:5678 unreachable | SSH tunnel down | re-run `gcloud compute ssh ... -L 5678:localhost:5678` |
| schedule didn't fire | workflow inactive / VM stopped | toggle Active / start VM |

## 15. Handoff protocol
Paste this spec first. State: sprint + single blocker + payload (ops row / errors object / match verdicts).
Instrument before rewriting. Telemetry chain: merged → survivors → llm(providers) → matches_written.
Calibration disputes resolved by evidence: rev + ops row + match verdicts, not intuition.

### Next Step
Run the Sprint 5 calibration pass: set `strict=false`, `min_score=0`, bump `rev`, execute once, then paste the ops row + the full score distribution from Gate & Score output (all survivors with their `final_score` components). I'll compute the elbow threshold and hand you the production `min_score`/`priority_score` values plus the first register entry.

**What changed and why:**

| Section | Change |
| --- | --- |
| §1 Status | All build sprints + deployment GREEN; Sprint 5 (Calibration) created as the only active phase |
| §2 Stack | Deployment facts recorded (e2-micro, SSH tunnel, backup routine): infrastructure is now part of the as-built record |
| §4 ADRs | +ADR-JR-16 (deployment decision), +ADR-JR-17 (calibration-as-data: tuning = config edits, never code) |
| §5 FRs | FR-JR-10 → tested ✅; +FR-JR-14 (autonomous daily ops), +FR-JR-15 (calibration loop) |
| §7 Schema | `status` column vocabulary formalized: your verdicts are the ground truth for tuning |
| §9 Telemetry | Baseline captured; calibration register table added (rev/change/hypothesis/verdict) |
| §10 OQs | OQ-11 closed; +OQ-12 (FP/FN rate after 7 days) |
| §12 NEW | Tuning playbook: symptom → diagnosis → config lever → direction. This is your entire remaining workload, as a table |
