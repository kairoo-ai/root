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
