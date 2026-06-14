'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingNavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface FloatingNavbarProps {
  items: FloatingNavItem[]
  className?: string
}

export function FloatingNavbar({ items, className }: FloatingNavbarProps) {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: reduce ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed inset-x-0 top-4 z-50 mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-background/80 px-4 py-2 shadow-lg backdrop-blur-md',
            className,
          )}
          aria-label="Floating navigation"
        >
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
