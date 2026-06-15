'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { triggerXpBurst } from '@/lib/xp-burst'
import type { Goal } from '@/data/repositories/goals.repo'

interface WeeklyGoalsProps {
  goals: Goal[]
}

export function WeeklyGoals({ goals: initialGoals }: WeeklyGoalsProps) {
  const [goals, setGoals] = useState(initialGoals)

  const toggle = async (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return

    // Optimistic update
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g))

    if (!goal.completed) {
      triggerXpBurst(e.currentTarget as HTMLElement, goal.xpReward ?? 50)
    }

    try {
      const res = await fetch(`/api/goals/${id}/toggle`, { method: 'POST' })
      if (!res.ok) {
        // Revert on failure
        setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: goal.completed } : g))
      }
    } catch {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: goal.completed } : g))
    }
  }

  const done = goals.filter(g => g.completed).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/50">Weekly Goals</h2>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 text-xs font-semibold text-foreground">
          This Week · {done} of {goals.length} done
        </div>
        {goals.length === 0 ? (
          <div className="px-4 py-6 text-xs text-muted-foreground text-center">No goals for this week yet.</div>
        ) : (
          goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={(e) => toggle(goal.id, e)}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-white/2 cursor-pointer transition-colors"
            >
              <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all', goal.completed ? 'bg-teal-500 border-teal-500' : 'border-teal-500/50')}>
                {goal.completed && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
              </div>
              <span className={cn('text-xs flex-1', goal.completed ? 'line-through text-muted-foreground/50' : 'text-muted-foreground')}>
                {goal.title}
              </span>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full shrink-0">+{goal.xpReward} XP</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
