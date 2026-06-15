// app/(app)/roadmaps/[id]/_components/RoadmapProgress.tsx
'use client'
import { motion } from 'framer-motion'

interface Props {
  percent: number  // 0–100
  doneCount: number
  totalCount: number
  totalWeeks: number
  weeksRemaining: number
}

export function RoadmapProgress({ percent, doneCount, totalCount, totalWeeks, weeksRemaining }: Props) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-border bg-card p-5">
      {/* SVG ring */}
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
          <motion.circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke="rgb(20 184 166)"  /* teal-500 */
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold text-foreground leading-none">{percent}%</span>
          <span className="text-[9px] text-muted-foreground mt-0.5">done</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
        <div>
          <div className="text-xs text-muted-foreground">Steps done</div>
          <div className="font-bold text-foreground">{doneCount} / {totalCount}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Weeks left</div>
          <div className="font-bold text-foreground">{weeksRemaining} / {totalWeeks}</div>
        </div>
      </div>
    </div>
  )
}
