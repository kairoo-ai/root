'use client'
import { motion } from 'framer-motion'
import { Clock, Zap } from 'lucide-react'
import type { ActivityEntry } from '@/data/repositories/activityLog.repo'

function timeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

const TYPE_DOT_CLASS: Record<string, string> = {
  ai_run: 'bg-teal-400',
  roadmap_created: 'bg-indigo-400',
  goal_completed: 'bg-green-400',
  streak_milestone: 'bg-amber-400',
}

interface ActivityFeedProps {
  activity: ActivityEntry[]
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</h2>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Activity Feed</span>
          </div>
          {activity.length > 0 && (
            <span className="text-[11px] text-muted-foreground">{activity.length} events</span>
          )}
        </div>

        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <Zap className="w-6 h-6 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">No activity yet. Run your first AI tool to get started.</p>
          </div>
        ) : (
          activity.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex items-start gap-3 px-4 py-3 border-b border-border/30 last:border-0 hover:bg-white/2 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${TYPE_DOT_CLASS[item.type] ?? 'bg-zinc-400'}`} />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-foreground font-medium truncate">{item.title}</div>
                {item.featureId && (
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.featureId}</div>
                )}
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">{timeAgo(item.createdAt)}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
