// engines/ai barrel.
//
// NOTE: `generate`/`createAiClient` are server-only by convention (they read the
// API key). Client components must NOT import this barrel — they get the pure
// feature data via the `@/lib/ai-tools` shim, which imports `./features/registry`
// directly.

export { generate, COMING_SOON_MESSAGE } from './generate';
export { createAiClient } from './client';
export { models } from './models';
export type { ModelKey } from './models';
export { features, featureRegistry, getFeature } from './features/registry';
export type { FeatureDef, FeatureInput } from './features/registry';
export { promptRegistry } from './prompts/registry';
