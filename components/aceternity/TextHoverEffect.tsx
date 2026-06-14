'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextHoverEffectProps {
  text: string
  className?: string
  duration?: number
}

export function TextHoverEffect({ text, className, duration = 0.3 }: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState(false)
  const [maskPos, setMaskPos] = useState({ cx: '50%', cy: '50%' })

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    setMaskPos({
      cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    })
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn('select-none', className)}
    >
      <defs>
        <linearGradient id="text-hover-gradient" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="50%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        <radialGradient id="text-hover-mask" gradientUnits="userSpaceOnUse" cx={maskPos.cx} cy={maskPos.cy} r="20%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="text-hover-reveal">
          <rect width="100%" height="100%" fill={hovered ? 'url(#text-hover-mask)' : 'black'} />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-muted-foreground/40 text-7xl font-bold"
        style={{ fontFamily: 'inherit' }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent text-7xl font-bold"
        style={{ stroke: 'url(#text-hover-gradient)', fontFamily: 'inherit' }}
        mask="url(#text-hover-reveal)"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: hovered ? 0 : 1000 }}
        transition={{ duration }}
      >
        {text}
      </motion.text>
    </svg>
  )
}
