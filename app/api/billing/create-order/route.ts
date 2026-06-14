import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const PLAN_PRICES: Record<string, number> = {
  pro: 49900, // ₹499 in paise
  enterprise: 199900, // ₹1999 in paise
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()
  const amount = PLAN_PRICES[plan]
  if (!amount) return Response.json({ error: 'Invalid plan' }, { status: 400 })

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `order_${userId}_${plan}_${Date.now()}`,
      notes: { userId, plan },
    })
    return Response.json({ orderId: order.id, amount, currency: 'INR' })
  } catch (err) {
    console.error('Razorpay order error:', err)
    return Response.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
