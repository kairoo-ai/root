// Prompt registry — id -> prompt builder.
//
// Derived from the single source of truth in `../features/registry` so a feature's
// inputs and its prompt can never drift apart. Only `ready` features are included;
// coming-soon features have no real prompt. Pure and client-safe (no secrets).

import { features } from '../features/registry';

export const promptRegistry: Record<string, (inputs: Record<string, string>) => string> =
  Object.fromEntries(
    features
      .filter((f) => f.status === 'ready')
      .map((f) => [f.id, f.buildPrompt]),
  );
