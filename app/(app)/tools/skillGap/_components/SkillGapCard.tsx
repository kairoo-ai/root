'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, CheckCircle2, Circle, TrendingUp } from 'lucide-react'
import type { SkillGap, LearningPlanItem, LearningResource } from '@/data/schema'
import { GlowingEffect } from '@/components/aceternity/GlowingEffect'
import { getResourcesForSkill, getSalaryDelta } from '@/data/content/skillResources'

const learningStyleOrder: Record<string, string[]> = {
  visual: ['video', 'course', 'article', 'book', 'practice'],
  reading: ['book', 'article', 'course', 'video', 'practice'],
  'hands-on': ['practice', 'course', 'video', 'book', 'article'],
}

function sortResourcesByStyle(resources: LearningResource[], style?: string | null): LearningResource[] {
  if (!style) return resources
  const order = learningStyleOrder[style.toLowerCase()] ?? ['course', 'video', 'book', 'article', 'practice']
  return [...resources].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
}

interface Props {
  gap: SkillGap
  plan?: LearningPlanItem
  index: number
  assessmentId?: string
  learningStyle?: string | null
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

export function SkillGapCard({ gap, plan, index, assessmentId, learningStyle }: Props) {
  const pCfg = priorityConfig[gap.priority]
  const dCfg = demandConfig[gap.marketDemand]
  const salaryDelta = getSalaryDelta(gap.skill)
  const realResources = getResourcesForSkill(gap.skill).slice(0, 3)

  // Local optimistic state for resource completion (sorted by learning style)
  const [resources, setResources] = useState<LearningResource[]>(
    sortResourcesByStyle(plan?.resources ?? [], learningStyle)
  )
  const [toggling, setToggling] = useState<string | null>(null)

  async function handleToggle(resource: LearningResource) {
    if (!assessmentId || !plan) return
    const next = !resource.completed
    const key = resource.title
    setToggling(key)
    // Optimistic update
    setResources(prev =>
      prev.map(r => r.title === key ? { ...r, completed: next } : r)
    )
    try {
      await fetch(`/api/skill-assessments/${assessmentId}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName: plan.skill, resourceTitle: key, completed: next }),
      })
    } catch {
      // Revert on failure
      setResources(prev =>
        prev.map(r => r.title === key ? { ...r, completed: !next } : r)
      )
    } finally {
      setToggling(null)
    }
  }

  const completedCount = resources.filter(r => r.completed).length
  const totalCount = resources.length

  return (
    <GlowingEffect className="rounded-2xl">
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
            <motion.div
              className="h-full rounded-full bg-primary/30"
              initial={{ width: 0 }}
              animate={{ width: `${(gap.requiredLevel / 5) * 100}%` }}
              transition={{ duration: 0.6, delay: index * 0.05 + 0.25 }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Gap: <span className="font-semibold text-foreground">+{gap.delta} levels</span>
            {plan && (
              <span className="ml-2 text-teal-400">· ~{plan.weeks} week{plan.weeks > 1 ? 's' : ''} to close</span>
            )}
          </p>
          {salaryDelta && (
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1">
              <TrendingUp className="w-3 h-3 shrink-0" />
              <span className="font-semibold">+${(salaryDelta.usdDelta / 1000).toFixed(0)}k/yr</span>
              <span className="text-muted-foreground">salary impact · demand score {salaryDelta.demandScore}</span>
            </div>
          )}
        </div>

        {/* Real course resources (shown when no plan resources available) */}
        {(!plan || resources.length === 0) && realResources.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground">Recommended Courses</p>
            {realResources.map((r, ri) => (
              <div key={ri} className="flex items-center gap-2 text-[11px] text-muted-foreground group">
                <span>{resourceTypeIcon[r.type] ?? '🔗'}</span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate hover:text-foreground hover:underline underline-offset-2 transition-colors"
                >
                  {r.title}
                </a>
                <span className={`shrink-0 text-[9px] font-bold border rounded-full px-1.5 py-0.5 ${r.free ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-muted-foreground border-border bg-muted/20'}`}>
                  {r.free ? 'FREE' : 'PAID'}
                </span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}

        {/* Resources */}
        {plan && resources.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-muted-foreground">Resources</p>
              {assessmentId && (
                <span className="text-[10px] text-muted-foreground">
                  {completedCount}/{totalCount} done
                </span>
              )}
            </div>
            {/* Progress bar for resource completion */}
            {assessmentId && totalCount > 0 && (
              <div className="h-1 rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-teal-500"
                  animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
            {resources.map((r, ri) => (
              <div
                key={ri}
                className="flex items-center gap-2 text-[11px] text-muted-foreground group"
              >
                {assessmentId ? (
                  <button
                    type="button"
                    onClick={() => handleToggle(r)}
                    disabled={toggling === r.title}
                    className="shrink-0 transition-opacity disabled:opacity-50"
                    aria-label={r.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {r.completed
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      : <Circle className="w-3.5 h-3.5 text-border group-hover:text-muted-foreground transition-colors" />
                    }
                  </button>
                ) : (
                  <span>{resourceTypeIcon[r.type] ?? '🔗'}</span>
                )}
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 truncate hover:text-foreground hover:underline underline-offset-2 transition-colors ${r.completed ? 'line-through text-muted-foreground/50' : ''}`}
                >
                  {assessmentId && <span className="mr-1">{resourceTypeIcon[r.type] ?? '🔗'}</span>}
                  {r.title}
                </a>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </GlowingEffect>
  )
}
