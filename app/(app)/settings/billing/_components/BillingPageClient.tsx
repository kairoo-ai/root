'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

declare global { interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void } } }

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, priceLabel: '₹0', period: '/mo',
    credits: 10, icon: Zap, color: 'text-zinc-400', border: 'border-border',
    features: ['10 AI credits/month', 'All career tools', 'Basic roadmaps', 'Email support'],
  },
  {
    id: 'pro', name: 'Pro', price: 499, priceLabel: '₹499', period: '/mo',
    credits: 100, icon: Crown, color: 'text-teal-400', border: 'border-teal-500/30',
    features: ['100 AI credits/month', 'All career + learning tools', 'Advanced roadmaps', 'Priority support', 'Roadmap history'],
    recommended: true,
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 1999, priceLabel: '₹1,999', period: '/mo',
    credits: 999, icon: Building2, color: 'text-indigo-400', border: 'border-indigo-500/30',
    features: ['Unlimited AI credits', 'Team collaboration', 'Custom integrations', 'Dedicated support', 'Analytics dashboard'],
  },
]

interface Props {
  subscription: { plan: string; status: string } | null
  remaining: number
}

export function BillingPageClient({ subscription, remaining }: Props) {
  const currentPlan = subscription?.plan ?? 'free'
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return
    setLoading(planId)
    try {
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const { orderId, amount } = await res.json()

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency: 'INR',
          name: 'Kairoo AI',
          description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
          order_id: orderId,
          theme: { color: '#14b8a6' },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            await fetch('/api/billing/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                plan: planId,
              }),
            })
            window.location.reload()
          },
        })
        rzp.open()
        setLoading(null)
      }
    } catch {
      setLoading(null)
    }
  }

  const planLimits: Record<string, number> = { free: 10, pro: 100, enterprise: 999 }
  const maxCredits = planLimits[currentPlan] ?? 10
  const usedCredits = maxCredits - remaining

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Billing & Plans</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your subscription and AI credits.</p>
      </div>

      {/* Current usage */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-foreground">This Month's Usage</span>
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize',
            currentPlan === 'pro' ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' :
            currentPlan === 'enterprise' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' :
            'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
          )}>{currentPlan} plan</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((usedCredits / maxCredits) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{usedCredits} / {maxCredits === 999 ? '∞' : maxCredits} credits</span>
        </div>
        <p className="text-xs text-muted-foreground">{remaining} credits remaining this month.</p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className={cn(
              'rounded-2xl border bg-card p-5 h-full flex flex-col relative',
              plan.recommended ? 'border-teal-500/40 bg-gradient-to-b from-teal-500/5 to-transparent' : 'border-border',
              currentPlan === plan.id ? 'ring-2 ring-teal-500/30' : ''
            )}>
              {plan.recommended && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-bold bg-teal-500 text-black px-3 py-0.5 rounded-full">Recommended</span>
                </div>
              )}
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', plan.id === 'pro' ? 'bg-teal-500/10' : plan.id === 'enterprise' ? 'bg-indigo-500/10' : 'bg-zinc-500/10')}>
                <plan.icon className={cn('w-4.5 h-4.5', plan.color)} />
              </div>
              <div className="font-bold text-foreground mb-0.5">{plan.name}</div>
              <div className="text-2xl font-extrabold text-foreground tracking-tight mb-1">{plan.priceLabel}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span></div>
              <div className="text-xs text-muted-foreground mb-4">{plan.credits === 999 ? 'Unlimited' : plan.credits} AI credits/month</div>
              <ul className="space-y-2 flex-1 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-teal-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentPlan === plan.id || loading === plan.id || plan.id === 'free'}
                className={cn(
                  'w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer',
                  currentPlan === plan.id ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 cursor-default' :
                  plan.id === 'free' ? 'bg-zinc-500/10 text-zinc-500 cursor-not-allowed' :
                  plan.recommended ? 'bg-teal-500 text-black hover:bg-teal-400' :
                  'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25'
                )}
              >
                {currentPlan === plan.id ? 'Current Plan' : loading === plan.id ? 'Processing...' : plan.id === 'free' ? 'Downgrade' : `Upgrade to ${plan.name}`}
                {currentPlan !== plan.id && plan.id !== 'free' && !loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
