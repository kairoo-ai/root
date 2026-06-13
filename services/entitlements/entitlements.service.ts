/**
 * Entitlements — feature gates derived from a user's plan.
 *
 * Reserved skeleton — typed stubs only. No network/DB calls at module scope.
 */

import { EntitlementError } from "@/lib/errors";
import type { TierKey } from "@/types/tiers";

/** Result of an entitlement check for a single feature. */
export interface Entitlement {
  featureId: string;
  allowed: boolean;
  /** Tier that would unlock the feature when `allowed` is false. */
  requiredTier?: TierKey;
}

/** Fail-closed default returned before any policy is wired. */
export const deniedEntitlement = {
  allowed: false,
} as const satisfies Pick<Entitlement, "allowed">;

export type DeniedEntitlement = typeof deniedEntitlement;

/** Resolve whether a user may use a feature. */
export async function checkEntitlement(
  _userId: string,
  _featureId: string,
): Promise<Entitlement> {
  // TODO: derive from services/billing tier + @/config feature matrix
  throw new Error("Not implemented");
}

/** Assert a user may use a feature; throws `EntitlementError` otherwise. */
export async function requireEntitlement(
  _userId: string,
  _featureId: string,
): Promise<void> {
  // TODO: delegate to checkEntitlement() and throw when not allowed
  throw new EntitlementError("Not implemented", "entitlement_not_implemented");
}
