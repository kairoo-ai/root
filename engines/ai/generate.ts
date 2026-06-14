// Generation entrypoint for the AI engine — pure capability, no user/auth/db.
// Server-only by convention (transitively reads the API key via ./client).

import { getFeature } from "./features/registry";
import { compose } from "./prompts/compose";
import { noopRetriever } from "./retrieval/noop";
import { sanitizeOutput } from "./guardrails/output";
import { generate as gatewayGenerate } from "./gateway";
import { ValidationError } from "@/lib/errors";

export const COMING_SOON_MESSAGE =
  "This feature isn't built yet — it needs user accounts and saved data the app doesn't have today. It's marked \"Coming soon\" rather than faked.";

export async function generate(featureId: string, inputs: Record<string, string>): Promise<string> {
  const feature = getFeature(featureId);
  if (!feature) throw new ValidationError(`Unknown feature: ${featureId}`, "unknown_feature", 400);
  if (feature.status === "coming-soon") return COMING_SOON_MESSAGE;

  const userPrompt = feature.buildUserPrompt(inputs ?? {});
  const context = await noopRetriever.retrieve(userPrompt);
  const messages = compose({ systemAddendum: feature.systemAddendum, userPrompt, context });

  const result = await gatewayGenerate({ messages, tier: feature.tier ?? "fast", maxOutputTokens: 2048 });
  if (!result.ok) throw result.error;
  return sanitizeOutput(result.value.text) || "AI response unavailable.";
}
