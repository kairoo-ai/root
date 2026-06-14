import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { findSubscriptionByUserId } from '@/data/repositories/subscriptions.repo'
import { getRemainingCredits } from '@/data/repositories/usage.repo'
import { BillingPageClient } from './_components/BillingPageClient'

export default async function BillingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [sub, remaining] = await Promise.all([
    findSubscriptionByUserId(userId).catch(() => null),
    getRemainingCredits(userId).catch(() => 10),
  ])

  return <BillingPageClient subscription={sub} remaining={remaining} />
}
