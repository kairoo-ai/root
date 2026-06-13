import type { Tier } from "@/types";

export const tiers: Tier[] = [
  {
    key: "free",
    name: "Free",
    priceMonthly: 0,
    features: [
      "1 active career path",
      "Weekly AI check-ins",
      "Community access",
    ],
    ctaLabel: "Get started",
  },
  {
    key: "pro",
    name: "Pro",
    priceMonthly: 19,
    features: [
      "Unlimited career paths",
      "Daily AI coaching",
      "Skill gap analysis",
      "Priority support",
    ],
    ctaLabel: "Start free trial",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    priceMonthly: "custom",
    features: [
      "Everything in Pro",
      "Team dashboards",
      "SSO & audit logs",
      "Dedicated success manager",
    ],
    ctaLabel: "Contact sales",
  },
];
