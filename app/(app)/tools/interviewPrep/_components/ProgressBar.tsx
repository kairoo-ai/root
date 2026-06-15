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
