'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { INTERVIEW_PERSONAS } from '@/data/content/interviewPersonas'

interface PersonaSelectorProps {
  value: string
  onChange: (id: string) => void
}

export function PersonaSelector({ value, onChange }: PersonaSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Interviewer Style
      </p>
      <div className="flex flex-wrap gap-2">
        {INTERVIEW_PERSONAS.map((p) => (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(p.id)}
            title={p.description}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              value === p.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            <span>{p.icon}</span>
            {p.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
