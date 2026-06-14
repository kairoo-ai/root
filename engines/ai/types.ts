export type ModelTier = "fast" | "balanced" | "deep";
export type Message = { role: "system" | "user" | "assistant"; content: string };

export type GenerationRequest = {
  messages: Message[];
  tier: ModelTier;
  maxOutputTokens?: number;
  temperature?: number;
  json?: boolean;
  signal?: AbortSignal;
};

export type GenerationResult = {
  text: string;
  provider: string;
  model: string;
  usage?: { inputTokens?: number; outputTokens?: number };
  finishReason?: string;
};

export interface ProviderAdapter {
  readonly name: string;
  isEnabled(): boolean;
  generate(req: GenerationRequest, model: string): Promise<GenerationResult>;
  /** Optional: stream tokens as they arrive. Returns an async iterable of text chunks. */
  generateStream?(req: GenerationRequest, model: string): AsyncIterable<string>;
}

export type ModelCandidate = { provider: string; model: string };
