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
  Settings,
} from 'lucide-react'
import { AceternitySidebar, SidebarProvider, SidebarToggle, SidebarLink, useSidebar } from '@/components/aceternity'
import { AppTopbar } from '@/components/layout/AppTopbar'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { PageTransition } from './PageTransition'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
  { label: 'Activity', href: '/activity', Icon: Activity },
  { label: 'Progress', href: '/progress', Icon: TrendingUp },
  { label: 'Roadmaps', href: '/roadmaps', Icon: Map },
  { label: 'Interview Prep', href: '/tools/interviewPrep', Icon: Briefcase },
  { label: 'Resume Builder', href: '/tools/resumeBuilder', Icon: FileText },
  { label: 'Skill Gap', href: '/tools/skillGapAnalysis', Icon: Zap },
  { label: 'All Tools', href: '/tools', Icon: Grid3x3 },
  { label: 'Settings', href: '/settings', Icon: Settings },
]

function AceternitySidebarNav() {
  const pathname = usePathname()
  const { open } = useSidebar()
  return (
    <AceternitySidebar>
      <div className="flex items-center justify-between px-3 py-3">
        {open && <span className="text-sm font-bold text-foreground">Kairoo</span>}
        <SidebarToggle />
      </div>
      <nav className="flex-1 overflow-y-auto py-2 px-1">
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            item={{
              label: item.label,
              href: item.href,
              icon: <item.Icon className="h-4 w-4" />,
              active: pathname === item.href || pathname.startsWith(item.href + '/'),
            }}
          />
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
        <AceternitySidebarNav />
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
