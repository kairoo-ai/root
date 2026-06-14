'use client'

import { forwardRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GooeyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
  containerClassName?: string
  onSubmit?: (value: string) => void
}

export const GooeyInput = forwardRef<HTMLInputElement, GooeyInputProps>(
  ({ containerClassName, className, onSubmit, onKeyDown, ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    const reduce = useReducedMotion()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        onSubmit((e.currentTarget as HTMLInputElement).value)
      }
      onKeyDown?.(e)
    }

    return (
      <div className={cn('relative', containerClassName)}>
        {/* SVG gooey filter */}
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter id="gooey-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
                result="gooey"
              />
              <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
            </filter>
          </defs>
        </svg>

        <motion.div
          animate={reduce ? {} : {
            boxShadow: focused
              ? `0 0 0 2px var(--primary), 0 0 24px 4px color-mix(in oklch, var(--primary) 30%, transparent)`
              : `0 0 0 1px var(--border)`,
          }}
          transition={{ duration: 0.25 }}
          className="flex items-center overflow-hidden rounded-xl bg-card"
          style={{ filter: focused && !reduce ? 'url(#gooey-filter)' : undefined }}
        >
          <input
            ref={ref}
            {...props}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
            onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none',
              className,
            )}
          />
        </motion.div>
      </div>
    )
  },
)
GooeyInput.displayName = 'GooeyInput'
