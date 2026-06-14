'use client'

import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Bell, ChevronRight, Command } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/activity': 'Activity',
  '/progress': 'Progress',
  '/roadmaps': 'Roadmaps',
  '/tools': 'All Tools',
  '/tools/interviewPrep': 'Interview Prep',
  '/tools/resumeBuilder': 'Resume Builder',
  '/tools/skillGapAnalysis': 'Skill Gap Analysis',
  '/tools/studyPlan': 'Study Plans',
  '/tools/conceptExplainer': 'Concept Explainer',
  '/tools/practiceQuizzes': 'Practice Quizzes',
  '/settings': 'Settings',
  '/settings/billing': 'Billing',
}

function getBreadcrumb(pathname: string): { segment: string; label: string }[] {
  const crumbs: { segment: string; label: string }[] = [{ segment: '/', label: 'Home' }]

  // Try exact match first
  if (routeLabels[pathname]) {
    crumbs.push({ segment: pathname, label: routeLabels[pathname] })
    return crumbs
  }

  // Walk up path segments
  const parts = pathname.split('/').filter(Boolean)
  let built = ''
  for (const part of parts) {
    built += '/' + part
    const label =
      routeLabels[built] ??
      part.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
    crumbs.push({ segment: built, label })
  }
  return crumbs
}

function openCommandPalette() {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
  )
}

export function AppTopbar() {
  const pathname = usePathname()
  const crumbs = getBreadcrumb(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1" aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <span key={crumb.segment} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
            )}
            <span
              className={cn(
                'text-sm',
                i === crumbs.length - 1
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Command palette trigger */}
        <button
          onClick={openCommandPalette}
          aria-label="Open command palette"
          className={cn(
            'flex items-center gap-1.5 rounded-lg border border-border bg-white/5 px-2.5 py-1.5',
            'text-xs text-muted-foreground transition-colors hover:border-teal-500/30 hover:bg-teal-500/5 hover:text-teal-400'
          )}
        >
          <Command className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">K</span>
        </button>

        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className={cn(
            'relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white/5',
            'text-muted-foreground transition-colors hover:border-teal-500/30 hover:bg-teal-500/5 hover:text-teal-400'
          )}
        >
          <Bell className="h-4 w-4" />
          {/* Unread dot */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal-400" />
        </button>

        {/* User avatar */}
        <UserButton />
      </div>
    </header>
  )
}
