'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { AppTopbar } from '@/components/layout/AppTopbar'
import { CommandPalette } from '@/components/ui/CommandPalette'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CommandPalette />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
