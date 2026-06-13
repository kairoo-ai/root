/**
 * Auth / session resolution.
 *
 * Reserved skeleton — typed stubs only. No network/DB calls at module scope.
 */

import { AuthError } from "@/lib/errors";

/** The minimal authenticated principal other services scope themselves to. */
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
}

/** Resolved session for the current request, or `null` when anonymous. */
export interface Session {
  user: SessionUser;
  expiresAt: string;
}

/** Resolve the session for the current request context. */
export async function getSession(): Promise<Session | null> {
  // TODO: read + verify session cookie / token once an auth provider is wired
  throw new Error("Not implemented");
}

/** Resolve the session or throw `AuthError` when unauthenticated. */
export async function requireSession(): Promise<Session> {
  // TODO: delegate to getSession() and throw when null
  throw new AuthError("Not implemented", "auth_not_implemented");
}
