'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextGenerateEffectProps {
  text: string
  className?: string
  duration?: number
}

export function TextGenerateEffect({ text, className, duration = 0.015 }: TextGenerateEffectProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, ++i))
      } else {
        clearInterval(interval)
      }
    }, duration * 1000)
    return () => clearInterval(interval)
  }, [text, duration])

  return (
    <span className={cn('inline', className)}>
      {displayed}
      <AnimatePresence>
        {displayed.length < text.length && (
          <motion.span
            className="inline-block w-0.5 h-4 bg-teal-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
      </AnimatePresence>
    </span>
  )
}
