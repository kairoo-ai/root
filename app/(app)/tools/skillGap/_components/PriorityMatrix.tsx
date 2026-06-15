'use client'
import { motion } from 'framer-motion'
import type { SkillGap } from '@/data/schema'

interface Props {
  gaps: SkillGap[]
}

type Quadrant = {
  label: string
  sublabel: string
  bg: string
  border: string
  dot: string
  filter: (g: SkillGap) => boolean
}

const quadrants: Quadrant[] = [
  {
    label: 'Do First',
    sublabel: 'High impact · High demand',
    bg: 'bg-teal-500/8',
    border: 'border-teal-500/20',
    dot: 'bg-teal-400',
    filter: g => g.priority === 'critical' && g.marketDemand === 'high',
  },
  {
    label: 'Plan',
    sublabel: 'High impact · Lower demand',
    bg: 'bg-blue-500/8',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
    filter: g => g.priority === 'critical' && g.marketDemand !== 'high',
  },
  {
    label: 'Delegate / Async',
    sublabel: 'Nice-to-have · High demand',
    bg: 'bg-amber-500/8',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
    filter: g => g.priority !== 'critical' && g.marketDemand === 'high',
  },
  {
    label: 'Deprioritise',
    sublabel: 'Nice-to-have · Lower demand',
    bg: 'bg-muted/30',
    border: 'border-border',
    dot: 'bg-muted-foreground',
    filter: g => g.priority !== 'critical' && g.marketDemand !== 'high',
  },
]

export function PriorityMatrix({ gaps }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quadrants.map((q, qi) => {
        const items = gaps.filter(q.filter)
        return (
          <motion.div
            key={qi}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: qi * 0.07 }}
            className={`rounded-2xl border ${q.bg} ${q.border} p-4 min-h-[120px]`}
          >
            <p className="text-xs font-bold text-foreground mb-0.5">{q.label}</p>
            <p className="text-[10px] text-muted-foreground mb-3">{q.sublabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {items.length === 0 && (
                <p className="text-[10px] text-muted-foreground/50 italic">None</p>
              )}
              {items.map(g => (
                <span
                  key={g.skill}
                  className="inline-flex items-center gap-1 text-[10px] font-medium bg-background/60 border border-border rounded-full px-2 py-0.5"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${q.dot} shrink-0`} />
                  {g.skill}
                </span>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
