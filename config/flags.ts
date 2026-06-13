export const flags = {
  analytics: false,
  consentBanner: true,
  authEnabled: false,
  billingEnabled: false,
} as const;

export type FeatureFlag = keyof typeof flags;
