import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/data/repositories/profiles.repo'
import { findUserById, upsertUserByClerkId } from '@/data/repositories/users.repo'
import { OnboardingWizard } from './_components/OnboardingWizard'

export default async function OnboardingPage() {
  try {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    // Ensure user exists in the database users table
    let dbUser = await findUserById(userId).catch(() => null)
    if (!dbUser) {
      const clerkUser = await currentUser()
      if (clerkUser) {
        dbUser = await upsertUserByClerkId(userId, {
          email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
          name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
          avatarUrl: clerkUser.imageUrl || null,
        })
      }
    }

    const profile = await getProfile(userId).catch(() => null)
    if (profile?.onboardingCompleted) redirect('/dashboard')

    return (
      <OnboardingWizard
        initialStep={profile?.onboardingStep ?? 0}
        initialData={{
          currentRole: profile?.currentRole ?? undefined,
          currentCompany: profile?.currentCompany ?? undefined,
          yearsExperience: profile?.yearsExperience ?? undefined,
          industry: profile?.industry ?? undefined,
          location: profile?.location ?? undefined,
          targetRole: profile?.targetRole ?? undefined,
          targetTimeline: profile?.targetTimeline ?? undefined,
          careerGoalShort: profile?.careerGoalShort ?? undefined,
          skills: (profile?.skills as string[] | undefined) ?? [],
          workStyle: profile?.workStyle ?? undefined,
          resumeText: profile?.resumeText ?? undefined,
          careerGoalLong: profile?.careerGoalLong ?? undefined,
        }}
      />
    )
  } catch (error) {
    if (error instanceof Error && (error.message.includes('DYNAMIC_SERVER_USAGE') || error.message.includes('dynamic server usage') || (error as any).digest === 'DYNAMIC_SERVER_USAGE')) {
      throw error
    }
    console.error('OnboardingPage render error:', error)
    throw error
  }
}
