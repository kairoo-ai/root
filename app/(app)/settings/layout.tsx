'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { User, Bell, Shield, CreditCard } from 'lucide-react'

const tabs = [
  { href: '/settings/profile', label: 'Profile', icon: User },
  { href: '/settings/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings/security', label: 'Security', icon: Shield },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences.</p>
      </div>
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 text-xs font-semibold px-4 py-2.5 border-b-2 transition-all -mb-px',
              pathname === tab.href || pathname.startsWith(tab.href + '/')
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  )
}
