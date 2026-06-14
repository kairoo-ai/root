'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SVGLoaderProps {
  pathD: string
  viewBox?: string
  size?: number
  className?: string
  strokeColor?: string
  duration?: number
}

export function SVGLoader({
  pathD,
  viewBox = '0 0 100 100',
  size = 48,
  className,
  strokeColor = 'var(--primary)',
  duration = 1.8,
}: SVGLoaderProps) {
  const reduce = useReducedMotion()
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      className={cn('animate-pulse', className)}
    >
      <motion.path
        d={pathD}
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={reduce ? { pathLength: 1, opacity: 1 } : {
          pathLength: [0, 1, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}
