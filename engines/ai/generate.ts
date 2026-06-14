// Generation entrypoint for the AI engine — pure capability, no user/auth/db.
// Server-only by convention (transitively reads the API key via ./client).
//
// Responsibilities: resolve the feature, refuse unknown features, short-circuit
// coming-soon features with an honest message, build the prompt, call the model.
// Per-user policy (entitlements, cost caps, metering) is NOT here — that belongs
// in services/ai once tiers/usage exist.

import type { GenerateContentConfig } from '@google/genai';
import { getFeature } from './features/registry';
import { createAiClient } from './client';
import { models } from './models';
import { UpstreamError, ValidationError } from '@/lib/errors';

/** Honest stand-in returned for features that are intentionally not built yet. */
export const COMING_SOON_MESSAGE =
  "This feature isn't built yet — it needs user accounts and saved data the app doesn't have today. It's marked \"Coming soon\" rather than faked.";

const generationConfig: GenerateContentConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

/**
 * Run one AI feature. Throws `ValidationError` for an unknown feature and
 * `UpstreamError` if the model call fails or no API key is configured.
 */
export async function generate(
  featureId: string,
  inputs: Record<string, string>,
): Promise<string> {
  const feature = getFeature(featureId);
  if (!feature) {
    throw new ValidationError(`Unknown feature: ${featureId}`, 'unknown_feature', 400);
  }

  // Coming-soon features render in the UI but never reach the model.
  if (feature.status === 'coming-soon') {
    return COMING_SOON_MESSAGE;
  }

  const client = createAiClient();
  const prompt = feature.buildUserPrompt(inputs ?? {});

  try {
    const result = await client.models.generateContent({
      model: models.default,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: generationConfig,
    });

    const rawText = (result as { text?: string | (() => string) }).text;
    const text = typeof rawText === 'function' ? rawText() : rawText ?? 'AI response unavailable.';
    return text;
  } catch (error: unknown) {
    if (error instanceof UpstreamError) throw error;
    const message = error instanceof Error ? error.message : 'Failed to generate AI response';
    throw new UpstreamError(message, 'ai_generation_failed', 502);
  }
}
