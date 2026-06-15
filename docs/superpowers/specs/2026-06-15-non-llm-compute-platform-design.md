# Non-LLM Compute Platform - Design Spec

- **Date:** 2026-06-15
- **Project:** Kairoo (formerly AstraPath AI)
- **Status:** Approved for spec review
- **Branch:** `latest`
- **Author:** Eshank Tyagi (with Claude)

---

## 1. Context & Motivation

An architecture audit (2026-06-15) established that Kairoo is, today, an **AI-heavy
monolith** where ~90% of the "intelligence" is LLM prompts. There is:

- **No product/web analytics** - only a NO-OP seam in `lib/observability/`.
- **No data engineering** - no ETL, no scheduled rollups, no materialized views.
  Migrations are pure `CREATE TABLE`; "analytics" (e.g.
  `data/repositories/interview.repo.ts`, `stats.repo.ts`) is `SELECT *` + JS loops
  recomputed live per request.
- **No non-LLM compute engine** - `engines/career` and `engines/learning` are empty
  stubs; the only real engine is `engines/ai` (LLM gateway).
- **No durable services** - `services/ai/rateLimit.ts` and `services/ai/budget.ts`
  hold state in **in-memory Maps** that reset per serverless instance, so quotas are
  not actually enforced in production. **This is a live correctness bug.**
- **No embeddings / vector search / matching** - `engines/ai/retrieval` is a `noop`.
- **No Python, no microservices, no background jobs, no caching/search.**

The goal is to add **real, deterministic, non-LLM engineering substance**: durable
services, a data-engineering analytics layer, an embeddings/matching engine, retrieval,
and a deterministic parsing engine - all at **$0 cost with no payment method**.

### Hard constraints

- **Budget: $0.** No paid services. Free tiers only, and only those that do **not**
  require a credit/debit card.
- **Polyglot:** the user explicitly wants a Python compute service (not a TS-only
  collapse).
- **Compute host:** **HuggingFace Spaces** (free CPU, no card, 16GB RAM / 2 vCPU; an
  HF token already exists in the project env). Oracle Cloud was ruled out (requires
  card verification).

---

## 2. Goals & Non-Goals

### Goals

1. Stand up a **Python FastAPI compute service** on HuggingFace Spaces as the home for
   heavy/ML/data work, callable from Next.js over an authenticated HTTP contract.
2. Fix the **durable rate-limit / token-budget bug** by moving state to Postgres.
3. Establish the **pgvector embedding substrate** that matching and retrieval build on.
4. Ship a working **embedding pipeline** (local `bge-small` model in Python + backfill
   job + keep-warm pinger).
5. Do all of the above **$0, no card**, with graceful degradation if the compute
   service is unavailable.

### Non-Goals (for Wave 1)

- The matching engine, analytics rollup engine, retrieval wiring, and resume parser -
  these are **later waves** (see §4). Wave 1 only builds the foundation they need.
- Replacing the LLM features. The LLM gateway (`engines/ai`) stays as-is.
- Migrating Next.js hosting. Where the Next app is deployed is out of scope.
- Real-time/streaming compute. All compute is request/response or scheduled batch.

---

## 3. Cross-Cutting Architecture (spans all waves)

```
[ Browser ]
     │
     ▼
[ Next.js app ]  ── HTTPS + Bearer shared-secret ──▶  [ Python FastAPI "compute" service ]
  gateway · UI · Clerk auth                              warm ML models in RAM (HF Spaces, Docker)
  orchestration · /api/* routes                          /v1/embed · (later: /v1/match, /v1/analytics, /v1/parse)
  Drizzle = schema owner                                 APScheduler batch jobs
     │                                                        │
     └────────────────── Neon Postgres + pgvector ───────────┘
                         (single shared store)
```

### Boundaries & responsibilities

- **Next.js** owns everything user-facing: Clerk auth, `/api/*` routes, orchestration,
  and the **database schema**. It calls the compute service for heavy work via a single
  typed client.
- **Python compute service** is the compute brain: stateless `/v1/*` request/response
  endpoints + an internal `APScheduler` for batch jobs. Holds the embedding model warm
  in RAM. Reads/writes rows in Neon but **never runs DDL**.
- **Neon Postgres + pgvector** is the single shared store.

### Contract

- **Transport:** REST/JSON over HTTPS, versioned under `/v1`.
- **Auth:** every `/v1/*` request must carry `Authorization: Bearer ${COMPUTE_SHARED_SECRET}`.
  The Space URL is public, so this check is **mandatory** and fail-closed.
- **Typing:** request/response shapes are defined with **Pydantic** (Python) and
  **Zod** (Next). The contract is intentionally duplicated and explicit on both ends;
  there is no shared codegen.
- **Schema ownership:** Drizzle migrations in the Next repo are the **single source of
  truth** for all tables, columns, and extensions (including `pgvector`). The Python
  service connects with a role that can `SELECT`/`INSERT`/`UPDATE`/`DELETE` rows but is
  expected never to alter schema. This prevents two-writer schema drift.
- **Degradation:** all compute calls go through one client wrapper that is gated by a
  `computeEnabled` flag and maps failures into the existing `lib/errors` hierarchy. If
  the service is down, callers fall back (e.g. to the LLM path or a cached/empty result)
  rather than 500-ing.

### Subsystem decomposition & wave sequencing

| #   | Subsystem                                                 | Depends on          | Wave  |
| --- | --------------------------------------------------------- | ------------------- | ----- |
| 1   | Durable services (Postgres rate-limit + budget)           | nothing             | **1** |
| 2   | Python compute service + HTTP seam                        | runtime decision    | **1** |
| 3   | Embedding substrate (pgvector + pipeline)                 | #2                  | **1** |
| 4   | Data-engineering analytics layer (events + rollups)       | jobs (#2 scheduler) | 2     |
| 5   | Skill/job matching engine (datasets + similarity scoring) | embeddings (#3)     | 3     |
| 6   | Search/retrieval (wire the noop retriever)                | embeddings (#3)     | 3     |
| 7   | Deterministic resume/profile parser                       | benefits from #5    | 4     |

Each wave is its own spec → plan → implement cycle. **This document specifies Wave 1
in full** and only sketches Waves 2–4 (§9) so the foundation is built to support them.

---

## 4. Wave 1 - Detailed Design

Five units, each independently understandable and testable. Build order is roughly 1a →
1d → 1b → 1e → 1c, but 1a is fully independent and ships first.

### Unit 1a - Durable rate-limit + token budget (Next.js + Postgres)

**What it does:** Replaces the in-memory `Map` state in `services/ai/rateLimit.ts` and
`services/ai/budget.ts` with Postgres-backed counters so limits hold across serverless
instances. Fixes the live bug.

**Current code being replaced:**

- `services/ai/rateLimit.ts` - sliding window, `const hits = new Map<string, number[]>()`,
  20 req / 5 min, exports `rateLimit(id)`.
- `services/ai/budget.ts` - daily caps in module-level `let` vars, exports
  `checkBudget(estTokens, now?)` and `estimateTokens(inputs, expectedOutput?)`.

**Data model (new Drizzle tables):**

```
rate_limit_buckets
  key          text        -- e.g. "ratelimit:{userId}"
  window_start timestamptz  -- start of the current fixed window
  count        integer      -- requests in this window
  PRIMARY KEY (key)

usage_budgets
  key          text        -- e.g. "budget:{userId}:{YYYY-MM-DD}" (daily) or global
  day          date
  req_count    integer
  token_estimate bigint
  PRIMARY KEY (key, day)
```

**Algorithm - fixed-window counter (atomic):**

- Rate limit: on each call, `INSERT ... ON CONFLICT (key) DO UPDATE` that resets
  `count` + `window_start` when `now - window_start >= WINDOW_MS`, else increments
  `count`. Reject when `count > MAX_REQ`. The whole read-modify-write is a single
  atomic SQL statement (using a `CASE` in the `DO UPDATE SET`) so concurrent requests
  cannot race.
- Budget: same pattern keyed by `(key, day)`, incrementing `req_count` and
  `token_estimate`; reject when either cap is exceeded.

**Interface (preserved so callers don't change):**

- `rateLimit(id: string): Promise<{ ok: boolean; retryAfter?: number }>` - now async.
- `checkBudget(estTokens: number): Promise<{ ok: boolean; reason?: string }>` - now async.
- `estimateTokens(...)` unchanged (pure function).
- Caps stay env-driven: `AI_DAILY_REQUEST_CAP`, `AI_DAILY_TOKEN_CAP`, plus new
  `AI_RATE_WINDOW_MS` / `AI_RATE_MAX_REQ` (defaults preserve current 5min/20).

**Callers to update:** every route that calls `rateLimit`/`checkBudget` must `await`
(they are in async handlers already, e.g. `app/api/ai/route.ts`). A grep sweep enumerates
them during implementation.

**Note:** This unit has **zero dependency on the Python service** - it ships first and
delivers value immediately.

### Unit 1b - Python FastAPI compute service (HuggingFace Docker Space)

**What it does:** The compute service skeleton with health + embedding endpoints,
deployed as a Docker Space.

**Structure (new top-level dir `compute/` in the repo, deployed to HF):**

```
compute/
  Dockerfile            -- python:3.11-slim, installs deps, runs uvicorn
  requirements.txt      -- fastapi, uvicorn, pydantic, sentence-transformers,
                           torch (cpu), asyncpg, apscheduler, numpy
  app/
    main.py             -- FastAPI app, lifespan loads model, mounts routers, scheduler
    config.py           -- env: COMPUTE_SHARED_SECRET, DATABASE_URL, MODEL_NAME, ALLOWED_ORIGIN
    auth.py             -- Bearer shared-secret dependency (fail-closed)
    db.py               -- asyncpg pool to Neon
    routers/
      health.py         -- GET /health (no auth) → {status, model_loaded}
      embed.py          -- POST /v1/embed (auth) → embeddings
    services/
      embedder.py       -- loads bge-small-en-v1.5, encode(texts) -> list[list[float]]
    jobs/
      scheduler.py      -- APScheduler; registers backfill job (Unit 1e)
  tests/
    test_health.py
    test_embed.py
    test_auth.py
```

**Endpoints:**

- `GET /health` → `{ "status": "ok", "model_loaded": true }`. No auth (used by pinger).
- `POST /v1/embed` (auth) → request `{ "texts": string[], "normalize": bool=true }`,
  response `{ "model": str, "dim": 384, "vectors": number[][] }`. Batches internally.

**Model:** `BAAI/bge-small-en-v1.5` (384-dim). Loaded once at startup (FastAPI lifespan)
and held warm in RAM. Fallback `sentence-transformers/all-MiniLM-L6-v2` (also 384-dim)
if RAM-constrained - both keep the `vector(384)` schema valid.

**Auth:** `auth.py` dependency compares `Authorization: Bearer <token>` against
`COMPUTE_SHARED_SECRET` using constant-time comparison; missing/wrong → 401. Applied to
all `/v1/*` routers. CORS restricted to `ALLOWED_ORIGIN` (the Next app origin).

**Secrets (HF Space settings):** `COMPUTE_SHARED_SECRET`, `DATABASE_URL`,
optionally `MODEL_NAME`, `ALLOWED_ORIGIN`.

**Deployment runbook (in spec, executed during implementation):** create HF account →
new **Docker** Space → push `compute/` (git or upload) → set Space secrets → Space
builds image and exposes `https://<user>-<space>.hf.space`.

### Unit 1c - Next.js → compute client

**What it does:** The single, typed gateway from Next.js to the compute service.

**File:** `services/compute/client.ts` (+ `services/compute/schemas.ts` for Zod).

**Interface:**

```ts
embed(texts: string[]): Promise<number[][]>   // POST /v1/embed
computeHealth(): Promise<boolean>             // GET /health
```

**Behavior:**

- Reads `COMPUTE_SERVICE_URL` + `COMPUTE_SHARED_SECRET` from env (server-only).
- Sets the `Authorization: Bearer` header.
- Timeout (default 15s) via `AbortController`; one retry on network/5xx with backoff.
- Validates responses with Zod; on shape mismatch throws `UpstreamError` from `lib/errors`.
- Gated by a new `computeEnabled` flag (§ config). When disabled or on failure, callers
  decide fallback; the client never silently returns wrong data.

### Unit 1d - pgvector foundation (Drizzle migration)

**What it does:** Enables `pgvector` and creates the shared embedding substrate.

**Migration contents:**

- `CREATE EXTENSION IF NOT EXISTS vector;`
- New table:

```
embeddings
  entity_type  text        -- 'skill' | 'resource' | 'profile' | ...
  entity_id    text        -- FK-ish id of the source row (string for flexibility)
  content_hash text        -- hash of the embedded text; skip re-embed if unchanged
  embedding    vector(384)
  model        text
  updated_at   timestamptz default now()
  PRIMARY KEY (entity_type, entity_id)
```

- HNSW index: `CREATE INDEX ... ON embeddings USING hnsw (embedding vector_cosine_ops);`

**Drizzle note:** `pgvector` types may need a custom Drizzle type or a hand-written SQL
migration appended to `data/migrations/`. The migration is generated/added so
`drizzle-kit` and the Python reader agree on the column. Schema stays Drizzle-owned.

### Unit 1e - Embedding pipeline (Python job + keep-warm pinger)

**What it does:** Populates and maintains the `embeddings` table; keeps the Space warm.

**Backfill/refresh job (`compute/app/jobs/scheduler.py`):**

- An `APScheduler` interval job (e.g. every 30 min) that:
  1. Selects source rows needing embeddings (e.g. skills from `lib/data/static`,
     learning resources, user profile summaries) whose `content_hash` differs from the
     stored one (or is missing).
  2. Calls the in-process embedder in batches.
  3. Upserts into `embeddings`.
- Idempotent via `content_hash`; safe to run repeatedly.
- Can also be triggered on demand via an internal `POST /v1/embed/backfill` (auth) for
  testing.

**Keep-warm pinger:** a scheduled **GitHub Action** (`.github/workflows/compute-ping.yml`)
that `curl`s `/health` every ~10 min. Free, no card. Prevents the 48h sleep so the model
stays warm.

---

## 5. Configuration changes

- **`config/flags.ts`** - add `computeEnabled: false` (flip on once the Space is live).
- **`config/env.ts`** - extend with `computeServiceUrl`, `computeSharedSecret`
  (server-only). Keep the existing minimal pattern; Zod validation optional.
- **`.env.example` / `.env.local` / `.env.prod`** - add `COMPUTE_SERVICE_URL`,
  `COMPUTE_SHARED_SECRET`, `AI_RATE_WINDOW_MS`, `AI_RATE_MAX_REQ` (names only in example).
- **HF Space secrets** - `COMPUTE_SHARED_SECRET`, `DATABASE_URL`, `MODEL_NAME`,
  `ALLOWED_ORIGIN`.

---

## 6. Testing Strategy

**Python (pytest):**

- `test_health` - returns ok + model_loaded.
- `test_auth` - 401 without/with wrong bearer; 200 with correct.
- `test_embed` - returns 384-dim vectors; determinism (same input → same output);
  batch length matches input length; normalized vectors have ~unit norm.

**Next.js (unit):**

- Rate-limit SQL: simulate concurrent hits against a test DB (or transaction harness);
  assert the cap holds and `retryAfter` is sane; window rolls over correctly.
- Budget: caps enforced; rolls daily.
- Compute client: Zod rejection → `UpstreamError`; timeout → retry once then error;
  disabled flag short-circuits.

**Integration smoke test:** `embed("hello")` → store in `embeddings` → cosine
nearest-neighbour query returns the row. Confirms the full Next ↔ Python ↔ pgvector loop.

---

## 7. Risks & Mitigations

| Risk                                     | Mitigation                                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| HF Space sleeps (cold start ~10–30s)     | Keep-warm GitHub Action pings `/health` every ~10 min.                                                                                |
| Public Space URL abuse                   | Mandatory fail-closed Bearer auth + CORS lock + rate budget.                                                                          |
| Two services, one DB → schema drift      | Drizzle is sole schema owner; Python is row-only.                                                                                     |
| `pgvector` not enabled on Neon free tier | Verify during 1d; Neon supports `pgvector`. If blocked, fall back to a TS cosine over a `jsonb` array (slower) - flagged, not silent. |
| Compute service down breaks UX           | `computeEnabled` flag + client wrapper + caller fallback (LLM path / empty).                                                          |
| `torch` image size / HF build limits     | Use CPU-only torch wheel; bge-small is small; pin slim base image.                                                                    |
| Rate-limit SQL races                     | Single atomic `INSERT ... ON CONFLICT DO UPDATE`, no read-then-write.                                                                 |

---

## 8. Success Criteria (Wave 1 done when…)

1. `rateLimit`/`checkBudget` enforce limits **durably** across instances (verified by a
   test that survives a simulated instance reset).
2. The HF Space responds `200` on `/health` and authenticated `/v1/embed` returns
   384-dim vectors.
3. `services/compute/client.ts` round-trips an embed call with auth, timeout, retry, and
   Zod validation; degrades cleanly when `computeEnabled=false`.
4. The `embeddings` table exists with the HNSW index; the backfill job populates it and
   is idempotent.
5. The keep-warm pinger workflow is committed and green.
6. `npx tsc --noEmit` clean; Python `pytest` green.

---

## 9. Later Waves (sketch - not specified here)

- **Wave 2 - Data-engineering analytics:** an `events` table + `APScheduler` rollup jobs
  writing daily/weekly aggregate tables (or Postgres materialized views refreshed on a
  schedule), replacing the per-request `reduce` loops in `interview.repo.ts` /
  `stats.repo.ts`. Optionally `duckdb`/`pandas` in Python for heavier aggregation.
- **Wave 3 - Matching engine + retrieval:** ingest open occupation/skill datasets
  (ESCO / O\*NET), embed them, and compute **deterministic** skill-gap/match scores via
  pgvector cosine + rule-based weighting (`/v1/match`). Wire `engines/ai/retrieval` from
  `noop` to a pgvector-backed retriever.
- **Wave 4 - Deterministic parser:** `/v1/parse/resume` using `pdfplumber` + `spaCy`
  NER to replace LLM JSON extraction with a fast, testable, free parser.

---

## 10. Decisions Log

- **Runtime:** Next.js monolith + Python FastAPI microservice (polyglot). _User chose
  both monolith add-ons and Python; reconciled to "Python service absorbs the add-ons at $0"._
- **Compute host:** HuggingFace Spaces (free CPU, no card). _Oracle ruled out - requires
  card verification._
- **Embedding model:** `bge-small-en-v1.5` (384-dim), fallback `all-MiniLM-L6-v2`.
- **Rate-limit algorithm:** fixed-window Postgres counter (sliding window deferred).
- **Schema ownership:** Drizzle-only; Python row-level access only.
- **Budget:** $0, no card - all choices validated against this.
