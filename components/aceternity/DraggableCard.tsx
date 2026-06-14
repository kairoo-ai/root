'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DraggableCardProps {
  children: React.ReactNode
  className?: string
  dragConstraintsRef?: React.RefObject<HTMLElement | null>
}

export function DraggableCard({ children, className, dragConstraintsRef }: DraggableCardProps) {
  const internalRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })

  if (reduce) {
    return <div className={cn('cursor-grab', className)}>{children}</div>
  }

  return (
    <motion.div
      ref={internalRef}
      drag
      dragConstraints={dragConstraintsRef ?? { left: -200, right: 200, top: -200, bottom: 200 }}
      dragElastic={0.1}
      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
      style={{ x, y, rotateX, rotateY }}
      className={cn('cursor-grab touch-none select-none', className)}
    >
      {children}
    </motion.div>
  )
}
