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
