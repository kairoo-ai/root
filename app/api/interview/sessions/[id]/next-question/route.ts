import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  getSessionWithExchanges,
  createExchange,
} from '@/data/repositories/interview.repo'
import { generate } from '@/engines/ai/gateway'
import { compose } from '@/engines/ai/prompts/compose'
import { buildNextQuestionPrompt } from '@/engines/ai/prompts/interview'
import { rateLimit } from '@/services/ai'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = await rateLimit(userId)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { id: sessionId } = await params
  const session = await getSessionWithExchanges(sessionId, userId)
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  if (session.status === 'completed') {
    return NextResponse.json({ error: 'Session already completed' }, { status: 400 })
  }

  const answeredExchanges = session.exchanges.filter((e) => e.userAnswer !== null)
  const nextOrder = session.exchanges.length + 1

  if (nextOrder > session.questionCount) {
    return NextResponse.json({ error: 'All questions exhausted' }, { status: 400 })
  }

  const prompt = buildNextQuestionPrompt(
    session.type,
    session.targetRole,
    session.targetCompany,
    session.difficulty,
    answeredExchanges.map((e) => ({
      questionText: e.questionText,
      userAnswer: e.userAnswer,
      starScore: e.starScore,
    })),
    nextOrder,
    session.questionCount,
  )

  const messages = compose({ userPrompt: prompt })
  const result = await generate({ messages, tier: 'fast', maxOutputTokens: 512 })

  if (!result.ok) return NextResponse.json({ error: 'Failed to generate question' }, { status: 502 })

  let parsed: { questionText: string; questionType: 'behavioral' | 'technical' | 'situational'; keywords: string[] }
  try {
    parsed = JSON.parse(result.value.text ?? '{}')
  } catch {
    return NextResponse.json({ error: 'AI returned malformed question' }, { status: 502 })
  }

  const exchange = await createExchange(
    sessionId,
    parsed.questionText,
    parsed.questionType,
    nextOrder,
    parsed.keywords ?? [],
  )

  return NextResponse.json({ exchange })
}
