export const flags = {
  analytics: false,
  consentBanner: true,
  authEnabled: false,
  billingEnabled: false,
  computeEnabled: false, // flip to true once the HF compute Space is live (Task 9)
} as const;

export type FeatureFlag = keyof typeof flags;
