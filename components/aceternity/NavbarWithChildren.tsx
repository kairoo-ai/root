'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

interface NavbarWithChildrenProps {
  items: NavItem[]
  logo?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function NavbarWithChildren({ items, logo, actions, className }: NavbarWithChildrenProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <nav
      className={cn(
        'relative z-40 border-b border-border bg-background/80 backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {logo && <div className="shrink-0">{logo}</div>}

        {/* Desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="relative"
              onMouseEnter={() => setOpenIdx(idx)}
              onMouseLeave={() => setOpenIdx(null)}
            >
              <a
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </a>
              {item.children && (
                <AnimatePresence>
                  {openIdx === idx && (
                    <motion.ul
                      initial={{ opacity: 0, y: reduce ? 0 : -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 min-w-[160px] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                    >
                      {item.children.map((child, cidx) => (
                        <li key={cidx}>
                          <a
                            href={child.href}
                            className="block px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>

        {actions && <div className="hidden items-center gap-2 md:flex">{actions}</div>}

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 p-1 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-0.5 w-5 bg-foreground" />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <ul className="px-4 py-3">
              {items.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <ul className="ml-3">
                      {item.children.map((child, cidx) => (
                        <li key={cidx}>
                          <a
                            href={child.href}
                            className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {actions && <div className="border-t border-border px-4 py-3">{actions}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
