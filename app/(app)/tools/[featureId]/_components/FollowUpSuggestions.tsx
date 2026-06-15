'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Props {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function FollowUpSuggestions({ suggestions, onSelect }: Props) {
  if (suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2 px-1"
    >
      <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wide px-1">
        Follow-up
      </p>
      <div className="flex flex-col gap-1.5">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(s)}
            className="flex items-center gap-2 text-left text-xs text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/40 border border-border hover:border-teal-500/30 rounded-xl px-3 py-2 transition-all cursor-pointer group"
          >
            <ArrowRight className="w-3 h-3 shrink-0 text-teal-500/50 group-hover:text-teal-400 transition-colors" />
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
