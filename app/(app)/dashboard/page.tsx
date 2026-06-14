import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getRemainingCredits, getMonthlyBreakdown } from '@/data/repositories/usage.repo'
import { getUserPlan } from '@/data/repositories/subscriptions.repo'
import { WelcomeBanner } from './_components/WelcomeBanner'
import { StatsGrid } from './_components/StatsGrid'
import { QuickLaunch } from './_components/QuickLaunch'
import { ActivityFeed } from './_components/ActivityFeed'
import { UsageWidget } from './_components/UsageWidget'
import { WeeklyGoals } from './_components/WeeklyGoals'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [remaining, breakdown, plan] = await Promise.all([
    getRemainingCredits(userId).catch(() => 10),
    getMonthlyBreakdown(userId).catch(() => ({ total: 0, byCategory: {} })),
    getUserPlan(userId).catch(() => 'free' as const),
  ])

  const planLimits = { free: 10, pro: 100, enterprise: 999 }
  const maxCredits = planLimits[plan] ?? 10
  const usedCredits = maxCredits - remaining

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <WelcomeBanner />
      <StatsGrid usedCredits={usedCredits} total={breakdown.total} />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 mt-5">
        <div className="space-y-5">
          <QuickLaunch />
          <ActivityFeed userId={userId} />
        </div>
        <div className="space-y-4">
          <UsageWidget used={usedCredits} max={maxCredits} plan={plan} breakdown={breakdown.byCategory} />
          <WeeklyGoals />
        </div>
      </div>
    </div>
  )
}
