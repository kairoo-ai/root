// Server-only by convention; do NOT import the 'server-only' package until installed.
// Reserved skeleton - no business logic yet.

export async function checkRateLimit(_key: string): Promise<{ ok: boolean }> {
  return { ok: true };
}
