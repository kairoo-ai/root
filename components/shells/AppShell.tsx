'use client'

import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  Map,
  Briefcase,
  FileText,
  Zap,
  Grid3x3,
  BookOpen,
  Lightbulb,
  CheckSquare,
  Settings,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AceternitySidebar, SidebarProvider, SidebarToggle, useSidebar } from '@/components/aceternity'
import { AppTopbar } from '@/components/layout/AppTopbar'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { PageTransition } from './PageTransition'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const TOOL_COUNT = 38

interface NavItem {
  label: string
  href: string
  Icon: React.ElementType
  badge?: string | number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
      { label: 'Activity', href: '/activity', Icon: Activity },
      { label: 'Progress', href: '/progress', Icon: TrendingUp },
    ],
  },
  {
    title: 'CAREER AI',
    items: [
      { label: 'Roadmaps', href: '/roadmaps', Icon: Map },
      { label: 'Interview Prep', href: '/tools/interviewPrep', Icon: Briefcase },
      { label: 'Resume Builder', href: '/tools/resumeBuilder', Icon: FileText },
      { label: 'Skill Gap', href: '/tools/skillGapAnalysis', Icon: Zap },
      { label: 'All Tools', href: '/tools', Icon: Grid3x3, badge: TOOL_COUNT },
    ],
  },
  {
    title: 'LEARNING',
    items: [
      { label: 'Study Plans', href: '/learning/study-plans', Icon: BookOpen },
      { label: 'Concept Explainer', href: '/learning/concept-explainer', Icon: Lightbulb },
      { label: 'Practice Quizzes', href: '/learning/quizzes', Icon: CheckSquare },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { label: 'Settings', href: '/settings', Icon: Settings },
    ],
  },
]

function SidebarNav() {
  const pathname = usePathname()
  const { open } = useSidebar()

  return (
    <AceternitySidebar>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/8">
        <AnimatePresence initial={false}>
          {open && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap text-sm font-bold bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Kairoo
            </motion.span>
          )}
        </AnimatePresence>
        <SidebarToggle />
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            {/* Section heading — hidden when collapsed */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden px-3 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground/50 uppercase"
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!open ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                      isActive
                        ? 'bg-teal-400/10 font-semibold text-teal-400'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                    )}
                  >
                    <item.Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-teal-400' : '')} />

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                          {item.badge !== undefined && (
                            <span className="ml-2 rounded-full bg-teal-400/15 px-2 py-0.5 text-[10px] font-semibold text-teal-400">
                              {item.badge}
                            </span>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </AceternitySidebar>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden bg-background">
        <CommandPalette />
        <SidebarNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppTopbar />
          <main className="flex flex-1 overflow-hidden">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
