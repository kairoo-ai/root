import { db } from '@/data/client'
import { skillAssessments } from '@/data/schema'
import type { LearningPlanItem } from '@/data/schema'
import { eq, desc, and } from 'drizzle-orm'

export type SkillAssessment = typeof skillAssessments.$inferSelect
export type NewSkillAssessment = typeof skillAssessments.$inferInsert

export async function createSkillAssessment(data: NewSkillAssessment): Promise<SkillAssessment> {
  const [row] = await db
    .insert(skillAssessments)
    .values({ ...data, updatedAt: new Date() })
    .returning()
  return row
}

export async function getSkillAssessments(userId: string): Promise<SkillAssessment[]> {
  return db
    .select()
    .from(skillAssessments)
    .where(eq(skillAssessments.userId, userId))
    .orderBy(desc(skillAssessments.createdAt))
}

export async function getSkillAssessmentById(
  id: string,
  userId: string,
): Promise<SkillAssessment | null> {
  const [row] = await db
    .select()
    .from(skillAssessments)
    .where(eq(skillAssessments.id, id))
    .limit(1)
  if (!row || row.userId !== userId) return null
  return row
}

export async function markResourceComplete(
  assessmentId: string,
  userId: string,
  skillName: string,
  resourceTitle: string,
  completed: boolean
) {
  const assessment = await db.query.skillAssessments.findFirst({
    where: and(eq(skillAssessments.id, assessmentId), eq(skillAssessments.userId, userId))
  })
  if (!assessment || !assessment.learningPlan) return null

  const updatedPlan = (assessment.learningPlan as LearningPlanItem[]).map(item => {
    if (item.skill !== skillName) return item
    return {
      ...item,
      resources: item.resources.map(r =>
        r.title === resourceTitle ? { ...r, completed } : r
      )
    }
  })

  return db.update(skillAssessments)
    .set({ learningPlan: updatedPlan as unknown as typeof skillAssessments.learningPlan._.data, updatedAt: new Date() })
    .where(and(eq(skillAssessments.id, assessmentId), eq(skillAssessments.userId, userId)))
    .returning()
}

export async function updateSkillAssessmentLearningPlan(
  id: string,
  userId: string,
  learningPlan: SkillAssessment['learningPlan'],
): Promise<SkillAssessment | null> {
  const [row] = await db
    .update(skillAssessments)
    .set({ learningPlan, updatedAt: new Date() })
    .where(eq(skillAssessments.id, id))
    .returning()
  if (!row || row.userId !== userId) return null
  return row
}
