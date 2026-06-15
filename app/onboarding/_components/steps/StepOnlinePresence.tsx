'use client'

import { Github, Linkedin, Globe, Building2, Link } from 'lucide-react'
import type { WizardData } from '../OnboardingWizard'

interface Props {
  data: WizardData
  onChange: (d: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

interface FieldConfig {
  key: keyof Pick<WizardData, 'githubUrl' | 'linkedinUrl' | 'portfolioUrl' | 'naukriUrl' | 'otherUrl'>
  label: string
  placeholder: string
  icon: React.ComponentType<{ className?: string }>
}

const FIELDS: FieldConfig[] = [
  { key: 'githubUrl', label: 'GitHub', placeholder: 'https://github.com/username', icon: Github },
  { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', icon: Linkedin },
  { key: 'portfolioUrl', label: 'Portfolio / Website', placeholder: 'https://yoursite.com', icon: Globe },
  { key: 'naukriUrl', label: 'Naukri', placeholder: 'https://naukri.com/mnjuser/profile', icon: Building2 },
  { key: 'otherUrl', label: 'Other profile', placeholder: 'Any other relevant profile URL', icon: Link },
]

export function StepOnlinePresence({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-foreground">Your online presence</h2>
        <p className="text-xs text-muted-foreground mt-0.5">All optional — links let {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} give more specific, context-aware advice.</p>
      </div>

      <div className="space-y-3">
        {FIELDS.map(field => {
          const Icon = field.icon
          return (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Icon className="w-3 h-3" /> {field.label}
              </label>
              <input
                type="url"
                value={data[field.key]}
                onChange={e => onChange({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-none text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-zinc-700"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-medium py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Next: Preferences
        </button>
      </div>
    </div>
  )
}
