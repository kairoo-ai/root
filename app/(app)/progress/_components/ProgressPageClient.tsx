'use client'
import { motion } from 'framer-motion'
import { Trophy, Flame, Zap, TrendingUp, Star } from 'lucide-react'
import { CardSpotlight } from '@/components/aceternity/CardSpotlight'
import { GlowingEffect, ShimmerLoader } from '@/components/aceternity'
import { cn } from '@/lib/utils'
import { features } from '@/engines/ai/features/registry'
import type { DerivedStats } from '@/data/repositories/stats.repo'

interface Props {
  stats: DerivedStats | null
}

// Fixed palette for top-5 feature bars - avoids inline styles
const FEATURE_COLORS = [
  { bar: 'bg-teal-400', text: 'text-teal-400' },
  { bar: 'bg-indigo-400', text: 'text-indigo-400' },
  { bar: 'bg-amber-400', text: 'text-amber-400' },
  { bar: 'bg-blue-400', text: 'text-blue-400' },
  { bar: 'bg-violet-400', text: 'text-violet-400' },
]

function featureName(id: string): string {
  return features.find(f => f.id === id)?.name ?? id
}

function featureScore(count: number, totalRuns: number): number {
  if (totalRuns === 0) return Math.min(count * 5, 95)
  return Math.min(Math.round((count / totalRuns) * 200), 95)
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function ProgressPageClient({ stats }: Props) {
  const xp = stats?.xp ?? 0
  const level = stats?.level ?? 1
  const xpInLevel = stats?.xpInLevel ?? 0
  const xpToNextLevel = stats?.xpToNextLevel ?? 500
  const xpPct = xpToNextLevel > 0 ? (xpInLevel / xpToNextLevel) * 100 : 0
  const streak = stats?.streak ?? 0
  const totalRuns = stats?.totalRuns ?? 0
  const weeklyActivity = stats?.weeklyActivity ?? [0, 0, 0, 0, 0, 0, 0]
  const topFeatures = stats?.topFeatures ?? []
  const maxActivity = Math.max(...weeklyActivity, 1)

  if (stats === null) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        <ShimmerLoader lines={3} className="mb-4" />
        <ShimmerLoader lines={5} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your growth journey, visualised.</p>
      </div>

      {/* XP + Level hero */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-teal-500/15 bg-gradient-to-br from-teal-500/8 to-transparent p-6 overflow-hidden"
      >
        <div className="absolute right-6 top-6 w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center">
          <Star className="w-5 h-5 text-teal-400 mb-0.5" />
          <div className="text-sm font-black text-foreground">Lv.{level}</div>
        </div>
        <div className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Experience Points</div>
        <div className="text-4xl font-black text-foreground tracking-tight mb-1">{xp.toLocaleString()} XP</div>
        <div className="text-sm text-muted-foreground mb-4">{xpToNextLevel - xpInLevel} XP to Level {level + 1}</div>
        <div className="h-2.5 bg-black/20 rounded-full overflow-hidden max-w-sm">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1.5">{Math.round(xpPct)}% to next level</div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Day Streak', value: `${streak}`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Total AI Runs', value: totalRuns.toString(), icon: Zap, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: 'Current Level', value: `Level ${level}`, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'This Week', value: weeklyActivity.reduce((a, b) => a + b, 0).toString(), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <CardSpotlight className="rounded-xl border border-border bg-card p-4 cursor-default">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', stat.bg)}>
                <stat.icon className={cn('w-4 h-4', stat.color)} />
              </div>
              <div className="text-lg font-black text-foreground">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly activity bar chart */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">This Week's Activity</h2>
          {weeklyActivity.every(v => v === 0) ? (
            <div className="flex items-center justify-center h-28 text-xs text-muted-foreground">
              No activity this week yet.
            </div>
          ) : (
            <div className="flex items-end gap-2 h-28">
              {weeklyActivity.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / maxActivity) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
                    title={`${val} runs`}
                  />
                  <span className="text-[9px] text-muted-foreground">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2 text-center">AI tool runs per day</div>
        </div>

        {/* Top features by usage */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">Most Used Tools</h2>
          {topFeatures.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
              Run AI tools to see your usage breakdown.
            </div>
          ) : (
            <div className="space-y-3.5">
              {topFeatures.map((f, i) => {
                const palette = FEATURE_COLORS[i % FEATURE_COLORS.length]
                const score = featureScore(f.count, totalRuns)
                return (
                  <div key={f.featureId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground truncate pr-2">{featureName(f.featureId)}</span>
                      <span className={cn('text-xs font-bold shrink-0', palette.text)}>{f.count}×</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', palette.bar)}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
