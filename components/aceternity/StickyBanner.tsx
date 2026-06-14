'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StickyBannerProps {
  children: React.ReactNode
  storageKey?: string
  className?: string
}

export function StickyBanner({ children, storageKey, className }: StickyBannerProps) {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (storageKey && localStorage.getItem(storageKey) === '1') return
    setVisible(true)
  }, [storageKey])

  const dismiss = () => {
    if (storageKey) localStorage.setItem(storageKey, '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Site announcement"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: 'easeInOut' }}
          className={cn(
            'relative z-50 overflow-hidden bg-primary/10 backdrop-blur-sm',
            className,
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2 text-sm text-foreground">
            {children}
          </div>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={dismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
