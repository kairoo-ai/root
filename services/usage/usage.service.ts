/**
 * Usage metering + cost accounting — the source of truth for the AI cost-cap.
 *
 * Reserved skeleton — typed stubs only. No network/DB calls at module scope.
 */

import { QuotaExceededError } from "@/lib/errors";

/** A single recorded usage event (one AI feature invocation). */
export interface UsageEvent {
  userId: string;
  featureId: string;
  /** Abstract cost in credits attributed to this event. */
  cost: number;
  at: string;
}

/** A user's remaining budget for the current accounting window. */
export interface UsageBudget {
  userId: string;
  /** Credits granted for the window. */
  limit: number;
  /** Credits already consumed. */
  used: number;
  /** Convenience: `limit - used`, never negative. */
  remaining: number;
}

/** Zero-budget default assumed before any ledger exists. */
export const emptyBudget = {
  limit: 0,
  used: 0,
  remaining: 0,
} as const satisfies Pick<UsageBudget, "limit" | "used" | "remaining">;

export type EmptyBudget = typeof emptyBudget;

/** Read a user's remaining budget for the current window. */
export async function getRemainingBudget(_userId: string): Promise<UsageBudget> {
  // TODO: aggregate ledger against @/config caps once a store is wired
  throw new Error("Not implemented");
}

/** Append a usage event to the ledger. */
export async function recordUsage(_event: UsageEvent): Promise<void> {
  // TODO: persist event once a store is wired
  throw new Error("Not implemented");
}

/** Assert a user has at least `cost` budget remaining; throws otherwise. */
export async function assertWithinBudget(
  _userId: string,
  _cost: number,
): Promise<void> {
  // TODO: delegate to getRemainingBudget() and throw when exceeded
  throw new QuotaExceededError("Not implemented", "usage_not_implemented");
}
