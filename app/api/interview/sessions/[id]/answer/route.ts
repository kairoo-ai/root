import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  getExchangeById,
  getSessionById,
  updateExchangeWithFeedback,
} from '@/data/repositories/interview.repo'
import { generateStream } from '@/engines/ai/gateway'
import { compose } from '@/engines/ai/prompts/compose'
import { buildFeedbackPrompt } from '@/engines/ai/prompts/interview'
import { sanitizeOutput } from '@/engines/ai/guardrails/output'
import { rateLimit } from '@/services/ai'
import type { SubmitAnswerRequest } from '@/types/interview'
import { INTERVIEW_PERSONAS } from '@/data/content/interviewPersonas'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = rateLimit(userId)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { id: sessionId } = await params
  const session = await getSessionById(sessionId, userId)
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const body: SubmitAnswerRequest = await req.json()
  const { exchangeId, answer, duration } = body

  if (!exchangeId || !answer) {
    return NextResponse.json({ error: 'Missing exchangeId or answer' }, { status: 400 })
  }

  const exchange = await getExchangeById(exchangeId)
  if (!exchange || exchange.sessionId !== sessionId) {
    return NextResponse.json({ error: 'Exchange not found' }, { status: 404 })
  }

  const persona = session.personaId
    ? INTERVIEW_PERSONAS.find((p) => p.id === session.personaId)
    : undefined

  const prompt = buildFeedbackPrompt(
    exchange.questionText,
    exchange.questionType,
    answer,
    exchange.keywords,
    session.targetRole,
  )
  const messages = compose({
    userPrompt: prompt,
    systemAddendum: persona?.systemPrompt,
  })
  const tokenStream = generateStream({ messages, tier: 'fast', maxOutputTokens: 800 })

  const encoder = new TextEncoder()
  let fullText = ''

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of tokenStream) {
          const clean = sanitizeOutput(chunk)
          if (clean) {
            controller.enqueue(encoder.encode(clean))
            fullText += clean
          }
        }
        controller.close()

        // Parse and persist feedback after stream ends
        try {
          const parsed = JSON.parse(fullText)
          await updateExchangeWithFeedback(
            exchangeId,
            answer,
            fullText,
            parsed.score ?? 0,
            parsed.keywordsUsed ?? [],
            duration,
          )
        } catch {
          // Non-fatal: stream already sent to client
        }
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-store',
    },
  })
}
