import { db } from '@/data/client'
import { userProfiles } from '@/data/schema'
import { eq } from 'drizzle-orm'

export type UserProfile = typeof userProfiles.$inferSelect
export type UserProfileUpdate = Partial<Omit<UserProfile, 'userId'>>

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1)
  return profile ?? null
}

export async function upsertProfile(userId: string, data: UserProfileUpdate): Promise<UserProfile> {
  const cleanData = { ...data }
  if (cleanData.yearsExperience === '' as any || cleanData.yearsExperience === null || cleanData.yearsExperience === undefined) {
    cleanData.yearsExperience = null
  } else if (typeof cleanData.yearsExperience === 'string') {
    const parsed = parseInt(cleanData.yearsExperience, 10)
    cleanData.yearsExperience = isNaN(parsed) ? null : parsed
  }

  const [profile] = await db
    .insert(userProfiles)
    .values({ userId, ...cleanData, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: { ...cleanData, updatedAt: new Date() },
    })
    .returning()
  return profile
}

export async function markOnboardingComplete(userId: string): Promise<void> {
  await db
    .update(userProfiles)
    .set({ onboardingCompleted: true, onboardingStep: 5, updatedAt: new Date() })
    .where(eq(userProfiles.userId, userId))
}
