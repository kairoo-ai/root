'use client'
import { motion } from 'framer-motion'
import { Trophy, Flame, Zap, TrendingUp, Star } from 'lucide-react'
import { CardSpotlight } from '@/components/aceternity/CardSpotlight'
import { cn } from '@/lib/utils'

// Mock XP/streak data — will be replaced by DB query in next iteration
const MOCK = {
  xp: 2450,
  level: 8,
  xpToNextLevel: 3000,
  streak: 12,
  totalRuns: 247,
  weeklyActivity: [3, 7, 5, 8, 4, 9, 6], // Mon-Sun
  skillScores: [
    { skill: 'Career Planning', score: 82, color: '#14b8a6' },
    { skill: 'Interview Prep', score: 67, color: '#818cf8' },
    { skill: 'Resume Writing', score: 91, color: '#f59e0b' },
    { skill: 'Skill Analysis', score: 74, color: '#60a5fa' },
    { skill: 'Study Habits', score: 55, color: '#a78bfa' },
  ],
}

interface Props {
  breakdown: { total: number; byCategory: Record<string, number> }
}

export function ProgressPageClient({ breakdown }: Props) {
  const xpPct = (MOCK.xp / MOCK.xpToNextLevel) * 100
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxActivity = Math.max(...MOCK.weeklyActivity)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your growth journey, visualised.</p>
      </div>

      {/* XP + Level hero */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-teal-500/15 bg-gradient-to-br from-teal-500/8 to-transparent p-6 overflow-hidden">
        <div className="absolute right-6 top-6 w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center">
          <Star className="w-5 h-5 text-teal-400 mb-0.5" />
          <div className="text-sm font-black text-foreground">Lv.{MOCK.level}</div>
        </div>
        <div className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Experience Points</div>
        <div className="text-4xl font-black text-foreground tracking-tight mb-1">{MOCK.xp.toLocaleString()} XP</div>
        <div className="text-sm text-muted-foreground mb-4">{MOCK.xpToNextLevel - MOCK.xp} XP to Level {MOCK.level + 1}</div>
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
          { label: 'Day Streak', value: `${MOCK.streak} 🔥`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Total AI Runs', value: breakdown.total || MOCK.totalRuns, icon: Zap, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: 'Current Level', value: `Level ${MOCK.level}`, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Growth Rate', value: '+18%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
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
        {/* Weekly activity chart — custom bar chart without chart.js to avoid SSR issues */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">This Week's Activity</h2>
          <div className="flex items-end gap-2 h-28">
            {MOCK.weeklyActivity.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxActivity) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
                  title={`${val} runs`}
                />
                <span className="text-[9px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">AI tool runs per day</div>
        </div>

        {/* Skill scores */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">Skill Proficiency</h2>
          <div className="space-y-3.5">
            {MOCK.skillScores.map((skill, i) => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{skill.skill}</span>
                  <span className="text-xs font-bold" style={{ color: skill.color }}>{skill.score}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: skill.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
