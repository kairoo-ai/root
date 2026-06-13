// Reserved skeleton — no business logic yet.

export interface UsageRecord {
  id: string;
  userId: string;
  metric: string;
  count: number;
  periodStart: string;
  periodEnd: string;
}

export interface UsageRepository {
  getForUser(userId: string, metric: string): Promise<UsageRecord | null>;
  increment(userId: string, metric: string, by: number): Promise<UsageRecord>;
  reset(userId: string, metric: string): Promise<void>;
}

export const usageRepository: UsageRepository = {
  getForUser(_userId: string, _metric: string): Promise<UsageRecord | null> {
    throw new Error("Not implemented");
  },
  increment(_userId: string, _metric: string, _by: number): Promise<UsageRecord> {
    throw new Error("Not implemented");
  },
  reset(_userId: string, _metric: string): Promise<void> {
    throw new Error("Not implemented");
  },
};
