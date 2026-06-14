'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TypewriterWord {
  text: string
  className?: string
}

interface TypewriterEffectProps {
  words: TypewriterWord[]
  className?: string
  cursorClassName?: string
}

export function TypewriterEffect({ words, className, cursorClassName }: TypewriterEffectProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={cn('inline', className)}>
        {words.map((w, i) => (
          <span key={i} className={cn('text-foreground', w.className)}>{w.text} </span>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('inline-flex flex-wrap items-center', className)}>
      {words.map((word, wIdx) => (
        <div key={wIdx} className="inline-flex overflow-hidden">
          {word.text.split('').map((char, cIdx) => (
            <motion.span
              key={cIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (wIdx * word.text.length + cIdx) * 0.05, duration: 0.2 }}
              className={cn('text-foreground', word.className)}
            >
              {char}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </div>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('ml-0.5 inline-block h-[1em] w-0.5 rounded-full bg-primary align-middle', cursorClassName)}
      />
    </div>
  )
}
