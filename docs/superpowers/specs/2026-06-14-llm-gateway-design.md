# Kairoo LLM Gateway & Base-Prompt System - Design Doc

**Date:** 2026-06-14
**Owner:** Eshank Tyagi (eshank@matters.ai)
**Branch:** `latest`
**Status:** Design - pending review → plan → build. **Constraint: demo in ~2 days; $0 budget.**

> Kairoo's proprietary AI layer is **not the model** - it's the base prompt, per-tool prompts,
> orchestration, guardrails, and (later) curated retrieval. This builds a provider-agnostic
> **LLM gateway** so we ride free tiers (Gemini primary, free fallbacks) and swap models by
> config, plus a structured **base/system prompt** system and robust guardrails.

---

## 0. Decisions (locked)

- **Providers:** Gemini (free) is primary; gateway is provider-agnostic with an adapter
  interface + model registry + **automatic fallback chain** across free providers
  (Groq, OpenRouter, NVIDIA NIM) by env priority. Claude/OpenAI adapters exist but are
  **disabled unless a key is set**. ($0: no paid provider wired on.)
- **RAG:** define a `Retriever` interface + wire a **no-op stub** into the pipeline now;
  full RAG is a later project (no curated content yet, demo in 2 days).
- **Scope:** full robustness - base prompt, per-tool prompts, input/output guardrails,
  retries/timeouts/fallback, rate-limit + cost caps, observability, optional structured
  outputs, light eval scaffold.
- Builds on existing infra: `lib/result` (`Result/ok/err`), `lib/errors` (`AppError`…),
  `lib/logger`, `lib/observability` (`track`). Keeps the existing **coming-soon honesty gate**.

---

## 1. Architecture & file structure

```
lib/ai/
  gateway.ts          # public entry: generate(request) → Result<GenerationResult>
  types.ts            # GenerationRequest/Result, Message, ProviderAdapter, ModelTier
  models.ts           # model registry: logical tier → ordered provider/model candidates
  providers/
    index.ts          # registry: enabled adapters by env, in priority order
    gemini.ts         # live (free tier)
    openai-compat.ts  # shared OpenAI-compatible adapter (Groq, OpenRouter, NVIDIA NIM, etc.)
    anthropic.ts      # Claude adapter (disabled unless ANTHROPIC_API_KEY)
  prompts/
    base.ts           # the Kairoo base/system prompt (identity, voice, safety)
    compose.ts        # compose(system, tool, inputs, context) → messages
  guardrails/
    input.ts          # zod validation, size caps, PII/secret scrub
    output.ts         # safety checks, disclaimer enforcement, schema validation
    rateLimit.ts      # per-identity sliding-window limiter
    budget.ts         # token/cost accounting + caps
  retrieval/
    types.ts          # Retriever interface + RetrievedChunk
    noop.ts           # NoopRetriever (stub) - returns []
  evals/
    cases.ts          # golden cases per tool
    run.ts            # offline runner (npm run evals)
```

`app/api/ai/route.ts` becomes a thin controller: parse → rate-limit → call `gateway.generate` → map `Result` to HTTP. `lib/ai-tools.ts` is refactored so each tool declares a **system addendum**, a **user-prompt builder**, **model tier**, and optional **output schema** (no more lone `buildPrompt`).

---

## 2. Provider gateway

### 2.1 Adapter interface (`types.ts`)

```ts
type Message = { role: "system" | "user" | "assistant"; content: string };
type GenerationRequest = {
  messages: Message[];
  tier: ModelTier; // "fast" | "balanced" | "deep"
  maxOutputTokens?: number;
  temperature?: number;
  json?: boolean; // request structured/JSON output
  signal?: AbortSignal;
};
type GenerationResult = {
  text: string;
  provider: string;
  model: string;
  usage?: { inputTokens?: number; outputTokens?: number };
  finishReason?: string;
};
interface ProviderAdapter {
  name: string;
  isEnabled(): boolean; // based on env keys
  generate(req: GenerationRequest, model: string): Promise<GenerationResult>;
}
```

### 2.2 Model registry (`models.ts`)

Maps a **logical tier** to an ordered list of `{ provider, model }` candidates. The gateway
tries candidates in order, skipping disabled providers, falling through on error/rate-limit.
Example:

- `fast`: Gemini `gemini-2.5-flash-lite` → Groq `llama-3.1-8b-instant` → OpenRouter `:free`
- `balanced`: Gemini `gemini-2.5-flash` → Groq `llama-3.3-70b-versatile`
- `deep`: Gemini `gemini-2.5-pro` → (Claude `claude-opus-4-8` _if key set_)

### 2.3 Adapters

- **gemini.ts** - wraps `@google/genai` (already a dep). Enabled iff `GEMINI_API_KEY`.
- **openai-compat.ts** - one adapter for all OpenAI-compatible HTTP APIs; configured per
  provider via base URL + key env: Groq (`GROQ_API_KEY`), OpenRouter (`OPENROUTER_API_KEY`),
  NVIDIA NIM (`NVIDIA_API_KEY`). Enabled per key present.
- **anthropic.ts** - Claude; enabled iff `ANTHROPIC_API_KEY` (off by default). _(When
  implementing, consult the claude-api skill for correct model IDs/SDK usage.)_

### 2.4 Fallback + resilience (`gateway.ts`)

For the request's tier, iterate enabled candidates: each call gets a **timeout** (e.g. 30s
via `AbortSignal`) and up to **N retries** with exponential backoff on transient errors
(429/5xx). On exhaustion of a candidate, move to the next provider. If all fail → `err(AppError)`.
Every attempt is logged + tracked (provider, model, latency, outcome).

---

## 3. Base prompt & composition

### 3.1 Base/system prompt (`prompts/base.ts`)

A single versioned constant encoding **who Kairoo is** + the locked brand voice + safety:

- Identity: "You are Kairoo, an AI career mentor…"
- **Voice (from brand spec §3.5):** confident mentor, not hype-man; plain-spoken, specific, encouraging; name the next concrete step; no hype/superlatives.
- **Safety/guardrails in-prompt:** not professional/legal/financial/medical advice; no guaranteed outcomes; refuse disallowed requests (per Acceptable Use); don't fabricate facts; stay on career-development scope.
- Output: clean markdown, concise.
  Exported with a `BASE_PROMPT_VERSION` for eval/version tracking.

### 3.2 Composition (`prompts/compose.ts`)

`compose({ tool, inputs, context })` → `Message[]`:

1. `system` = BASE_PROMPT + tool.systemAddendum.
2. optional `system`/`user` context block from retrieval (RAG) when chunks exist.
3. `user` = tool.buildUserPrompt(inputs) (the existing per-tool prompt bodies, minus the
   "You are an X" role lines - role now lives in base + addendum).

### 3.3 Tool model refactor (`lib/ai-tools.ts`)

Extend `Tool`:

```ts
tier: ModelTier;                         // default "fast"
systemAddendum?: string;                 // tool-specific role/instructions
buildUserPrompt: (inputs) => string;     // renamed from buildPrompt
outputSchema?: ZodType;                  // optional structured output
```

Keep `status: 'coming-soon'` honesty behavior.

---

## 4. Guardrails

- **Input (`guardrails/input.ts`):** zod-validate `{toolId, inputs}`; enforce per-field and
  total input size caps; strip obvious secrets/keys; normalize. Reject → `ValidationError`.
- **Rate limit (`guardrails/rateLimit.ts`):** per-identity (IP/session) sliding window
  (e.g., 20 req / 5 min) - in-memory for now (demo), interface ready for KV/Redis later.
  Over limit → 429.
- **Budget (`guardrails/budget.ts`):** estimate/track tokens; per-request `maxOutputTokens`
  cap; a soft global daily cap (env) to protect free-tier quotas; log spend.
- **Output (`guardrails/output.ts`):** if `outputSchema`, parse+validate JSON (on failure,
  one repair retry, then fall back to markdown); strip anything resembling a system-prompt
  leak; ensure refusal path returns a clean message; never return provider error internals
  to the client.
- **Honesty:** coming-soon tools still never call a model.

---

## 5. Structured outputs

Tools may declare `outputSchema` (zod). When present, gateway requests JSON (`json:true`),
validates against the schema, and the API returns `{ data }`; otherwise returns `{ result }`
markdown (rendered by the branded `RichText`). Default for the ~20 existing tools stays
markdown; opt a few high-value ones (roadmaps, skill-gap) into schemas later.

## 6. Retrieval (stub now)

`retrieval/types.ts`: `interface Retriever { retrieve(query: string, k: number): Promise<RetrievedChunk[]> }`.
`retrieval/noop.ts`: returns `[]`. `compose.ts` injects a context block only when chunks
exist - so turning on real RAG later is a one-line swap of the retriever, no pipeline change.

## 7. Observability & errors

Every generation: `track('ai_generation', { tool, tier, provider, model, ms, inputTokens, outputTokens, ok })` via `lib/observability`; errors via `lib/logger` + `Result<…, AppError>`. The route maps `Result` to HTTP (200 / 4xx / 5xx) and never leaks stack traces.

## 8. Config (env)

`GEMINI_API_KEY` (primary), optional `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `NVIDIA_API_KEY`,
`ANTHROPIC_API_KEY`; `AI_PROVIDER_PRIORITY` (comma list to reorder), `AI_DAILY_TOKEN_CAP`.
Gateway auto-detects which adapters are enabled by which keys are set. `.env.local` documented;
nothing breaks if only `GEMINI_API_KEY` is present.

## 9. Evals (light)

`evals/cases.ts`: a few golden `{toolId, inputs, assertions}` per key tool (e.g., output is
non-empty markdown, contains required sections, no banned hype phrases, respects refusal on a
disallowed input). `npm run evals` runs them against the gateway and prints pass/fail. Not in
CI for the demo; runnable locally.

---

## 10. Phasing (demo in 2 days)

- **Phase 1 (demo-critical):** types, Gemini adapter, model registry, gateway w/ timeout+retry+fallback (Gemini only live), base prompt, compose, ai-tools refactor, input + output + rate-limit guardrails, route rewrite, observability. → A visibly better, safer, branded AI.
- **Phase 2 (right after):** openai-compat adapter (Groq/OpenRouter/NVIDIA) + real fallback across providers, budget caps, structured outputs for 1–2 tools, eval scaffold, RAG stub wiring.
  (RAG-real, Claude/OpenAI enablement = later.)

## 11. File-by-file summary

**Create:** `lib/ai/**` (as in §1). **Modify:** `app/api/ai/route.ts` (thin controller),
`lib/ai-tools.ts` (tool shape), `package.json` (`evals` script; `zod` dep if absent),
`.env.local` (documented keys). **Reuse:** `lib/result`, `lib/errors`, `lib/logger`,
`lib/observability`, `components/RichText.tsx` (renders markdown output).

## Open items (non-blocking)

- Exact free-tier model IDs per provider may drift - kept in `models.ts`, easy to edit.
- Persistent rate-limit/budget store (KV/Redis) deferred; in-memory for demo.

## Decisions log

- 2026-06-14: $0 budget → Gemini-primary free multi-provider gateway w/ fallback; Claude/OpenAI off unless keyed. RAG = interface + no-op stub (no content yet, 2-day demo). Full robustness + guardrails. Phased for demo.
- 2026-06-14: **Canonical location reconciled.** Spec/plan originally referenced `lib/ai/`; the codebase had since adopted the `engines/`/`services/` architecture, so Phase 1 was relocated: pure model capability (gateway, providers, prompts, compose, retrieval, output guardrail) lives in **`engines/ai/`** (single entrypoint `engines/ai/generate.ts` → `engines/ai/gateway.ts`); per-request policy (rate limit, request validation) lives in **`services/ai/`**; the route uses both. `lib/ai/` removed. Wherever this doc says `lib/ai/…`, read `engines/ai/…` (and policy in `services/ai/…`).
