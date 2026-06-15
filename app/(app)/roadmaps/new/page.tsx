import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/data/repositories/profiles.repo'
import { RoadmapWizard } from './_components/RoadmapWizard'

export default async function NewRoadmapPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const profile = await getProfile(userId)
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <RoadmapWizard
        defaultGoal={profile?.careerGoalShort ?? ''}
        defaultTargetRole={profile?.targetRole ?? ''}
      />
    </div>
  )
}
