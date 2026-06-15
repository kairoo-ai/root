'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { upsertProfile, markOnboardingComplete } from '@/data/repositories/profiles.repo'

interface StepData {
  currentRole?: string
  currentCompany?: string
  yearsExperience?: number | ''
  industry?: string
  location?: string
  targetRole?: string
  targetTimeline?: string
  careerGoalShort?: string
  careerGoalLong?: string
  skills?: string[]
  education?: { degree: string; field: string; institution: string; year: string }[]
  certifications?: string[]
  resumeText?: string
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  naukriUrl?: string
  otherUrl?: string
  workStyle?: string
  learningStyle?: string
}

export async function saveOnboardingStep(step: number, data: StepData): Promise<void> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { yearsExperience, education, ...rest } = data
  await upsertProfile(userId, {
    ...rest,
    ...(yearsExperience !== '' && yearsExperience !== undefined ? { yearsExperience } : {}),
    ...(education ? { education: education.map(e => ({ ...e, year: e.year ? parseInt(e.year, 10) || undefined : undefined })) } : {}),
    onboardingStep: step + 1,
  })
}

export async function completeOnboarding(data: StepData): Promise<void> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { yearsExperience, education, ...rest } = data
  await upsertProfile(userId, {
    ...rest,
    ...(yearsExperience !== '' && yearsExperience !== undefined ? { yearsExperience } : {}),
    ...(education ? { education: education.map(e => ({ ...e, year: e.year ? parseInt(e.year, 10) || undefined : undefined })) } : {}),
    onboardingCompleted: true,
    onboardingStep: 7,
  })
}
