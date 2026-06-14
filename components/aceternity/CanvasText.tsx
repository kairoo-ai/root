'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface CanvasTextProps {
  text: string
  className?: string
  fontSize?: number
  color?: string
}

export function CanvasText({ text, className, fontSize = 72, color }: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    if (!w || !h) return
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    // Resolve color — fallback to white for oklch values canvas can't paint
    const resolvedColor = color ?? '#ffffff'
    ctx.clearRect(0, 0, w, h)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = resolvedColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
  }, [text, fontSize, color])

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full', className)}
      aria-label={text}
      role="img"
    />
  )
}
