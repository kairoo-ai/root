export type TierKey = "free" | "pro" | "enterprise";

export interface Tier {
  key: TierKey;
  name: string;
  priceMonthly: number | "custom";
  features: string[];
  ctaLabel: string;
  popular?: boolean;
}
