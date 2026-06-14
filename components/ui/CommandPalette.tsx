'use client'

import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'All Tools', href: '/tools', icon: '✦' },
  { label: 'Dynamic Roadmaps', href: '/tools/dynamicRoadmaps', icon: '→' },
  { label: 'Interview Prep', href: '/tools/interviewPrep', icon: '◎' },
  { label: 'Resume Builder', href: '/tools/resumeBuilder', icon: '☰' },
  { label: 'Skill Gap Analysis', href: '/tools/skillGapAnalysis', icon: '◈' },
  { label: 'Roadmaps', href: '/roadmaps', icon: '⬡' },
  { label: 'Progress', href: '/progress', icon: '▲' },
  { label: 'Settings', href: '/settings', icon: '⚙' },
  { label: 'Billing', href: '/settings/billing', icon: '₹' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg mx-4 rounded-xl border border-white/10 bg-[oklch(0.12_0.006_255)] shadow-2xl overflow-hidden"
            initial={{ scale: 0.96, y: -8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -8, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Command className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-zinc-500 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
              <div className="flex items-center border-b border-white/[0.08] px-4">
                <span className="text-zinc-400 mr-3 text-sm">⌘</span>
                <Command.Input
                  placeholder="Search tools, pages..."
                  className="flex-1 bg-transparent py-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
                />
                <kbd className="text-[10px] text-zinc-600 border border-zinc-700 rounded px-1.5 py-0.5">ESC</kbd>
              </div>

              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-zinc-500">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation">
                  {navItems.map(item => (
                    <Command.Item
                      key={item.href}
                      value={item.label}
                      onSelect={() => runCommand(item.href)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 cursor-pointer data-[selected=true]:bg-teal-500/10 data-[selected=true]:text-teal-400 transition-colors"
                    >
                      <span className="w-5 text-center text-zinc-500 text-xs">{item.icon}</span>
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="border-t border-white/[0.06] px-4 py-2.5 flex items-center gap-4 text-[11px] text-zinc-600">
                <span><kbd className="border border-zinc-700 rounded px-1">↑↓</kbd> navigate</span>
                <span><kbd className="border border-zinc-700 rounded px-1">↵</kbd> open</span>
                <span><kbd className="border border-zinc-700 rounded px-1">esc</kbd> close</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
