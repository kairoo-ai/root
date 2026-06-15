import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getAllActivity } from '@/data/repositories/activityLog.repo'
import { ActivityPageClient } from './_components/ActivityPageClient'

// Demo seed data
const DEMO_ACTIVITY = [
  { id: '1', type: 'ai_run', title: 'Generated cover letter for Google SWE role', featureId: 'cover-letter', createdAt: new Date(Date.now() - 1000 * 60 * 20), userId: 'demo', payloadJson: null },
  { id: '2', type: 'roadmap_created', title: 'Created 12-month roadmap: Staff Engineer track', featureId: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), userId: 'demo', payloadJson: null },
  { id: '3', type: 'goal_completed', title: 'Completed: Submit 5 applications this week', featureId: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), userId: 'demo', payloadJson: null },
  { id: '4', type: 'ai_run', title: 'Mock interview: System Design round', featureId: 'interview-prep', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), userId: 'demo', payloadJson: null },
  { id: '5', type: 'ai_run', title: 'Skill gap analysis vs Senior PM roles', featureId: 'skill-gap', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), userId: 'demo', payloadJson: null },
  { id: '6', type: 'streak_milestone', title: '7-day streak achieved!', featureId: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), userId: 'demo', payloadJson: null },
  { id: '7', type: 'ai_run', title: 'Resume tailored for Meta Product Manager', featureId: 'resume-builder', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), userId: 'demo', payloadJson: null },
  { id: '8', type: 'goal_completed', title: 'Completed: Finish system design course', featureId: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48 - 3600000), userId: 'demo', payloadJson: null },
  { id: '9', type: 'ai_run', title: 'Salary negotiation script generated', featureId: 'salary-negotiation', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), userId: 'demo', payloadJson: null },
  { id: '10', type: 'roadmap_created', title: 'Created sprint plan: Q3 job search sprint', featureId: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), userId: 'demo', payloadJson: null },
]

export default async function ActivityPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? ''
  const isDemo = email === 'demo@mreshank.com'

  if (isDemo) {
    return <ActivityPageClient activity={DEMO_ACTIVITY as never} />
  }

  const activity = await getAllActivity(userId).catch(() => [])
  return <ActivityPageClient activity={activity} />
}
