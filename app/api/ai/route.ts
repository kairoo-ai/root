import { NextRequest, NextResponse } from 'next/server';
import { generate } from '@/engines/ai';
import { AppError } from '@/lib/errors';

// Thin transport: parse the request, delegate to the AI engine, map errors to HTTP.
// All feature/prompt logic lives in engines/ai; per-user policy will later wrap
// this via services/ai (entitlements + cost caps) once tiers/usage exist.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const featureId: string = body.toolId ?? body.featureId;
    const inputs: Record<string, string> = body.inputs ?? {};

    const result = await generate(featureId, inputs);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.httpStatus });
    }
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
