# Wavess internship: facts extracted from the end-of-studies report

Reference only. Client and person names have been removed on purpose; do not restore them.

Source: PFE_Report_Mohamed_Landolsi_compressed.pdf (180 PDF pages). "p.N" = printed page number. For body pages, PDF page = p.N + 15. Front matter is cited as PDF page.

## 1. Identity
- Title: "Design and Implementation of a B2B SaaS Platform for GTM Intelligence and LinkedIn Content Generation" (PDF 1).
- End-of-studies report for the "National Engineering Degree", "Specialization: Software Engineering", Ecole Supérieure Privée des Technologies de l'Information et de Management de Nabeul (ITBS, PDF 4). Academic Year 2025-2026 (PDF 1).
- Academic and professional supervisors are named in the report [names removed; the professional supervisor is the CEO].
- Duration: "six-month engineering internship" (p.1). Sprint table runs S1 "Feb 2" to S6 "May 31" (p.28). No December start date appears.
- Role title: none stated. Abstract: "final-year software engineering internship" (PDF 5). Chapter 2 "follows a functional analyst perspective" (p.25).

## 2. Company context
- "Berlin-based B2B SaaS startup founded in 2023", "lean, predominantly remote team" (p.1, p.7). "Bootstrapped (pre-seed)" (p.8).
- Domains: wavess.ai, app.wavess.ai (Portal), linkedin.wavess.ai (Tropicc), gtm.wavess.ai (Oceanss) (p.7).
- ICP: "SMB B2B firms, approximately 5-100 employees"; SaaS, fintech, HR tech, financial services, B2B agencies; "DACH, United Kingdom, and Czech Republic" (p.9).
- Clients "as of Q1 2026": Tropicc: four clients (B2B marketing and HR tech in Germany, fintech in the UK) [names removed] (p.10). Oceanss: two fintech clients (Czech Republic and UK) [names removed] (p.11).
- Problem: "a structural disconnect persists between market intelligence and content execution" (p.1); manual LinkedIn production consumes "several hours per week per profile" (p.12); intent tools are "coarse and indirect" (p.14). Six gaps defined (p.20-21).

## 3. The platform
- Style: "federated coarse-grained service-oriented architecture", chosen over monolith and fine-grained microservices (PDF 5, Table 2.15 p.53). DDD bounded contexts (p.54).
- Portal: "multi-tenant identity and workspace governance layer" (PDF 5). FastAPI "modular monolith" (p.70); atomic org provisioning (p.73); onboarding "scrape, truncate, and LLM extract" with draft-then-confirm (p.75); dual-flow invitations (p.71); Platform Admin dashboard (p.81).
- Tropicc: "AI-powered LinkedIn content generation service" (PDF 5). Six domains (Table 4.1 p.89): post creation with ML regression engagement prediction (reactions, comments, reposts, p.93); Content Hub (RSS + Apify, RelevanceEngine); ICP Generation (Apify LinkedIn scraping, dual scoring); Competitors Generation (listed, but "deferred to a future iteration", p.27); Product Post RAG (pgvector); Notifications. LinkedIn OAuth 2.0 + UGC Posts API (p.97).
- Oceanss: "predictive go-to-market intelligence engine" (PDF 5). Seven signal types, four connectors + three proxy signals (p.118); EWMA/CUSUM anomaly detection (p.120); seven-stage hiring intent scan (p.121); Tavily + LLM ICP and competitor discovery (p.123); Automation Lab; activity tiers; goal-driven dashboard with four goals (p.120, 133).
- Wavess-Core: shared Python library, "Git-sourced dependency, pinned to a specific commit" (p.65). JWT (ES256) vs Supabase JWKS, tenant resolution, three-layer entitlement gating, RBAC owner/admin/member, LLM router, ARQ/Redis (p.65-70).
- Connection: Portal sets an "HTTPOnly access token cookie on the parent domain"; sibling products verify it through Wavess-Core middleware (p.71).
- Data: one Supabase PostgreSQL instance; public, tropicc and oceanss schemas (p.52, 115, 154). Portal: "Six application tables" (p.83). Oceanss: "thirty-nine tables organized into thirteen logical clusters" (p.137). Caveat: Tropicc backend uses the service role key "that bypasses RLS"; isolation "relies on mandatory client-key filtering" (p.115).

## 4. Tech stack (as stated)
Python 3.12, FastAPI, Pydantic, Uvicorn, Jinja2, HTMX, Bootstrap, Plotly, Chart.js (p.59-61, 155); Supabase (PostgreSQL 15+, Auth, RLS), pgvector, Cloudinary (p.60, 107, 155); ARQ + Upstash Redis (p.62); LLMs: Groq, Cerebras, Gemini (2.5 Flash, Flash-Lite), NVIDIA NIM (p.63, 68, 75); Sentence Transformers all-MiniLM-L6-v2 (p.110); Apify, Tavily, NewsAPI, Alpha Vantage (p.63, 119); BeautifulSoup, httpx (p.75); Brevo, Office 365 SMTP, Resend (p.111, 120); Docker, Fly.io (Oceanss in Amsterdam region), GitHub Actions, Infisical, GoDaddy (p.64, 116, 138); pytest (p.86); Jira, GitHub, Slack, Google Meet (p.26).

## 5. His contributions
- The report is written impersonally and has no "my contributions" section. Explicit attributions: priority "Scoring was performed by the author and reviewed by the CEO" (p.36); "Working on Portal, Tropicc, and Oceanss under her supervision" (PDF 4). The CEO "managed the Jira backlog, gathered and prioritized requirements" (p.26). Tropicc: "Approximately 90% of the service was refactored or rebuilt from scratch" (p.27, passive voice).
- BA artifacts in the report: 46 FRs (12 Portal, 14 Tropicc, 13 Oceanss, 7 Core; Tables 2.5-2.8 p.37-40; total is my count, not stated); 11 NFRs (Table 2.9 p.42); 15 user stories (p.45, 141); acceptance criteria (Table A.2 p.143, covers 8 of the 15 stories); bidirectional RTM for all 15 stories (Table A.3 p.144); 8 actors in 3 categories (Table 2.3 p.30, my count); 3 use case diagrams; 3 BPMN diagrams (1 as-is, 2 to-be); weighted prioritization formula (p.36); 18 KPIs (Tables A.4-A.6, my count); 7 assumptions (Table 1.2); research questions MRQ + RQ1-RQ4 (p.15); 7-dimension tool benchmark (Table 1.9 p.20); comparison tables for architecture, backend, persistence, UI, queues, AI, deployment (Tables 2.15, 2.17-2.22). The term "ADR" is not used. No API contract document; FastAPI OpenAPI docs "support cross-service contract clarity" (p.59).
- Engineering described: everything in section 3.

## 6. Quantitative figures
- Founded 2023 (p.7); six-month internship (p.1); 6 sprints (p.28); 3 phases (p.27); stand-ups "three times per week" (p.26).
- 4 Tropicc + 2 Oceanss clients (p.10-11); conclusion names only 5, omitting one of the four content clients (p.140).
- Priority weights 0.40/0.25/0.20/0.15; High >= 4.0 (p.36).
- NFR targets (not measured): "< 500ms for 95th percentile", "< 15s", "100% of protected routes", "> 99% monthly uptime", "> 90% of requests served within free tiers" (p.42).
- Router: long context > 8,000 tokens; classification < 7,000 (p.67); provider exhausted at 95% of daily cap, 24-hour TTL (p.67). Free-tier RPD: groq-scout 1,000; groq-fast 14,400; cerebras 1,700; gemini-flash 250; gemini-flash-lite 1,000; nvidia "Unlimited" (p.68).
- Worker timeouts 3600 s / 900 s / 600 s (p.70). Memory stated inconsistently: "1 GB RAM ceiling" (p.6), "512 MB per machine" (p.62), Appendix D: Portal 512 MB, Tropicc 2 GB, Oceanss 1 GB (p.155).
- Tropicc: audience report scores up to 50 profiles, shows top 10 (p.98); RelevanceEngine 0-10 scale (p.102); RAG 220-token chunks, 384-dimensional embeddings, K 20 (p.110); 7 email types (p.110).
- Oceanss: fundraising proxy > $20 million or Series C+ (p.119); 7 scan stages, intent score 0-100, queries capped at 20 (p.121); 8 weighted ICP components (p.125); 6 eligibility checks, 1 scan/day (p.129); 8 Automation Lab sections (p.129); 4 activity tiers (p.131).
- Tests: 7 core scenarios (p.87); Tropicc 12 scenarios: 8 covered, 3 not covered, 1 partial (p.157); Oceanss 13 rows: 9 automated CI, 3 not covered, 1 manual staging (p.158-159). No coverage percentage: suite "prioritizes refactor parity over coverage metrics" (p.116). Timeouts "represent configured constraints rather than measured performance baselines" (p.87). Load testing "not yet implemented" (p.88).
- Screenshots: "12 companies scored" (Fig 5.3 p.122); "23 Hiring Signals - 23 Accounts Prioritized" (Fig 5.12 p.133).

## 7. Methodology
Adapted Scrum; no formal Scrum Master or Product Owner, CEO directed (p.26). Artifacts: product backlog, sprint backlog, user stories with AC, Definition of Done, RTM, sprint review outputs (p.26). MoSCoW plus weighted scoring, releases R1/R2 (p.36, 141). Artefacts "maintained throughout the project lifecycle as living documents in Jira" (p.141). Phases: Tropicc refactor, platform extraction (Core + Portal), Oceanss delivery (p.27).

## 8. Portfolio-worthy figures (printed p. / PDF page)
- Architecture: Fig 2.13 Federated architecture (PDF 69); Fig 1.10 Conceptual SOA model (PDF 38); Fig 1.5 Platform overview (PDF 27); Fig 2.18 LLM fallback chain (PDF 78); Fig 2.17 Async job pattern (PDF 72)
- Use cases: Figs 2.3 / 2.4 / 2.5 (PDF 47 / 49 / 50)
- BPMN: Fig 1.6 as-is content (PDF 28); Fig 2.7 to-be content (PDF 61); Fig 2.8 to-be GTM (PDF 62); Fig 1.7 as-is vs to-be GTM (PDF 29)
- Data: Fig 2.12 Multi-tenant domain model (PDF 67); ERDs Fig 3.14 Portal (PDF 99), Fig 4.25 Tropicc (PDF 130), Fig 5.17 Oceanss clusters (PDF 153)
- Sequences: Fig 3.1 JWT verification (PDF 81); Fig 3.5 Atomic provisioning (PDF 88); Fig B.4 Hiring scan (PDF 166)
- Other: Fig 4.19 RAG architecture (PDF 122); Fig 2.2 Sprint roadmap (PDF 44)
- UI screenshots: Fig 4.2 Tropicc dashboard (PDF 106); Fig 5.3 scan report (PDF 137); Fig 5.12 client dashboard (PDF 148)

## 9. Confidentiality
- No confidentiality, NDA, non-disclosure, proprietary or publication-restriction statement found (full-text search plus read of front matter and appendices). The report also grants no publication permission.
- Client names appear openly: all six in Tables 1.5-1.6 (p.10-11), plus p.1-2, 6, 9, 14, 36, 41, 140. CEO name and background appear (p.8).
- Screenshots show real third-party companies as prospects: real third-party company names (Fig 5.3 p.122, Fig 5.12 p.133) [names removed]. These would need redacting before reuse.

## 10. Gaps vs CV
- "6 European B2B clients": SUPPORTED (6 named, Germany x3, UK x2, Czech Republic x1). The number "six" is never stated; the conclusion lists 5.
- "LLM router across 6 providers": PARTIAL. "six-provider LLM routing" (p.140) and 6 router entries (p.68), but only 4 vendors (Groq, Cerebras, Gemini, NVIDIA NIM, p.41).
- ">90% of API costs within free tiers": DIFFERENT. The report says ">90% of requests", not costs, and it is a target (NFR-COST-01, p.42). No measured result.
- "ARQ/Redis workers processing thousands of daily signals": NOT SUPPORTED. Only "thousands of executions" (p.68); 1 scan/day per org (p.129); screenshots show 12-23 items.
- "Apify + Tavily enrichment via FastAPI": SUPPORTED (p.63, 75, 101, 104, 121, 123), executed in ARQ background workers.
- "LLM ICP scoring": SUPPORTED (Tropicc 1-10, p.105; Oceanss intent 0-100, p.121). Oceanss ICP ranking is a rule-based weighted engine (p.125); accuracy "unquantifiable" (p.139).
- Dates (Dec 2025 start) and title "Business Analyst & Software Engineer": NOT STATED in the report.
