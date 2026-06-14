import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getMonthlyBreakdown } from '@/data/repositories/usage.repo'
import { ProgressPageClient } from './_components/ProgressPageClient'

export default async function ProgressPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const breakdown = await getMonthlyBreakdown(userId).catch(() => ({ total: 0, byCategory: {} }))

  return <ProgressPageClient breakdown={breakdown} />
}
