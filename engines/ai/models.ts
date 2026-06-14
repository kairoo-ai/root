import type { ModelTier, ModelCandidate } from "./types";

export const models = { default: "gemini-2.5-flash-lite" } as const;
export type ModelKey = keyof typeof models;

// Model IDs vary by provider and drift over time — edit here; the gateway skips disabled providers and falls through on error.
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
    { provider: "cerebras", model: "llama-3.3-70b" },
    { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
  ],
  deep: [
    { provider: "gemini", model: "gemini-2.5-pro" },
    { provider: "cerebras", model: "qwen-3-32b" },
    { provider: "groq", model: "openai/gpt-oss-120b" },
    { provider: "huggingface", model: "Qwen/Qwen2.5-7B-Instruct-1M" },
    { provider: "openrouter", model: "deepseek/deepseek-r1:free" },
  ],
};
