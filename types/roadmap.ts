// types/roadmap.ts

export type StepStatus = 'todo' | 'in_progress' | 'done'

export type ResourceType = 'article' | 'video' | 'course' | 'book'

export interface RoadmapResource {
  title: string
  url: string
  type: ResourceType
}

export interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string       // e.g. "2 weeks"
  status: StepStatus
  resources: RoadmapResource[]
  xpReward: number
  completedAt?: string   // ISO date string
}

export interface RoadmapPhase {
  id: string
  title: string          // e.g. "Foundation", "Core Skills"
  color: string          // Tailwind token e.g. "teal", "blue", "purple", "amber"
  steps: RoadmapStep[]
}

export interface RoadmapPlanJson {
  phases: RoadmapPhase[]
  targetRole: string
  totalWeeks: number
  generatedAt: string    // ISO date string
}

/** Type guard - distinguishes new phase-based planJson from legacy steps[] shape */
export function isPhasedPlan(plan: unknown): plan is RoadmapPlanJson {
  return (
    typeof plan === 'object' &&
    plan !== null &&
    'phases' in plan &&
    Array.isArray((plan as RoadmapPlanJson).phases)
  )
}

/** Flatten all steps from all phases into a single array */
export function flattenSteps(plan: RoadmapPlanJson): RoadmapStep[] {
  return plan.phases.flatMap((p) => p.steps)
}

/** Compute % steps done (0–100) */
export function computeProgress(plan: RoadmapPlanJson): number {
  const all = flattenSteps(plan)
  if (all.length === 0) return 0
  return Math.round((all.filter((s) => s.status === 'done').length / all.length) * 100)
}
