'use client'
import { motion } from 'framer-motion'

interface UsageWidgetProps {
  used: number
  max: number
  plan: string
  breakdown: Record<string, number>
}

export function UsageWidget({ used, max, plan, breakdown }: UsageWidgetProps) {
  const remaining = max - used
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0
  // SVG ring
  const r = 28, circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div>
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-3">Usage</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-foreground">AI Credits</span>
          <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full capitalize">{plan}</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-border" />
            <motion.circle
              cx="35" cy="35" r={r} fill="none"
              stroke="url(#tealGrad)" strokeWidth="5"
              strokeDasharray={circ} strokeDashoffset={circ}
              strokeLinecap="round"
              transform="rotate(-90 35 35)"
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
            <defs>
              <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            <text x="35" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="800" fontFamily="system-ui">{remaining}</text>
            <text x="35" y="43" textAnchor="middle" fill="#71717a" fontSize="8" fontFamily="system-ui">/ {max}</text>
          </svg>
          <div>
            <div className="text-xl font-extrabold text-foreground">{remaining} <span className="text-sm font-normal text-muted-foreground">/ {max}</span></div>
            <div className="text-[11px] text-muted-foreground mt-0.5">credits remaining</div>
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Career tools', val: Object.entries(breakdown).filter(([k]) => k !== 'learning').reduce((s,[,v]) => s+v, 0), color: '#14b8a6', max },
            { label: 'Learning', val: breakdown['learning'] ?? 0, color: '#818cf8', max },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-24 shrink-0">{row.label}</span>
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: row.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((row.val / row.max) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground w-6 text-right">{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
