'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const COLORS = [
  'var(--primary)', 'var(--accent)', 'var(--chart-1)',
  'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)',
]

interface BoxProps { color: string }

function Box({ color }: BoxProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="h-8 w-8 border border-white/5"
      animate={{ backgroundColor: hovered ? color : 'transparent' }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  )
}

interface BackgroundBoxesProps {
  children?: React.ReactNode
  className?: string
  rows?: number
  cols?: number
}

export function BackgroundBoxes({ children, className, rows = 20, cols = 30 }: BackgroundBoxesProps) {
  const boxes = useMemo(
    () => Array.from({ length: rows * cols }, (_, i) => ({ id: i, color: COLORS[i % COLORS.length] })),
    [rows, cols],
  )
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {boxes.map((b) => <Box key={b.id} color={b.color} />)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
