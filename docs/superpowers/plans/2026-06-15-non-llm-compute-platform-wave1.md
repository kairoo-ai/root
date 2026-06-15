# Non-LLM Compute Platform - Wave 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation for Kairoo's non-LLM compute platform - durable Postgres rate-limit/budget (fixing the live in-memory bug), a Python FastAPI compute service on HuggingFace Spaces, and a pgvector embedding substrate - all additive and behind a `computeEnabled` flag so existing flows never break.

**Architecture:** Next.js monolith stays the gateway/UI (Drizzle = sole schema owner). A new `compute/` Python FastAPI service runs on a HuggingFace Docker Space and holds an embedding model warm in RAM. They share a Neon Postgres + pgvector database. Next→Python is REST/JSON over HTTPS with a `Bearer` shared secret; every call goes through one typed client gated by `computeEnabled` with graceful fallback.

**Tech Stack:** Next.js 16 / TypeScript / Drizzle (neon-http) / Zod / Vitest · Python 3.11 / FastAPI / Pydantic / sentence-transformers (`bge-small-en-v1.5`) / asyncpg / APScheduler / pytest · Neon Postgres + pgvector · HuggingFace Spaces (Docker) · GitHub Actions (keep-warm pinger).

**Spec:** `docs/superpowers/specs/2026-06-15-non-llm-compute-platform-design.md`

---

## File Structure

**Next.js (existing app):**

- `vitest.config.ts` _(create)_ - test runner config
- `config/flags.ts` _(modify)_ - add `computeEnabled`
- `config/env.ts` _(modify)_ - add compute service env
- `data/schema/index.ts` _(modify)_ - add `rateLimitBuckets`, `usageBudgets`, `embeddings` tables + vector custom type
- `data/migrations/*` _(generate + hand-edit for pgvector)_
- `services/ai/window.ts` _(create)_ - pure fixed-window state helpers (unit-testable)
- `services/ai/rateLimit.ts` _(rewrite)_ - async, Postgres-backed
- `services/ai/budget.ts` _(rewrite)_ - async, Postgres-backed
- `services/ai/window.test.ts` _(create)_ - Vitest unit tests
- `app/api/ai/route.ts`, `app/api/interview/sessions/route.ts`, `app/api/interview/sessions/[id]/answer/route.ts`, `app/api/interview/sessions/[id]/next-question/route.ts` _(modify)_ - `await rateLimit(...)`
- `services/compute/schemas.ts` _(create)_ - Zod request/response shapes
- `services/compute/client.ts` _(create)_ - typed compute client
- `services/compute/client.test.ts` _(create)_ - Vitest with mocked fetch

**Python service (new `compute/` dir, deployed to HF):**

- `compute/Dockerfile`, `compute/requirements.txt`, `compute/README.md`, `compute/.dockerignore`
- `compute/app/main.py`, `compute/app/config.py`, `compute/app/auth.py`, `compute/app/db.py`
- `compute/app/routers/health.py`, `compute/app/routers/embed.py`
- `compute/app/services/embedder.py`
- `compute/app/jobs/scheduler.py`, `compute/app/jobs/backfill.py`
- `compute/tests/test_health.py`, `compute/tests/test_auth.py`, `compute/tests/test_embed.py`, `compute/tests/test_backfill.py`

**Ops:**

- `.github/workflows/compute-ping.yml` _(create)_ - keep-warm pinger
- `docs/runbooks/hf-space-deploy.md` _(create)_ - deploy runbook

---

## Task 1: Test harness + config scaffolding (Next.js)

**Files:**

- Create: `vitest.config.ts`
- Modify: `package.json` (devDeps + scripts)
- Modify: `config/flags.ts`
- Modify: `config/env.ts`
- Modify: `.env.example`

- [ ] **Step 1: Install Vitest (devDependency only - does not affect the app bundle)**

Run: `npm install -D vitest@^2.1.0`
Expected: `vitest` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "compute/**"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Add test script to `package.json`**

Add to the `"scripts"` block:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Add `computeEnabled` flag to `config/flags.ts`**

Replace the file contents with:

```ts
export const flags = {
  analytics: false,
  consentBanner: true,
  authEnabled: false,
  billingEnabled: false,
  computeEnabled: false, // flip to true once the HF compute Space is live (Task 9)
} as const;

export type FeatureFlag = keyof typeof flags;
```

- [ ] **Step 5: Extend `config/env.ts` with compute service env**

Replace the file contents with:

```ts
// TODO: validate with zod once installed; this module is server-only by convention
export const env = {
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  computeServiceUrl: process.env.COMPUTE_SERVICE_URL ?? "",
  computeSharedSecret: process.env.COMPUTE_SHARED_SECRET ?? "",
} as const;
```

- [ ] **Step 6: Add env var names to `.env.example`**

Append:

```
# --- Non-LLM compute service (HuggingFace Space) ---
COMPUTE_SERVICE_URL=
COMPUTE_SHARED_SECRET=
# --- Durable rate limiting (optional overrides; defaults 300000ms / 20 req) ---
AI_RATE_WINDOW_MS=
AI_RATE_MAX_REQ=
```

- [ ] **Step 7: Verify the harness runs and the app still type-checks**

Run: `npx tsc --noEmit && npx vitest run`
Expected: `tsc` clean; Vitest reports "No test files found" (exit 0) - harness works, no tests yet.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts config/flags.ts config/env.ts .env.example
git commit -m "chore(compute): add Vitest harness + computeEnabled flag + compute env

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Pure fixed-window helpers + tests

**Files:**

- Create: `services/ai/window.ts`
- Test: `services/ai/window.test.ts`

- [ ] **Step 1: Write the failing test** - `services/ai/window.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { nextBucketState, computeRetryAfterSec } from "./window";

describe("nextBucketState", () => {
  it("starts a fresh bucket when none exists", () => {
    expect(nextBucketState(null, 1000, 5000)).toEqual({
      windowStart: 1000,
      count: 1,
    });
  });

  it("increments within the window", () => {
    const prev = { windowStart: 1000, count: 3 };
    expect(nextBucketState(prev, 2000, 5000)).toEqual({
      windowStart: 1000,
      count: 4,
    });
  });

  it("rolls over when the window has elapsed", () => {
    const prev = { windowStart: 1000, count: 19 };
    expect(nextBucketState(prev, 7000, 5000)).toEqual({
      windowStart: 7000,
      count: 1,
    });
  });

  it("rolls over exactly at the window boundary", () => {
    const prev = { windowStart: 1000, count: 10 };
    expect(nextBucketState(prev, 6000, 5000)).toEqual({
      windowStart: 6000,
      count: 1,
    });
  });
});

describe("computeRetryAfterSec", () => {
  it("returns whole seconds remaining in the window", () => {
    expect(computeRetryAfterSec(1000, 5000, 2000)).toBe(4);
  });
  it("never returns less than 1", () => {
    expect(computeRetryAfterSec(1000, 5000, 5999)).toBe(1);
    expect(computeRetryAfterSec(1000, 5000, 9000)).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run services/ai/window.test.ts`
Expected: FAIL - `window.ts` does not exist / exports undefined.

- [ ] **Step 3: Write minimal implementation** - `services/ai/window.ts`

```ts
/**
 * Pure helpers for fixed-window rate limiting & daily budgets.
 * No I/O - these mirror the atomic SQL in rateLimit.ts/budget.ts and exist
 * so the window algorithm is unit-testable without a database.
 */

export const RATE_WINDOW_MS = Number(
  process.env.AI_RATE_WINDOW_MS ?? 5 * 60_000,
);
export const RATE_MAX_REQ = Number(process.env.AI_RATE_MAX_REQ ?? 20);

export type BucketState = { windowStart: number; count: number };

/** Next state for a fixed-window counter given the previous state and now. */
export function nextBucketState(
  prev: BucketState | null,
  nowMs: number,
  windowMs: number,
): BucketState {
  if (!prev || nowMs - prev.windowStart >= windowMs) {
    return { windowStart: nowMs, count: 1 };
  }
  return { windowStart: prev.windowStart, count: prev.count + 1 };
}

/** Whole seconds until the current window expires (minimum 1). */
export function computeRetryAfterSec(
  windowStartMs: number,
  windowMs: number,
  nowMs: number,
): number {
  return Math.max(1, Math.ceil((windowStartMs + windowMs - nowMs) / 1000));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run services/ai/window.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add services/ai/window.ts services/ai/window.test.ts
git commit -m "feat(compute): pure fixed-window rate-limit helpers + tests

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Durable rate-limit (Postgres) + caller updates

**Files:**

- Modify: `data/schema/index.ts` (add `rateLimitBuckets`)
- Rewrite: `services/ai/rateLimit.ts`
- Modify: `app/api/ai/route.ts:22`, `app/api/interview/sessions/route.ts:14`, `app/api/interview/sessions/[id]/answer/route.ts:23`, `app/api/interview/sessions/[id]/next-question/route.ts:19`
- Generate: a Drizzle migration

- [ ] **Step 1: Add the `rateLimitBuckets` table to `data/schema/index.ts`**

Append at the end of the file:

```ts
// --- Durable rate limiting (replaces in-memory Map) ---
export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  key: text("key").primaryKey(), // e.g. "ai:{userId}"
  windowStart: timestamp("window_start").defaultNow().notNull(),
  count: integer("count").notNull().default(0),
});
```

- [ ] **Step 2: Rewrite `services/ai/rateLimit.ts` to use an atomic Postgres upsert**

```ts
import { sql } from "drizzle-orm";
import { db } from "@/data/client";
import { RATE_WINDOW_MS, RATE_MAX_REQ } from "./window";

/**
 * Durable fixed-window rate limiter. State lives in Postgres (rate_limit_buckets)
 * so limits hold across serverless instances - replaces the old in-memory Map.
 * The whole read-modify-write is a single atomic INSERT ... ON CONFLICT DO UPDATE,
 * so concurrent requests cannot race. DB now() is the clock (no instance drift).
 */
export async function rateLimit(
  id: string,
  windowMs: number = RATE_WINDOW_MS,
  maxReq: number = RATE_MAX_REQ,
): Promise<{ ok: boolean; retryAfter?: number }> {
  const key = `ai:${id}`;
  const interval = `${windowMs} milliseconds`;
  try {
    const rows = (await db.execute(sql`
      INSERT INTO rate_limit_buckets (key, window_start, count)
      VALUES (${key}, now(), 1)
      ON CONFLICT (key) DO UPDATE SET
        window_start = CASE
          WHEN rate_limit_buckets.window_start < now() - ${interval}::interval
          THEN now() ELSE rate_limit_buckets.window_start END,
        count = CASE
          WHEN rate_limit_buckets.window_start < now() - ${interval}::interval
          THEN 1 ELSE rate_limit_buckets.count + 1 END
      RETURNING count,
        GREATEST(1, CEIL(EXTRACT(EPOCH FROM
          (window_start + ${interval}::interval - now()))))::int AS retry_after
    `)) as unknown as { rows: { count: number; retry_after: number }[] };

    const row = rows.rows[0];
    if (row && row.count > maxReq) {
      return { ok: false, retryAfter: row.retry_after };
    }
    return { ok: true };
  } catch (e) {
    // Fail-open on DB error so a transient DB blip never blocks all traffic.
    console.error("[rateLimit] db error, failing open:", e);
    return { ok: true };
  }
}
```

> Note: `db.execute()` on the neon-http driver returns a result whose `.rows` holds the `RETURNING` output. The `as unknown as {...}` cast types it locally.

- [ ] **Step 3: Update the 4 callers to `await`**

In each file, change the synchronous call to async. Exact edits:

`app/api/ai/route.ts:22` - `const rl = rateLimit(userId);` → `const rl = await rateLimit(userId);`
`app/api/interview/sessions/route.ts:14` - `const rl = rateLimit(userId)` → `const rl = await rateLimit(userId)`
`app/api/interview/sessions/[id]/answer/route.ts:23` - `const rl = rateLimit(userId)` → `const rl = await rateLimit(userId)`
`app/api/interview/sessions/[id]/next-question/route.ts:19` - `const rl = rateLimit(userId)` → `const rl = await rateLimit(userId)`

(All four are already inside `async` handlers, so adding `await` is valid.)

- [ ] **Step 4: Generate the migration**

Run: `npm run db:generate`
Expected: a new file `data/migrations/0004_*.sql` containing `CREATE TABLE "rate_limit_buckets"`.

- [ ] **Step 5: Verify type-check passes across the app**

Run: `npx tsc --noEmit`
Expected: clean (zero `error TS`). Confirms all 4 callers correctly `await`.

- [ ] **Step 6: Commit**

```bash
git add data/schema/index.ts data/migrations services/ai/rateLimit.ts app/api/ai/route.ts "app/api/interview/sessions/route.ts" "app/api/interview/sessions/[id]/answer/route.ts" "app/api/interview/sessions/[id]/next-question/route.ts"
git commit -m "fix(services): durable Postgres rate limiter (was in-memory Map)

State now survives serverless cold starts and is enforced across instances.
Atomic INSERT...ON CONFLICT DO UPDATE; fails open on DB error.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Durable daily budget (Postgres)

**Files:**

- Modify: `data/schema/index.ts` (add `usageBudgets`)
- Rewrite: `services/ai/budget.ts`
- Generate: migration

(`checkBudget`/`estimateTokens` have no external callers today - verified by grep - so the async change is safe. We keep the exact export names from `services/ai/index.ts`.)

- [ ] **Step 1: Add the `usageBudgets` table to `data/schema/index.ts`**

Append:

```ts
// --- Durable daily budget guard (replaces in-memory counters) ---
export const usageBudgets = pgTable(
  "usage_budgets",
  {
    day: text("day").notNull(), // 'YYYY-MM-DD' (UTC)
    scope: text("scope").notNull().default("global"),
    reqCount: integer("req_count").notNull().default(0),
    tokenEstimate: integer("token_estimate").notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.day, t.scope] }),
  }),
);
```

- [ ] **Step 2: Add `primaryKey` to the schema import line**

Change `data/schema/index.ts` line 1 from:

```ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
```

to:

```ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
```

- [ ] **Step 3: Rewrite `services/ai/budget.ts`**

```ts
import { sql } from "drizzle-orm";
import { db } from "@/data/client";

const MAX_REQ_PER_DAY = Number(process.env.AI_DAILY_REQUEST_CAP ?? 5000);
const MAX_TOKENS_PER_DAY = Number(process.env.AI_DAILY_TOKEN_CAP ?? 2_000_000);

/**
 * Durable daily budget guard. Counters live in Postgres (usage_budgets), keyed
 * by UTC day, so caps hold across instances. Atomic upsert; fails open on error.
 * Call before generating. `estTokens` ~ ceil(inputChars/4) + expected output.
 */
export async function checkBudget(
  estTokens: number,
  scope = "global",
): Promise<{ ok: boolean; reason?: string }> {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  try {
    const rows = (await db.execute(sql`
      INSERT INTO usage_budgets (day, scope, req_count, token_estimate)
      VALUES (${day}, ${scope}, 1, ${estTokens})
      ON CONFLICT (day, scope) DO UPDATE SET
        req_count = usage_budgets.req_count + 1,
        token_estimate = usage_budgets.token_estimate + ${estTokens}
      RETURNING req_count, token_estimate
    `)) as unknown as { rows: { req_count: number; token_estimate: number }[] };

    const row = rows.rows[0];
    if (row && row.req_count > MAX_REQ_PER_DAY)
      return { ok: false, reason: "daily request cap reached" };
    if (row && row.token_estimate > MAX_TOKENS_PER_DAY)
      return { ok: false, reason: "daily token cap reached" };
    return { ok: true };
  } catch (e) {
    console.error("[checkBudget] db error, failing open:", e);
    return { ok: true };
  }
}

export function estimateTokens(
  inputs: Record<string, string>,
  expectedOutput = 700,
): number {
  const inChars = Object.values(inputs).join("").length;
  return Math.ceil(inChars / 4) + expectedOutput;
}
```

- [ ] **Step 4: Generate the migration**

Run: `npm run db:generate`
Expected: a new migration containing `CREATE TABLE "usage_budgets"`.

- [ ] **Step 5: Verify type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add data/schema/index.ts data/migrations services/ai/budget.ts
git commit -m "fix(services): durable Postgres daily budget guard (was in-memory)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: pgvector substrate - `embeddings` table + extension + index

**Files:**

- Modify: `data/schema/index.ts` (custom `vector` type + `embeddings` table)
- Generate + hand-edit: migration (drizzle-kit won't emit `CREATE EXTENSION`/HNSW)

- [ ] **Step 1: Define a custom pgvector column type and the `embeddings` table in `data/schema/index.ts`**

Add near the top (after the import line):

```ts
import { customType } from "drizzle-orm/pg-core";

/** Minimal pgvector column type (stores a fixed-dimension float vector). */
const vector = (dimensions: number) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]) {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string) {
      return value
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map(Number);
    },
  })("embedding");
```

Append the table at the end of the file:

```ts
// --- Shared embedding substrate (pgvector) ---
export const embeddings = pgTable(
  "embeddings",
  {
    entityType: text("entity_type").notNull(), // 'skill' | 'resource' | 'profile' | ...
    entityId: text("entity_id").notNull(),
    contentHash: text("content_hash").notNull(), // skip re-embed when unchanged
    embedding: vector(384),
    model: text("model").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.entityType, t.entityId] }),
  }),
);
```

- [ ] **Step 2: Generate the base migration**

Run: `npm run db:generate`
Expected: a new migration `data/migrations/0006_*.sql` with `CREATE TABLE "embeddings"`.

- [ ] **Step 3: Hand-edit the generated embeddings migration to add the extension + HNSW index**

At the **very top** of that migration file add:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

At the **very bottom** add:

```sql
CREATE INDEX IF NOT EXISTS embeddings_vec_hnsw
  ON embeddings USING hnsw (embedding vector_cosine_ops);
```

- [ ] **Step 4: Verify type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add data/schema/index.ts data/migrations
git commit -m "feat(data): pgvector embeddings substrate (extension + table + HNSW index)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

> Migration is **applied** to Neon in Task 9 (`npm run db:push`) once reviewed - keeps schema changes auditable before they hit the shared DB.

---

## Task 6: Python compute service skeleton (health + auth)

**Files:**

- Create: `compute/requirements.txt`, `compute/Dockerfile`, `compute/.dockerignore`, `compute/README.md`
- Create: `compute/app/__init__.py`, `compute/app/config.py`, `compute/app/auth.py`, `compute/app/main.py`
- Create: `compute/app/routers/__init__.py`, `compute/app/routers/health.py`
- Test: `compute/tests/__init__.py`, `compute/tests/conftest.py`, `compute/tests/test_health.py`, `compute/tests/test_auth.py`

- [ ] **Step 1: Create `compute/requirements.txt`**

```
fastapi==0.115.5
uvicorn[standard]==0.32.1
pydantic==2.10.3
pydantic-settings==2.6.1
sentence-transformers==3.3.1
torch==2.5.1
asyncpg==0.30.0
apscheduler==3.11.0
numpy==2.1.3
httpx==0.28.1
pytest==8.3.4
pytest-asyncio==0.24.0
```

- [ ] **Step 2: Create `compute/app/config.py`**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    compute_shared_secret: str = "dev-secret-change-me"
    database_url: str = ""
    model_name: str = "BAAI/bge-small-en-v1.5"
    allowed_origin: str = "*"

    class Config:
        env_file = ".env"


settings = Settings()
```

- [ ] **Step 3: Create `compute/app/auth.py`**

```python
import hmac
from fastapi import Header, HTTPException, status
from .config import settings


def require_bearer(authorization: str = Header(default="")) -> None:
    """Fail-closed Bearer shared-secret check for all /v1/* routes."""
    prefix = "Bearer "
    token = authorization[len(prefix):] if authorization.startswith(prefix) else ""
    if not token or not hmac.compare_digest(token, settings.compute_shared_secret):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token")
```

- [ ] **Step 4: Create `compute/app/routers/health.py`**

```python
from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/health")
def health(request: Request) -> dict:
    return {
        "status": "ok",
        "model_loaded": bool(getattr(request.app.state, "embedder", None)),
    }
```

- [ ] **Step 5: Create `compute/app/main.py` (model loads lazily; routers mounted)**

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import health


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Embedder is attached in Task 7; None here keeps the skeleton importable/testable.
    app.state.embedder = getattr(app.state, "embedder", None)
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="Kairoo Compute", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.allowed_origin],
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    return app


app = create_app()
```

- [ ] **Step 6: Create the empty package + test files**

`compute/app/__init__.py`, `compute/app/routers/__init__.py`, `compute/tests/__init__.py` - all empty.

`compute/tests/conftest.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import create_app


@pytest.fixture
def client():
    return TestClient(create_app())
```

- [ ] **Step 7: Write the failing tests** - `compute/tests/test_health.py`

```python
def test_health_ok(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
```

`compute/tests/test_auth.py`:

```python
def test_protected_route_requires_bearer(client):
    # /health is public; we assert the dependency itself rejects bad tokens
    from app.auth import require_bearer
    import pytest
    from fastapi import HTTPException

    with pytest.raises(HTTPException) as exc:
        require_bearer(authorization="Bearer wrong")
    assert exc.value.status_code == 401

    with pytest.raises(HTTPException):
        require_bearer(authorization="")
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `cd compute && pip install -r requirements.txt && PYTHONPATH=. pytest tests/test_health.py tests/test_auth.py -v`
Expected: PASS (the shared secret default lets `require_bearer("Bearer dev-secret-change-me")` succeed; wrong/empty raise 401).

- [ ] **Step 9: Create `compute/Dockerfile`**

```dockerfile
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1 HF_HOME=/app/.cache/huggingface
WORKDIR /app
RUN pip install --no-cache-dir torch==2.5.1 --index-url https://download.pytorch.org/whl/cpu
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

(HF Spaces expose port 7860 by convention.)

- [ ] **Step 10: Create `compute/.dockerignore`**

```
__pycache__/
*.pyc
.pytest_cache/
.cache/
tests/
.env
```

- [ ] **Step 11: Create `compute/README.md`** (short - purpose + local run)

```md
# Kairoo Compute Service

FastAPI service for non-LLM compute (embeddings, later: matching/analytics/parsing).
Deployed as a HuggingFace Docker Space. Schema is owned by the Next.js repo (Drizzle);
this service only reads/writes rows.

## Local run
```

pip install -r requirements.txt
PYTHONPATH=. uvicorn app.main:app --reload --port 7860

```

## Env
COMPUTE_SHARED_SECRET, DATABASE_URL, MODEL_NAME, ALLOWED_ORIGIN
```

- [ ] **Step 12: Commit**

```bash
git add compute/
git commit -m "feat(compute): FastAPI service skeleton (health + bearer auth + Docker)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Embedding endpoint `/v1/embed` + warm model

**Files:**

- Create: `compute/app/services/__init__.py`, `compute/app/services/embedder.py`
- Create: `compute/app/routers/embed.py`
- Modify: `compute/app/main.py` (load embedder in lifespan, mount embed router)
- Test: `compute/tests/test_embed.py`

- [ ] **Step 1: Create `compute/app/services/embedder.py`**

```python
from __future__ import annotations
from sentence_transformers import SentenceTransformer


class Embedder:
    """Wraps a sentence-transformers model held warm in RAM."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.dim = self.model.get_sentence_embedding_dimension()

    def encode(self, texts: list[str], normalize: bool = True) -> list[list[float]]:
        vectors = self.model.encode(
            texts, normalize_embeddings=normalize, convert_to_numpy=True
        )
        return [v.tolist() for v in vectors]
```

- [ ] **Step 2: Create `compute/app/routers/embed.py`**

```python
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from ..auth import require_bearer

router = APIRouter(prefix="/v1", dependencies=[Depends(require_bearer)])


class EmbedRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=256)
    normalize: bool = True


class EmbedResponse(BaseModel):
    model: str
    dim: int
    vectors: list[list[float]]


@router.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest, request: Request) -> EmbedResponse:
    embedder = getattr(request.app.state, "embedder", None)
    if embedder is None:
        raise HTTPException(status_code=503, detail="model not loaded")
    vectors = embedder.encode(req.texts, normalize=req.normalize)
    return EmbedResponse(model=embedder.model_name, dim=embedder.dim, vectors=vectors)
```

- [ ] **Step 3: Wire the embedder into `compute/app/main.py` lifespan + mount the router**

Replace the lifespan and `create_app` in `compute/app/main.py` with:

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import health, embed
from .services.embedder import Embedder


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.embedder = Embedder(settings.model_name)
    yield
    app.state.embedder = None


def create_app(load_model: bool = True) -> FastAPI:
    app = FastAPI(title="Kairoo Compute", version="0.1.0", lifespan=lifespan if load_model else None)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.allowed_origin],
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(embed.router)
    return app


app = create_app()
```

- [ ] **Step 4: Write the test** - `compute/tests/test_embed.py`

```python
import pytest
from fastapi.testclient import TestClient
from app.main import create_app
from app.config import settings

AUTH = {"Authorization": f"Bearer {settings.compute_shared_secret}"}


@pytest.fixture(scope="module")
def warm_client():
    # load_model=True triggers lifespan (downloads model on first run ~130MB)
    with TestClient(create_app(load_model=True)) as c:
        yield c


def test_embed_requires_auth(warm_client):
    r = warm_client.post("/v1/embed", json={"texts": ["hello"]})
    assert r.status_code == 401


def test_embed_returns_384_dim_vectors(warm_client):
    r = warm_client.post("/v1/embed", json={"texts": ["hello", "world"]}, headers=AUTH)
    assert r.status_code == 200
    body = r.json()
    assert body["dim"] == 384
    assert len(body["vectors"]) == 2
    assert len(body["vectors"][0]) == 384


def test_embed_is_deterministic(warm_client):
    a = warm_client.post("/v1/embed", json={"texts": ["repeatable"]}, headers=AUTH).json()
    b = warm_client.post("/v1/embed", json={"texts": ["repeatable"]}, headers=AUTH).json()
    assert a["vectors"][0][:5] == b["vectors"][0][:5]
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd compute && PYTHONPATH=. pytest tests/test_embed.py -v`
Expected: PASS (first run downloads the model; subsequent runs use cache). 384-dim vectors, deterministic.

- [ ] **Step 6: Commit**

```bash
git add compute/app compute/tests/test_embed.py
git commit -m "feat(compute): /v1/embed endpoint with warm bge-small model

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Next.js → compute client (typed, gated, graceful)

**Files:**

- Create: `services/compute/schemas.ts`
- Create: `services/compute/client.ts`
- Test: `services/compute/client.test.ts`

- [ ] **Step 1: Create `services/compute/schemas.ts`**

```ts
import { z } from "zod";

export const embedResponseSchema = z.object({
  model: z.string(),
  dim: z.number(),
  vectors: z.array(z.array(z.number())),
});

export type EmbedResponse = z.infer<typeof embedResponseSchema>;
```

- [ ] **Step 2: Write the failing test** - `services/compute/client.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const ORIGINAL = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = {
    ...ORIGINAL,
    COMPUTE_SERVICE_URL: "https://x.hf.space",
    COMPUTE_SHARED_SECRET: "s",
  };
});

describe("embed()", () => {
  it("sends bearer auth and returns parsed vectors", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ model: "m", dim: 2, vectors: [[1, 2]] }),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    const { embed } = await import("./client");
    const out = await embed(["hi"]);
    expect(out).toEqual([[1, 2]]);
    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer s",
    );
  });

  it("throws UpstreamError on malformed response shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ nope: true }), { status: 200 }),
        ),
    );
    const { embed } = await import("./client");
    await expect(embed(["hi"])).rejects.toThrow();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run services/compute/client.test.ts`
Expected: FAIL - `./client` does not exist.

- [ ] **Step 4: Create `services/compute/client.ts`**

```ts
import { env } from "@/config/env";
import { UpstreamError } from "@/lib/errors";
import { embedResponseSchema } from "./schemas";

const TIMEOUT_MS = 15_000;

async function callCompute<T>(
  path: string,
  body: unknown,
  retries = 1,
): Promise<T> {
  if (!env.computeServiceUrl)
    throw new UpstreamError("compute service not configured");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${env.computeServiceUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.computeSharedSecret}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      if (res.status >= 500 && retries > 0)
        return callCompute<T>(path, body, retries - 1);
      throw new UpstreamError(`compute ${path} failed: ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (e) {
    if (retries > 0 && e instanceof Error && e.name === "AbortError") {
      return callCompute<T>(path, body, retries - 1);
    }
    if (e instanceof UpstreamError) throw e;
    throw new UpstreamError(`compute ${path} error: ${(e as Error).message}`);
  } finally {
    clearTimeout(timer);
  }
}

/** Embed texts via the compute service. Returns one vector per input. */
export async function embed(texts: string[]): Promise<number[][]> {
  const raw = await callCompute<unknown>("/v1/embed", {
    texts,
    normalize: true,
  });
  const parsed = embedResponseSchema.safeParse(raw);
  if (!parsed.success)
    throw new UpstreamError("compute /v1/embed returned an unexpected shape");
  return parsed.data.vectors;
}

/** Liveness check used by callers before relying on compute. */
export async function computeHealth(): Promise<boolean> {
  if (!env.computeServiceUrl) return false;
  try {
    const res = await fetch(`${env.computeServiceUrl}/health`, {
      method: "GET",
    });
    return res.ok;
  } catch {
    return false;
  }
}
```

> Confirm `UpstreamError` is exported from `lib/errors`. If the export name differs, use the actual one (per the audit, `lib/errors` defines `AppError` subclasses including `UpstreamError`). If absent, add `export class UpstreamError extends AppError { constructor(msg: string) { super(msg, 'UPSTREAM', 502) } }` to `lib/errors/index.ts`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run services/compute/client.test.ts && npx tsc --noEmit`
Expected: PASS (2 tests) and clean type-check.

- [ ] **Step 6: Commit**

```bash
git add services/compute
git commit -m "feat(compute): typed Next->compute client (zod-validated, retry, graceful)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Embedding backfill job + idempotency

**Files:**

- Create: `compute/app/db.py`
- Create: `compute/app/jobs/__init__.py`, `compute/app/jobs/backfill.py`, `compute/app/jobs/scheduler.py`
- Modify: `compute/app/main.py` (start scheduler in lifespan)
- Modify: `compute/app/routers/embed.py` (add internal `/v1/embed/backfill` trigger)
- Test: `compute/tests/test_backfill.py`

- [ ] **Step 1: Create `compute/app/db.py` (asyncpg pool)**

```python
import asyncpg
from .config import settings

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=4)
    return _pool
```

- [ ] **Step 2: Create `compute/app/jobs/backfill.py` (pure hash + upsert logic)**

```python
from __future__ import annotations
import hashlib


def content_hash(text: str) -> str:
    """Stable hash used to skip re-embedding unchanged content."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


async def upsert_embedding(pool, entity_type: str, entity_id: str, text: str, embedder) -> bool:
    """Embed + upsert one entity. Returns True if (re)embedded, False if unchanged."""
    h = content_hash(text)
    async with pool.acquire() as conn:
        existing = await conn.fetchval(
            "SELECT content_hash FROM embeddings WHERE entity_type=$1 AND entity_id=$2",
            entity_type, entity_id,
        )
        if existing == h:
            return False
        vector = embedder.encode([text])[0]
        vec_literal = "[" + ",".join(str(x) for x in vector) + "]"
        await conn.execute(
            """
            INSERT INTO embeddings (entity_type, entity_id, content_hash, embedding, model, updated_at)
            VALUES ($1, $2, $3, $4::vector, $5, now())
            ON CONFLICT (entity_type, entity_id) DO UPDATE SET
              content_hash = EXCLUDED.content_hash,
              embedding = EXCLUDED.embedding,
              model = EXCLUDED.model,
              updated_at = now()
            """,
            entity_type, entity_id, h, vec_literal, embedder.model_name,
        )
        return True
```

- [ ] **Step 3: Create `compute/app/jobs/scheduler.py`**

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()


def start_scheduler(app):
    """Register periodic jobs. Source-row selection is added per-wave;
    for Wave 1 the scheduler is wired but registers no heavy job yet."""
    if not scheduler.running:
        scheduler.start()
    return scheduler
```

- [ ] **Step 4: Add the internal backfill trigger to `compute/app/routers/embed.py`**

Append to that file:

```python
class BackfillItem(BaseModel):
    entity_type: str
    entity_id: str
    text: str


class BackfillRequest(BaseModel):
    items: list[BackfillItem] = Field(..., min_length=1, max_length=512)


@router.post("/embed/backfill")
async def embed_backfill(req: BackfillRequest, request: Request) -> dict:
    from ..db import get_pool
    from ..jobs.backfill import upsert_embedding

    embedder = getattr(request.app.state, "embedder", None)
    if embedder is None:
        raise HTTPException(status_code=503, detail="model not loaded")
    pool = await get_pool()
    changed = 0
    for item in req.items:
        if await upsert_embedding(pool, item.entity_type, item.entity_id, item.text, embedder):
            changed += 1
    return {"processed": len(req.items), "changed": changed}
```

- [ ] **Step 5: Start the scheduler in `compute/app/main.py` lifespan**

In the lifespan function, after `app.state.embedder = Embedder(...)`, add:

```python
    from .jobs.scheduler import start_scheduler
    start_scheduler(app)
```

- [ ] **Step 6: Write the test** - `compute/tests/test_backfill.py` (pure hash, no DB)

```python
from app.jobs.backfill import content_hash


def test_content_hash_is_stable_and_distinct():
    assert content_hash("abc") == content_hash("abc")
    assert content_hash("abc") != content_hash("abd")
    assert len(content_hash("abc")) == 64
```

- [ ] **Step 7: Run tests**

Run: `cd compute && PYTHONPATH=. pytest tests/test_backfill.py -v`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add compute/app compute/tests/test_backfill.py
git commit -m "feat(compute): embedding backfill (hash-idempotent upsert) + scheduler wiring

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Deploy runbook, keep-warm pinger, apply migrations, flip the flag

**Files:**

- Create: `docs/runbooks/hf-space-deploy.md`
- Create: `.github/workflows/compute-ping.yml`
- Apply: migrations to Neon
- Modify: `config/flags.ts` (`computeEnabled: true`) - only after the Space is verified

- [ ] **Step 1: Create `docs/runbooks/hf-space-deploy.md`**

```md
# Deploy the compute service to a HuggingFace Docker Space

1. Create a free HF account (no card). https://huggingface.co/join
2. New Space → SDK: **Docker** → name e.g. `kairoo-compute` → **Public** (free CPU).
3. Push the `compute/` directory to the Space repo:
   git clone https://huggingface.co/spaces/<user>/kairoo-compute
   copy the repo's compute/\* into it, commit, push.
   (Or use the Space web "Files" upload.)
4. Space → Settings → **Variables and secrets**, add:
   - COMPUTE_SHARED_SECRET (a long random string)
   - DATABASE_URL (the Neon connection string)
   - MODEL_NAME BAAI/bge-small-en-v1.5
   - ALLOWED_ORIGIN https://<your-next-app-origin>
5. Space builds the Docker image and serves at https://<user>-kairoo-compute.hf.space
6. Verify: curl https://<user>-kairoo-compute.hf.space/health → {"status":"ok","model_loaded":true}
7. In the Next.js env (.env.local / host), set:
   - COMPUTE_SERVICE_URL=https://<user>-kairoo-compute.hf.space
   - COMPUTE_SHARED_SECRET=<same as the Space secret>
```

- [ ] **Step 2: Create `.github/workflows/compute-ping.yml` (keep-warm; no card)**

```yaml
name: keep-compute-warm
on:
  schedule:
    - cron: "*/10 * * * *" # every 10 minutes
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping compute /health
        run: |
          if [ -z "${{ secrets.COMPUTE_SERVICE_URL }}" ]; then
            echo "COMPUTE_SERVICE_URL not set; skipping"; exit 0
          fi
          curl -fsS "${{ secrets.COMPUTE_SERVICE_URL }}/health" || echo "ping failed (space may be waking)"
```

(Set the `COMPUTE_SERVICE_URL` repo secret in GitHub → Settings → Secrets → Actions.)

- [ ] **Step 3: Apply the migrations to Neon**

Run: `npm run db:push`
Expected: Drizzle reports the new tables (`rate_limit_buckets`, `usage_budgets`, `embeddings`) and the `vector` extension/index applied. If `db:push` cannot apply the hand-edited extension/index SQL, run those two statements once via `npx drizzle-kit studio` or `psql "$DATABASE_URL" -f data/migrations/<embeddings>.sql`.

- [ ] **Step 4: Integration smoke test (manual, after the Space is live)**

Run (replace URL/secret):

```bash
curl -fsS -X POST "$COMPUTE_SERVICE_URL/v1/embed" \
  -H "Authorization: Bearer $COMPUTE_SHARED_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"texts":["python data engineer"]}' | head -c 200
```

Expected: JSON with `"dim":384` and a 384-length vector. Then a backfill round-trip:

```bash
curl -fsS -X POST "$COMPUTE_SERVICE_URL/v1/embed/backfill" \
  -H "Authorization: Bearer $COMPUTE_SHARED_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"entity_type":"smoke","entity_id":"1","text":"hello"}]}'
```

Expected: `{"processed":1,"changed":1}`; a second identical call returns `"changed":0` (idempotent).

- [ ] **Step 5: Flip `computeEnabled` to true in `config/flags.ts`** (only after Steps 3–4 pass)

Change `computeEnabled: false` → `computeEnabled: true`.

- [ ] **Step 6: Full verification gate**

Run: `npx tsc --noEmit && npx vitest run && (cd compute && PYTHONPATH=. pytest -v)`
Expected: tsc clean; all Vitest tests pass; all pytest tests pass.

- [ ] **Step 7: Manual app-still-works check**

Run: `npm run dev` and confirm the app boots on port 1254, an existing AI feature still streams (rate-limit now hits Postgres), and no console errors. This satisfies the "don't break the app" requirement.

- [ ] **Step 8: Commit**

```bash
git add docs/runbooks/hf-space-deploy.md .github/workflows/compute-ping.yml config/flags.ts
git commit -m "feat(compute): deploy runbook + keep-warm pinger; enable computeEnabled

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Wave 1 Done - Definition of Done

- [ ] `rateLimit`/`checkBudget` enforce limits durably via Postgres (in-memory Maps gone).
- [ ] All 4 `rateLimit` callers `await`; `npx tsc --noEmit` clean.
- [ ] HF Space `/health` returns ok + `model_loaded: true`; `/v1/embed` returns 384-dim vectors.
- [ ] `services/compute/client.ts` round-trips embed with auth/timeout/retry/Zod; degrades when `computeEnabled=false` or URL unset.
- [ ] `embeddings` table + `vector` extension + HNSW index live on Neon; backfill is hash-idempotent.
- [ ] Keep-warm workflow committed.
- [ ] Existing app verified running normally (`npm run dev`).

## Out of Scope (later waves - own spec→plan→build each)

- **Wave 2:** analytics events table + scheduled rollups replacing per-request JS aggregation.
- **Wave 3:** skill/job matching engine (ESCO/O\*NET ingest + pgvector cosine + rule weighting) + wire `engines/ai/retrieval` off `noop`.
- **Wave 4:** deterministic resume parser (`pdfplumber` + `spaCy`) replacing LLM JSON extraction.
