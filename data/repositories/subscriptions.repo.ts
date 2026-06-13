// Reserved skeleton — no business logic yet.

export interface Subscription {
  id: string;
  userId: string;
  tier: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodEnd: string;
}

export interface SubscriptionsRepository {
  getForUser(userId: string): Promise<Subscription | null>;
  upsert(input: Omit<Subscription, "id">): Promise<Subscription>;
  cancel(id: string): Promise<Subscription>;
}

export const subscriptionsRepository: SubscriptionsRepository = {
  getForUser(_userId: string): Promise<Subscription | null> {
    throw new Error("Not implemented");
  },
  upsert(_input: Omit<Subscription, "id">): Promise<Subscription> {
    throw new Error("Not implemented");
  },
  cancel(_id: string): Promise<Subscription> {
    throw new Error("Not implemented");
  },
};
