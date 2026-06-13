import { NextRequest, NextResponse } from 'next/server';
import { GenerateContentConfig, GoogleGenAI } from '@google/genai';
import { getTool } from '@/lib/ai-tools';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const client = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const COMING_SOON_MESSAGE =
  "This feature isn't built yet — it needs user accounts and saved data the app doesn't have today. It's marked \"Coming soon\" rather than faked.";

export async function POST(request: NextRequest) {
  if (!client) {
    return NextResponse.json(
      { error: 'Gemini API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { toolId, inputs } = await request.json();

    const tool = getTool(toolId);
    if (!tool) {
      return NextResponse.json(
        { error: `Unknown tool: ${toolId}` },
        { status: 400 }
      );
    }

    // Honesty: data-dependent features render but never call the model.
    if (tool.status === 'coming-soon') {
      return NextResponse.json({ result: COMING_SOON_MESSAGE });
    }

    const prompt = tool.buildPrompt((inputs ?? {}) as Record<string, string>);

    const generationConfig: GenerateContentConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const result = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: generationConfig,
    });

    const rawText = (result as { text?: string | (() => string) }).text;
    const text = typeof rawText === 'function' ? rawText() : rawText ?? 'AI response unavailable.';

    return NextResponse.json({ result: text });
  } catch (error: unknown) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
