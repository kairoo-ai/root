'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, RoadmapStep } from '@/types/roadmap'

const PHASE_BORDER: Record<string, string> = {
  teal:   'border-teal-500/30 bg-teal-500/5',
  blue:   'border-blue-500/30 bg-blue-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  amber:  'border-amber-500/30 bg-amber-500/5',
  rose:   'border-rose-500/30 bg-rose-500/5',
  orange: 'border-orange-500/30 bg-orange-500/5',
}

function StatusDot({ status }: { status: RoadmapStep['status'] }) {
  if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-teal-400" />
  if (status === 'in_progress') return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <div className="absolute w-5 h-5 rounded-full bg-blue-500/20 animate-ping" />
      <div className="w-3 h-3 rounded-full bg-blue-500" />
    </div>
  )
  return <Circle className="w-5 h-5 text-muted-foreground/30" />
}

interface Props {
  phases: RoadmapPhase[]
  onStepClick: (phaseId: string, step: RoadmapStep) => void
}

export function RoadmapTimeline({ phases, onStepClick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={scrollRef} className="overflow-x-auto pb-4 -mx-6 px-6">
      <div className="flex gap-6 min-w-max">
        {phases.map((phase) => (
          <div key={phase.id} className="flex flex-col gap-1">
            {/* Phase header */}
            <div className={cn('text-[10px] font-bold px-3 py-1 rounded-lg border mb-2 self-start', PHASE_BORDER[phase.color] ?? PHASE_BORDER.teal)}>
              {phase.title}
            </div>
            {/* Steps column */}
            <div className="flex flex-col gap-0">
              {phase.steps.map((step, si) => (
                <div key={step.id} className="flex gap-3 items-start">
                  {/* Connector line + dot */}
                  <div className="flex flex-col items-center pt-1">
                    <StatusDot status={step.status} />
                    {si < phase.steps.length - 1 && (
                      <div className={cn(
                        'w-px flex-1 mt-1 mb-0',
                        step.status === 'done' ? 'bg-teal-500/40' : 'bg-border'
                      )} style={{ minHeight: 28 }} />
                    )}
                  </div>
                  {/* Step card */}
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => onStepClick(phase.id, step)}
                    className={cn(
                      'w-52 rounded-xl border p-3 text-left transition-colors cursor-pointer mb-1',
                      step.status === 'done'
                        ? 'border-teal-500/20 bg-teal-500/5'
                        : step.status === 'in_progress'
                        ? 'border-blue-500/30 bg-blue-500/5'
                        : 'border-border bg-card hover:border-border/70'
                    )}
                  >
                    <div className={cn(
                      'text-xs font-semibold leading-snug',
                      step.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
                    )}>
                      {step.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground/50 mt-1">{step.duration}</div>
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
