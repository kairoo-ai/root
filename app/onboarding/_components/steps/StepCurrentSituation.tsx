'use client'
import { useState } from 'react'
import { Briefcase, MapPin, Building2 } from 'lucide-react'
import { Combobox } from '../Combobox'
import { JOB_TITLES } from '@/lib/data/static/job-titles'
import { INDUSTRIES } from '@/lib/data/static/industries'
import { LOCATIONS } from '@/lib/data/static/locations'
import { cn } from '@/lib/utils'

const EXP_RANGES = [
  { label: 'Student / Fresher', value: 0 },
  { label: '1–2 years', value: 1 },
  { label: '3–5 years', value: 3 },
  { label: '6–10 years', value: 6 },
  { label: '10+ years', value: 10 },
]

interface FormData {
  currentRole: string
  currentCompany: string
  yearsExperience: number | ''
  industry: string
  location: string
}

interface Props {
  data: FormData
  onNext: (d: FormData) => void
  onBack: () => void
}

export function StepCurrentSituation({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<FormData>(data)
  const [industrySearch, setIndustrySearch] = useState('')
  const set = (k: keyof FormData, v: FormData[typeof k]) => setForm(f => ({ ...f, [k]: v }))

  const filteredIndustries = industrySearch
    ? INDUSTRIES.filter(i => i.toLowerCase().includes(industrySearch.toLowerCase()))
    : INDUSTRIES

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-foreground">Where are you right now?</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Your current professional situation.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3" /> Current job title
          </label>
          <Combobox
            value={form.currentRole}
            onChange={v => set('currentRole', v)}
            options={JOB_TITLES}
            placeholder="e.g. Software Engineer, Product Manager, Student"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> Company / Organisation
          </label>
          <input
            value={form.currentCompany}
            onChange={e => set('currentCompany', e.target.value)}
            placeholder="e.g. Google, Infosys, IIT Delhi (or leave blank)"
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2">Years of experience</label>
          <div className="flex flex-wrap gap-2">
            {EXP_RANGES.map(r => (
              <button key={r.label} type="button" onClick={() => set('yearsExperience', r.value)}
                className={cn('text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer', form.yearsExperience === r.value
                  ? 'bg-teal-500/15 border-teal-500/50 text-teal-400'
                  : 'border-border text-muted-foreground hover:border-teal-500/30')}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2">Industry</label>
          <input
            value={industrySearch}
            onChange={e => setIndustrySearch(e.target.value)}
            placeholder="Search industries..."
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors mb-2"
          />
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredIndustries.map(ind => (
              <button key={ind} type="button" onClick={() => set('industry', ind)}
                className={cn('text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer shrink-0', form.industry === ind
                  ? 'bg-teal-500/15 border-teal-500/50 text-teal-400'
                  : 'border-border text-muted-foreground hover:border-teal-500/30')}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Location
          </label>
          <Combobox
            value={form.location}
            onChange={v => set('location', v)}
            options={LOCATIONS}
            placeholder="e.g. Bangalore, Mumbai, Remote"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button type="button" onClick={onBack} className="flex-none text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-border">Back</button>
        <button type="button" onClick={() => onNext(form)} className="flex-1 bg-teal-500 text-black font-bold py-2.5 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer text-sm">Next: Career Goals</button>
      </div>
    </div>
  )
}
