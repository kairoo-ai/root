'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
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
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavGroup {
  heading: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    heading: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Activity', href: '/activity', icon: Activity },
      { label: 'Progress', href: '/progress', icon: TrendingUp },
    ],
  },
  {
    heading: 'CAREER AI',
    items: [
      { label: 'Roadmaps', href: '/roadmaps', icon: Map },
      { label: 'Interview Prep', href: '/tools/interviewPrep', icon: Briefcase },
      { label: 'Resume Builder', href: '/tools/resumeBuilder', icon: FileText },
      { label: 'Skill Gap', href: '/tools/skillGapAnalysis', icon: Zap },
      { label: 'All Tools', href: '/tools', icon: Grid3x3, badge: '38' },
    ],
  },
  {
    heading: 'LEARNING',
    items: [
      { label: 'Study Plans', href: '/tools/studyPlan', icon: BookOpen },
      { label: 'Concept Explainer', href: '/tools/conceptExplainer', icon: Lightbulb },
      { label: 'Practice Quizzes', href: '/tools/practiceQuizzes', icon: CheckSquare },
    ],
  },
  {
    heading: 'ACCOUNT',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

function NavItemRow({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
        isActive
          ? 'border border-teal-500/20 bg-teal-500/10 text-teal-400'
          : 'border border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          isActive ? 'text-teal-400' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500/15 px-1.5 text-[10px] font-semibold text-teal-400">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  const isActive = (href: string) => {
    if (href === '/tools') return pathname === '/tools'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col h-screen border-r border-border bg-sidebar overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/20">
          <span className="text-sm font-bold text-white">K</span>
        </div>
        <span className="text-base font-semibold tracking-tight text-foreground">Kairoo</span>
        <span className="ml-auto flex h-5 items-center rounded-md bg-teal-500/15 px-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400">
          AI
        </span>
      </div>

      {/* User pill */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
        <UserButton />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-foreground leading-none">
            {user?.firstName ?? user?.username ?? 'User'}
          </span>
          <span className="mt-0.5 text-[11px] text-muted-foreground leading-none">
            {user?.primaryEmailAddress?.emailAddress ?? ''}
          </span>
        </div>
        <span className="flex h-5 shrink-0 items-center rounded-md bg-teal-500/15 px-1.5 text-[10px] font-semibold text-teal-400">
          Pro
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
              {group.heading}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItemRow key={item.href} item={item} isActive={isActive(item.href)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade card */}
      <div className="px-3 py-3 border-t border-border">
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span className="text-xs font-semibold text-teal-400">Pro Plan</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
            Unlimited AI tools, priority access, and advanced analytics.
          </p>
          {/* Usage bar */}
          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>AI Credits</span>
            <span>850 / 1000</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
              style={{ width: '85%' }}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
