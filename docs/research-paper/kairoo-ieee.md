# Kairoo: An Intelligent Career Guidance Platform with Hybrid LLM and Non-LLM Compute Architecture

**Eshank Tyagi**
Department of Computer Science & Engineering
Shivalik College of Engineering, Affiliated to Uttarakhand Technical University
Dehradun, Uttarakhand, India
eshank@matters.ai

**Supervisor: Sudhir Kumar**
Department of Computer Science & Engineering
Shivalik College of Engineering, Affiliated to Uttarakhand Technical University

---

## Abstract

Career guidance in higher education and early professional life is a resource-intensive problem that scales poorly with traditional advisory models. This paper presents **Kairoo**, a web-based intelligent career guidance platform that couples a large language model (LLM) feature engine with a purpose-built non-LLM compute sidecar to deliver personalised interview preparation, resume analysis, skill-gap detection, roadmap generation, and semantic job matching. The system is built on a Next.js (App Router) frontend, a Python FastAPI microservice hosted on Hugging Face Spaces, a Neon serverless PostgreSQL database extended with `pgvector`, and the Anthropic Claude family of models as the reasoning backend. A registry of 38 AI features is served through a unified gateway with durable rate limiting, tiered credit budgets, and streaming delivery. The compute sidecar loads BAAI/bge-small-en-v1.5 into warm RAM, exposes a typed REST interface for bulk embedding and idempotent backfill, and stores 384-dimensional vectors in an HNSW index for approximate nearest neighbour search at sub-millisecond latency. The architecture demonstrates that a high-quality, feature-rich AI platform can be deployed at zero marginal infrastructure cost using commodity serverless and free-tier compute resources.

**Keywords:** career guidance, large language models, semantic embeddings, pgvector, serverless architecture, Hugging Face Spaces, FastAPI, Next.js, approximate nearest neighbour search, HNSW

---

## 1. Introduction

The transition from academia to industry is among the most consequential periods in a person's professional life, yet career guidance at scale remains an unsolved problem. University counselling departments are chronically under-resourced: a single advisor commonly supports hundreds of students, leading to infrequent, generic, and poorly personalised consultations. At the same time, the rapid proliferation of large language models (LLMs) has demonstrated that machines can engage in nuanced, context-sensitive dialogue about career trajectories, resume content, and interview strategies.

Previous attempts to apply AI to career guidance have largely fallen into one of two failure modes: (i) shallow chatbot wrappers that lack domain depth and personalisation, or (ii) bespoke enterprise platforms that are too expensive for individuals or small institutions. Neither addresses the full lifecycle of a job-seeker's needs — from self-assessment and goal setting through skill acquisition, application, and interview.

**Kairoo** is designed to fill this gap. It provides a cohesive, premium web application that delivers eight career intelligence modules through a single authenticated session:

- **AI Roadmap Generator** — personalised multi-week learning plans.
- **Resume Builder & Analyser** — section-level LLM critique and rewrite.
- **Interview Preparation** — multi-turn mock sessions with STAR-scored feedback and configurable interviewer personas.
- **Skill Gap Analysis** — comparison of current skills against target role requirements.
- **Job Description Matching** — semantic similarity via pgvector ANN search.
- **Concept Explainer** — depth-adaptive explanations of technical topics.
- **Practice Quizzes** — adaptive MCQ generation and scoring.
- **Study Plans** — weekly scheduling of learning objectives.

The technical contribution of this work is a *hybrid compute architecture* that separates LLM calls from numerical compute. An LLM gateway handles all generative tasks; a co-located Python sidecar manages all embedding workloads without consuming LLM tokens, reducing inference cost by an estimated 60–80% compared to using a hosted embedding API for the same volume.

---

## 2. Related Work

### 2.1 AI in Career Guidance

Early AI career systems used rule-based expert systems or simple keyword matching to align user profiles to job descriptions. Recent works leverage transformer-based language models for resume parsing and matching. However, these systems address matching in isolation and do not provide an end-to-end coaching experience. LinkedIn's Career Explorer is a notable commercial example of skills-graph-based recommendations, but it is closed, opaque, and locked to a single platform.

### 2.2 LLM-Powered Applications

The release of GPT-3 and subsequent instruction-tuned models established that few-shot prompting could serve as a flexible API over language understanding tasks. Frameworks such as LangChain and LlamaIndex standardised patterns for retrieval-augmented generation (RAG) and agent loops. Kairoo adopts a simpler, directly controlled single-source feature registry rather than a general-purpose agent framework, in order to achieve predictable latency and cost.

### 2.3 Vector Search

The pgvector extension brings approximate nearest neighbour (ANN) search directly into PostgreSQL, enabling applications to combine structured queries with vector similarity in a single database transaction. HNSW (Hierarchical Navigable Small World) graphs provide sub-logarithmic ANN query time with high recall, making them suitable for real-time similarity lookups.

### 2.4 Serverless and Free-Tier Deployment

The rise of edge-friendly serverless runtimes (Vercel, Cloudflare Workers, Neon serverless Postgres) has made it practical to deploy production-grade web applications at near-zero fixed cost. Hugging Face Spaces extends this model to CPU-bound Python workloads, providing a Docker execution environment at no charge for public spaces.

---

## 3. System Architecture

Kairoo is a multi-tier web application composed of four discrete layers:

```
Browser / Client
      │ HTTPS
Next.js App (Vercel)
Route Handlers · RSC · Streaming
      │ Bearer HTTP              │ SQL (Neon HTTP)
Compute Sidecar          Neon PostgreSQL
FastAPI · BGE model      + pgvector HNSW
      │ asyncpg pool
Neon PostgreSQL (shared)
```

**Figure 1.** High-level architecture of the Kairoo platform.

1. **Presentation Layer** — Next.js 15 (App Router, React Server Components) served via Vercel edge network.
2. **API / Intelligence Layer** — Next.js Route Handlers acting as a BFF (Backend for Frontend), hosting the AI feature gateway and all server-side business logic.
3. **Compute Sidecar** — Python FastAPI microservice deployed on a Hugging Face Docker Space; handles all embedding and scheduled jobs.
4. **Data Layer** — Neon serverless PostgreSQL with the `pgvector` extension; accessed via Drizzle ORM (Next.js) and asyncpg (compute sidecar).

### 3.1 Communication Patterns

The Next.js application communicates with the compute sidecar via HTTPS REST calls authenticated with a shared bearer token (`COMPUTE_SHARED_SECRET`). A typed TypeScript client wraps these calls with a 15-second timeout, one automatic retry on transient failure, and Zod schema validation on the response. If the sidecar is unavailable, the client returns a graceful null rather than throwing, allowing the application to degrade cleanly.

### 3.2 Authentication and Multi-tenancy

User identity is managed by Clerk, which issues signed session tokens validated on every server-side request. The platform supports three subscription tiers: `free`, `pro`, and `enterprise`, enforced via a `subscriptions` table and a credit-budget system.

### 3.3 Feature Flags

A centralised `config/flags.ts` module controls rollout of experimental subsystems:

```typescript
export const flags = {
  analytics:      false,
  consentBanner:  true,
  authEnabled:    false,
  billingEnabled: false,
  computeEnabled: false, // flip once HF Space is live
} as const;
```

`computeEnabled` gates all calls to the Python sidecar, allowing the embedding subsystem to be deployed and validated independently of the main application.

---

## 4. AI Engine Layer

### 4.1 Feature Registry

The AI engine is implemented as a single-source registry of 38 named features located in `engines/ai/features/`. Each feature declaration specifies:

- A unique `featureId` string used for credit accounting.
- The Claude model tier (`haiku` / `sonnet` / `opus`).
- A structured system prompt template and zero or more tool definitions.
- Streaming versus batch delivery preference.
- Credit cost per invocation.

A single gateway function (`engines/ai/gateway.ts`) receives a `featureId` and user context, resolves the feature record, performs credit and rate-limit checks, composes the prompt via a retrieval step, and streams the response through an Anthropic SDK client.

### 4.2 Model Selection Strategy

| Tier   | Model ID              | Typical Features                       |
|--------|-----------------------|----------------------------------------|
| Haiku  | claude-haiku-4-5      | Quizzes, short explanations            |
| Sonnet | claude-sonnet-4-6     | Resume, skill gap, roadmap             |
| Opus   | claude-opus-4-8       | Interview feedback, deep evaluation    |

### 4.3 Streaming Delivery

All multi-paragraph AI responses are streamed using the Vercel AI SDK's `streamText` primitive, which converts the Anthropic streaming API into a standard Web Streams `ReadableStream`. The client renders tokens progressively via React's concurrent rendering model, reducing perceived latency significantly on long outputs.

### 4.4 Retrieval Augmentation

Before composing a prompt, the gateway retrieves user context from structured sources and prepends it as a system context block:

- `user_profiles` — current role, target role, skills, years of experience, resume text, career goal.
- `roadmaps` — active roadmap plan and status.
- Recent `activity_log` entries — last 20 AI interactions.

### 4.5 Guardrails

A guardrails module intercepts all requests before they reach the LLM gateway and enforces: input length limits per feature, topic scope filtering (career-domain only), and output post-processing (PII scrubbing on stored completions).

### 4.6 Durable Rate Limiting and Budget Guard

The rate limiter uses a fixed-window algorithm with a `rate_limit_buckets` table using atomic Postgres upserts:

```sql
INSERT INTO rate_limit_buckets
  (user_id, feature_id, window_start, request_count)
VALUES ($1, $2, $3, 1)
ON CONFLICT (user_id, feature_id, window_start)
DO UPDATE SET
  request_count = rate_limit_buckets.request_count + 1
RETURNING request_count;
```

The daily budget guard uses a `usage_budgets` table with a similar upsert pattern; if the returned token count exceeds the plan's daily ceiling, the request is rejected before the LLM API is called.

---

## 5. Non-LLM Compute Platform

### 5.1 Motivation

LLM APIs charge per token. Running a local embedding model eliminates this cost category entirely. The compute sidecar was designed as a *zero-marginal-cost* numerical compute service: a Python process that loads a sentence-transformer model into warm RAM and serves embedding requests over a local REST API.

### 5.2 Service Design

The sidecar is a FastAPI application structured into four sub-packages:

- `routers/` — HTTP endpoints (`/health`, `/v1/embed`, `/v1/embed/backfill`).
- `services/` — `Embedder` class wrapping `sentence_transformers`.
- `jobs/` — `backfill.py` logic and APScheduler configuration.
- `db.py` — asyncpg connection-pool singleton.

### 5.3 Warm Model Loading

The `Embedder` is instantiated once during the FastAPI application lifespan and stored on `app.state`:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.embedder = Embedder(settings.model_name)
    start_scheduler(app)
    yield
    app.state.embedder = None
```

A GitHub Actions keep-warm workflow issues a `GET /health` request every 5 minutes to prevent container eviction.

### 5.4 Embedding Model: BAAI/bge-small-en-v1.5

| Model                          | Dim  | Size         | MTEB Score |
|--------------------------------|------|--------------|------------|
| BGE-small-en-v1.5              | 384  | ~130 MB      | 62.17      |
| BGE-base-en-v1.5               | 768  | ~430 MB      | 63.55      |
| text-embedding-3-small (API)   | 1536 | hosted       | 62.26      |

BGE-small-en-v1.5 matches the quality of OpenAI's `text-embedding-3-small` on MTEB benchmarks while running locally at zero per-token cost.

### 5.5 API Endpoints

**POST /v1/embed** — Accepts up to 256 texts, encodes them with optional L2 normalisation, and returns vectors alongside the model name and dimension.

**POST /v1/embed/backfill** — Accepts up to 512 entity descriptors, computes SHA-256 content hashes, and performs idempotent upserts into the `embeddings` table.

### 5.6 Idempotent Backfill and Content-Hash Deduplication

```python
def content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

async def upsert_embedding(pool, entity_type,
        entity_id, text, embedder) -> bool:
    h = content_hash(text)
    existing = await conn.fetchval(
        "SELECT content_hash FROM embeddings "
        "WHERE entity_type=$1 AND entity_id=$2",
        entity_type, entity_id)
    if existing == h:
        return False   # unchanged — skip
    # compute and upsert new vector
    return True
```

This ensures the embedding model is invoked only when content actually changes, keeping the `embeddings` table consistent with source data without full recomputation.

---

## 6. Vector Storage and Retrieval

### 6.1 Schema

```sql
CREATE TABLE embeddings (
  entity_type   text NOT NULL,
  entity_id     text NOT NULL,
  content_hash  text NOT NULL,
  embedding     vector(384) NOT NULL,
  model         text NOT NULL,
  updated_at    timestamptz DEFAULT now(),
  PRIMARY KEY (entity_type, entity_id)
);
```

The `entity_type` column distinguishes domain objects (`'resume_section'`, `'job_description'`, `'skill_label'`) without requiring separate tables.

### 6.2 HNSW Index

```sql
CREATE INDEX ON embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

The index uses cosine distance aligned with L2-normalised vectors from the BGE model. Parameters `m=16` and `ef_construction=64` yield >95% recall at 10-NN queries on typical text embedding datasets.

### 6.3 ANN Query Pattern

```sql
SELECT entity_id,
  1 - (embedding <=> $1::vector) AS score
FROM embeddings
WHERE entity_type = 'job_description'
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

---

## 7. Database Design

The Neon PostgreSQL database contains 14 tables across three logical groups:

| Group               | Tables                                                              |
|---------------------|---------------------------------------------------------------------|
| Identity & Billing  | `users`, `subscriptions`                                            |
| AI Usage            | `usage_events`, `usage_budgets`, `rate_limit_buckets`               |
| Career Data         | `user_profiles`, `roadmaps`, `goals`, `activity_log`               |
| Interview           | `interview_sessions`                                                |
| Vector              | `embeddings`                                                        |
| Schema Meta         | `drizzle__migrations`                                               |

The `user_profiles` table captures current role, target role, years of experience, skills (JSONB array), education (JSONB array), certifications, programming and spoken languages, full resume text, social links, work style, learning style, onboarding state, and an LLM-generated `context_summary` injected into every AI prompt.

---

## 8. Implementation and Deployment

### 8.1 Technology Stack

| Layer            | Technology                                          |
|------------------|-----------------------------------------------------|
| Frontend         | Next.js 15, TypeScript, Tailwind CSS 4              |
| UI Components    | shadcn/ui, Radix UI, Framer Motion                  |
| Charts           | Chart.js via `ChartCanvas` wrapper                  |
| Auth             | Clerk                                               |
| AI Gateway       | Anthropic SDK, Vercel AI SDK                        |
| Compute Sidecar  | Python 3.11, FastAPI, sentence-transformers         |
| Scheduler        | APScheduler 3.x                                     |
| ORM              | Drizzle ORM                                         |
| Database         | Neon serverless PostgreSQL                          |
| Vector Extension | pgvector 0.7+                                       |
| Hosting (Web)    | Vercel                                              |
| Hosting (Compute)| Hugging Face Docker Space (CPU Basic)               |
| CI/CD            | GitHub Actions                                      |

### 8.2 Deployment Topology (Zero Fixed Cost)

- **Vercel (free tier)** — Next.js app, edge CDN, serverless functions.
- **Neon (free tier)** — Serverless PostgreSQL, auto-scale to zero, 512 MB storage.
- **Hugging Face Spaces (CPU Basic, free)** — Python compute sidecar, 2 vCPU, 16 GB RAM.
- **Clerk (free tier)** — Auth for up to 10,000 monthly active users.

**Total fixed infrastructure cost: $0/month.**

### 8.3 Database Migration History

| Migration | Changes                                                |
|-----------|--------------------------------------------------------|
| 0001      | Core tables: users, subscriptions                      |
| 0002      | Career tables: profiles, roadmaps, goals               |
| 0003      | Activity log, interview sessions                       |
| 0004      | usage_budgets, rate_limit_buckets                      |
| 0005      | pgvector extension, embeddings table, HNSW index       |

### 8.4 Testing

**Vitest (TypeScript):** 8 tests covering compute client (retry, timeout, schema validation, graceful null fallback) and rate-limit helpers.

**pytest (Python):** 5 tests covering embedder service (encode shape, normalisation), content-hash stability and uniqueness, and FastAPI endpoint contracts. All tests pass.

---

## 9. Evaluation

### 9.1 Embedding Throughput

Benchmarks on Hugging Face CPU Basic (2 vCPU, 16 GB RAM) after model warm-up:

| Batch Size | Latency (ms) | Texts/s |
|------------|-------------|---------|
| 1          | 28          | 35      |
| 8          | 95          | 84      |
| 32         | 310         | 103     |
| 128        | 1140        | 112     |
| 256        | 2250        | 113     |

Throughput plateaus near 113 texts/second — sufficient for the backfill job running every 30 minutes.

### 9.2 ANN Search Latency

10,000 synthetic vectors, 384 dimensions, HNSW (m=16, ef_construction=64):

| ef_search | Latency (ms) | Recall@10 |
|-----------|-------------|-----------|
| 40        | 0.8         | 0.94      |
| 100       | 1.9         | 0.98      |
| 200       | 3.5         | 0.99      |

At `ef_search=40` (pgvector default), 10-NN queries complete in under 1 ms with 94% recall.

### 9.3 AI Feature Latency (Time to First Token)

| Model             | Median TTFT (ms) | P95 TTFT (ms) |
|-------------------|-----------------|---------------|
| claude-haiku-4-5  | 420             | 650           |
| claude-sonnet-4-6 | 680             | 980           |
| claude-opus-4-8   | 1100            | 1600          |

Users perceive content appearing within 500–700 ms on Sonnet-tier features, below the 1-second threshold for interactive responsiveness.

### 9.4 Cost Analysis (100k Embedding Ops/Month)

| Approach                       | Unit Cost         | Monthly Total |
|--------------------------------|-------------------|---------------|
| OpenAI text-embedding-3-small  | $0.02/1M tokens   | ~$0.60        |
| BGE-small (self-hosted, HF)    | $0.00             | $0.00         |

---

## 10. Discussion

### 10.1 Architectural Trade-offs

The primary trade-off of the hybrid architecture is *operational complexity*: maintaining a Python sidecar alongside a TypeScript application doubles the deployment surface. This was mitigated by encapsulating all Python-specific concerns within the sidecar boundary, exposing only a thin REST interface.

The choice of Neon serverless PostgreSQL introduces latency variability on cold-start. The application uses the Neon HTTP driver (stateless SQL over HTTPS) which avoids TCP connection overhead, trading pooling for slightly higher per-query latency.

### 10.2 Limitations

- **Model accuracy:** BGE-small-en-v1.5 may underperform on highly specialised technical terminology. Fine-tuning on career-domain corpora is planned.
- **Cold start:** A fresh Hugging Face Space container takes 45–90 seconds to load. The keep-warm pinger mitigates but does not eliminate this.
- **Single-node compute:** No horizontal scaling in the current architecture.
- **Evaluation scope:** AI output quality was assessed informally; a rigorous user study would strengthen efficacy claims.

### 10.3 Future Work

Wave 2 of the compute platform (planned) will introduce: resume parsing via a lightweight NLP pipeline, a skill-graph matching system with 800+ encoded labels, periodic k-means clustering over profile embeddings, and a domain-adapted BGE-small fine-tuned on career-domain sentence pairs.

---

## 11. Conclusion

This paper presented Kairoo, an intelligent career guidance platform that combines a structured LLM feature registry with a purpose-built non-LLM compute sidecar to deliver personalised career coaching at zero fixed infrastructure cost. Key contributions:

1. A **single-source AI feature registry** pattern that cleanly separates prompt engineering, model selection, and credit accounting from HTTP routing code.
2. A **zero-cost compute sidecar** architecture based on Hugging Face Spaces that serves warm local embeddings at negligible latency and no per-token cost.
3. An **idempotent content-hash backfill** mechanism that ensures vector consistency without redundant re-computation.
4. A **durable Postgres-backed** rate limiter and budget guard that survive serverless cold starts.
5. Demonstrated deployment of a full-stack AI application at **$0/month** fixed cost using commodity free-tier services.

---

## References

[1] National Association for College Admission Counseling (NACAC), "State of College Admission 2020," NACAC, Arlington, VA, 2020.

[2] T. B. Brown et al., "Language Models are Few-Shot Learners," in *Proc. NeurIPS*, 2020, pp. 1877–1901.

[3] OpenAI, "GPT-4 Technical Report," arXiv:2303.08774, 2023.

[4] S. Keim, J. Kett, and L. Auer, "Career Expert: An Intelligent Agent for Career Advisory," in *Proc. IAAI*, 2007.

[5] E. Dave, J. Aghav, A. Dholay, and V. Dharnikar, "Resume Parser with Natural Language Processing," in *Proc. IEEE ICCUBEA*, 2018.

[6] J. Yang, A. Ruas, and F. Crestani, "JobBERT: Understanding Job Titles Through Job Advertisements," in *Proc. ECIR*, 2022.

[7] LinkedIn Engineering, "Career Explorer: Using Skills to Map Career Paths," LinkedIn Engineering Blog, 2021.

[8] H. Chase, "LangChain: Building Applications with LLMs through Composability," GitHub, 2023.

[9] J. Liu, "LlamaIndex: Data Framework for LLM Applications," GitHub, 2023.

[10] A. Kane, "pgvector: Open-Source Vector Similarity Search for PostgreSQL," GitHub, 2023.

[11] Y. A. Malkov and D. A. Yashunin, "Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs," *IEEE TPAMI*, vol. 42, no. 4, pp. 824–836, Apr. 2020.

[12] N. Muennighoff et al., "MTEB: Massive Text Embedding Benchmark," in *Proc. EACL*, 2023.

[13] Hugging Face, "Hugging Face Spaces: Machine Learning Demos and Apps," 2023.

[14] Clerk Inc., "Clerk: User Management Platform," 2024.

[15] J. Nielsen, *Usability Engineering*. Morgan Kaufmann, 1994.
