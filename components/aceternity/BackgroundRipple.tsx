'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BackgroundRippleProps {
  children?: React.ReactNode
  className?: string
  rippleColor?: string
  numRings?: number
}

export function BackgroundRipple({
  children,
  className,
  rippleColor = 'var(--primary)',
  numRings = 6,
}: BackgroundRippleProps) {
  const reduce = useReducedMotion()
  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden', className)}>
      {Array.from({ length: numRings }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          initial={{ opacity: 0, scale: 0 }}
          animate={reduce ? { opacity: 0.15, scale: 1 + i * 0.4 } : {
            opacity: [0, 0.15, 0],
            scale: [0, 1 + i * 0.4, 2 + i * 0.4],
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            width: `${(i + 1) * 120}px`,
            height: `${(i + 1) * 120}px`,
            borderColor: rippleColor,
          }}
        />
      ))}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
