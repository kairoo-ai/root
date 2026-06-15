import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { features } from '@/engines/ai/features/registry';
import { generateStream } from '@/engines/ai/gateway';
import { compose } from '@/engines/ai/prompts/compose';
import { noopRetriever } from '@/engines/ai/retrieval/noop';
import { sanitizeOutput } from '@/engines/ai/guardrails/output';
import { getRemainingCredits, recordUsage } from '@/data/repositories/usage.repo';
import { logActivity } from '@/data/repositories/activityLog.repo';
import { rateLimit } from '@/services/ai';
import { buildUserContext } from '@/engines/user-context';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth - every call must be authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate-limit by userId (replaces the old IP-based limiter)
    const rl = await rateLimit(userId);
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } }
      );
    }

    // 3. Parse body
    const body = await req.json().catch(() => null);
    const featureId: string | undefined = body?.featureId;
    const inputs: Record<string, string> | undefined = body?.inputs;

    if (!featureId || !inputs || typeof inputs !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid featureId / inputs.' }, { status: 400 });
    }

    // 4. Find feature in registry
    const feature = features.find((f) => f.id === featureId);
    if (!feature) {
      return NextResponse.json({ error: `Unknown feature: ${featureId}` }, { status: 404 });
    }
    if (feature.status === 'coming-soon') {
      return NextResponse.json(
        { error: 'This feature is coming soon and is not yet available.' },
        { status: 400 }
      );
    }

    // 5. Credit check
    const remaining = await getRemainingCredits(userId);
    if (remaining <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 402 }
      );
    }

    // 6. Build prompt using the same compose() + retrieval path as generate()
    const userPrompt = feature.buildUserPrompt(inputs);
    const context = await noopRetriever.retrieve(userPrompt);
    const userContext = await buildUserContext(userId).catch(() => '');
    const systemAddendum = [feature.systemAddendum, userContext].filter(Boolean).join('\n\n');
    const messages = compose({ systemAddendum, userPrompt, context });

    // 7. Stream tokens back - gateway handles provider fallback & retries
    const tokenStream = generateStream({
      messages,
      tier: feature.tier ?? 'fast',
      maxOutputTokens: feature.maxOutputTokens ?? 2048,
    });

    const encoder = new TextEncoder();
    let totalChars = 0;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of tokenStream) {
            const clean = sanitizeOutput(chunk);
            if (clean) {
              controller.enqueue(encoder.encode(clean));
              totalChars += clean.length;
            }
          }
          controller.close();
          // Fire-and-forget: record usage + activity after stream completes
          recordUsage(userId, featureId, totalChars).catch((e) =>
            console.error('[ai/route] recordUsage failed:', e)
          );
          logActivity(userId, 'ai_run', feature.name, featureId).catch((e) =>
            console.error('[ai/route] logActivity failed:', e)
          );
        } catch (err) {
          console.error('[ai/route] stream error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[ai/route] unhandled error:', err);
    return NextResponse.json({ error: 'AI is temporarily unavailable. Please try again.' }, { status: 500 });
  }
}
