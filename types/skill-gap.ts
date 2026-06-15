// Re-export skill gap domain types from the schema for use across the app.
// Keep this file as the single import point for consumers outside data/.

export type {
  SkillEntry,
  TargetSkillEntry,
  SkillGap,
  LearningResource,
  LearningPlanItem,
} from '@/data/schema'

export type { SkillAssessment, NewSkillAssessment } from '@/data/repositories/skillAssessments.repo'
