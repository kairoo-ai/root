import { db } from '@/data/client'
import { chatThreads } from '@/data/schema'
import { eq, and, desc } from 'drizzle-orm'
import type { ChatMessage } from '@/data/schema'

export type ChatThread = typeof chatThreads.$inferSelect

export async function createChatThread(data: {
  id: string
  userId: string
  featureId: string
  title: string
  messages: ChatMessage[]
}): Promise<ChatThread> {
  const [row] = await db
    .insert(chatThreads)
    .values({ ...data, updatedAt: new Date() })
    .returning()
  return row
}

export async function getChatThreadsByFeature(
  userId: string,
  featureId: string,
): Promise<ChatThread[]> {
  return db
    .select()
    .from(chatThreads)
    .where(and(eq(chatThreads.userId, userId), eq(chatThreads.featureId, featureId)))
    .orderBy(desc(chatThreads.updatedAt))
    .limit(30)
}

export async function getChatThreadById(
  id: string,
  userId: string,
): Promise<ChatThread | null> {
  const [row] = await db
    .select()
    .from(chatThreads)
    .where(eq(chatThreads.id, id))
    .limit(1)
  if (!row || row.userId !== userId) return null
  return row
}

export async function appendMessagesToThread(
  id: string,
  userId: string,
  newMessages: ChatMessage[],
): Promise<ChatThread | null> {
  const thread = await getChatThreadById(id, userId)
  if (!thread) return null

  const merged = [...thread.messages, ...newMessages]

  const [row] = await db
    .update(chatThreads)
    .set({ messages: merged, updatedAt: new Date() })
    .where(eq(chatThreads.id, id))
    .returning()
  return row ?? null
}

export async function deleteChatThread(id: string, userId: string): Promise<void> {
  const thread = await getChatThreadById(id, userId)
  if (!thread) return
  await db.delete(chatThreads).where(eq(chatThreads.id, id))
}
