// Server-only by convention; do NOT import the 'server-only' package until installed.
// Reserved skeleton - no business logic yet.

// TODO: thread RequestContext, auth guards, rate limiting, and input
// validation (e.g. zod) through this factory once those deps are installed.
export function createAction<I, O>(_fn: (input: I) => Promise<O>) {
  return async (_input: I): Promise<O> => {
    throw new Error("Not implemented");
  };
}
