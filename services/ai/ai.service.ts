/**
 * AI feature orchestration - the enforcement side of the per-user AI cost-cap.
 *
 * Reserved skeleton - typed stubs only. No network/AI calls at module scope.
 */

import { UpstreamError } from "@/lib/errors";

/** Arguments for a single AI feature invocation, scoped to one user. */
export interface RunAiFeatureArgs {
  userId: string;
  featureId: string;
  inputs: Record<string, string>;
}

/** Per-feature runtime budget/limits resolved before a call is made. */
export const aiRuntimeDefaults = {
  /** Hard ceiling on output tokens for a single invocation. */
  maxOutputTokens: 2048,
  /** Per-request timeout budget in milliseconds. */
  timeoutMs: 30_000,
  /** Whether a feature may stream partial output. */
  streaming: false,
} as const;

export type AiRuntimeDefaults = typeof aiRuntimeDefaults;

/**
 * Run a single AI feature for a user.
 *
 * Responsibilities (once implemented):
 *  1. Resolve the user's entitlement for `featureId` (`services/entitlements`).
 *  2. Check remaining budget (`services/usage`) and refuse once a cap is hit.
 *  3. Assemble the prompt and call the model (`@google/genai`).
 *  4. Record usage/cost back into `services/usage`.
 */
export async function runAiFeature(_args: {
  userId: string;
  featureId: string;
  inputs: Record<string, string>;
}): Promise<string> {
  // TODO: entitlement check via services/entitlements
  // TODO: budget check via services/usage (getRemainingBudget)
  // TODO: build prompt + call @google/genai
  // TODO: record spend via services/usage (recordUsage)
  throw new Error("Not implemented");
}

/** Estimate the cost (in abstract credits) of a feature run, pre-flight. */
export function estimateAiCost(_args: RunAiFeatureArgs): number {
  // TODO: derive from feature config + input size once @/config exists
  throw new UpstreamError("Not implemented", "ai_estimate_not_implemented");
}
