/**
 * Billing — plan + subscription state (Stripe-shaped, no SDK wired yet).
 *
 * Reserved skeleton — typed stubs only. No network/DB calls at module scope.
 */

import type { TierKey } from "@/types/tiers";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "none";

/** A user's current subscription, keyed to a pricing `TierKey`. */
export interface Subscription {
  userId: string;
  tier: TierKey;
  status: SubscriptionStatus;
  /** ISO timestamp of the current period end, when applicable. */
  currentPeriodEnd?: string;
}

/** Default subscription assumed for a user with no billing record. */
export const defaultSubscription = {
  tier: "free",
  status: "none",
} as const satisfies Pick<Subscription, "tier" | "status">;

export type DefaultSubscription = typeof defaultSubscription;

/** Fetch the active subscription for a user. */
export async function getSubscription(_userId: string): Promise<Subscription> {
  // TODO: look up billing record once a billing provider is wired
  throw new Error("Not implemented");
}

/** Begin a checkout session for a target tier; returns a redirect URL. */
export async function createCheckout(
  _userId: string,
  _tier: TierKey,
): Promise<string> {
  // TODO: create Stripe Checkout session and return its URL
  throw new Error("Not implemented");
}
