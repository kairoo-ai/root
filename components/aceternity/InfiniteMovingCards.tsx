'use client'

import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MovingCard {
  quote: string
  name: string
  title?: string
}

interface InfiniteMovingCardsProps {
  items: MovingCard[]
  direction?: 'left' | 'right'
  speed?: number
  pauseOnHover?: boolean
  className?: string
}

export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 30,
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const reduce = useReducedMotion()
  const doubled = [...items, ...items]

  if (reduce) {
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">"{item.quote}"</p>
            <p className="mt-2 text-xs font-medium text-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max gap-4',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{
          animation: `scroll ${speed}s linear infinite ${direction === 'right' ? 'reverse' : ''}`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="w-80 shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs font-medium text-foreground">{item.name}</p>
              {item.title && <p className="text-xs text-muted-foreground">{item.title}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}
