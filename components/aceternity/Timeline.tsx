'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  title: string
  date?: string
  content: React.ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-border md:block" aria-hidden="true">
        <motion.div
          className="absolute left-0 top-0 w-full origin-top bg-primary"
          style={reduce ? { height: '100%' } : { height: lineHeight }}
        />
      </div>
      <div className="space-y-10 md:pl-12">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={reduce ? {} : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.05 * idx }}
            className="relative"
          >
            <div className="absolute -left-12 top-1 hidden h-3 w-3 rounded-full bg-primary ring-4 ring-background md:block" />
            {item.date && (
              <p className="mb-1 text-xs text-muted-foreground">{item.date}</p>
            )}
            <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
            <div className="text-sm text-muted-foreground">{item.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
