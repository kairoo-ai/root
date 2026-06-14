import type { ProviderAdapter, GenerationRequest, GenerationResult } from "../types";

interface ChatCompletionResponse {
  choices: Array<{
    message: { content: string | null };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

function isChatCompletionResponse(val: unknown): val is ChatCompletionResponse {
  return (
    typeof val === "object" &&
    val !== null &&
    Array.isArray((val as Record<string, unknown>).choices)
  );
}

/**
 * Merge consecutive same-role messages so providers that reject consecutive
 * system messages (or duplicate roles) receive a clean message list.
 * Multiple leading system messages are joined with "\n\n" into one.
 */
function mergeMessages(
  messages: GenerationRequest["messages"]
): GenerationRequest["messages"] {
  if (!messages.length) return messages;
  const merged: GenerationRequest["messages"] = [];
  for (const msg of messages) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === msg.role) {
      merged[merged.length - 1] = {
        role: prev.role,
        content: `${prev.content}\n\n${msg.content}`,
      };
    } else {
      merged.push({ ...msg });
    }
  }
  return merged;
}

export type OpenAICompatConfig = {
  name: string;
  baseURL: string;
  apiKeyEnv: string;
  extraHeaders?: Record<string, string>;
};

export function makeOpenAICompatAdapter(cfg: OpenAICompatConfig): ProviderAdapter {
  return {
    name: cfg.name,

    isEnabled(): boolean {
      return !!process.env[cfg.apiKeyEnv];
    },

    async generate(req: GenerationRequest, model: string): Promise<GenerationResult> {
      const key = process.env[cfg.apiKeyEnv];
      if (!key) throw new Error(`${cfg.name}: API key not set (${cfg.apiKeyEnv})`);

      const messages = mergeMessages(req.messages);

      const body = {
        model,
        messages,
        temperature: req.temperature ?? 0.7,
        max_tokens: req.maxOutputTokens ?? 2048,
        ...(req.json ? { response_format: { type: "json_object" } } : {}),
      };

      const res = await fetch(`${cfg.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          ...cfg.extraHeaders,
        },
        body: JSON.stringify(body),
        signal: req.signal,
      });

      if (!res.ok) {
        throw new Error(`${cfg.name} ${res.status}: ${await res.text()}`);
      }

      const data: unknown = await res.json();
      if (!isChatCompletionResponse(data)) {
        throw new Error(`${cfg.name}: unexpected response shape`);
      }

      const choice = data.choices[0];
      return {
        text: choice?.message.content ?? "",
        provider: cfg.name,
        model,
        usage: data.usage
          ? {
              inputTokens: data.usage.prompt_tokens,
              outputTokens: data.usage.completion_tokens,
            }
          : undefined,
        finishReason: choice?.finish_reason ?? undefined,
      };
    },
  };
}
