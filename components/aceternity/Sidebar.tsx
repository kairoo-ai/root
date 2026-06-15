'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SidebarContextValue {
  open: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue>({ open: true, toggle: () => {} })

export function useSidebar() {
  return useContext(SidebarContext)
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen)
  const toggle = useCallback(() => setOpen((v) => !v), [])
  return <SidebarContext.Provider value={{ open, toggle }}>{children}</SidebarContext.Provider>
}

export interface SidebarLinkItem {
  label: string
  href: string
  icon?: React.ReactNode
  active?: boolean
}

interface SidebarLinkProps {
  item: SidebarLinkItem
}

export function SidebarLink({ item }: SidebarLinkProps) {
  const { open } = useSidebar()
  return (
    <a
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        item.active
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
      title={!open ? item.label : undefined}
    >
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  )
}

export function SidebarToggle() {
  const { open, toggle } = useSidebar()
  return (
    <button
      onClick={toggle}
      aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </button>
  )
}

interface AceternitySidebarProps {
  children: React.ReactNode
  className?: string
}

export function AceternitySidebar({ children, className }: AceternitySidebarProps) {
  const { open } = useSidebar()
  const reduce = useReducedMotion()

  return (
    <motion.aside
      animate={reduce ? {} : { width: open ? 240 : 56 }}
      initial={false}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'flex shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar',
        className,
      )}
      style={reduce ? { width: open ? 240 : 56 } : undefined}
    >
      {children}
    </motion.aside>
  )
}
