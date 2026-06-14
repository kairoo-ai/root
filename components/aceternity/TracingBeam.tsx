'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TracingBeamProps {
  children: React.ReactNode
  className?: string
}

export function TracingBeam({ children, className }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const scrollResult = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const y1 = useSpring(scrollResult.scrollYProgress, { stiffness: 500, damping: 90 })

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight)
    }
  }, [])

  if (reduce) {
    return <div className={cn('relative', className)}>{children}</div>
  }

  return (
    <div ref={ref} className={cn('relative mx-auto max-w-4xl', className)}>
      <div className="absolute -left-4 top-3 hidden md:block" aria-hidden="true">
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width={20}
          height={svgHeight}
          fill="none"
          className="overflow-visible"
        >
          <motion.path
            d={`M 10 0 L 10 ${svgHeight}`}
            stroke="url(#beam-gradient)"
            strokeWidth="1.5"
            className="motion-safe:block"
            style={{ pathLength: scrollYProgress }}
          />
          <motion.circle
            cx="10"
            cy="0"
            r="4"
            fill="var(--primary)"
            style={{ offsetDistance: `${y1}` as unknown as string }}
          />
          <defs>
            <linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={svgHeight}>
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
              <stop offset="10%" stopColor="var(--primary)" />
              <stop offset="90%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
