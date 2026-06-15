'use client'
import { motion } from 'framer-motion'
import { TracingBeam } from '@/components/aceternity'
import type { LearningPlanItem } from '@/data/schema'

interface Props {
  plan: LearningPlanItem[]
}

// Build week-by-week view: figure out which skills are active per week
function buildWeekMap(plan: LearningPlanItem[]): Map<number, LearningPlanItem[]> {
  const map = new Map<number, LearningPlanItem[]>()
  let cursor = 1
  for (const item of plan) {
    for (let w = cursor; w < cursor + item.weeks; w++) {
      const existing = map.get(w) ?? []
      map.set(w, [...existing, item])
    }
    cursor += item.weeks
  }
  return map
}

const weekColors = [
  'bg-teal-500/15 border-teal-500/25 text-teal-400',
  'bg-blue-500/15 border-blue-500/25 text-blue-400',
  'bg-violet-500/15 border-violet-500/25 text-violet-400',
  'bg-amber-500/15 border-amber-500/25 text-amber-400',
  'bg-pink-500/15 border-pink-500/25 text-pink-400',
  'bg-cyan-500/15 border-cyan-500/25 text-cyan-400',
]

export function LearningPlanTimeline({ plan }: Props) {
  if (plan.length === 0) return null

  const weekMap = buildWeekMap(plan)
  const totalWeeks = Math.max(...Array.from(weekMap.keys()))

  return (
    <TracingBeam>
      <div className="space-y-3">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => {
          const items = weekMap.get(week) ?? []
          return (
            <motion.div
              key={week}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: (week - 1) * 0.06 }}
              className="flex gap-4 items-start"
            >
              {/* Week pill */}
              <div className="shrink-0 w-14 h-7 rounded-lg bg-muted/40 border border-border flex items-center justify-center">
                <span className="text-[10px] font-bold text-muted-foreground">Wk {week}</span>
              </div>

              {/* Skills active this week */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                {items.map((item, ii) => (
                  <span
                    key={item.skill}
                    className={`inline-flex items-center text-[11px] font-semibold border rounded-xl px-3 py-1 ${weekColors[(ii + week) % weekColors.length]}`}
                  >
                    {item.skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </TracingBeam>
  )
}
