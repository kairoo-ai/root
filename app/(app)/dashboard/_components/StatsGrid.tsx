'use client'
import { motion } from 'framer-motion'
import { Zap, Map, BookOpen, Flame } from 'lucide-react'
import { CardSpotlight, GlowingEffect, ShimmerLoader } from '@/components/aceternity'
import { cn } from '@/lib/utils'
import type { DerivedStats } from '@/data/repositories/stats.repo'

interface StatsGridProps {
  stats: DerivedStats | null
  usedCredits: number
}

export function StatsGrid({ stats, usedCredits }: StatsGridProps) {
  const items = [
    {
      label: 'AI Runs',
      value: stats?.totalRuns?.toString() ?? '0',
      sub: 'total sessions',
      icon: Zap,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      delta: 'all time',
      positive: true,
    },
    {
      label: 'Roadmaps',
      value: stats?.roadmapCount?.toString() ?? '0',
      sub: 'career plans',
      icon: Map,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      delta: stats?.roadmapCount === 0 ? 'none yet' : `${stats?.roadmapCount} active`,
      positive: true,
    },
    {
      label: 'Credits Used',
      value: usedCredits.toString(),
      sub: 'this month',
      icon: BookOpen,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      delta: `${usedCredits} spent`,
      positive: true,
    },
    {
      label: 'Day Streak',
      value: stats?.streak?.toString() ?? '0',
      sub: stats?.streak === 1 ? 'day active' : 'days active',
      icon: Flame,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      delta: stats ? `Level ${stats.level}` : 'Level 1',
      positive: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
      {items.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
        >
          <GlowingEffect>
            <CardSpotlight className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/8 hover:border-white/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] will-change-transform">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', stat.bg)}>
                <stat.icon className={cn('w-4 h-4', stat.color)} />
              </div>
              <div className="text-2xl font-extrabold text-white tracking-tight leading-none mb-0.5">{stat.value}</div>
              <div className="text-[11px] text-white/60">{stat.label}</div>
              <div className="text-[11px] text-white/40 mt-1">{stat.sub}</div>
              <div className={cn('inline-flex items-center text-[10px] font-semibold mt-2 px-1.5 py-0.5 rounded-full', stat.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                {stat.delta}
              </div>
            </CardSpotlight>
          </GlowingEffect>
        </motion.div>
      ))}
    </div>
  )
}
