'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STAR_STEPS = [
  { label: 'Situation', desc: 'Set the context - what was the scenario or challenge?' },
  { label: 'Task', desc: 'What was your specific responsibility or goal?' },
  { label: 'Action', desc: 'What concrete steps did YOU take? Use "I", not "we".' },
  { label: 'Result', desc: 'What measurable outcome occurred? Quantify if possible.' },
]

export function STARHints() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]"
      >
        <span>STAR Framework Hints</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-3">
              {STAR_STEPS.map(({ label, desc }) => (
                <div key={label} className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[var(--color-primary)]/15 text-center text-xs font-semibold leading-5 text-[var(--color-primary)]">
                    {label[0]}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">{label} - </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
