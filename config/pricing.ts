export const pricing = {
  currency: "USD",
  currencySymbol: "$",
  billingPeriods: ["monthly", "yearly"],
  defaultPeriod: "monthly",
  yearlyDiscountPct: 20,
  customLabel: "Custom",
  freeLabel: "Free",
  perMonthSuffix: "/mo",
} as const;

export type Pricing = typeof pricing;
