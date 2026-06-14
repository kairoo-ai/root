'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Map, Calendar, CheckCircle, Clock, Archive, Plus } from 'lucide-react'
import { CardSpotlight } from '@/components/aceternity/CardSpotlight'
import { cn } from '@/lib/utils'

type Roadmap = { id: string; title: string; goal: string; status: string; createdAt: Date }

const statusConfig = {
  active: { label: 'Active', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', icon: Clock },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
  archived: { label: 'Archived', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Archive },
}

export function RoadmapsList({ roadmaps }: { roadmaps: Roadmap[] }) {
  const router = useRouter()

  if (roadmaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
          <Map className="w-7 h-7 text-teal-400" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-2">No roadmaps yet</h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-xs">Generate your first AI career roadmap to get a personalised step-by-step plan.</p>
        <button
          onClick={() => router.push('/roadmaps/new')}
          className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-4 py-2.5 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Create your first roadmap
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roadmaps.map((rm, i) => {
        const cfg = statusConfig[rm.status as keyof typeof statusConfig] ?? statusConfig.active
        return (
          <motion.div key={rm.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <CardSpotlight
              className="rounded-2xl border border-border bg-card p-5 cursor-pointer hover:-translate-y-0.5 hover:border-teal-500/25 transition-all h-full flex flex-col"
              onClick={() => router.push(`/roadmaps/${rm.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Map className="w-4.5 h-4.5 text-teal-400" />
                </div>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', cfg.color, cfg.bg, cfg.border)}>
                  {cfg.label}
                </span>
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1">{rm.title}</h3>
              <p className="text-[11.5px] text-muted-foreground line-clamp-2 flex-1">{rm.goal}</p>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground/60">
                <Calendar className="w-3 h-3" />
                {new Date(rm.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </CardSpotlight>
          </motion.div>
        )
      })}
    </div>
  )
}
