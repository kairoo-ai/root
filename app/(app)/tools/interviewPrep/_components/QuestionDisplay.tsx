'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { TypewriterEffect } from '@/components/aceternity/TypewriterEffect'

interface QuestionDisplayProps {
  questionText: string
  questionNumber: number
  totalQuestions: number
}

export function QuestionDisplay({ questionText, questionNumber, totalQuestions }: QuestionDisplayProps) {
  const words = questionText.split(' ').map((w) => ({ text: w }))

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        Question {questionNumber} of {totalQuestions}
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={questionText}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <TypewriterEffect
            words={words}
            className="text-xl font-medium leading-relaxed text-[var(--color-text-primary)]"
            cursorClassName="bg-[var(--color-primary)]"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
