'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Map, CheckCircle2, Flame, Clock, Filter, Search,
  BrainCircuit, FileText, BookOpen, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityEntry } from '@/data/repositories/activityLog.repo'

// ── helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function dateLabel(date: Date): string {
  const now = new Date()
  const d = new Date(date)
  const todayStr = now.toDateString()
  const dStr = d.toDateString()
  if (dStr === todayStr) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (dStr === yesterday.toDateString()) return 'Yesterday'
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays < 7) return 'This Week'
  if (diffDays < 30) return 'This Month'
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// ── type meta ─────────────────────────────────────────────────────────────────

type ActivityType = 'all' | 'ai_run' | 'roadmap_created' | 'goal_completed' | 'streak_milestone'

const TYPE_META: Record<string, {
  label: string
  icon: React.ElementType
  dot: string
  bg: string
  text: string
}> = {
  ai_run: {
    label: 'AI Tool Run',
    icon: BrainCircuit,
    dot: 'bg-teal-400',
    bg: 'bg-teal-400/10',
    text: 'text-teal-400',
  },
  roadmap_created: {
    label: 'Roadmap',
    icon: Map,
    dot: 'bg-indigo-400',
    bg: 'bg-indigo-400/10',
    text: 'text-indigo-400',
  },
  goal_completed: {
    label: 'Goal',
    icon: CheckCircle2,
    dot: 'bg-green-400',
    bg: 'bg-green-400/10',
    text: 'text-green-400',
  },
  streak_milestone: {
    label: 'Milestone',
    icon: Flame,
    dot: 'bg-amber-400',
    bg: 'bg-amber-400/10',
    text: 'text-amber-400',
  },
  resume_generated: {
    label: 'Resume',
    icon: FileText,
    dot: 'bg-blue-400',
    bg: 'bg-blue-400/10',
    text: 'text-blue-400',
  },
  skill_assessed: {
    label: 'Skill Check',
    icon: BookOpen,
    dot: 'bg-violet-400',
    bg: 'bg-violet-400/10',
    text: 'text-violet-400',
  },
}

const FALLBACK_META = {
  label: 'Activity',
  icon: Zap,
  dot: 'bg-zinc-400',
  bg: 'bg-zinc-400/10',
  text: 'text-zinc-400',
}

const FILTER_TABS: { key: ActivityType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai_run', label: 'AI Runs' },
  { key: 'roadmap_created', label: 'Roadmaps' },
  { key: 'goal_completed', label: 'Goals' },
  { key: 'streak_milestone', label: 'Milestones' },
]

// ── component ─────────────────────────────────────────────────────────────────

interface Props {
  activity: ActivityEntry[]
}

export function ActivityPageClient({ activity }: Props) {
  const [activeFilter, setActiveFilter] = useState<ActivityType>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return activity.filter(item => {
      const matchesType = activeFilter === 'all' || item.type === activeFilter
      const matchesSearch = search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.featureId ?? '').toLowerCase().includes(search.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [activity, activeFilter, search])

  // Group by date label, maintaining order
  const groups = useMemo((): [string, ActivityEntry[]][] => {
    const keys: string[] = []
    const map: Record<string, ActivityEntry[]> = {}
    for (const item of filtered) {
      const label = dateLabel(item.createdAt)
      if (!map[label]) { map[label] = []; keys.push(label) }
      map[label].push(item)
    }
    return keys.map(k => [k, map[k]])
  }, [filtered])

  // Summary stats
  const totalRuns = activity.filter(a => a.type === 'ai_run').length
  const totalGoals = activity.filter(a => a.type === 'goal_completed').length
  const totalRoadmaps = activity.filter(a => a.type === 'roadmap_created').length

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Every action you've taken, in one place.</p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Total Events', value: activity.length, dot: 'bg-zinc-400' },
          { label: 'AI Runs', value: totalRuns, dot: 'bg-teal-400' },
          { label: 'Goals Done', value: totalGoals, dot: 'bg-green-400' },
          { label: 'Roadmaps', value: totalRoadmaps, dot: 'bg-indigo-400' },
        ].map(stat => (
          <div
            key={stat.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs"
          >
            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', stat.dot)} />
            <span className="font-semibold text-foreground">{stat.value}</span>
            <span className="text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search activity…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Filter className="w-3 h-3 text-muted-foreground ml-1 shrink-0" />
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors',
                activeFilter === tab.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Zap className="w-7 h-7 text-muted-foreground/25 mb-3" />
          <p className="text-sm text-muted-foreground">
            {search || activeFilter !== 'all' ? 'No matching activity found.' : 'No activity yet. Run your first AI tool to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {groups.map(([label, items]: [string, ActivityEntry[]]) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Date group header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    {label}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] text-muted-foreground/50">{items.length}</span>
                </div>

                {/* Items */}
                <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/40">
                  {items.map((item: ActivityEntry, i: number) => {
                    const meta = TYPE_META[item.type] ?? FALLBACK_META
                    const Icon = meta.icon
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/2 transition-colors group"
                      >
                        {/* Icon badge */}
                        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', meta.bg)}>
                          <Icon className={cn('w-3.5 h-3.5', meta.text)} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-foreground truncate">{item.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.featureId && (
                              <>
                                <span className={cn('text-[10px] font-semibold', meta.text)}>{item.featureId}</span>
                                <span className="text-muted-foreground/30 text-[10px]">·</span>
                              </>
                            )}
                            <span className="text-[10px] text-muted-foreground/60">{timeAgo(item.createdAt)}</span>
                          </div>
                        </div>

                        {/* Type pill */}
                        <span className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 hidden sm:block',
                          meta.bg, meta.text,
                        )}>
                          {meta.label}
                        </span>

                        <ChevronRight className="w-3 h-3 text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors shrink-0" />
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
