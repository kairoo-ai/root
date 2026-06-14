import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { upsertUserByClerkId } from '@/data/repositories/users.repo'
import { db } from '@/data/client'
import { users } from '@/data/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch {
    return new Response('Invalid webhook signature', { status: 400 })
  }

  const { type, data } = evt

  if (type === 'user.created' || type === 'user.updated') {
    const email = data.email_addresses?.[0]?.email_address ?? ''
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || undefined
    const avatarUrl = data.image_url ?? undefined
    await upsertUserByClerkId(data.id, { email, name, avatarUrl })
  }

  if (type === 'user.deleted' && data.id) {
    await db.delete(users).where(eq(users.id, data.id)).catch(() => null)
  }

  return new Response('OK', { status: 200 })
}
