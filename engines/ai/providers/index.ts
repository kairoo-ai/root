import type { ProviderAdapter } from "../types";
import { geminiAdapter } from "./gemini";
import { makeOpenAICompatAdapter } from "./openai-compat";
import { OPENAI_COMPAT_PROVIDERS } from "./registry.config";

const ALL: ProviderAdapter[] = [
  geminiAdapter,
  ...OPENAI_COMPAT_PROVIDERS.map(makeOpenAICompatAdapter),
];

export function enabledProviders(): ProviderAdapter[] {
  const priority = (process.env.AI_PROVIDER_PRIORITY ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const enabled = ALL.filter((p) => p.isEnabled());
  if (!priority.length) return enabled;
  return [...enabled].sort((a, b) => {
    const ia = priority.indexOf(a.name), ib = priority.indexOf(b.name);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

export function getProvider(name: string): ProviderAdapter | undefined {
  return ALL.find((p) => p.name === name && p.isEnabled());
}
