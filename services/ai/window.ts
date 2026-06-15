export const RATE_WINDOW_MS = Number(
  process.env.AI_RATE_WINDOW_MS ?? 5 * 60_000,
);
export const RATE_MAX_REQ = Number(process.env.AI_RATE_MAX_REQ ?? 20);

export type BucketState = { windowStart: number; count: number };

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

export function computeRetryAfterSec(
  windowStartMs: number,
  windowMs: number,
  nowMs: number,
): number {
  return Math.max(1, Math.ceil((windowStartMs + windowMs - nowMs) / 1000));
}
