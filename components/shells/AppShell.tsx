'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { AppTopbar } from '@/components/layout/AppTopbar'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { PageTransition } from './PageTransition'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CommandPalette />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex flex-1 overflow-hidden">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
