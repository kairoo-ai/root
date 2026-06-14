'use client'
import { motion } from 'framer-motion'
import { Zap, Map, BookOpen, Trophy } from 'lucide-react'
import { CardSpotlight } from '@/components/aceternity/CardSpotlight'
import { cn } from '@/lib/utils'

interface StatsGridProps {
  usedCredits: number
  total: number
}

export function StatsGrid({ usedCredits, total }: StatsGridProps) {
  const stats = [
    { label: 'AI Runs', value: total.toString(), sub: 'this month', icon: Zap, color: 'text-teal-400', bg: 'bg-teal-500/10', delta: '+18%', positive: true },
    { label: 'Roadmaps', value: '3', sub: 'active plans', icon: Map, color: 'text-indigo-400', bg: 'bg-indigo-500/10', delta: '1 done ✓', positive: true },
    { label: 'Credits Used', value: usedCredits.toString(), sub: 'this month', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10', delta: `${usedCredits} spent`, positive: true },
    { label: 'XP Streak', value: '12', sub: 'days 🔥', icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10', delta: 'Level 8', positive: true },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
        >
          <CardSpotlight className="rounded-xl border border-border bg-card p-4 hover:border-teal-500/25 transition-colors cursor-default">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', stat.bg)}>
              <stat.icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight leading-none mb-0.5">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{stat.sub}</div>
            <div className={cn('inline-flex items-center text-[10px] font-semibold mt-2 px-1.5 py-0.5 rounded-full', stat.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
              {stat.delta}
            </div>
          </CardSpotlight>
        </motion.div>
      ))}
    </div>
  )
}
