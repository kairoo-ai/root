# Kairoo LLM Gateway — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use `- [ ]`.

**Goal:** Provider-agnostic LLM gateway (Gemini-primary, free fallbacks ready) with a Kairoo base/system prompt, per-tool prompts, and full guardrails — replacing the hardwired Gemini call in `app/api/ai/route.ts`.

**Architecture:** `lib/ai/` holds types, a model registry, provider adapters (Gemini live; OpenAI-compatible for Groq/OpenRouter/NVIDIA; Anthropic off-by-default), a base prompt + composer, guardrails (input/output/rate-limit/budget), a no-op retriever stub, and the `gateway.generate()` entry returning `Result`. The route becomes a thin controller. `lib/ai-tools.ts` tools gain `tier`, `systemAddendum`, `buildUserPrompt`, optional `outputSchema`.

**Tech Stack:** Next.js 16 route handlers, TypeScript, `@google/genai` (dep), `zod` (validation), existing `lib/result|errors|logger|observability`.

**Source of truth:** `docs/superpowers/specs/2026-06-14-llm-gateway-design.md`.

**ENVIRONMENT:** prefix node/npm/npx with `export PATH="/opt/homebrew/bin:$PATH"`; verify `npx tsc --noEmit && npm run build && npm run lint:colors`; never `npm run dev`. Branch `latest`.

**Testing note:** no unit runner; verify per task with tsc + build. The route keeps the existing coming-soon honesty gate. Commit per task.

---

## PHASE 1 — demo-critical

## Task 1: Types + model registry
**Files:** Create `lib/ai/types.ts`, `lib/ai/models.ts`

- [ ] **Step 1: `lib/ai/types.ts`**
```ts
export type ModelTier = "fast" | "balanced" | "deep";
export type Message = { role: "system" | "user" | "assistant"; content: string };

export type GenerationRequest = {
  messages: Message[];
  tier: ModelTier;
  maxOutputTokens?: number;
  temperature?: number;
  json?: boolean;
  signal?: AbortSignal;
};

export type GenerationResult = {
  text: string;
  provider: string;
  model: string;
  usage?: { inputTokens?: number; outputTokens?: number };
  finishReason?: string;
};

export interface ProviderAdapter {
  readonly name: string;
  isEnabled(): boolean;
  generate(req: GenerationRequest, model: string): Promise<GenerationResult>;
}

export type ModelCandidate = { provider: string; model: string };
```

- [ ] **Step 2: `lib/ai/models.ts`**
```ts
import type { ModelTier, ModelCandidate } from "./types";

// Ordered candidates per tier. Gateway skips disabled providers and falls through on error.
export const MODEL_TIERS: Record<ModelTier, ModelCandidate[]> = {
  fast: [
    { provider: "gemini", model: "gemini-2.5-flash-lite" },
    { provider: "groq", model: "llama-3.1-8b-instant" },
    { provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct:free" },
  ],
  balanced: [
    { provider: "gemini", model: "gemini-2.5-flash" },
    { provider: "groq", model: "llama-3.3-70b-versatile" },
  ],
  deep: [
    { provider: "gemini", model: "gemini-2.5-pro" },
    { provider: "anthropic", model: "claude-opus-4-8" },
  ],
};
```

- [ ] **Step 3: Verify + commit**
`export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit` → clean.
```bash
git add lib/ai/types.ts lib/ai/models.ts
git commit -m "feat(ai): gateway types + model tier registry"
```

---

## Task 2: Gemini adapter
**Files:** Create `lib/ai/providers/gemini.ts`

- [ ] **Step 1: Write the adapter** (wraps `@google/genai`, mirrors current route usage)
```ts
import { GoogleGenAI } from "@google/genai";
import type { ProviderAdapter, GenerationRequest, GenerationResult } from "../types";

const key = process.env.GEMINI_API_KEY;
const client = key ? new GoogleGenAI({ apiKey: key }) : null;

export const geminiAdapter: ProviderAdapter = {
  name: "gemini",
  isEnabled: () => client !== null,
  async generate(req: GenerationRequest, model: string): Promise<GenerationResult> {
    if (!client) throw new Error("Gemini not configured");
    const system = req.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const contents = req.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
    const res = await client.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: system || undefined,
        temperature: req.temperature ?? 0.8,
        maxOutputTokens: req.maxOutputTokens ?? 2048,
        responseMimeType: req.json ? "application/json" : undefined,
        abortSignal: req.signal,
      },
    });
    const raw = (res as { text?: string | (() => string) }).text;
    const text = typeof raw === "function" ? raw() : raw ?? "";
    const usage = (res as { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } }).usageMetadata;
    return {
      text, provider: "gemini", model,
      usage: { inputTokens: usage?.promptTokenCount, outputTokens: usage?.candidatesTokenCount },
    };
  },
};
```
> If `abortSignal` isn't accepted by the installed `@google/genai` config type, drop it from `config` and keep the timeout at the gateway level (Promise.race). Verify via tsc.

- [ ] **Step 2: Verify + commit**
`npx tsc --noEmit` → clean.
```bash
git add lib/ai/providers/gemini.ts
git commit -m "feat(ai): Gemini provider adapter"
```

---

## Task 3: Provider registry
**Files:** Create `lib/ai/providers/index.ts`

- [ ] **Step 1: Write the registry** (enabled adapters, env-priority order; only Gemini live in Phase 1)
```ts
import type { ProviderAdapter } from "../types";
import { geminiAdapter } from "./gemini";

// Phase 1: Gemini only. Phase 2 adds groq/openrouter/nvidia (openai-compat) + anthropic.
const ALL: ProviderAdapter[] = [geminiAdapter];

export function enabledProviders(): ProviderAdapter[] {
  const priority = (process.env.AI_PROVIDER_PRIORITY ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const enabled = ALL.filter((p) => p.isEnabled());
  if (!priority.length) return enabled;
  return [...enabled].sort((a, b) => {
    const ia = priority.indexOf(a.name), ib = priority.indexOf(b.name);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

export function getProvider(name: string): ProviderAdapter | undefined {
  return ALL.find((p) => p.name === name && p.isEnabled());
}
```

- [ ] **Step 2: Verify + commit**
```bash
git add lib/ai/providers/index.ts
git commit -m "feat(ai): provider registry with env priority"
```

---

## Task 4: Base prompt + composer + retriever stub
**Files:** Create `lib/ai/prompts/base.ts`, `lib/ai/prompts/compose.ts`, `lib/ai/retrieval/types.ts`, `lib/ai/retrieval/noop.ts`

- [ ] **Step 1: `lib/ai/prompts/base.ts`** (Kairoo identity + locked brand voice + safety)
```ts
export const BASE_PROMPT_VERSION = "2026-06-14.1";

export const BASE_PROMPT = `You are Kairoo, an AI career mentor that helps people grow — from students and job seekers to working professionals and teams.

Voice: a confident mentor, not a hype-man. Be plain-spoken, specific, and encouraging. Name the next concrete step instead of promising the world. No hype, no exclamation-spam, no vague superlatives, and never call yourself "AI-powered" as a brag.

Rules:
- You provide guidance, not professional, legal, financial, or medical advice, and you never guarantee outcomes (jobs, raises, results).
- Do not fabricate facts, statistics, employers, or sources. If unsure, say so.
- Stay within career development, learning, and professional growth. Politely decline unrelated or disallowed requests.
- Keep a human in the loop: frame output as suggestions the person should review.

Format: respond in clean, concise Markdown. Use headings and lists where they help; avoid filler.`;
```

- [ ] **Step 2: `lib/ai/retrieval/types.ts`**
```ts
export type RetrievedChunk = { text: string; source?: string; score?: number };
export interface Retriever {
  retrieve(query: string, k?: number): Promise<RetrievedChunk[]>;
}
```

- [ ] **Step 3: `lib/ai/retrieval/noop.ts`**
```ts
import type { Retriever } from "./types";
export const noopRetriever: Retriever = { async retrieve() { return []; } };
```

- [ ] **Step 4: `lib/ai/prompts/compose.ts`**
```ts
import type { Message } from "../types";
import { BASE_PROMPT } from "./base";
import type { RetrievedChunk } from "../retrieval/types";

export function compose(opts: {
  systemAddendum?: string;
  userPrompt: string;
  context?: RetrievedChunk[];
}): Message[] {
  const system = [BASE_PROMPT, opts.systemAddendum].filter(Boolean).join("\n\n");
  const messages: Message[] = [{ role: "system", content: system }];
  if (opts.context && opts.context.length) {
    const ctx = opts.context.map((c, i) => `[${i + 1}] ${c.text}`).join("\n\n");
    messages.push({ role: "system", content: `Relevant context:\n${ctx}` });
  }
  messages.push({ role: "user", content: opts.userPrompt });
  return messages;
}
```

- [ ] **Step 5: Verify + commit**
`npx tsc --noEmit` → clean.
```bash
git add lib/ai/prompts lib/ai/retrieval
git commit -m "feat(ai): Kairoo base prompt, composer, retriever stub"
```

---

## Task 5: Guardrails — input, rate-limit, output
**Files:** Create `lib/ai/guardrails/input.ts`, `rateLimit.ts`, `output.ts`. Ensure `zod` is installed.

- [ ] **Step 1: Install zod if missing**
`export PATH="/opt/homebrew/bin:$PATH" && (npm ls zod >/dev/null 2>&1 || npm i zod)`

- [ ] **Step 2: `lib/ai/guardrails/input.ts`**
```ts
import { z } from "zod";

const MAX_FIELD = 4000;
const MAX_TOTAL = 12000;

export const requestSchema = z.object({
  toolId: z.string().min(1).max(64),
  inputs: z.record(z.string(), z.string().max(MAX_FIELD)).default({}),
});

export type ParsedRequest = z.infer<typeof requestSchema>;

export function validateInput(body: unknown): { ok: true; value: ParsedRequest } | { ok: false; message: string } {
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return { ok: false, message: "Invalid request." };
  const total = Object.values(parsed.data.inputs).join("").length;
  if (total > MAX_TOTAL) return { ok: false, message: "Input too large." };
  return { ok: true, value: parsed.data };
}
```

- [ ] **Step 3: `lib/ai/guardrails/rateLimit.ts`** (in-memory sliding window)
```ts
const WINDOW_MS = 5 * 60_000;
const MAX_REQ = 20;
const hits = new Map<string, number[]>();

export function rateLimit(id: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const arr = (hits.get(id) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_REQ) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - arr[0])) / 1000);
    hits.set(id, arr);
    return { ok: false, retryAfter };
  }
  arr.push(now);
  hits.set(id, arr);
  return { ok: true };
}
```

- [ ] **Step 4: `lib/ai/guardrails/output.ts`**
```ts
export function sanitizeOutput(text: string): string {
  // Defensive: drop accidental system-prompt echoes / code-fence-wrapped whole answers are fine.
  return text.replace(/^\s*(system:|SYSTEM PROMPT)[\s\S]*?\n/i, "").trim();
}

export function safeParseJson<T = unknown>(text: string): { ok: true; data: T } | { ok: false } {
  try {
    const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, "");
    return { ok: true, data: JSON.parse(cleaned) as T };
  } catch {
    return { ok: false };
  }
}
```

- [ ] **Step 5: Verify + commit**
```bash
git add lib/ai/guardrails package.json package-lock.json
git commit -m "feat(ai): input validation, rate limit, output sanitize guardrails"
```

---

## Task 6: Gateway core (timeout + retry + fallback)
**Files:** Create `lib/ai/gateway.ts`

- [ ] **Step 1: Write the gateway**
```ts
import { ok, err, type Result } from "@/lib/result";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { MODEL_TIERS } from "./models";
import { enabledProviders, getProvider } from "./providers";
import type { GenerationRequest, GenerationResult } from "./types";

const TIMEOUT_MS = 30_000;
const RETRIES = 1;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export async function generate(req: GenerationRequest): Promise<Result<GenerationResult, AppError>> {
  const candidates = MODEL_TIERS[req.tier] ?? MODEL_TIERS.fast;
  const enabled = new Set(enabledProviders().map((p) => p.name));
  const usable = candidates.filter((c) => enabled.has(c.provider));
  if (!usable.length) return err(new AppError("No AI provider configured."));

  let lastErr: unknown;
  for (const cand of usable) {
    const adapter = getProvider(cand.provider);
    if (!adapter) continue;
    for (let attempt = 0; attempt <= RETRIES; attempt++) {
      const started = Date.now();
      try {
        const res = await withTimeout(adapter.generate(req, cand.model), TIMEOUT_MS);
        logger.info?.("ai.generate.ok", { provider: cand.provider, model: cand.model, ms: Date.now() - started });
        return ok(res);
      } catch (e) {
        lastErr = e;
        logger.warn?.("ai.generate.fail", { provider: cand.provider, model: cand.model, attempt, error: String(e) });
        if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }
  }
  return err(new AppError(`All providers failed: ${String(lastErr)}`));
}
```
> If `logger` doesn't expose `.info/.warn` exactly, adapt to its actual interface (check `lib/logger`). Keep calls optional-chained.

- [ ] **Step 2: Verify + commit**
`npx tsc --noEmit` → clean.
```bash
git add lib/ai/gateway.ts
git commit -m "feat(ai): gateway with timeout, retry, provider fallback"
```

---

## Task 7: Refactor `lib/ai-tools.ts` tool shape
**Files:** Modify `lib/ai-tools.ts`

- [ ] **Step 1: Extend the `Tool` interface** — add `tier`, optional `systemAddendum`, rename `buildPrompt`→`buildUserPrompt`. To avoid touching all ~20 tools' role lines now, KEEP their existing prompt bodies as `buildUserPrompt` (rename the property only) and add `tier: 'fast'` to each tool (one-line each). Add `systemAddendum` only where a tool needs a sharper role than the base prompt (optional; can be added later). Concretely:
  - In the `Tool` interface: change `buildPrompt: (inputs: Record<string,string>) => string;` to `buildUserPrompt: (inputs: Record<string, string>) => string;` and add `tier: ModelTier;` and `systemAddendum?: string;`. Import `ModelTier` from `@/lib/ai/types`.
  - For every tool object: rename its `buildPrompt:` key to `buildUserPrompt:` and add `tier: 'fast',`.
  - The `notBuilt` placeholder: rename usage accordingly.
- [ ] **Step 2: Keep `getTool`/exports** unchanged in signature.
- [ ] **Step 3: Verify** `npx tsc --noEmit && npm run build` → success; `grep -n "buildPrompt" lib components app` → only references updated to `buildUserPrompt` (update `app/api/ai/route.ts` in Task 8).
- [ ] **Step 4: Commit**
```bash
git add lib/ai-tools.ts
git commit -m "feat(ai): tool shape — tier + systemAddendum + buildUserPrompt"
```

---

## Task 8: Rewrite the route as a thin controller
**Files:** Modify `app/api/ai/route.ts`

- [ ] **Step 1: Replace the route body**
```ts
import { NextRequest, NextResponse } from "next/server";
import { getTool } from "@/lib/ai-tools";
import { generate } from "@/lib/ai/gateway";
import { compose } from "@/lib/ai/prompts/compose";
import { noopRetriever } from "@/lib/ai/retrieval/noop";
import { validateInput } from "@/lib/ai/guardrails/input";
import { rateLimit } from "@/lib/ai/guardrails/rateLimit";
import { sanitizeOutput } from "@/lib/ai/guardrails/output";

const COMING_SOON_MESSAGE =
  "This feature isn't built yet — it needs user accounts and saved data the app doesn't have today. It's marked \"Coming soon\" rather than faked.";

export async function POST(request: NextRequest) {
  const id = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const rl = rateLimit(id);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } });
  }

  const parsed = validateInput(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 });

  const tool = getTool(parsed.value.toolId);
  if (!tool) return NextResponse.json({ error: `Unknown tool: ${parsed.value.toolId}` }, { status: 400 });
  if (tool.status === "coming-soon") return NextResponse.json({ result: COMING_SOON_MESSAGE });

  const userPrompt = tool.buildUserPrompt(parsed.value.inputs);
  // RAG stub: returns [] today; real retriever swaps in later with no change here.
  const context = await noopRetriever.retrieve(userPrompt);
  const messages = compose({ systemAddendum: tool.systemAddendum, userPrompt, context });

  const result = await generate({ messages, tier: tool.tier, maxOutputTokens: 2048 });
  if (!result.ok) {
    return NextResponse.json({ error: "AI is temporarily unavailable. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ result: sanitizeOutput(result.value.text) || "AI response unavailable." });
}
```

- [ ] **Step 2: Verify** `npx tsc --noEmit && npm run build && npm run lint:colors` → all pass. Manually confirm `/api/ai` route is in the build output.
- [ ] **Step 3: Commit**
```bash
git add app/api/ai/route.ts
git commit -m "feat(ai): route is a thin controller over the gateway + guardrails"
```

---

## Task 9: Observability + env docs + Phase-1 verification
**Files:** Modify `lib/ai/gateway.ts` (track), `.env.local` (document), final checks

- [ ] **Step 1: Add usage tracking** in `gateway.ts` on success, using `lib/observability`'s `track` (check its signature in `lib/observability/index.ts`). After a successful `generate`, call:
```ts
import { track } from "@/lib/observability";
// inside the ok branch, before return:
track("ai_generation", { provider: cand.provider, model: cand.model, tier: req.tier, ms: Date.now() - started, inputTokens: res.usage?.inputTokens, outputTokens: res.usage?.outputTokens });
```
(If `track` is client-only/needs consent, guard appropriately or use `logger` server-side; verify against the actual module — server routes may need a server-safe log instead. Prefer `logger.info` if `track` is browser-scoped.)

- [ ] **Step 2: Document env** — add to `.env.local` (create if missing) commented keys:
```
GEMINI_API_KEY=
# Optional free fallbacks (Phase 2): GROQ_API_KEY=, OPENROUTER_API_KEY=, NVIDIA_API_KEY=
# AI_PROVIDER_PRIORITY=gemini,groq,openrouter
```

- [ ] **Step 3: Full verify** `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run lint:colors && npm run build` → all pass.
- [ ] **Step 4: Commit**
```bash
git add lib/ai/gateway.ts .env.local
git commit -m "feat(ai): generation observability + documented env"
```

---

## PHASE 2 — after the demo (specified, build later)

- **Task 10: OpenAI-compatible adapter** — `lib/ai/providers/openai-compat.ts`: one adapter factory configured per provider (Groq/OpenRouter/NVIDIA) via base URL + key env; register enabled ones in `providers/index.ts`. Enables real cross-provider fallback. Verify by setting a `GROQ_API_KEY` and forcing a Gemini failure.
- **Task 11: Anthropic adapter (off by default)** — `lib/ai/providers/anthropic.ts`, enabled iff `ANTHROPIC_API_KEY`. **Consult the claude-api skill for correct model IDs/SDK.**
- **Task 12: Budget caps** — `lib/ai/guardrails/budget.ts`: per-request token cap + soft global daily cap (`AI_DAILY_TOKEN_CAP`), enforced in gateway; log spend.
- **Task 13: Structured outputs** — add `outputSchema?: ZodType` to 1–2 high-value tools (roadmaps, skill-gap); gateway requests `json:true`, validates via `safeParseJson` + schema, one repair retry, fallback to markdown; route returns `{ data }` when structured.
- **Task 14: Eval scaffold** — `lib/ai/evals/cases.ts` + `run.ts` + `npm run evals`: golden cases asserting non-empty markdown, required sections, no banned hype phrases, refusal on a disallowed input.

---

## Self-Review (coverage vs spec)
- §2 gateway/adapters/registry/fallback → Tasks 1,2,3,6 (Phase 1: Gemini live); 10,11 (Phase 2 providers). ✅
- §3 base prompt + compose + tool refactor → Tasks 4,7. ✅
- §4 guardrails (input/rate-limit/output) → Task 5; budget → Task 12. ✅
- §5 structured outputs → Task 13. ✅
- §6 retrieval stub → Task 4 (+ wired in Task 8). ✅
- §7 observability/errors (Result) → Tasks 6,9. ✅
- §8 env config → Tasks 3,9. ✅
- §9 evals → Task 14. ✅
- §10 phasing honored (Phase 1 demo-critical). ✅
- Honesty coming-soon gate preserved → Task 8. ✅
