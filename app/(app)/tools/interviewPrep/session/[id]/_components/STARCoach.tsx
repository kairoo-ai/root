'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface STARCoachProps {
  answer: string
  question: string
  className?: string
}

const STAR_KEYWORDS = {
  situation: ['when', 'while', 'at my', 'in my', 'during', 'working at', 'my team', 'our company'],
  task: ['responsible for', 'tasked with', 'my role was', 'needed to', 'had to', 'was asked', 'goal was'],
  action: ['i decided', 'i implemented', 'i created', 'i built', 'i reached out', 'i proposed', 'i led', 'i designed', 'i developed', 'i collaborated', 'i introduced', 'i analyzed'],
  result: ['resulted in', 'increased', 'decreased', 'reduced', 'improved', 'saved', 'grew', 'achieved', 'delivered', 'outcome was', 'as a result', '%', 'by 2x', '3x', 'million', 'thousand'],
}

function detectSTAR(text: string): Record<keyof typeof STAR_KEYWORDS, boolean> {
  const lower = text.toLowerCase()
  return {
    situation: STAR_KEYWORDS.situation.some(k => lower.includes(k)),
    task: STAR_KEYWORDS.task.some(k => lower.includes(k)),
    action: STAR_KEYWORDS.action.some(k => lower.includes(k)),
    result: STAR_KEYWORDS.result.some(k => lower.includes(k)),
  }
}

const STAR_LABELS: Record<string, { label: string; tip: string; color: string }> = {
  situation: { label: 'Situation', tip: 'Set the scene - when, where, what was happening?', color: 'bg-blue-500' },
  task: { label: 'Task', tip: 'What was your specific responsibility?', color: 'bg-violet-500' },
  action: { label: 'Action', tip: 'What exactly did YOU do? Use "I", not "we".', color: 'bg-amber-500' },
  result: { label: 'Result', tip: 'Quantify the outcome - numbers, %, time saved.', color: 'bg-emerald-500' },
}

export function STARCoach({ answer, className }: STARCoachProps) {
  const detected = useMemo(() => detectSTAR(answer), [answer])
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length
  const completedCount = Object.values(detected).filter(Boolean).length

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">STAR Framework</p>
        <span className={cn('text-xs font-medium', completedCount === 4 ? 'text-emerald-500' : 'text-muted-foreground')}>
          {completedCount}/4 detected
        </span>
      </div>
      <div className="space-y-2">
        {(Object.keys(STAR_LABELS) as Array<keyof typeof STAR_KEYWORDS>).map((key) => {
          const { label, tip, color } = STAR_LABELS[key]
          const done = detected[key]
          return (
            <motion.div
              key={key}
              className={cn('flex items-start gap-2.5 rounded-lg p-2 transition-colors', done ? 'bg-muted/50' : 'bg-transparent')}
              animate={{ opacity: done ? 1 : 0.6 }}
            >
              <div className={cn('mt-0.5 h-3 w-3 shrink-0 rounded-full transition-colors', done ? color : 'bg-border')} />
              <div>
                <p className={cn('text-xs font-semibold', done ? 'text-foreground' : 'text-muted-foreground')}>
                  {label}
                  {done && <span className="ml-1 text-emerald-500">✓</span>}
                </p>
                <AnimatePresence>
                  {!done && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-xs text-muted-foreground"
                    >
                      {tip}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{wordCount} words</span>
          <span className={cn(wordCount < 80 ? 'text-amber-500' : wordCount > 400 ? 'text-red-500' : 'text-emerald-500')}>
            {wordCount < 80 ? 'Too short' : wordCount > 400 ? 'Too long' : 'Good length'}
          </span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
          <motion.div
            className={cn('h-full rounded-full', wordCount < 80 ? 'bg-amber-500' : wordCount > 400 ? 'bg-red-500' : 'bg-emerald-500')}
            animate={{ width: `${Math.min(100, (wordCount / 250) * 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}
