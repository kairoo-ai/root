import { createAiClient } from "../client";
import { env } from "@/config/env";
import type { ProviderAdapter, GenerationRequest, GenerationResult } from "../types";

export const geminiAdapter: ProviderAdapter = {
  name: "gemini",

  isEnabled(): boolean {
    return !!env.geminiApiKey;
  },

  async generate(req: GenerationRequest, model: string): Promise<GenerationResult> {
    const ai = createAiClient();
    const systemParts = req.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    const conversationMessages = req.messages.filter((m) => m.role !== "system");
    const contents = conversationMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        ...(systemParts ? { systemInstruction: systemParts } : {}),
        ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
        ...(req.maxOutputTokens !== undefined ? { maxOutputTokens: req.maxOutputTokens } : {}),
        ...(req.json ? { responseMimeType: "application/json" } : {}),
        ...(req.signal ? { abortSignal: req.signal } : {}),
      },
    });
    const text = response.text ?? "";
    const usage = response.usageMetadata
      ? {
          inputTokens: response.usageMetadata.promptTokenCount,
          outputTokens: response.usageMetadata.candidatesTokenCount,
        }
      : undefined;
    const finishReason = response.candidates?.[0]?.finishReason?.toString();
    return { text, provider: "gemini", model, usage, finishReason };
  },

  async *generateStream(req: GenerationRequest, model: string): AsyncIterable<string> {
    const ai = createAiClient();
    const systemParts = req.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    const conversationMessages = req.messages.filter((m) => m.role !== "system");
    const contents = conversationMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const stream = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        ...(systemParts ? { systemInstruction: systemParts } : {}),
        ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
        ...(req.maxOutputTokens !== undefined ? { maxOutputTokens: req.maxOutputTokens } : {}),
        ...(req.signal ? { abortSignal: req.signal } : {}),
      },
    });
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) yield text;
    }
  },
};
