'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TooltipItem {
  id: number | string
  name: string
  designation?: string
  image?: string
}

interface AnimatedTooltipProps {
  items: TooltipItem[]
  className?: string
}

export function AnimatedTooltip({ items, className }: AnimatedTooltipProps) {
  const [hoveredId, setHoveredId] = useState<number | string | null>(null)
  const reduce = useReducedMotion()

  return (
    <div className={cn('flex flex-row items-center justify-center gap-1', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <AnimatePresence>
            {hoveredId === item.id && (
              <motion.div
                className="absolute -top-14 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center"
                initial={{ opacity: 0, y: reduce ? 0 : 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: reduce ? 0 : 8, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <div className="rounded-md bg-card px-3 py-1.5 shadow-lg ring-1 ring-border">
                  <p className="whitespace-nowrap text-xs font-medium text-foreground">{item.name}</p>
                  {item.designation && (
                    <p className="whitespace-nowrap text-xs text-muted-foreground">{item.designation}</p>
                  )}
                </div>
                <div className="h-1.5 w-1.5 rotate-45 bg-card ring-1 ring-border" style={{ marginTop: -4 }} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-border transition-transform duration-150 group-hover:z-10 group-hover:scale-110">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold text-muted-foreground">
                {item.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
