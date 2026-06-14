'use client'

import { useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface GlowingEffectProps {
  children: React.ReactNode
  className?: string
  color?: string
  size?: number
  blur?: number
}

export function GlowingEffect({ children, className, color = 'var(--primary)', size = 200, blur = 80 }: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || !glowRef.current) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glowRef.current.style.left = `${x - size / 2}px`
    glowRef.current.style.top = `${y - size / 2}px`
    glowRef.current.style.opacity = '1'
  }, [size])

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          filter: `blur(${blur}px)`,
          opacity: 0,
        }}
      />
      {children}
    </div>
  )
}
