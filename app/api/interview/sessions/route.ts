import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSession, createExchange } from '@/data/repositories/interview.repo'
import { generate } from '@/engines/ai/gateway'
import { compose } from '@/engines/ai/prompts/compose'
import { buildFirstQuestionPrompt } from '@/engines/ai/prompts/interview'
import { rateLimit } from '@/services/ai'
import type { CreateSessionRequest } from '@/types/interview'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = await rateLimit(userId)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const body: CreateSessionRequest = await req.json()
  const { title, type, targetRole, targetCompany, personaId, difficulty, questionCount } = body

  if (!title || !type || !targetRole || !difficulty || !questionCount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Create the session row
  const session = await createSession(userId, body)

  // Generate the first question immediately
  const prompt = buildFirstQuestionPrompt(type, targetRole, targetCompany ?? null, difficulty)
  const messages = compose({ userPrompt: prompt })
  const result = await generate({ messages, tier: 'fast', maxOutputTokens: 512 })

  if (!result.ok) {
    return NextResponse.json({ error: 'Failed to generate first question' }, { status: 502 })
  }

  let parsed: { questionText: string; questionType: 'behavioral' | 'technical' | 'situational'; keywords: string[] }
  try {
    parsed = JSON.parse(result.value.text ?? '{}')
  } catch {
    return NextResponse.json({ error: 'AI returned malformed question' }, { status: 502 })
  }

  const exchange = await createExchange(
    session.id,
    parsed.questionText,
    parsed.questionType,
    1,
    parsed.keywords ?? [],
  )

  return NextResponse.json({ session, firstExchange: exchange }, { status: 201 })
}

export async function GET(_req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { getUserSessions, getInterviewStats } = await import('@/data/repositories/interview.repo')
  const [sessions, stats] = await Promise.all([getUserSessions(userId), getInterviewStats(userId)])
  return NextResponse.json({ sessions, stats })
}
