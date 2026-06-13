/**
 * Consent-gated NO-OP analytics seam.
 * Reserved skeleton — no-op implementation, no business logic yet.
 */

import { getConsent } from "./consent";

export type AnalyticsProperties = Record<string, unknown>;

export const track = (_event: string, _props?: AnalyticsProperties): void => {
  // TODO: forward to a real analytics provider once consent is granted.
  void getConsent;
};

export const pageView = (_path: string, _props?: AnalyticsProperties): void => {
  // TODO: forward to a real analytics provider once consent is granted.
};

export const identify = (_id: string, _traits?: AnalyticsProperties): void => {
  // TODO: forward to a real analytics provider once consent is granted.
};
