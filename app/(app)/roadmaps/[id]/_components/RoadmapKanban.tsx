// app/(app)/roadmaps/[id]/_components/RoadmapKanban.tsx
'use client'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, RoadmapStep } from '@/types/roadmap'

type StepStatus = RoadmapStep['status']

const COLUMNS: { id: StepStatus; label: string; color: string }[] = [
  { id: 'todo',        label: 'To Do',       color: 'text-muted-foreground border-border' },
  { id: 'in_progress', label: 'In Progress',  color: 'text-blue-400 border-blue-500/20' },
  { id: 'done',        label: 'Done',         color: 'text-teal-400 border-teal-500/20' },
]

interface FlatStep extends RoadmapStep { phaseId: string; phaseTitle: string }

interface Props {
  phases: RoadmapPhase[]
  onStatusChange: (phaseId: string, stepId: string, status: StepStatus) => void
  onStepClick: (phaseId: string, step: RoadmapStep) => void
}

export function RoadmapKanban({ phases, onStatusChange, onStepClick }: Props) {
  const flat: FlatStep[] = phases.flatMap((p) =>
    p.steps.map((s) => ({ ...s, phaseId: p.id, phaseTitle: p.title }))
  )

  const byStatus = (status: StepStatus) => flat.filter((s) => s.status === status)

  const move = (step: FlatStep, direction: -1 | 1) => {
    const order: StepStatus[] = ['todo', 'in_progress', 'done']
    const idx = order.indexOf(step.status)
    const next = order[idx + direction]
    if (next) onStatusChange(step.phaseId, step.id, next)
  }

  return (
    <div className="grid grid-cols-3 gap-3 min-h-[400px]">
      {COLUMNS.map((col) => (
        <div key={col.id} className="flex flex-col gap-2">
          <div className={cn('text-[11px] font-bold px-2 py-1 rounded-lg border', col.color, 'bg-transparent')}>
            {col.label} <span className="text-muted-foreground/50 font-normal ml-1">{byStatus(col.id).length}</span>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {byStatus(col.id).map((step) => (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-border bg-card p-3 cursor-pointer group hover:border-border/60 transition-colors"
                onClick={() => onStepClick(step.phaseId, step)}
              >
                <div className="text-[10px] text-muted-foreground/50 mb-1">{step.phaseTitle}</div>
                <div className="text-sm font-medium text-foreground leading-snug">{step.title}</div>
                <div className="text-[10px] text-teal-400 mt-1">{step.duration}</div>
                {/* Move buttons */}
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {step.status !== 'todo' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); move(step, -1) }}
                      className="w-6 h-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                  {step.status !== 'done' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); move(step, 1) }}
                      className="w-6 h-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                  <span className="text-[9px] text-muted-foreground/40 ml-auto">+{step.xpReward} XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
