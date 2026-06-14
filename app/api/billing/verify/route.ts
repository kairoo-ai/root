import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { upsertSubscription } from '@/data/repositories/subscriptions.repo'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId, paymentId, signature, plan } = await req.json()

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  if (expectedSignature !== signature) {
    return Response.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  await upsertSubscription(userId, {
    plan: plan as 'pro' | 'enterprise',
    status: 'active',
    razorpaySubscriptionId: paymentId,
    updatedAt: new Date(),
  })

  return Response.json({ success: true })
}
