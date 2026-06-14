'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface AppleCard {
  id: string | number
  title: string
  category?: string
  description?: string
  content?: React.ReactNode
  image?: string
  color?: string
}

interface AppleCardsCarouselProps {
  cards: AppleCard[]
  className?: string
}

export function AppleCardsCarousel({ cards, className }: AppleCardsCarouselProps) {
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState<string | number | null>(null)
  const reduce = useReducedMotion()

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(cards.length - 1, i + 1)), [cards.length])

  return (
    <div className={cn('relative w-full', className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous card"
          className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={reduce ? {} : { x: `calc(-${index * 100}% - ${index * 16}px)` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className="min-w-full cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => setExpanded(expanded === card.id ? null : card.id)}
                style={{ background: card.color ?? 'var(--card)' }}
                whileHover={reduce ? {} : { scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                {card.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.image} alt={card.title} className="h-56 w-full object-cover" />
                )}
                <div className="p-6">
                  {card.category && (
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {card.category}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                  {card.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                  )}
                  <AnimatePresence>
                    {expanded === card.id && card.content && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 overflow-hidden text-sm text-muted-foreground"
                      >
                        {card.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <button
          onClick={next}
          disabled={index === cards.length - 1}
          aria-label="Next card"
          className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to card ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === index ? 'w-5 bg-primary' : 'w-1.5 bg-border',
            )}
          />
        ))}
      </div>
    </div>
  )
}
