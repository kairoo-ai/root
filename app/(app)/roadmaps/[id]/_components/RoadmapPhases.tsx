// app/(app)/roadmaps/[id]/_components/RoadmapPhases.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, RoadmapStep } from '@/types/roadmap'

const COLOR_MAP: Record<string, string> = {
  teal:   'text-teal-400 bg-teal-500/10 border-teal-500/20',
  blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  amber:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  rose:   'text-rose-400 bg-rose-500/10 border-rose-500/20',
  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
}

function StepStatusIcon({ status }: { status: RoadmapStep['status'] }) {
  if (status === 'done') return <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
  if (status === 'in_progress') return <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
  return <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
}

interface Props {
  phases: RoadmapPhase[]
  onStepClick: (phaseId: string, step: RoadmapStep) => void
  onStatusChange: (phaseId: string, stepId: string, status: RoadmapStep['status']) => void
}

export function RoadmapPhases({ phases, onStepClick, onStatusChange }: Props) {
  const [open, setOpen] = useState<string>(phases[0]?.id ?? '')

  return (
    <div className="space-y-2">
      {phases.map((phase) => {
        const done = phase.steps.filter((s) => s.status === 'done').length
        const pct = phase.steps.length ? Math.round((done / phase.steps.length) * 100) : 0
        const colorCls = COLOR_MAP[phase.color] ?? COLOR_MAP.teal
        const isOpen = open === phase.id

        return (
          <div key={phase.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? '' : phase.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
            >
              <div className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', colorCls)}>
                {phase.title}
              </div>
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden mx-2">
                <motion.div
                  className="h-full bg-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{done}/{phase.steps.length}</span>
              <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground/50 transition-transform shrink-0', isOpen && 'rotate-180')} />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                    {phase.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/30 transition-colors group cursor-pointer"
                        onClick={() => onStepClick(phase.id, step)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const next: RoadmapStep['status'] =
                              step.status === 'todo' ? 'in_progress' :
                              step.status === 'in_progress' ? 'done' : 'todo'
                            onStatusChange(phase.id, step.id, next)
                          }}
                          className="mt-0.5 cursor-pointer"
                        >
                          <StepStatusIcon status={step.status} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={cn('text-sm font-medium text-foreground', step.status === 'done' && 'line-through text-muted-foreground')}>
                            {step.title}
                          </div>
                          <div className="text-[10px] text-teal-400 mt-0.5 font-medium">{step.duration}</div>
                        </div>
                        <span className="text-[10px] text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          +{step.xpReward} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
