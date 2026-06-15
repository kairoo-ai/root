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
