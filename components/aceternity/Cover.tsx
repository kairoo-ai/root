'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CoverProps {
  children: React.ReactNode
  className?: string
}

export function Cover({ children, className }: CoverProps) {
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('relative inline-block', className)}
    >
      {children}
      <motion.span
        className="absolute inset-0 rounded-md"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={reduce
          ? { opacity: hovered ? 0.15 : 0 }
          : { opacity: hovered ? 0.15 : 0, scale: hovered ? 1 : 1.05 }
        }
        transition={{ duration: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}
