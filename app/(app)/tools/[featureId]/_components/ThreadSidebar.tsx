'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ChatThread } from '@/data/repositories/chatThreads.repo'

interface Props {
  threads: ChatThread[]
  activeThreadId: string | null
  onSelect: (thread: ChatThread) => void
  onDelete: (threadId: string) => void
  collapsed: boolean
  onToggle: () => void
  featureName: string
}

export function ThreadSidebar({
  threads,
  activeThreadId,
  onSelect,
  onDelete,
  collapsed,
  onToggle,
  featureName,
}: Props) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 44 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="shrink-0 flex flex-col border-r border-border bg-card/50 overflow-hidden"
    >
      {/* Toggle button */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide truncate flex-1"
            >
              History
            </motion.p>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto py-2">
        {threads.length === 0 && !collapsed && (
          <p className="text-[11px] text-muted-foreground/50 px-4 py-3 italic">No history yet</p>
        )}
        {threads.map(thread => (
          <div
            key={thread.id}
            className={`group relative flex items-start gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
              thread.id === activeThreadId
                ? 'bg-teal-500/10 border-r-2 border-teal-500'
                : 'hover:bg-muted/30'
            }`}
            onClick={() => onSelect(thread)}
          >
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-[11px] font-medium text-foreground truncate leading-tight">
                    {thread.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {new Date(thread.updatedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!collapsed && (
              <button
                onClick={e => { e.stopPropagation(); onDelete(thread.id) }}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all cursor-pointer mt-0.5"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Feature label at bottom */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 py-3 border-t border-border"
          >
            <p className="text-[10px] text-muted-foreground/50 truncate">{featureName}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
