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
