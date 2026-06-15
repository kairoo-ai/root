'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { upsertProfile, markOnboardingComplete } from '@/data/repositories/profiles.repo'

interface EducationEntry {
  degree: string
  field: string
  institution: string
  year?: string
}

interface StepData {
  currentRole?: string
  currentCompany?: string
  yearsExperience?: number
  industry?: string
  location?: string
  targetRole?: string
  targetTimeline?: string
  careerGoalShort?: string
  careerGoalLong?: string
  skills?: string[]
  education?: EducationEntry[]
  certifications?: string[]
  resumeText?: string
  workStyle?: string
  learningStyle?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  naukriUrl?: string
  otherUrl?: string
  employmentStatus?: string
  currentSalary?: string
  targetSalary?: string
}

export async function saveOnboardingStep(step: number, data: StepData): Promise<void> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await upsertProfile(userId, {
    ...data,
    onboardingStep: step + 1,
  })
}

export async function completeOnboarding(data: StepData): Promise<void> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await upsertProfile(userId, {
    ...data,
    onboardingCompleted: true,
    onboardingStep: 7,
  })
}
