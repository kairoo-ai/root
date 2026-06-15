// Coarse daily budget guard for free-tier protection. In-memory (resets on restart / not multi-instance) - fine for now; swap for KV later.
const DAY_MS = 24 * 60 * 60_000;
const MAX_REQ_PER_DAY = Number(process.env.AI_DAILY_REQUEST_CAP ?? 5000);
const MAX_TOKENS_PER_DAY = Number(process.env.AI_DAILY_TOKEN_CAP ?? 2_000_000);

let windowStart = 0;
let reqCount = 0;
let tokenEstimate = 0;

function rollIfNeeded(now: number) {
  if (now - windowStart >= DAY_MS) { windowStart = now; reqCount = 0; tokenEstimate = 0; }
}

/** Call before generating. `estTokens` ~ ceil(inputChars/4) + expected output. */
export function checkBudget(estTokens: number, now = Date.now()): { ok: boolean; reason?: string } {
  rollIfNeeded(now);
  if (reqCount >= MAX_REQ_PER_DAY) return { ok: false, reason: "daily request cap reached" };
  if (tokenEstimate + estTokens >= MAX_TOKENS_PER_DAY) return { ok: false, reason: "daily token cap reached" };
  reqCount += 1;
  tokenEstimate += estTokens;
  return { ok: true };
}

export function estimateTokens(inputs: Record<string, string>, expectedOutput = 700): number {
  const inChars = Object.values(inputs).join("").length;
  return Math.ceil(inChars / 4) + expectedOutput;
}
