import { db } from '@/data/client'
import { users } from '@/data/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function upsertUserByClerkId(clerkId: string, data: {
  email: string
  name?: string | null
  avatarUrl?: string | null
}) {
  const existing = await db.select().from(users).where(eq(users.id, clerkId)).limit(1)
  if (existing.length > 0) {
    await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, clerkId))
    return existing[0]
  }
  const [user] = await db.insert(users).values({ id: clerkId, ...data }).returning()
  return user
}

export async function findUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return user ?? null
}
