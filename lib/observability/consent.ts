/**
 * Consent gating for analytics/observability.
 * Reserved skeleton — no business logic yet.
 */

export type ConsentState = { granted: boolean };

export const getConsent = (): ConsentState => ({ granted: false });
