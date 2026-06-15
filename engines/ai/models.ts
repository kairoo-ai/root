import type { ModelTier, ModelCandidate } from "./types";

export const models = { default: "gemini-2.5-flash-lite" } as const;
export type ModelKey = keyof typeof models;

// Model IDs vary by provider and drift over time - edit here; the gateway skips
// disabled providers and falls through on error. Note: Qwen is deprioritized
// (placed last in deep) - it's verbose ("speaks too much") so it's a high-usage
// fallback, not a default.
export const MODEL_TIERS: Record<ModelTier, ModelCandidate[]> = {
  fast: [
    { provider: "gemini", model: "gemini-2.5-flash-lite" },
    { provider: "groq", model: "llama-3.1-8b-instant" },
    { provider: "cerebras", model: "llama3.1-8b" },
    { provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct:free" },
  ],
  balanced: [
    { provider: "gemini", model: "gemini-2.5-flash" },
    { provider: "groq", model: "llama-3.3-70b-versatile" },
    { provider: "groq", model: "meta-llama/llama-4-scout-17b-16e-instruct" },
    { provider: "cerebras", model: "llama-3.3-70b" },
    { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
  ],
  deep: [
    { provider: "gemini", model: "gemini-2.5-pro" },
    { provider: "groq", model: "groq/compound" },
    { provider: "groq", model: "meta-llama/llama-4-scout-17b-16e-instruct" },
    { provider: "cerebras", model: "gpt-oss-120b" },
    { provider: "ollama", model: "gpt-oss:120b-cloud" },
    { provider: "openrouter", model: "deepseek/deepseek-r1:free" },
    // Qwen last - capable but verbose; high-usage fallback only.
    { provider: "groq", model: "qwen/qwen3-32b" },
  ],
};
