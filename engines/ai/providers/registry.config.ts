export type OpenAICompatProviderConfig = {
  name: string;
  baseURL: string;
  apiKeyEnv: string;
  extraHeaders?: Record<string, string>;
};

export const OPENAI_COMPAT_PROVIDERS: OpenAICompatProviderConfig[] = [
  { name: "groq", baseURL: "https://api.groq.com/openai/v1", apiKeyEnv: "GROQ_API_KEY" },
  { name: "cerebras", baseURL: "https://api.cerebras.ai/v1", apiKeyEnv: "CEREBRAS_API_KEY" },
  { name: "nvidia", baseURL: "https://integrate.api.nvidia.com/v1", apiKeyEnv: "NVIDIA_API_KEY" },
  { name: "openrouter", baseURL: "https://openrouter.ai/api/v1", apiKeyEnv: "OPENROUTER_API_KEY" },
  { name: "huggingface", baseURL: "https://router.huggingface.co/v1", apiKeyEnv: "HUGGINGFACE_WRITE_TOKEN" },
  { name: "ollama", baseURL: "https://ollama.com/v1", apiKeyEnv: "OLLAMA_API_KEY" },
];
