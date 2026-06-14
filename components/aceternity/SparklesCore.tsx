'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SparklesProps {
  className?: string
  particleCount?: number
  particleColor?: string
  minSize?: number
  maxSize?: number
  speed?: number
}

export function SparklesCore({
  className,
  particleCount = 40,
  particleColor = '#14b8a6',
  minSize = 1,
  maxSize = 2,
  speed = 0.3,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Array<{
      x: number; y: number; vx: number; vy: number
      size: number; opacity: number; life: number; maxLife: number
    }> = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = () => {
      if (particles.length < particleCount) {
        const maxLife = 60 + Math.random() * 120
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed - 0.1,
          size: minSize + Math.random() * (maxSize - minSize),
          opacity: 0,
          life: 0,
          maxLife,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.opacity = p.life < p.maxLife * 0.3
          ? p.life / (p.maxLife * 0.3)
          : 1 - (p.life - p.maxLife * 0.3) / (p.maxLife * 0.7)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.globalAlpha = Math.max(0, p.opacity) * 0.6
        ctx.fill()

        if (p.life >= p.maxLife) particles.splice(i, 1)
      }
      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [particleCount, particleColor, minSize, maxSize, speed])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
    />
  )
}
