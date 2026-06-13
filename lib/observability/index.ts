/**
 * Observability barrel — consent-gated NO-OP analytics seam.
 * Reserved skeleton — no business logic yet.
 */

export { track, pageView, identify } from "./analytics";
export type { AnalyticsProperties } from "./analytics";
export { getConsent } from "./consent";
export type { ConsentState } from "./consent";
export { logger } from "./logger";
export type { Logger } from "./logger";
