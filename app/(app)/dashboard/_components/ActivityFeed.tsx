'use client'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

// Static mock activity — will pull from DB in next iteration
const mockActivity = [
  { id: '1', dot: '#14b8a6', title: 'Dynamic Roadmap generated', sub: 'Senior ML Engineer path, 18-month plan', time: '2h ago' },
  { id: '2', dot: '#818cf8', title: 'Interview session', sub: 'System Design round, scored 78/100', time: 'Yesterday 4:30 PM' },
  { id: '3', dot: '#f59e0b', title: 'Resume scored', sub: 'ATS match 92%, 4 improvements suggested', time: '2 days ago' },
  { id: '4', dot: '#22c55e', title: 'Study plan completed', sub: 'Python for Data Science, Week 3', time: '3 days ago' },
]

export function ActivityFeed({ userId }: { userId: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</h2>
        <button className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer">View all →</button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Activity Feed</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Today · 3 new</span>
        </div>
        {mockActivity.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="flex items-start gap-3 px-4 py-3 border-b border-border/30 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: item.dot }} />
            <div>
              <div className="text-xs text-foreground font-medium">{item.title}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">{item.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
