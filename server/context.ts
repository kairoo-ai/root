// Server-only by convention; do NOT import the 'server-only' package until installed.
// Reserved skeleton — no business logic yet.

export interface RequestContext {
  userId: string | null;
  tier: "free" | "pro" | "enterprise" | null;
  ip: string | null;
}

export function getRequestContext(): RequestContext {
  throw new Error("Not implemented");
}
