import { env } from "@/config/env";
import { embedResponseSchema } from "./schemas";

class UpstreamError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "UpstreamError";
  }
}

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
