'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FollowingPointerProps {
  children: React.ReactNode
  className?: string
  label?: string
}

export function FollowingPointer({ children, className, label }: FollowingPointerProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  if (reduce) return <div className={className}>{children}</div>

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn('relative', className)}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            className="pointer-events-none absolute z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
          >
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary" />
              {label && (
                <span className="rounded bg-card px-2 py-0.5 text-xs text-foreground shadow-sm">
                  {label}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
}
