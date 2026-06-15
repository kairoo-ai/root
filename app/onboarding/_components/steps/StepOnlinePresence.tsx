'use client'
import { useState } from 'react'
import { Github, Linkedin, Globe, Building2, Link } from 'lucide-react'

interface Data {
  githubUrl: string
  linkedinUrl: string
  portfolioUrl: string
  naukriUrl: string
  otherUrl: string
}

interface Props {
  data: Data
  onNext: (d: Data) => void
  onBack: () => void
}

const FIELDS = [
  { key: 'githubUrl' as const, label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { key: 'linkedinUrl' as const, label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { key: 'portfolioUrl' as const, label: 'Portfolio / Website', icon: Globe, placeholder: 'https://yoursite.com' },
  { key: 'naukriUrl' as const, label: 'Naukri', icon: Building2, placeholder: 'https://naukri.com/mnjuser/profile' },
  { key: 'otherUrl' as const, label: 'Other profile', icon: Link, placeholder: 'Any other relevant profile URL' },
]

export function StepOnlinePresence({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Data>(data)
  const set = (k: keyof Data, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-foreground">Your online presence</h2>
        <p className="text-xs text-muted-foreground mt-0.5">All optional — links let Kairoo give more specific, context-aware advice.</p>
      </div>

      <div className="space-y-3.5">
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <f.icon className="w-3 h-3" />
              {f.label}
            </label>
            <input
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              type="url"
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button type="button" onClick={onBack} className="flex-none text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-border">Back</button>
        <button type="button" onClick={() => onNext(form)} className="flex-1 bg-teal-500 text-black font-bold py-2.5 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer text-sm">
          Next: Preferences
        </button>
      </div>
    </div>
  )
}
