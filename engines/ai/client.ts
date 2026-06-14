// Gemini client factory. Server-only by convention (reads a secret via config/env).
// Never import this from a client component.

import { GoogleGenAI } from '@google/genai';
import { env } from '@/config/env';
import { UpstreamError } from '@/lib/errors';

/** Create a Gemini client, or throw if no API key is configured. */
export function createAiClient(): GoogleGenAI {
  if (!env.geminiApiKey) {
    throw new UpstreamError('Gemini API key not configured', 'ai_no_api_key', 500);
  }
  return new GoogleGenAI({ apiKey: env.geminiApiKey });
}
