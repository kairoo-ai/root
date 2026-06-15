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
        // malformed - show raw
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
