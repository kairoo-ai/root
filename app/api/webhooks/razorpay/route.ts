import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { upsertSubscription } from '@/data/repositories/subscriptions.repo'
import { db } from '@/data/client'
import { subscriptions } from '@/data/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature')
  const body = await req.text()

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(body)
  const { event: eventType, payload } = event

  if (eventType === 'payment.captured') {
    const notes = payload?.payment?.entity?.notes ?? {}
    const { userId, plan } = notes
    if (userId && plan) {
      await upsertSubscription(userId, { plan, status: 'active' })
    }
  }

  if (eventType === 'subscription.cancelled') {
    const subId = payload?.subscription?.entity?.id
    if (subId) {
      await db.update(subscriptions).set({ status: 'cancelled' }).where(eq(subscriptions.razorpaySubscriptionId, subId))
    }
  }

  return new Response('OK', { status: 200 })
}
