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
