'use client'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, User } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [careerGoal, setCareerGoal] = useState('')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [saved, setSaved] = useState(false)

  const save = async () => {
    // Update user metadata via Clerk
    await user?.update({ unsafeMetadata: { careerGoal, timezone } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!isLoaded) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-card border border-border animate-pulse" />)}
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Avatar */}
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-teal-500 flex items-center justify-center text-2xl font-bold text-white">
          {user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress?.[0] ?? 'K'}
        </div>
        <div>
          <div className="font-bold text-foreground">{user?.fullName ?? 'Kairoo User'}</div>
          <div className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</div>
          <div className="text-xs text-teal-400 mt-0.5">Managed by Clerk — edit via account portal</div>
        </div>
      </div>

      {/* Career goal */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-bold text-foreground">Career Profile</h2>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Career Goal</label>
          <textarea
            value={careerGoal}
            onChange={e => setCareerGoal(e.target.value)}
            placeholder="e.g. Become a Senior Product Manager at a Series B startup within 18 months"
            rows={3}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 resize-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Timezone</label>
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-teal-500/50 cursor-pointer transition-colors"
          >
            <option value="Asia/Kolkata">India Standard Time (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
          </select>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-4 py-2 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </motion.div>
  )
}
