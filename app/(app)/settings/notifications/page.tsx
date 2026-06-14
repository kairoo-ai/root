'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const PREFS = [
  { id: 'weekly_digest', label: 'Weekly Progress Digest', desc: 'A summary of your activity, XP earned, and goals completed.', default: true },
  { id: 'goal_reminders', label: 'Goal Reminders', desc: 'Nudges when you have incomplete weekly goals.', default: true },
  { id: 'new_features', label: 'New Features & Tools', desc: 'Be first to know when new AI tools are added.', default: true },
  { id: 'streak_alerts', label: 'Streak Alerts', desc: "Reminders to maintain your daily streak.", default: false },
  { id: 'credit_alerts', label: 'Credit Warnings', desc: 'Alert when you have fewer than 10 credits left.', default: true },
]

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState(Object.fromEntries(PREFS.map(p => [p.id, p.default])))

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="text-sm font-bold text-foreground">Email Notifications</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Choose what emails you receive from Kairoo.</p>
        </div>
        {PREFS.map(pref => (
          <div key={pref.id} className="flex items-center justify-between px-5 py-4 border-b border-border/30 last:border-0">
            <div>
              <div className="text-sm font-medium text-foreground">{pref.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{pref.desc}</div>
            </div>
            <button
              onClick={() => setPrefs(p => ({ ...p, [pref.id]: !p[pref.id] }))}
              className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${prefs[pref.id] ? 'bg-teal-500' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${prefs[pref.id] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
