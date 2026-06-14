'use client'

import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Marquee3DProps {
  items: string[]
  className?: string
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
}

export function Marquee3D({ items, className, speed = 30, reverse = false, pauseOnHover = true }: Marquee3DProps) {
  const reduce = useReducedMotion()
  const doubled = [...items, ...items]

  if (reduce) {
    return (
      <div className={cn('flex flex-wrap gap-3', className)}>
        {items.map((item, i) => (
          <span key={i} className="rounded-md bg-card px-4 py-2 text-sm text-foreground">
            {item}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max gap-6',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{
          animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm text-foreground shadow-sm"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}
