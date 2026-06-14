'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { triggerXpBurst } from '@/lib/xp-burst'

const defaultGoals = [
  { id: '1', text: 'Complete Interview Prep session', xp: 50, done: true },
  { id: '2', text: 'Generate career roadmap', xp: 100, done: true },
  { id: '3', text: 'Run Skill Gap Analysis', xp: 75, done: false },
  { id: '4', text: 'Complete 3 study sessions', xp: 150, done: false },
  { id: '5', text: 'Update and score resume', xp: 50, done: false },
]

export function WeeklyGoals() {
  const [goals, setGoals] = useState(defaultGoals)
  const toggle = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const goal = goals.find(g => g.id === id)
    const isCompleting = goal && !goal.done
    setGoals(g => g.map(g2 => g2.id === id ? { ...g2, done: !g2.done } : g2))
    if (isCompleting) {
      triggerXpBurst(e.currentTarget as HTMLElement, goal.xp ?? 50)
    }
  }
  const done = goals.filter(g => g.done).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Weekly Goals</h2>
        <button className="text-xs text-teal-400 hover:text-teal-300 cursor-pointer transition-colors">Edit →</button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 text-xs font-semibold text-foreground">
          This Week · {done} of {goals.length} done
        </div>
        {goals.map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={(e) => toggle(goal.id, e)}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
          >
            <div className={cn('w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all', goal.done ? 'bg-teal-500 border-teal-500' : 'border-teal-500/50')}>
              {goal.done && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
            </div>
            <span className={cn('text-xs flex-1', goal.done ? 'line-through text-muted-foreground/50' : 'text-muted-foreground')}>
              {goal.text}
            </span>
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">+{goal.xp} XP</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
