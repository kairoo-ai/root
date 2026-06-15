# Interview Prep Suite — Implementation Plan
**Date:** 2026-06-15  
**Branch:** latest  
**Estimated tasks:** 38

---

## Overview

Replace the current single-shot `interviewCoach` feature (one form → one AI response) with a full stateful Interview Prep Suite:  
Hub → Setup → Live Session (streamed Q&A) → Results → Question Bank.

The suite lives at `app/(app)/tools/interviewPrep/` as a dedicated sub-app. It does NOT replace the generic `[featureId]` route — both coexist.

---

## Task 0 — Types file (do this first, everything imports from it)

**File:** `types/interview.ts`

```typescript
export type InterviewType = 'behavioral' | 'technical' | 'system_design' | 'case_study'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type SessionStatus = 'in_progress' | 'completed'
export type QuestionType = 'behavioral' | 'technical' | 'situational'

export interface InterviewSession {
  id: string
  userId: string
  title: string
  type: InterviewType
  targetRole: string
  targetCompany: string | null
  difficulty: Difficulty
  questionCount: number
  status: SessionStatus
  overallScore: number | null
  strengths: string[]
  improvements: string[]
  createdAt: Date
  updatedAt: Date
}

export interface InterviewExchange {
  id: string
  sessionId: string
  questionText: string
  questionType: QuestionType
  userAnswer: string | null
  aiFeedback: string | null
  starScore: number | null
  keywords: string[]
  keywordsUsed: string[]
  duration: number | null  // seconds
  order: number
  createdAt: Date
}

export interface SessionWithExchanges extends InterviewSession {
  exchanges: InterviewExchange[]
}

// API request/response shapes
export interface CreateSessionRequest {
  title: string
  type: InterviewType
  targetRole: string
  targetCompany?: string
  difficulty: Difficulty
  questionCount: 5 | 10 | 15
}

export interface SubmitAnswerRequest {
  exchangeId: string
  answer: string
  duration: number
}

export interface FeedbackResult {
  score: number
  whatWasGood: string
  whatWasMissing: string
  exampleImprovement: string
  keywordsUsed: string[]
}

export interface SessionAssessment {
  overallScore: number
  strengths: string[]
  improvements: string[]
  topActions: string[]
}
```

---

## Task 1 — DB schema additions

**File:** `data/schema/index.ts` — append these two tables after `goals`.

```typescript
export const interviewSessions = pgTable('interview_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type', { enum: ['behavioral', 'technical', 'system_design', 'case_study'] }).notNull(),
  targetRole: text('target_role').notNull(),
  targetCompany: text('target_company'),
  difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).notNull().default('medium'),
  questionCount: integer('question_count').notNull().default(5),
  status: text('status', { enum: ['in_progress', 'completed'] }).notNull().default('in_progress'),
  overallScore: integer('overall_score'),
  strengths: jsonb('strengths').$type<string[]>().default([]),
  improvements: jsonb('improvements').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const interviewExchanges = pgTable('interview_exchanges', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => interviewSessions.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  questionType: text('question_type', { enum: ['behavioral', 'technical', 'situational'] }).notNull(),
  userAnswer: text('user_answer'),
  aiFeedback: text('ai_feedback'),
  starScore: integer('star_score'),
  keywords: jsonb('keywords').$type<string[]>().default([]),
  keywordsUsed: jsonb('keywords_used').$type<string[]>().default([]),
  duration: integer('duration'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

Also add exports at bottom of schema file:
```typescript
// already exported by being declared — no additional export needed if using named exports
```

---

## Task 2 — Drizzle migration

Run after schema changes:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

The migration generates two `CREATE TABLE` statements. No changes to existing tables.

---

## Task 3 — Interview repository

**File:** `data/repositories/interview.repo.ts`

```typescript
import { db } from '@/data/client'
import { interviewSessions, interviewExchanges } from '@/data/schema'
import { eq, desc, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import type {
  InterviewSession,
  InterviewExchange,
  SessionWithExchanges,
  CreateSessionRequest,
  SessionAssessment,
} from '@/types/interview'

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function createSession(
  userId: string,
  data: CreateSessionRequest,
): Promise<InterviewSession> {
  const [session] = await db
    .insert(interviewSessions)
    .values({
      id: nanoid(),
      userId,
      title: data.title,
      type: data.type,
      targetRole: data.targetRole,
      targetCompany: data.targetCompany ?? null,
      difficulty: data.difficulty,
      questionCount: data.questionCount,
      status: 'in_progress',
      strengths: [],
      improvements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
  return session as InterviewSession
}

export async function getUserSessions(
  userId: string,
  limit = 20,
): Promise<InterviewSession[]> {
  return db
    .select()
    .from(interviewSessions)
    .where(eq(interviewSessions.userId, userId))
    .orderBy(desc(interviewSessions.createdAt))
    .limit(limit) as Promise<InterviewSession[]>
}

export async function getSessionById(
  id: string,
  userId: string,
): Promise<InterviewSession | null> {
  const [session] = await db
    .select()
    .from(interviewSessions)
    .where(and(eq(interviewSessions.id, id), eq(interviewSessions.userId, userId)))
    .limit(1)
  return (session as InterviewSession) ?? null
}

export async function getSessionWithExchanges(
  id: string,
  userId: string,
): Promise<SessionWithExchanges | null> {
  const session = await getSessionById(id, userId)
  if (!session) return null
  const exchanges = await db
    .select()
    .from(interviewExchanges)
    .where(eq(interviewExchanges.sessionId, id))
    .orderBy(interviewExchanges.order)
  return { ...session, exchanges: exchanges as InterviewExchange[] }
}

export async function completeSession(
  id: string,
  userId: string,
  assessment: SessionAssessment,
): Promise<void> {
  await db
    .update(interviewSessions)
    .set({
      status: 'completed',
      overallScore: assessment.overallScore,
      strengths: assessment.strengths,
      improvements: assessment.improvements,
      updatedAt: new Date(),
    })
    .where(and(eq(interviewSessions.id, id), eq(interviewSessions.userId, userId)))
}

// ── Exchanges ─────────────────────────────────────────────────────────────────

export async function createExchange(
  sessionId: string,
  questionText: string,
  questionType: InterviewExchange['questionType'],
  order: number,
  keywords: string[],
): Promise<InterviewExchange> {
  const [exchange] = await db
    .insert(interviewExchanges)
    .values({
      id: nanoid(),
      sessionId,
      questionText,
      questionType,
      keywords,
      keywordsUsed: [],
      order,
      createdAt: new Date(),
    })
    .returning()
  return exchange as InterviewExchange
}

export async function updateExchangeWithFeedback(
  id: string,
  answer: string,
  aiFeedback: string,
  starScore: number,
  keywordsUsed: string[],
  duration: number,
): Promise<void> {
  await db
    .update(interviewExchanges)
    .set({ userAnswer: answer, aiFeedback, starScore, keywordsUsed, duration })
    .where(eq(interviewExchanges.id, id))
}

export async function getExchangeById(id: string): Promise<InterviewExchange | null> {
  const [exchange] = await db
    .select()
    .from(interviewExchanges)
    .where(eq(interviewExchanges.id, id))
    .limit(1)
  return (exchange as InterviewExchange) ?? null
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface InterviewStats {
  totalSessions: number
  avgScore: number | null
  completedSessions: number
}

export async function getInterviewStats(userId: string): Promise<InterviewStats> {
  const sessions = await getUserSessions(userId, 100)
  const completed = sessions.filter((s) => s.status === 'completed')
  const scores = completed.map((s) => s.overallScore).filter((s): s is number => s !== null)
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  return {
    totalSessions: sessions.length,
    completedSessions: completed.length,
    avgScore,
  }
}
```

---

## Task 4 — AI prompt helpers

**File:** `engines/ai/prompts/interview.ts`

These are pure functions — no network calls. Used by the API routes to build structured prompts.

```typescript
import type { InterviewType, Difficulty, InterviewExchange } from '@/types/interview'

export function buildFirstQuestionPrompt(
  type: InterviewType,
  targetRole: string,
  targetCompany: string | null,
  difficulty: Difficulty,
): string {
  const companyLine = targetCompany ? ` at ${targetCompany}` : ''
  const difficultyMap: Record<Difficulty, string> = {
    easy: 'entry-level, straightforward',
    medium: 'mid-level, moderately challenging',
    hard: 'senior-level, complex and probing',
  }
  const typeInstructions: Record<InterviewType, string> = {
    behavioral: 'Ask a behavioral question using the STAR method framework (Situation, Task, Action, Result).',
    technical: 'Ask a technical question relevant to the role. Be specific about a concrete problem or concept.',
    system_design: 'Ask a system design question. Start with a high-level prompt that leaves room for the candidate to clarify requirements.',
    case_study: 'Present a realistic business case or product scenario relevant to the role.',
  }
  return `You are an expert ${type.replace('_', ' ')} interviewer for a ${difficultyMap[difficulty]} ${targetRole} role${companyLine}.

${typeInstructions[type]}

Return ONLY valid JSON in this exact shape — no markdown, no extra text:
{
  "questionText": "...",
  "questionType": "behavioral" | "technical" | "situational",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

The keywords array must contain 4-6 concepts or terms the ideal answer should include.`
}

export function buildNextQuestionPrompt(
  type: InterviewType,
  targetRole: string,
  targetCompany: string | null,
  difficulty: Difficulty,
  previousExchanges: Pick<InterviewExchange, 'questionText' | 'userAnswer' | 'starScore'>[],
  questionNumber: number,
  totalQuestions: number,
): string {
  const companyLine = targetCompany ? ` at ${targetCompany}` : ''
  const history = previousExchanges
    .map((e, i) => `Q${i + 1}: ${e.questionText}\nA${i + 1}: ${e.userAnswer ?? '(no answer)'}\nScore: ${e.starScore ?? 'N/A'}/100`)
    .join('\n\n')

  return `You are conducting a ${type.replace('_', ' ')} interview for a ${targetRole} role${companyLine}.

Previous exchanges:
${history}

You are now generating question ${questionNumber} of ${totalQuestions}. Based on the candidate's previous answers, choose a question that:
- Probes an area they showed weakness in OR explores a new dimension
- Matches ${difficulty} difficulty
- Builds natural conversational flow

Return ONLY valid JSON:
{
  "questionText": "...",
  "questionType": "behavioral" | "technical" | "situational",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`
}

export function buildFeedbackPrompt(
  questionText: string,
  questionType: string,
  userAnswer: string,
  keywords: string[],
  targetRole: string,
): string {
  return `You are an expert interview coach evaluating a ${targetRole} candidate.

Question: ${questionText}
Expected keywords/concepts: ${keywords.join(', ')}

Candidate's answer:
${userAnswer}

Evaluate this answer and return ONLY valid JSON:
{
  "score": <0-100 integer>,
  "whatWasGood": "<1-2 sentences on strengths>",
  "whatWasMissing": "<1-2 sentences on gaps>",
  "exampleImprovement": "<rewrite 1-3 key sentences to show improvement>",
  "keywordsUsed": ["<keywords from the expected list that the candidate actually used>"]
}

Scoring guide: 0-40 = poor structure/content, 41-60 = adequate, 61-80 = good, 81-100 = excellent.
For behavioral questions, score heavily on STAR structure.
For technical questions, score on correctness and depth.`
}

export function buildSessionAssessmentPrompt(
  exchanges: Pick<InterviewExchange, 'questionText' | 'userAnswer' | 'starScore' | 'aiFeedback'>[],
  targetRole: string,
): string {
  const summary = exchanges
    .map((e, i) => `Q${i + 1} (score ${e.starScore ?? 'N/A'}): ${e.questionText}`)
    .join('\n')

  return `You are summarizing a complete mock interview for a ${targetRole} candidate.

Questions and scores:
${summary}

Generate an overall assessment. Return ONLY valid JSON:
{
  "overallScore": <0-100 integer, weighted average>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>", "<area to improve 3>"],
  "topActions": ["<specific action 1>", "<specific action 2>", "<specific action 3>"]
}`
}
```

---

## Task 5 — API routes

### 5a. `POST /api/interview/sessions` — create session + first question

**File:** `app/api/interview/sessions/route.ts`

```typescript
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

  const rl = rateLimit(userId)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const body: CreateSessionRequest = await req.json()
  const { title, type, targetRole, targetCompany, difficulty, questionCount } = body

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

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { getUserSessions, getInterviewStats } = await import('@/data/repositories/interview.repo')
  const [sessions, stats] = await Promise.all([getUserSessions(userId), getInterviewStats(userId)])
  return NextResponse.json({ sessions, stats })
}
```

### 5b. `GET /api/interview/sessions/[id]` — get session with exchanges

**File:** `app/api/interview/sessions/[id]/route.ts`

```typescript
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithExchanges } from '@/data/repositories/interview.repo'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const session = await getSessionWithExchanges(id, userId)
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ session })
}
```

### 5c. `POST /api/interview/sessions/[id]/answer` — submit answer, stream feedback

**File:** `app/api/interview/sessions/[id]/answer/route.ts`

```typescript
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

  const prompt = buildFeedbackPrompt(
    exchange.questionText,
    exchange.questionType,
    answer,
    exchange.keywords,
    session.targetRole,
  )
  const messages = compose({ userPrompt: prompt })
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
```

### 5d. `POST /api/interview/sessions/[id]/next-question` — generate next question

**File:** `app/api/interview/sessions/[id]/next-question/route.ts`

```typescript
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

  const rl = rateLimit(userId)
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
```

### 5e. `POST /api/interview/sessions/[id]/complete` — finalize session

**File:** `app/api/interview/sessions/[id]/complete/route.ts`

```typescript
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  getSessionWithExchanges,
  completeSession,
} from '@/data/repositories/interview.repo'
import { generate } from '@/engines/ai/gateway'
import { compose } from '@/engines/ai/prompts/compose'
import { buildSessionAssessmentPrompt } from '@/engines/ai/prompts/interview'
import { logActivity } from '@/data/repositories/activityLog.repo'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: sessionId } = await params
  const session = await getSessionWithExchanges(sessionId, userId)
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  if (session.status === 'completed') {
    return NextResponse.json({ session })
  }

  const prompt = buildSessionAssessmentPrompt(
    session.exchanges.map((e) => ({
      questionText: e.questionText,
      userAnswer: e.userAnswer,
      starScore: e.starScore,
      aiFeedback: e.aiFeedback,
    })),
    session.targetRole,
  )

  const messages = compose({ userPrompt: prompt })
  const result = await generate({ messages, tier: 'fast', maxOutputTokens: 512 })

  let assessment = { overallScore: 0, strengths: [] as string[], improvements: [] as string[], topActions: [] as string[] }
  if (result.ok) {
    try {
      assessment = JSON.parse(result.value.text ?? '{}')
    } catch {
      // use defaults
    }
  }

  await completeSession(sessionId, userId, assessment)
  await logActivity(userId, 'interview_completed', `Completed: ${session.title}`, 'interviewPrep', {
    sessionId,
    score: assessment.overallScore,
  })

  return NextResponse.json({ assessment })
}
```

---

## Task 6 — Static question bank data

**File:** `data/content/interviewQuestions.ts`

```typescript
export interface BankQuestion {
  id: string
  text: string
  type: 'behavioral' | 'technical' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard'
  category: string  // 'leadership' | 'problem-solving' | 'communication' | 'technical-cs' | 'product' | 'data' | 'system-design'
  roles: string[]   // e.g. ['Software Engineer', 'Product Manager'] — empty means all
}

export const bankQuestions: BankQuestion[] = [
  // Behavioral — Leadership
  { id: 'b1', text: 'Tell me about a time you led a team through a difficult situation.', type: 'behavioral', difficulty: 'medium', category: 'leadership', roles: [] },
  { id: 'b2', text: 'Describe a time you had to influence someone without direct authority.', type: 'behavioral', difficulty: 'medium', category: 'leadership', roles: [] },
  { id: 'b3', text: 'Give an example of when you set a goal and how you achieved it.', type: 'behavioral', difficulty: 'easy', category: 'leadership', roles: [] },
  // Behavioral — Problem Solving
  { id: 'b4', text: 'Tell me about the most complex problem you have ever solved.', type: 'behavioral', difficulty: 'hard', category: 'problem-solving', roles: [] },
  { id: 'b5', text: 'Describe a time when you had to make a decision with incomplete information.', type: 'behavioral', difficulty: 'medium', category: 'problem-solving', roles: [] },
  { id: 'b6', text: 'Tell me about a time you failed. What did you learn?', type: 'behavioral', difficulty: 'easy', category: 'problem-solving', roles: [] },
  // Behavioral — Communication
  { id: 'b7', text: 'Describe a time you had to deliver difficult feedback.', type: 'behavioral', difficulty: 'medium', category: 'communication', roles: [] },
  { id: 'b8', text: 'Tell me about a conflict with a colleague and how you resolved it.', type: 'behavioral', difficulty: 'medium', category: 'communication', roles: [] },
  { id: 'b9', text: 'Give an example of a time you had to explain a complex topic to a non-technical audience.', type: 'behavioral', difficulty: 'easy', category: 'communication', roles: [] },
  // Technical — SWE
  { id: 't1', text: 'Explain the difference between a process and a thread.', type: 'technical', difficulty: 'easy', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 't2', text: 'What are the tradeoffs between SQL and NoSQL databases?', type: 'technical', difficulty: 'medium', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer', 'Data Engineer'] },
  { id: 't3', text: 'How does garbage collection work in your primary language?', type: 'technical', difficulty: 'medium', category: 'technical-cs', roles: ['Software Engineer'] },
  { id: 't4', text: 'Explain eventual consistency and when you would accept it.', type: 'technical', difficulty: 'hard', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 't5', text: 'What is the difference between optimistic and pessimistic locking?', type: 'technical', difficulty: 'hard', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer'] },
  // System Design
  { id: 's1', text: 'Design a URL shortener like bit.ly.', type: 'technical', difficulty: 'medium', category: 'system-design', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 's2', text: 'Design a notification system for a social media platform.', type: 'technical', difficulty: 'hard', category: 'system-design', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 's3', text: 'How would you design a rate limiter?', type: 'technical', difficulty: 'hard', category: 'system-design', roles: ['Software Engineer', 'Backend Engineer'] },
  // Product
  { id: 'p1', text: 'How would you improve our onboarding flow?', type: 'situational', difficulty: 'medium', category: 'product', roles: ['Product Manager', 'Product Designer'] },
  { id: 'p2', text: 'A key metric dropped 20% overnight. Walk me through your investigation.', type: 'situational', difficulty: 'hard', category: 'product', roles: ['Product Manager', 'Data Analyst'] },
  { id: 'p3', text: 'How do you prioritize features when every stakeholder says theirs is most important?', type: 'situational', difficulty: 'medium', category: 'product', roles: ['Product Manager'] },
  // Data
  { id: 'd1', text: 'What is the difference between supervised and unsupervised learning?', type: 'technical', difficulty: 'easy', category: 'data', roles: ['Data Scientist', 'ML Engineer'] },
  { id: 'd2', text: 'Explain how you would handle class imbalance in a classification problem.', type: 'technical', difficulty: 'medium', category: 'data', roles: ['Data Scientist', 'ML Engineer'] },
  { id: 'd3', text: 'Walk me through how you would design an A/B test.', type: 'technical', difficulty: 'medium', category: 'data', roles: ['Data Scientist', 'Data Analyst', 'Product Manager'] },
]
```

---

## Task 7 — Shared components (build in this order)

All go in `app/(app)/tools/interviewPrep/_components/`.

### 7a. `ProgressBar.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.min((current / total) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--color-text-secondary)] tabular-nums">
        {current}/{total}
      </span>
      <div className="relative h-1.5 flex-1 rounded-full bg-[var(--color-surface-2)]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-primary)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <span className="text-sm font-medium text-[var(--color-text-primary)]">
        {Math.round(pct)}%
      </span>
    </div>
  )
}
```

### 7b. `SessionModeCard.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'
import type { InterviewType } from '@/types/interview'

const MODE_META: Record<InterviewType, { label: string; description: string; icon: string; accentVar: string }> = {
  behavioral: {
    label: 'Behavioral',
    description: 'STAR-method stories about past experience',
    icon: '💬',
    accentVar: '--color-primary',
  },
  technical: {
    label: 'Technical',
    description: 'Coding, CS fundamentals, and domain knowledge',
    icon: '⚙️',
    accentVar: '--color-secondary',
  },
  system_design: {
    label: 'System Design',
    description: 'Architect scalable distributed systems',
    icon: '🏗️',
    accentVar: '--color-accent-green',
  },
  case_study: {
    label: 'Case Study',
    description: 'Business cases, product sense, and analytics',
    icon: '📊',
    accentVar: '--color-accent-orange',
  },
}

interface SessionModeCardProps {
  type: InterviewType
  selected: boolean
  onClick: () => void
}

export function SessionModeCard({ type, selected, onClick }: SessionModeCardProps) {
  const meta = MODE_META[type]

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={[
        'relative flex flex-col gap-2 rounded-2xl border p-5 text-left transition-colors',
        selected
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
          : 'border-[var(--color-border)] bg-[var(--color-surface-1)] hover:border-[var(--color-primary)]/50',
      ].join(' ')}
    >
      <span className="text-2xl">{meta.icon}</span>
      <span className="font-semibold text-[var(--color-text-primary)]">{meta.label}</span>
      <span className="text-sm text-[var(--color-text-secondary)]">{meta.description}</span>
      {selected && (
        <motion.span
          layoutId="mode-indicator"
          className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[var(--color-primary)]"
        />
      )}
    </motion.button>
  )
}
```

### 7c. `QuestionDisplay.tsx`

```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface QuestionDisplayProps {
  questionText: string
  questionNumber: number
  totalQuestions: number
}

export function QuestionDisplay({ questionText, questionNumber, totalQuestions }: QuestionDisplayProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        Question {questionNumber} of {totalQuestions}
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={questionText}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="text-xl font-medium leading-relaxed text-[var(--color-text-primary)]"
        >
          {questionText}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
```

### 7d. `AnswerInput.tsx`

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface AnswerInputProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled: boolean
  onDurationChange: (seconds: number) => void
}

export function AnswerInput({ value, onChange, onSubmit, disabled, onDurationChange }: AnswerInputProps) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedRef = useRef(false)

  // Start timer on first keystroke
  function handleChange(v: string) {
    if (!startedRef.current && v.length > 0) {
      startedRef.current = true
      intervalRef.current = setInterval(() => {
        setElapsed((s) => {
          onDurationChange(s + 1)
          return s + 1
        })
      }, 1000)
    }
    onChange(v)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
        <span>{wordCount} words</span>
        <span className="font-mono">{mins}:{secs}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        rows={8}
        placeholder="Type your answer here… focus on Situation → Task → Action → Result"
        className={[
          'w-full resize-none rounded-xl border bg-[var(--color-surface-1)] px-4 py-3',
          'text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
          'transition-colors focus:border-[var(--color-primary)] focus:outline-none',
          disabled ? 'cursor-not-allowed opacity-50' : 'border-[var(--color-border)]',
        ].join(' ')}
      />
      <motion.button
        onClick={onSubmit}
        disabled={disabled || value.trim().length < 10}
        whileTap={{ scale: 0.97 }}
        className={[
          'self-end rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors',
          disabled || value.trim().length < 10
            ? 'cursor-not-allowed bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)]'
            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        ].join(' ')}
      >
        Submit Answer
      </motion.button>
    </div>
  )
}
```

### 7e. `STARHints.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STAR_STEPS = [
  { label: 'Situation', desc: 'Set the context — what was the scenario or challenge?' },
  { label: 'Task', desc: 'What was your specific responsibility or goal?' },
  { label: 'Action', desc: 'What concrete steps did YOU take? Use "I", not "we".' },
  { label: 'Result', desc: 'What measurable outcome occurred? Quantify if possible.' },
]

export function STARHints() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]"
      >
        <span>STAR Framework Hints</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-3">
              {STAR_STEPS.map(({ label, desc }) => (
                <div key={label} className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[var(--color-primary)]/15 text-center text-xs font-semibold leading-5 text-[var(--color-primary)]">
                    {label[0]}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">{label} — </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### 7f. `FeedbackPanel.tsx`

Receives the streaming text from `/api/interview/sessions/[id]/answer`, parses JSON when complete, then renders structured feedback.

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FeedbackResult } from '@/types/interview'

interface FeedbackPanelProps {
  sessionId: string
  exchangeId: string
  answer: string
  duration: number
  onFeedbackComplete: (result: FeedbackResult) => void
}

export function FeedbackPanel({
  sessionId,
  exchangeId,
  answer,
  duration,
  onFeedbackComplete,
}: FeedbackPanelProps) {
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState<FeedbackResult | null>(null)
  const [loading, setLoading] = useState(true)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    async function fetchFeedback() {
      const res = await fetch(`/api/interview/sessions/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeId, answer, duration }),
      })

      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setRaw(accumulated)
      }

      try {
        const result: FeedbackResult = JSON.parse(accumulated)
        setParsed(result)
        onFeedbackComplete(result)
      } catch {
        // malformed — show raw
      }
      setLoading(false)
    }

    fetchFeedback()
  }, [sessionId, exchangeId, answer, duration, onFeedbackComplete])

  if (loading && !raw) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-text-secondary)]">
        <span className="animate-pulse">Analyzing your answer…</span>
      </div>
    )
  }

  if (!parsed) {
    // Show raw streaming text while parsing
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
        <pre className="whitespace-pre-wrap text-xs text-[var(--color-text-secondary)]">{raw}</pre>
      </div>
    )
  }

  const scoreColor =
    parsed.score >= 80
      ? 'text-emerald-500'
      : parsed.score >= 60
      ? 'text-amber-500'
      : 'text-rose-500'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">AI Feedback</span>
          <span className={`text-2xl font-bold tabular-nums ${scoreColor}`}>{parsed.score}/100</span>
        </div>
        <FeedbackRow label="What went well" text={parsed.whatWasGood} positive />
        <FeedbackRow label="What was missing" text={parsed.whatWasMissing} />
        <div className="rounded-lg bg-[var(--color-surface-2)] px-3 py-2">
          <span className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Example improvement</span>
          <p className="text-sm italic text-[var(--color-text-primary)]">{parsed.exampleImprovement}</p>
        </div>
        {parsed.keywordsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {parsed.keywordsUsed.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function FeedbackRow({ label, text, positive = false }: { label: string; text: string; positive?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className={`mt-0.5 text-sm ${positive ? 'text-emerald-500' : 'text-amber-500'}`}>
        {positive ? '✓' : '△'}
      </span>
      <div>
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{label}: </span>
        <span className="text-sm text-[var(--color-text-primary)]">{text}</span>
      </div>
    </div>
  )
}
```

### 7g. `SessionScoreCard.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'
import type { SessionAssessment } from '@/types/interview'

interface SessionScoreCardProps {
  assessment: SessionAssessment
}

export function SessionScoreCard({ assessment }: SessionScoreCardProps) {
  const { overallScore, strengths, improvements, topActions } = assessment
  const circumference = 2 * Math.PI * 44 // r=44
  const offset = circumference - (overallScore / 100) * circumference

  const scoreColor =
    overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col gap-6">
      {/* Score ring */}
      <div className="flex flex-col items-center gap-2">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-surface-2)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={scoreColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transform="rotate(-90 50 50)"
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill={scoreColor}>
            {overallScore}
          </text>
        </svg>
        <span className="text-sm text-[var(--color-text-secondary)]">Overall Score</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ScoreSection title="Strengths" items={strengths} positive />
        <ScoreSection title="Areas to Improve" items={improvements} />
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
        <p className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Top 3 Actions</p>
        <ol className="flex flex-col gap-2">
          {topActions.slice(0, 3).map((action, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className="font-bold text-[var(--color-primary)]">{i + 1}.</span>
              {action}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function ScoreSection({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-[var(--color-text-primary)]">
            <span className={positive ? 'text-emerald-500' : 'text-amber-500'}>{positive ? '✓' : '△'}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### 7h. `QuestionBankCard.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'
import type { BankQuestion } from '@/data/content/interviewQuestions'
import { useRouter } from 'next/navigation'

interface QuestionBankCardProps {
  question: BankQuestion
}

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

const TYPE_STYLES = {
  behavioral: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  technical: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  situational: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
}

export function QuestionBankCard({ question }: QuestionBankCardProps) {
  const router = useRouter()

  function handlePractice() {
    const params = new URLSearchParams({
      prefillType: question.type === 'situational' ? 'behavioral' : question.type,
      prefillDifficulty: question.difficulty,
    })
    router.push(`/tools/interviewPrep/setup?${params.toString()}`)
  }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4"
    >
      <p className="text-sm font-medium leading-relaxed text-[var(--color-text-primary)]">
        {question.text}
      </p>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLES[question.type]}`}>
          {question.type}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[question.difficulty]}`}>
          {question.difficulty}
        </span>
        {question.roles.length > 0 && (
          <span className="text-xs text-[var(--color-text-tertiary)]">{question.roles[0]}</span>
        )}
      </div>
      <button
        onClick={handlePractice}
        className="self-start rounded-lg bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/20"
      >
        Practice this →
      </button>
    </motion.div>
  )
}
```

---

## Task 8 — Page: Hub

**File:** `app/(app)/tools/interviewPrep/page.tsx`

```typescript
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserSessions, getInterviewStats } from '@/data/repositories/interview.repo'
import { SessionModeCard } from './_components/SessionModeCard'
import type { InterviewType } from '@/types/interview'

const MODES: InterviewType[] = ['behavioral', 'technical', 'system_design', 'case_study']

export default async function InterviewPrepHub() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [sessions, stats] = await Promise.all([
    getUserSessions(userId, 5),
    getInterviewStats(userId),
  ])

  const inProgress = sessions.find((s) => s.status === 'in_progress')

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Interview Prep</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Practice mock interviews with AI-powered feedback and scoring.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sessions', value: stats.totalSessions },
          { label: 'Completed', value: stats.completedSessions },
          { label: 'Avg Score', value: stats.avgScore !== null ? `${stats.avgScore}/100` : '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] py-4"
          >
            <span className="text-xl font-bold text-[var(--color-text-primary)]">{value}</span>
            <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
          </div>
        ))}
      </div>

      {/* Continue in-progress session */}
      {inProgress && (
        <Link
          href={`/tools/interviewPrep/session/${inProgress.id}`}
          className="flex items-center justify-between rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-5 py-4 transition-colors hover:bg-[var(--color-primary)]/10"
        >
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Continue: {inProgress.title}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{inProgress.type} · {inProgress.difficulty}</p>
          </div>
          <span className="text-[var(--color-primary)]">→</span>
        </Link>
      )}

      {/* Mode selector — navigates to setup with type pre-selected */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">Start New Session</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MODES.map((type) => (
            <Link key={type} href={`/tools/interviewPrep/setup?type=${type}`}>
              {/* SessionModeCard is a client component; wrap in a div to allow Link navigation */}
              <div className="cursor-pointer">
                <SessionModeCard type={type} selected={false} onClick={() => {}} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">Recent Sessions</h2>
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={
                  s.status === 'completed'
                    ? `/tools/interviewPrep/session/${s.id}/results`
                    : `/tools/interviewPrep/session/${s.id}`
                }
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{s.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {s.type} · {s.difficulty} · {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.overallScore !== null && (
                    <span className="text-sm font-bold text-[var(--color-primary)]">{s.overallScore}</span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {s.status === 'completed' ? 'Done' : 'In progress'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## Task 9 — Page: Setup

**File:** `app/(app)/tools/interviewPrep/setup/page.tsx`

This is a client component because it manages form state and makes a POST to create the session.

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SessionModeCard } from '../_components/SessionModeCard'
import type { InterviewType, Difficulty, CreateSessionRequest } from '@/types/interview'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const QUESTION_COUNTS = [5, 10, 15] as const

export default function SetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState<InterviewType>(
    (searchParams.get('type') as InterviewType) ?? 'behavioral',
  )
  const [targetRole, setTargetRole] = useState(searchParams.get('role') ?? '')
  const [targetCompany, setTargetCompany] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>(
    (searchParams.get('prefillDifficulty') as Difficulty) ?? 'medium',
  )
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = [targetRole, type.replace('_', ' ')].filter(Boolean).join(' — ')

  async function handleStart() {
    if (!targetRole.trim()) {
      setError('Target role is required')
      return
    }
    setLoading(true)
    setError(null)

    const body: CreateSessionRequest = {
      title: title || 'Mock Interview',
      type,
      targetRole: targetRole.trim(),
      targetCompany: targetCompany.trim() || undefined,
      difficulty,
      questionCount,
    }

    const res = await fetch('/api/interview/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to create session')
      setLoading(false)
      return
    }

    const { session } = await res.json()
    router.push(`/tools/interviewPrep/session/${session.id}`)
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">New Interview Session</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Configure your mock interview.</p>
      </div>

      {/* Type */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold text-[var(--color-text-primary)]">Interview Type</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['behavioral', 'technical', 'system_design', 'case_study'] as InterviewType[]).map((t) => (
            <SessionModeCard key={t} type={t} selected={type === t} onClick={() => setType(t)} />
          ))}
        </div>
      </fieldset>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">Target Role *</label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Senior Software Engineer"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">Target Company (optional)</label>
        <input
          type="text"
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
          placeholder="e.g. Google, Meta, Stripe…"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      {/* Difficulty */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-[var(--color-text-primary)]">Difficulty</legend>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={[
                'flex-1 rounded-xl border py-2 text-sm font-medium capitalize transition-colors',
                difficulty === d
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50',
              ].join(' ')}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Question count */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-[var(--color-text-primary)]">Questions</legend>
        <div className="flex gap-2">
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={[
                'flex-1 rounded-xl border py-2 text-sm font-medium transition-colors',
                questionCount === n
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button
        onClick={handleStart}
        disabled={loading}
        className={[
          'rounded-xl py-3 text-sm font-semibold transition-colors',
          loading
            ? 'cursor-not-allowed bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)]'
            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        ].join(' ')}
      >
        {loading ? 'Creating session…' : 'Start Interview →'}
      </button>
    </div>
  )
}
```

---

## Task 10 — Page: Live Session

**File:** `app/(app)/tools/interviewPrep/session/[id]/page.tsx`

```typescript
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { getSessionWithExchanges } from '@/data/repositories/interview.repo'
import { SessionClient } from './_SessionClient'

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params
  const session = await getSessionWithExchanges(id, userId)
  if (!session) notFound()

  if (session.status === 'completed') {
    redirect(`/tools/interviewPrep/session/${id}/results`)
  }

  return <SessionClient session={session} />
}
```

**File:** `app/(app)/tools/interviewPrep/session/[id]/_SessionClient.tsx`

```typescript
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionDisplay } from '../../_components/QuestionDisplay'
import { AnswerInput } from '../../_components/AnswerInput'
import { FeedbackPanel } from '../../_components/FeedbackPanel'
import { STARHints } from '../../_components/STARHints'
import { ProgressBar } from '../../_components/ProgressBar'
import type { SessionWithExchanges, InterviewExchange, FeedbackResult } from '@/types/interview'

interface SessionClientProps {
  session: SessionWithExchanges
}

type UIPhase = 'answering' | 'feedback' | 'loading_next' | 'completing'

export function SessionClient({ session: initialSession }: SessionClientProps) {
  const router = useRouter()
  const [session, setSession] = useState(initialSession)
  const [currentExchange, setCurrentExchange] = useState<InterviewExchange>(
    initialSession.exchanges[initialSession.exchanges.length - 1],
  )
  const [answer, setAnswer] = useState('')
  const [duration, setDuration] = useState(0)
  const [phase, setPhase] = useState<UIPhase>('answering')
  const [answeredCount, setAnsweredCount] = useState(
    initialSession.exchanges.filter((e) => e.userAnswer !== null).length,
  )

  const handleSubmit = useCallback(() => {
    if (answer.trim().length < 10) return
    setPhase('feedback')
  }, [answer])

  const handleFeedbackComplete = useCallback(
    (result: FeedbackResult) => {
      console.log('[session] feedback complete', result.score)
    },
    [],
  )

  async function handleNextQuestion() {
    const nextAnsweredCount = answeredCount + 1
    setAnsweredCount(nextAnsweredCount)

    if (nextAnsweredCount >= session.questionCount) {
      // Complete the session
      setPhase('completing')
      await fetch(`/api/interview/sessions/${session.id}/complete`, { method: 'POST' })
      router.push(`/tools/interviewPrep/session/${session.id}/results`)
      return
    }

    setPhase('loading_next')
    const res = await fetch(`/api/interview/sessions/${session.id}/next-question`, {
      method: 'POST',
    })
    if (!res.ok) return

    const { exchange } = await res.json() as { exchange: InterviewExchange }
    setSession((prev) => ({ ...prev, exchanges: [...prev.exchanges, exchange] }))
    setCurrentExchange(exchange)
    setAnswer('')
    setDuration(0)
    setPhase('answering')
  }

  if (phase === 'completing') {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-[var(--color-text-secondary)]">Generating your results…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <ProgressBar current={answeredCount} total={session.questionCount} />

      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">{session.title}</h1>
        <QuestionDisplay
          questionText={currentExchange.questionText}
          questionNumber={answeredCount + 1}
          totalQuestions={session.questionCount}
        />
      </div>

      <STARHints />

      {phase === 'answering' && (
        <AnswerInput
          value={answer}
          onChange={setAnswer}
          onSubmit={handleSubmit}
          disabled={false}
          onDurationChange={setDuration}
        />
      )}

      {phase === 'feedback' && (
        <>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-3">
            <p className="text-sm text-[var(--color-text-secondary)]">Your answer:</p>
            <p className="mt-1 text-sm text-[var(--color-text-primary)]">{answer}</p>
          </div>
          <FeedbackPanel
            sessionId={session.id}
            exchangeId={currentExchange.id}
            answer={answer}
            duration={duration}
            onFeedbackComplete={handleFeedbackComplete}
          />
          <button
            onClick={handleNextQuestion}
            className="self-end rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          >
            {answeredCount + 1 >= session.questionCount ? 'Finish Interview →' : 'Next Question →'}
          </button>
        </>
      )}

      {phase === 'loading_next' && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span className="animate-pulse">Generating next question…</span>
        </div>
      )}
    </div>
  )
}
```

---

## Task 11 — Page: Results

**File:** `app/(app)/tools/interviewPrep/session/[id]/results/page.tsx`

```typescript
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionWithExchanges } from '@/data/repositories/interview.repo'
import { SessionScoreCard } from '../../../_components/SessionScoreCard'
import type { SessionAssessment } from '@/types/interview'

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params
  const session = await getSessionWithExchanges(id, userId)
  if (!session) notFound()
  if (session.status !== 'completed') redirect(`/tools/interviewPrep/session/${id}`)

  const assessment: SessionAssessment = {
    overallScore: session.overallScore ?? 0,
    strengths: session.strengths,
    improvements: session.improvements,
    topActions: [],  // stored in improvements[3+] or reparsed from activityLog
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{session.title}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {session.type} · {session.difficulty} · {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/tools/interviewPrep"
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
        >
          ← Back
        </Link>
      </div>

      <SessionScoreCard assessment={assessment} />

      {/* Per-question breakdown */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">Question Breakdown</h2>
        <div className="flex flex-col gap-3">
          {session.exchanges.map((ex, i) => (
            <div
              key={ex.id}
              className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Q{i + 1}: {ex.questionText}
                </p>
                {ex.starScore !== null && (
                  <span className="shrink-0 text-sm font-bold text-[var(--color-primary)]">
                    {ex.starScore}/100
                  </span>
                )}
              </div>
              {ex.userAnswer && (
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3">{ex.userAnswer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href={`/tools/interviewPrep/setup?type=${session.type}&role=${encodeURIComponent(session.targetRole)}&prefillDifficulty=${session.difficulty}`}
          className="flex-1 rounded-xl bg-[var(--color-primary)] py-3 text-center text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Practice Again
        </Link>
        <Link
          href="/tools/interviewPrep"
          className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
        >
          All Sessions
        </Link>
      </div>
    </div>
  )
}
```

---

## Task 12 — Page: Question Bank

**File:** `app/(app)/tools/interviewPrep/questions/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { bankQuestions } from '@/data/content/interviewQuestions'
import { QuestionBankCard } from '../_components/QuestionBankCard'

const ALL_CATEGORIES = Array.from(new Set(bankQuestions.map((q) => q.category))).sort()

export default function QuestionBankPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filtered = bankQuestions.filter((q) => {
    if (typeFilter !== 'all' && q.type !== typeFilter) return false
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false
    return true
  })

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Question Bank</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Browse {bankQuestions.length} curated questions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All Types" value="all" current={typeFilter} onChange={setTypeFilter} />
        {(['behavioral', 'technical', 'situational'] as const).map((t) => (
          <FilterChip key={t} label={t} value={t} current={typeFilter} onChange={setTypeFilter} />
        ))}
        <span className="w-px self-stretch bg-[var(--color-border)]" />
        <FilterChip label="All Levels" value="all" current={difficultyFilter} onChange={setDifficultyFilter} />
        {(['easy', 'medium', 'hard'] as const).map((d) => (
          <FilterChip key={d} label={d} value={d} current={difficultyFilter} onChange={setDifficultyFilter} />
        ))}
        <span className="w-px self-stretch bg-[var(--color-border)]" />
        <FilterChip label="All Categories" value="all" current={categoryFilter} onChange={setCategoryFilter} />
        {ALL_CATEGORIES.map((c) => (
          <FilterChip key={c} label={c} value={c} current={categoryFilter} onChange={setCategoryFilter} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((q) => (
          <QuestionBankCard key={q.id} question={q} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[var(--color-text-tertiary)]">No questions match your filters.</p>
      )}
    </div>
  )
}

function FilterChip({
  label,
  value,
  current,
  onChange,
}: {
  label: string
  value: string
  current: string
  onChange: (v: string) => void
}) {
  const active = current === value
  return (
    <button
      onClick={() => onChange(value)}
      className={[
        'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
        active
          ? 'bg-[var(--color-primary)] text-white'
          : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
```

---

## Task 13 — Wire into nav / feature registry

The hub page lives at `/tools/interviewPrep` (not under `[featureId]`). Two places to update:

### 13a. Feature registry — mark `interviewCoach` as redirecting

In `engines/ai/features/registry.ts`, find the `interviewCoach` feature entry and update its description to note the new dedicated page, OR leave it as-is and add a redirect in `app/(app)/tools/[featureId]/page.tsx`:

```typescript
// In app/(app)/tools/[featureId]/page.tsx (or the server component that renders it)
// Add at the top of the component:
if (params.featureId === 'interviewCoach') {
  redirect('/tools/interviewPrep')
}
```

### 13b. Sidebar / navigation

Wherever the tools list is rendered (check `app/(app)/_components/` or `components/nav/`), ensure `interviewPrep` links to `/tools/interviewPrep` rather than `/tools/interviewCoach`. This is a nav config change, not a new component.

---

## Task 14 — TypeScript check

After all files are written:
```bash
npx tsc --noEmit
```

Common fixes to anticipate:
- `params` in Next.js App Router is now `Promise<{...}>` — all route handlers above already use `await params`
- `jsonb` columns return `unknown` from Drizzle unless `.$type<T>()` is applied — already applied in schema
- `interviewSessions` and `interviewExchanges` must be exported from `data/schema/index.ts` and imported in the repo

---

## Execution Order

| # | Task | File(s) | Depends on |
|---|------|---------|-----------|
| 0 | Types | `types/interview.ts` | — |
| 1 | Schema | `data/schema/index.ts` | 0 |
| 2 | Migration | `npx drizzle-kit generate && migrate` | 1 |
| 3 | Repository | `data/repositories/interview.repo.ts` | 0, 1 |
| 4 | AI prompts | `engines/ai/prompts/interview.ts` | 0 |
| 5a | API: POST /sessions | `app/api/interview/sessions/route.ts` | 3, 4 |
| 5b | API: GET /sessions/[id] | `app/api/interview/sessions/[id]/route.ts` | 3 |
| 5c | API: answer | `…/answer/route.ts` | 3, 4 |
| 5d | API: next-question | `…/next-question/route.ts` | 3, 4 |
| 5e | API: complete | `…/complete/route.ts` | 3, 4 |
| 6 | Question bank data | `data/content/interviewQuestions.ts` | 0 |
| 7a | ProgressBar | component | — |
| 7b | SessionModeCard | component | 0 |
| 7c | QuestionDisplay | component | — |
| 7d | AnswerInput | component | — |
| 7e | STARHints | component | — |
| 7f | FeedbackPanel | component | 0 |
| 7g | SessionScoreCard | component | 0 |
| 7h | QuestionBankCard | component | 6 |
| 8 | Hub page | `interviewPrep/page.tsx` | 3, 7b |
| 9 | Setup page | `interviewPrep/setup/page.tsx` | 7b, 5a |
| 10 | Live session page | `session/[id]/page.tsx` + `_SessionClient.tsx` | 7c–7f, 5c, 5d |
| 11 | Results page | `session/[id]/results/page.tsx` | 7g, 3 |
| 12 | Question bank page | `questions/page.tsx` | 7h, 6 |
| 13 | Nav wiring | `[featureId]/page.tsx` + nav config | 8 |
| 14 | `tsc --noEmit` | — | all |

**Total tasks: 28 discrete implementation steps** (grouped as 38 files total).
