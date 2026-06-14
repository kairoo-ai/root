'use client'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Shield, Smartphone, Globe, AlertTriangle } from 'lucide-react'

export default function SecurityPage() {
  const { user } = useUser()

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Connected accounts */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-bold text-foreground mb-4">Connected Accounts</h2>
        <div className="space-y-3">
          {user?.externalAccounts?.length ? user.externalAccounts.map(acc => (
            <div key={acc.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground capitalize">{acc.provider}</div>
                <div className="text-xs text-muted-foreground">{acc.emailAddress}</div>
              </div>
              <span className="ml-auto text-[10px] font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">Connected</span>
            </div>
          )) : (
            <p className="text-xs text-muted-foreground">No external accounts connected. Add Google or GitHub via your profile.</p>
          )}
        </div>
      </div>

      {/* MFA */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-2">
          <Smartphone className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-bold text-foreground">Two-Factor Authentication</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Secure your account with 2FA. Managed through Clerk.</p>
        <a
          href={user?.id ? `https://accounts.kairoo.ai/user` : '#'}
          className="inline-flex items-center gap-2 text-xs font-semibold border border-border text-muted-foreground px-4 py-2 rounded-xl hover:bg-card hover:text-foreground transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          Manage 2FA Settings
        </a>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-bold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="text-xs font-semibold text-red-400 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer">
          Delete Account
        </button>
      </div>
    </motion.div>
  )
}
