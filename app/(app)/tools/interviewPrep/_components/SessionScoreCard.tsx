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
