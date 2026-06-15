'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { SkillGap, LearningPlanItem } from '@/data/schema'

interface Props {
  gap: SkillGap
  plan?: LearningPlanItem
  index: number
}

const priorityConfig: Record<SkillGap['priority'], { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  important: { label: 'Important', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  nice: { label: 'Nice to have', color: 'text-muted-foreground bg-muted/30 border-border' },
}

const demandConfig: Record<SkillGap['marketDemand'], string> = {
  high: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  low: 'text-muted-foreground bg-muted/30 border-border',
}

const resourceTypeIcon: Record<string, string> = {
  course: '🎓',
  book: '📖',
  article: '📄',
  video: '▶️',
  practice: '🛠',
}

export function SkillGapCard({ gap, plan, index }: Props) {
  const pCfg = priorityConfig[gap.priority]
  const dCfg = demandConfig[gap.marketDemand]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">{gap.skill}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">{gap.category}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${pCfg.color}`}>
            {pCfg.label}
          </span>
          <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${dCfg}`}>
            {gap.marketDemand} demand
          </span>
        </div>
      </div>

      {/* Level progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Your level</span>
          <span className="font-semibold text-foreground">{gap.currentLevel} / 5</span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${(gap.currentLevel / 5) * 100}%` }}
            transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Target level</span>
          <span className="font-semibold text-foreground">{gap.requiredLevel} / 5</span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/30"
            style={{ width: `${(gap.requiredLevel / 5) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Gap: <span className="font-semibold text-foreground">+{gap.delta} levels</span>
          {plan && (
            <span className="ml-2 text-teal-400">· ~{plan.weeks} week{plan.weeks > 1 ? 's' : ''} to close</span>
          )}
        </p>
      </div>

      {/* Resources */}
      {plan && plan.resources.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">Resources</p>
          {plan.resources.map((r, ri) => (
            <a
              key={ri}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span>{resourceTypeIcon[r.type] ?? '🔗'}</span>
              <span className="flex-1 truncate group-hover:underline underline-offset-2">{r.title}</span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  )
}
