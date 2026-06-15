import { ok, err, type Result } from "@/lib/result";
import { UpstreamError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { MODEL_TIERS } from "./models";
import { enabledProviders, getProvider } from "./providers";
import type { GenerationRequest, GenerationResult } from "./types";

const TIMEOUT_MS = 30_000;
const RETRIES = 1;

// Round-robin counter per tier - spreads load evenly across free-tier providers
// so no single provider absorbs all traffic. Skipped when AI_PROVIDER_PRIORITY
// is set, so explicit operator ordering is always respected.
const rrCounter: Record<string, number> = {};
function rotate<T>(arr: T[], tier: string): T[] {
  if (arr.length <= 1) return arr;
  // If the user pinned an explicit priority, don't rotate - respect their order.
  if (process.env.AI_PROVIDER_PRIORITY) return arr;
  const n = (rrCounter[tier] = (rrCounter[tier] ?? 0) + 1);
  const start = n % arr.length;
  return [...arr.slice(start), ...arr.slice(0, start)];
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export async function generate(req: GenerationRequest): Promise<Result<GenerationResult, UpstreamError>> {
  const candidates = MODEL_TIERS[req.tier] ?? MODEL_TIERS.fast;
  const enabled = new Set(enabledProviders().map((p) => p.name));
  const usable = candidates.filter((c) => enabled.has(c.provider));
  if (!usable.length) return err(new UpstreamError("No AI provider configured.", "ai_no_provider", 503));

  const ordered = rotate(usable, req.tier);
  let lastErr: unknown;
  for (const cand of ordered) {
    const adapter = getProvider(cand.provider);
    if (!adapter) continue;
    for (let attempt = 0; attempt <= RETRIES; attempt++) {
      const started = Date.now();
      try {
        const res = await withTimeout(adapter.generate(req, cand.model), TIMEOUT_MS);
        logger.info("ai.generate.ok", {
          provider: cand.provider,
          model: cand.model,
          tier: req.tier,
          ms: Date.now() - started,
          inputTokens: res.usage?.inputTokens,
          outputTokens: res.usage?.outputTokens,
        });
        return ok(res);
      } catch (e) {
        lastErr = e;
        logger.warn("ai.generate.fail", { provider: cand.provider, model: cand.model, attempt, error: String(e) });
        if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }
  }
  return err(new UpstreamError(`All providers failed: ${String(lastErr)}`, "ai_upstream_error", 502));
}

/**
 * Stream tokens as they arrive from the first capable provider.
 * Falls back to the non-streaming `generate()` path (emits the full result as
 * a single chunk) when no provider implements `generateStream`.
 */
export async function* generateStream(req: GenerationRequest): AsyncIterable<string> {
  const candidates = MODEL_TIERS[req.tier] ?? MODEL_TIERS.fast;
  const enabled = new Set(enabledProviders().map((p) => p.name));
  const usable = candidates.filter((c) => enabled.has(c.provider));
  if (!usable.length) throw new UpstreamError("No AI provider configured.", "ai_no_provider", 503);

  const ordered = rotate(usable, req.tier);
  let lastErr: unknown;

  for (const cand of ordered) {
    const adapter = getProvider(cand.provider);
    if (!adapter) continue;

    // Prefer streaming path if the provider supports it
    if (adapter.generateStream) {
      try {
        yield* withTimeoutStream(adapter.generateStream(req, cand.model), TIMEOUT_MS);
        return;
      } catch (e) {
        lastErr = e;
        logger.warn("ai.generateStream.fail", { provider: cand.provider, model: cand.model, error: String(e) });
      }
    } else {
      // Fallback: non-streaming, emit full text as one chunk
      try {
        const res = await withTimeout(adapter.generate(req, cand.model), TIMEOUT_MS);
        if (res.text) yield res.text;
        return;
      } catch (e) {
        lastErr = e;
        logger.warn("ai.generateStream.fail.nonstream", { provider: cand.provider, model: cand.model, error: String(e) });
      }
    }
  }

  throw new UpstreamError(`All providers failed: ${String(lastErr)}`, "ai_upstream_error", 502);
}

/** Wrap an async iterable with a hard timeout - throws if no chunk arrives within `ms`. */
async function* withTimeoutStream(source: AsyncIterable<string>, ms: number): AsyncIterable<string> {
  const iter = source[Symbol.asyncIterator]();
  while (true) {
    const next = await Promise.race([
      iter.next(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("stream timeout")), ms)),
    ]);
    if (next.done) break;
    yield next.value;
  }
}
