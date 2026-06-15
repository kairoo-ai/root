import { pgTable, text, timestamp, integer, jsonb, boolean, uuid } from 'drizzle-orm/pg-core'
import type { ResumeSections } from '@/types/resume'

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  careerGoal: text('career_goal'),
  timezone: text('timezone').default('UTC'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: text('plan', { enum: ['free', 'pro', 'enterprise'] }).notNull().default('free'),
  status: text('status', { enum: ['active', 'cancelled', 'past_due', 'trialing'] }).notNull().default('active'),
  razorpaySubscriptionId: text('razorpay_subscription_id'),
  razorpayCustomerId: text('razorpay_customer_id'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const usageEvents = pgTable('usage_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  featureId: text('feature_id').notNull(),
  tokensUsed: integer('tokens_used').notNull().default(0),
  creditsUsed: integer('credits_used').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const roadmaps = pgTable('roadmaps', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  goal: text('goal').notNull(),
  planJson: jsonb('plan_json'),
  status: text('status', { enum: ['active', 'completed', 'archived'] }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const activityLog = pgTable('activity_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'ai_run' | 'roadmap_created' | 'goal_completed' | 'streak_milestone'
  featureId: text('feature_id'),
  title: text('title').notNull(),
  payloadJson: jsonb('payload_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const userProfiles = pgTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  // Current situation
  currentRole: text('current_role'),
  currentCompany: text('current_company'),
  yearsExperience: integer('years_experience'),
  industry: text('industry'),
  location: text('location'),
  // Where they're going
  targetRole: text('target_role'),
  targetTimeline: text('target_timeline'), // e.g. "12 months", "2 years"
  careerGoalShort: text('career_goal_short'), // 1-sentence
  careerGoalLong: text('career_goal_long'),   // full paragraph
  // Background
  skills: jsonb('skills').$type<string[]>().default([]),
  education: jsonb('education').$type<{ degree: string; field: string; institution: string; year?: number }[]>().default([]),
  certifications: jsonb('certifications').$type<string[]>().default([]),
  languages: jsonb('languages').$type<string[]>().default([]), // spoken + programming
  resumeText: text('resume_text'), // full resume paste
  // Links
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  portfolioUrl: text('portfolio_url'),
  // Preferences
  workStyle: text('work_style'), // 'remote' | 'hybrid' | 'onsite'
  learningStyle: text('learning_style'), // 'visual' | 'reading' | 'hands-on'
  // AI-generated context summary (refreshed on profile save)
  contextSummary: text('context_summary'),
  // Onboarding state
  onboardingCompleted: boolean('onboarding_completed').default(false),
  onboardingStep: integer('onboarding_step').default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  xpReward: integer('xp_reward').notNull().default(50),
  completed: boolean('completed').notNull().default(false),
  weekOf: text('week_of').notNull(), // ISO week string e.g. "2026-W24"
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const interviewSessions = pgTable('interview_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type', { enum: ['behavioral', 'technical', 'system_design', 'case_study'] }).notNull(),
  targetRole: text('target_role').notNull(),
  targetCompany: text('target_company'),
  personaId: text('persona_id'),
  difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).notNull().default('medium'),
  questionCount: integer('question_count').notNull().default(5),
  status: text('status', { enum: ['in_progress', 'completed'] }).notNull().default('in_progress'),
  overallScore: integer('overall_score'),
  strengths: jsonb('strengths').$type<string[]>().default([]),
  improvements: jsonb('improvements').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const interviewExchanges = pgTable('interview_exchanges', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => interviewSessions.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  questionType: text('question_type', { enum: ['behavioral', 'technical', 'situational'] }).notNull(),
  userAnswer: text('user_answer'),
  aiFeedback: text('ai_feedback'),
  starScore: integer('star_score'),
  keywords: jsonb('keywords').$type<string[]>().default([]),
  keywordsUsed: jsonb('keywords_used').$type<string[]>().default([]),
  duration: integer('duration'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const resumes = pgTable('resumes', {
  id: text('id').primaryKey(), // nanoid
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('Untitled Resume'),
  targetRole: text('target_role'),
  targetCompany: text('target_company'),
  jobDescription: text('job_description'),
  sections: jsonb('sections').$type<ResumeSections>().notNull(),
  templateId: text('template_id', { enum: ['minimal', 'modern', 'executive', 'creative'] })
    .notNull()
    .default('minimal'),
  atsScore: integer('ats_score'),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// --- Skill Gap ---

export type SkillEntry = {
  name: string
  level: number        // 0–5
  category: string
}

export type TargetSkillEntry = {
  name: string
  requiredLevel: number  // 0–5
  category: string
  marketDemand: 'high' | 'medium' | 'low'
}

export type SkillGap = {
  skill: string
  category: string
  currentLevel: number
  requiredLevel: number
  delta: number
  priority: 'critical' | 'important' | 'nice'
  marketDemand: 'high' | 'medium' | 'low'
}

export type LearningResource = {
  title: string
  url: string
  type: 'course' | 'book' | 'article' | 'video' | 'practice'
  completed?: boolean
}

export type LearningPlanItem = {
  skill: string
  weeks: number
  resources: LearningResource[]
}

export const skillAssessments = pgTable('skill_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  currentRole: text('current_role').notNull(),
  targetRole: text('target_role').notNull(),
  currentSkills: jsonb('current_skills').$type<SkillEntry[]>().notNull().default([]),
  targetSkills: jsonb('target_skills').$type<TargetSkillEntry[]>().notNull().default([]),
  gaps: jsonb('gaps').$type<SkillGap[]>().notNull().default([]),
  learningPlan: jsonb('learning_plan').$type<LearningPlanItem[]>().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// --- Chat Threads ---

export type ChatMessageRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string           // nanoid/uuid for keying
  role: ChatMessageRole
  content: string
  timestamp: string    // ISO string
}

export const chatThreads = pgTable('chat_threads', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  featureId: text('feature_id').notNull(),
  title: text('title').notNull(),
  messages: jsonb('messages').$type<ChatMessage[]>().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
