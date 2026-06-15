import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getRemainingCredits, getMonthlyBreakdown } from '@/data/repositories/usage.repo'
import { getUserPlan } from '@/data/repositories/subscriptions.repo'
import { getDerivedStats } from '@/data/repositories/stats.repo'
import { getRecentActivity } from '@/data/repositories/activityLog.repo'
import { getOrSeedWeeklyGoals } from '@/data/repositories/goals.repo'
import { WelcomeBanner } from './_components/WelcomeBanner'
import { StatsGrid } from './_components/StatsGrid'
import { QuickLaunch } from './_components/QuickLaunch'
import { ActivityFeed } from './_components/ActivityFeed'
import { UsageWidget } from './_components/UsageWidget'
import { WeeklyGoals } from './_components/WeeklyGoals'
import { TodaysFocusWidget } from './_components/TodaysFocusWidget'
import { getDemoDashboardData } from './_demo/demoData'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? ''
  const isDemo = email === 'demo@mreshank.com'

  if (isDemo) {
    const demo = getDemoDashboardData()
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <WelcomeBanner />
        <StatsGrid stats={demo.stats} usedCredits={demo.usedCredits} />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 mt-5">
          <div className="space-y-5">
            <QuickLaunch />
            <ActivityFeed activity={demo.activity} />
          </div>
          <div className="space-y-4">
            <TodaysFocusWidget />
            <UsageWidget used={demo.usedCredits} max={demo.maxCredits} plan={demo.plan} breakdown={demo.breakdown} />
            <WeeklyGoals goals={demo.goals} />
          </div>
        </div>
      </div>
    )
  }

  const [remaining, breakdown, plan, stats, activity, goals] = await Promise.all([
    getRemainingCredits(userId).catch(() => 10),
    getMonthlyBreakdown(userId).catch(() => ({ total: 0, byCategory: {} })),
    getUserPlan(userId).catch(() => 'free' as const),
    getDerivedStats(userId).catch(() => null),
    getRecentActivity(userId, 8).catch(() => []),
    getOrSeedWeeklyGoals(userId).catch(() => []),
  ])

  const planLimits: Record<string, number> = { free: 10, pro: 100, enterprise: 999 }
  const maxCredits = planLimits[plan] ?? 10
  const usedCredits = maxCredits - remaining

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <WelcomeBanner />
      <StatsGrid stats={stats} usedCredits={usedCredits} />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 mt-5">
        <div className="space-y-5">
          <QuickLaunch />
          <ActivityFeed activity={activity} />
        </div>
        <div className="space-y-4">
          <TodaysFocusWidget />
          <UsageWidget used={usedCredits} max={maxCredits} plan={plan} breakdown={breakdown.byCategory} />
          <WeeklyGoals goals={goals} />
        </div>
      </div>
    </div>
  )
}
