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

  const handleFeedbackComplete = useCallback((result: FeedbackResult) => {
    console.log('[session] feedback complete', result.score)
  }, [])

  async function handleNextQuestion() {
    const nextAnsweredCount = answeredCount + 1
    setAnsweredCount(nextAnsweredCount)

    if (nextAnsweredCount >= session.questionCount) {
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

    const { exchange } = (await res.json()) as { exchange: InterviewExchange }
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
