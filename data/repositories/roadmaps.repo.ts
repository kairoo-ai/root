// data/repositories/roadmaps.repo.ts
import { db } from '@/data/client'
import { roadmaps } from '@/data/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import type { RoadmapPlanJson } from '@/types/roadmap'

export type Roadmap = typeof roadmaps.$inferSelect

export async function getRoadmapsForUser(userId: string): Promise<Roadmap[]> {
  return db.select().from(roadmaps).where(eq(roadmaps.userId, userId))
}

export async function getRoadmapById(id: string, userId: string): Promise<Roadmap | null> {
  const [row] = await db
    .select()
    .from(roadmaps)
    .where(and(eq(roadmaps.id, id), eq(roadmaps.userId, userId)))
    .limit(1)
  return row ?? null
}

export async function createRoadmap(
  userId: string,
  title: string,
  goal: string,
  planJson: RoadmapPlanJson,
): Promise<Roadmap> {
  const [row] = await db
    .insert(roadmaps)
    .values({ id: nanoid(), userId, title, goal, planJson, status: 'active' })
    .returning()
  return row
}

export async function updateRoadmapPlan(
  id: string,
  userId: string,
  planJson: RoadmapPlanJson,
): Promise<Roadmap | null> {
  const [row] = await db
    .update(roadmaps)
    .set({ planJson, updatedAt: new Date() })
    .where(and(eq(roadmaps.id, id), eq(roadmaps.userId, userId)))
    .returning()
  return row ?? null
}

export async function getTodaysFocus(userId: string) {
  const userRoadmaps = await getRoadmapsForUser(userId)
  for (const roadmap of userRoadmaps) {
    const plan = roadmap.planJson as RoadmapPlanJson | null
    if (!plan?.phases) continue
    for (const phase of plan.phases) {
      for (const step of phase.steps) {
        if (step.status === 'in_progress') {
          return { roadmap, phase, step }
        }
      }
    }
    // If no in_progress, return the first todo step
    for (const phase of plan.phases) {
      for (const step of phase.steps) {
        if (step.status === 'todo') {
          return { roadmap, phase, step }
        }
      }
    }
  }
  return null
}

export async function patchStepStatus(
  id: string,
  userId: string,
  phaseId: string,
  stepId: string,
  status: 'todo' | 'in_progress' | 'done',
): Promise<Roadmap | null> {
  const roadmap = await getRoadmapById(id, userId)
  if (!roadmap) return null

  const plan = roadmap.planJson as RoadmapPlanJson | null
  if (!plan?.phases) return null

  const updatedPhases = plan.phases.map((phase) => {
    if (phase.id !== phaseId) return phase
    return {
      ...phase,
      steps: phase.steps.map((step) => {
        if (step.id !== stepId) return step
        return {
          ...step,
          status,
          completedAt: status === 'done' ? new Date().toISOString() : undefined,
        }
      }),
    }
  })

  const updatedPlan: RoadmapPlanJson = { ...plan, phases: updatedPhases }
  return updateRoadmapPlan(id, userId, updatedPlan)
}
