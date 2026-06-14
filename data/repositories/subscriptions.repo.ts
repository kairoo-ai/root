import { db } from '@/data/client'
import { subscriptions } from '@/data/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function findSubscriptionByUserId(userId: string) {
  const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1)
  return sub ?? null
}

export async function upsertSubscription(userId: string, data: Partial<typeof subscriptions.$inferInsert>) {
  const existing = await findSubscriptionByUserId(userId)
  if (existing) {
    await db.update(subscriptions).set({ ...data, updatedAt: new Date() }).where(eq(subscriptions.userId, userId))
    return { ...existing, ...data }
  }
  const [sub] = await db.insert(subscriptions).values({ id: nanoid(), userId, ...data } as typeof subscriptions.$inferInsert).returning()
  return sub
}

export async function getUserPlan(userId: string): Promise<'free' | 'pro' | 'enterprise'> {
  const sub = await findSubscriptionByUserId(userId)
  return (sub?.plan ?? 'free') as 'free' | 'pro' | 'enterprise'
}
