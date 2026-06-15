'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Map, Calendar, Layers, Kanban, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPhasedPlan, computeProgress, flattenSteps } from '@/types/roadmap'
import type { RoadmapPlanJson, RoadmapStep } from '@/types/roadmap'
import { RoadmapProgress } from './RoadmapProgress'
import { RoadmapTimeline } from './RoadmapTimeline'
import { RoadmapKanban } from './RoadmapKanban'
import { RoadmapPhases } from './RoadmapPhases'
import { StepDrawer } from './StepDrawer'
import { AICoachPanel } from './AICoachPanel'

interface Roadmap {
  id: string
  title: string
  goal: string
  status: string
  planJson: unknown
  createdAt: Date
}

type ViewMode = 'timeline' | 'kanban' | 'phases'

const VIEW_TABS: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'kanban',   label: 'Kanban',   icon: Kanban },
  { id: 'phases',   label: 'Phases',   icon: Layers },
]

export function RoadmapDetail({ roadmap }: { roadmap: Roadmap }) {
  const router = useRouter()
  const [view, setView] = useState<ViewMode>('timeline')
  const [plan, setPlan] = useState<RoadmapPlanJson | null>(
    isPhasedPlan(roadmap.planJson) ? roadmap.planJson : null
  )
  const [activeStep, setActiveStep] = useState<RoadmapStep | null>(null)
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null)
  const [coachOpen, setCoachOpen] = useState(false)
  const [coachStep, setCoachStep] = useState<RoadmapStep | null>(null)

  const openStep = useCallback((phaseId: string, step: RoadmapStep) => {
    setActivePhaseId(phaseId)
    setActiveStep(step)
  }, [])

  const closeStep = useCallback(() => {
    setActiveStep(null)
    setActivePhaseId(null)
  }, [])

  const handleStatusChange = useCallback(async (phaseId: string, stepId: string, status: RoadmapStep['status']) => {
    // Optimistic update
    setPlan((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        phases: prev.phases.map((p) =>
          p.id !== phaseId ? p : {
            ...p,
            steps: p.steps.map((s) =>
              s.id !== stepId ? s : {
                ...s,
                status,
                completedAt: status === 'done' ? new Date().toISOString() : undefined,
              }
            ),
          }
        ),
      }
    })
    // Sync to server
    await fetch(`/api/roadmaps/${roadmap.id}/step`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phaseId, stepId, status }),
    })
  }, [roadmap.id])

  const openCoach = useCallback((step: RoadmapStep) => {
    setCoachStep(step)
    setCoachOpen(true)
    closeStep()
  }, [closeStep])

  const activePhaseTitle = plan?.phases.find((p) => p.id === activePhaseId)?.title ?? ''
  const progress = plan ? computeProgress(plan) : 0
  const allSteps = plan ? flattenSteps(plan) : []
  const weeksElapsed = plan
    ? Math.round((Date.now() - new Date(plan.generatedAt).getTime()) / (1000 * 60 * 60 * 24 * 7))
    : 0
  const weeksRemaining = Math.max(0, (plan?.totalWeeks ?? 0) - weeksElapsed)

  // Legacy planJson support
  const legacyPlan = !plan ? (roadmap.planJson as { steps?: { title: string; description: string; duration: string }[] } | null) : null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to roadmaps
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
          <Map className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">{roadmap.title}</h1>
            {plan?.targetRole && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
                {plan.targetRole}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{roadmap.goal}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground/50">
            <Calendar className="w-3 h-3" />
            Created {new Date(roadmap.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Progress ring (phased plans only) */}
      {plan && (
        <div className="mb-5">
          <RoadmapProgress
            percent={progress}
            doneCount={allSteps.filter((s) => s.status === 'done').length}
            totalCount={allSteps.length}
            totalWeeks={plan.totalWeeks}
            weeksRemaining={weeksRemaining}
          />
        </div>
      )}

      {/* View tabs (phased plans only) */}
      {plan && (
        <div className="flex gap-1 mb-5 bg-card border border-border rounded-xl p-1 w-fit">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
                  view === tab.id
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* View content */}
      {plan ? (
        <motion.div key={view} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
          {view === 'timeline' && <RoadmapTimeline phases={plan.phases} onStepClick={openStep} />}
          {view === 'kanban'   && <RoadmapKanban   phases={plan.phases} onStatusChange={handleStatusChange} onStepClick={openStep} />}
          {view === 'phases'   && <RoadmapPhases   phases={plan.phases} onStepClick={openStep} onStatusChange={handleStatusChange} />}
        </motion.div>
      ) : legacyPlan?.steps ? (
        // Legacy fallback
        <div className="space-y-3">
          {legacyPlan.steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0">{i + 1}</div>
                {i < (legacyPlan.steps?.length ?? 0) - 1 && <div className="flex-1 w-px bg-border" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="font-semibold text-sm text-foreground">{step.title}</div>
                <div className="text-[11.5px] text-muted-foreground mt-1 leading-relaxed">{step.description}</div>
                {step.duration && <div className="text-[10px] text-teal-400 mt-2 font-medium">{step.duration}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Roadmap content will appear here once generated by the AI tool.
        </div>
      )}

      {/* Step drawer */}
      <StepDrawer
        step={activeStep}
        phaseId={activePhaseId}
        phaseTitle={activePhaseTitle}
        onClose={closeStep}
        onStatusChange={handleStatusChange}
        onAskCoach={openCoach}
      />

      {/* AI Coach panel */}
      <AICoachPanel
        open={coachOpen}
        initialStep={coachStep}
        roadmapTitle={roadmap.title}
        onClose={() => setCoachOpen(false)}
      />
    </div>
  )
}
