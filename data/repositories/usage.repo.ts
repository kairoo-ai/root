import { db } from '@/data/client'
import { usageEvents, subscriptions } from '@/data/schema'
import { eq, and, gte, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const PLAN_CREDITS: Record<string, number> = {
  free: 10,
  pro: 100,
  enterprise: 999999,
}

export async function recordUsage(userId: string, featureId: string, tokensUsed: number) {
  await db.insert(usageEvents).values({
    id: nanoid(),
    userId,
    featureId,
    tokensUsed,
    creditsUsed: 1,
  })
}

export async function getRemainingCredits(userId: string): Promise<number> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1)
  const plan = sub?.plan ?? 'free'
  const maxCredits = PLAN_CREDITS[plan] ?? 10

  const [result] = await db
    .select({ used: sql<number>`cast(count(*) as int)` })
    .from(usageEvents)
    .where(and(eq(usageEvents.userId, userId), gte(usageEvents.createdAt, startOfMonth)))

  const used = result?.used ?? 0
  return Math.max(0, maxCredits - used)
}

export async function getMonthlyBreakdown(userId: string) {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const events = await db
    .select()
    .from(usageEvents)
    .where(and(eq(usageEvents.userId, userId), gte(usageEvents.createdAt, startOfMonth)))

  const byCategory: Record<string, number> = {}
  for (const event of events) {
    const cat = event.featureId ?? 'other'
    byCategory[cat] = (byCategory[cat] ?? 0) + 1
  }
  return { total: events.length, byCategory }
}
