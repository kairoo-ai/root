'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, BookOpen, Video, FileText, Book } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapStep } from '@/types/roadmap'

const RESOURCE_ICONS: Record<RoadmapStep['resources'][number]['type'], React.ElementType> = {
  article: FileText,
  video:   Video,
  course:  BookOpen,
  book:    Book,
}

interface Props {
  step: RoadmapStep | null
  phaseId: string | null
  phaseTitle: string
  onClose: () => void
  onStatusChange: (phaseId: string, stepId: string, status: RoadmapStep['status']) => void
  onAskCoach: (step: RoadmapStep) => void
}

const STATUS_CYCLE: RoadmapStep['status'][] = ['todo', 'in_progress', 'done']

export function StepDrawer({ step, phaseId, phaseTitle, onClose, onStatusChange, onAskCoach }: Props) {
  return (
    <AnimatePresence>
      {step && phaseId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">{phaseTitle}</div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{step.title}</h3>
                <div className="text-[10px] text-teal-400 mt-1 font-medium">{step.duration} · +{step.xpReward} XP</div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status toggle */}
              <div className="flex gap-2">
                {STATUS_CYCLE.map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(phaseId, step.id, s)}
                    className={cn(
                      'flex-1 text-[10px] font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer',
                      step.status === s
                        ? s === 'done' ? 'bg-teal-500/20 border-teal-500/40 text-teal-400'
                          : s === 'in_progress' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                          : 'bg-muted/50 border-border text-foreground'
                        : 'bg-transparent border-border/50 text-muted-foreground/50 hover:border-border'
                    )}
                  >
                    {s === 'todo' ? 'To Do' : s === 'in_progress' ? 'In Progress' : 'Done'}
                  </button>
                ))}
              </div>

              {/* Description */}
              {step.description && (
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">About this step</div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{step.description}</p>
                </div>
              )}

              {/* Resources */}
              {step.resources.length > 0 && (
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Resources</div>
                  <div className="space-y-2">
                    {step.resources.map((r, i) => {
                      const Icon = RESOURCE_ICONS[r.type]
                      return (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-border/70 transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                          <span className="text-xs text-foreground/80 flex-1 line-clamp-1">{r.title}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Ask AI Coach */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => onAskCoach(step)}
                className="w-full text-xs font-semibold bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl py-2.5 hover:bg-teal-500/20 transition-colors cursor-pointer"
              >
                Ask AI Coach about this step
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
