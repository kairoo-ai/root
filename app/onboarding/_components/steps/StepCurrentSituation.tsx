'use client'

import { useState, useRef } from 'react'
import { Briefcase, MapPin, Building2 } from 'lucide-react'
import { JOB_TITLES } from '@/lib/data/static/job-titles'
import { LOCATIONS } from '@/lib/data/static/locations'
import { INDUSTRIES } from '@/lib/data/static/industries'
import type { WizardData } from '../OnboardingWizard'

const EXP_RANGES = [
  { label: 'Student / Fresher', value: 0 },
  { label: '1–2 years', value: 1 },
  { label: '3–5 years', value: 3 },
  { label: '6–10 years', value: 6 },
  { label: '10+ years', value: 10 },
]

const EMPLOYMENT_STATUS = ['Employed full-time', 'Employed part-time', 'Freelancing', 'Student', 'Looking for work', 'On a break']

interface ComboboxProps {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  id: string
}

function Combobox({ value, onChange, options, placeholder, id }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [inputVal, setInputVal] = useState(value)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtered = inputVal.trim()
    ? options.filter(o => o.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 8)
    : []

  const handleInput = (v: string) => {
    setInputVal(v)
    onChange(v)
  }

  const handleSelect = (v: string) => {
    setInputVal(v)
    onChange(v)
    setOpen(false)
  }

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 150)
  }

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current)
    if (inputVal.trim()) setOpen(true)
  }

  return (
    <div className="relative" id={id}>
      <input
        value={inputVal}
        onChange={e => { handleInput(e.target.value); setOpen(true) }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={() => handleSelect(opt)}
              className="px-3 py-2 hover:bg-zinc-700 cursor-pointer text-sm text-zinc-200"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  data: WizardData
  onNext: (d: Partial<WizardData>) => void
  onBack: () => void
}

export function StepCurrentSituation({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    currentRole: data.currentRole,
    currentCompany: data.currentCompany,
    yearsExperience: data.yearsExperience,
    industry: data.industry,
    location: data.location,
    employmentStatus: data.employmentStatus,
    currentSalary: data.currentSalary,
  })
  const [industrySearch, setIndustrySearch] = useState('')

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const filteredIndustries = industrySearch.trim()
    ? INDUSTRIES.filter(i => i.toLowerCase().includes(industrySearch.toLowerCase()))
    : INDUSTRIES

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-white">Where are you right now?</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Your current professional situation.</p>
      </div>

      <div className="space-y-4">
        {/* Current role */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3" /> Current job title
          </label>
          <Combobox
            id="currentRole"
            value={form.currentRole}
            onChange={v => set('currentRole', v)}
            options={JOB_TITLES}
            placeholder="e.g. Software Engineer, Product Manager, Student"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> Company / Organisation
          </label>
          <input
            value={form.currentCompany}
            onChange={e => set('currentCompany', e.target.value)}
            placeholder="e.g. Google, Infosys, IIT Delhi (or leave blank)"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
          />
        </div>

        {/* Employment status */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Employment status</label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_STATUS.map(s => (
              <button
                key={s}
                onClick={() => set('employmentStatus', s)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  form.employmentStatus === s
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Years of experience */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Years of experience</label>
          <div className="flex flex-wrap gap-2">
            {EXP_RANGES.map(r => (
              <button
                key={r.label}
                onClick={() => set('yearsExperience', r.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  form.yearsExperience === r.value
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Industry</label>
          <input
            value={industrySearch}
            onChange={e => setIndustrySearch(e.target.value)}
            placeholder="Search industries..."
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 mb-2"
          />
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {filteredIndustries.map(ind => (
              <button
                key={ind}
                onClick={() => set('industry', ind)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer shrink-0 ${
                  form.industry === ind
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Location
          </label>
          <Combobox
            id="location"
            value={form.location}
            onChange={v => set('location', v)}
            options={LOCATIONS}
            placeholder="e.g. Bangalore, Mumbai, Remote"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-none text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-zinc-700"
        >
          Back
        </button>
        <button
          onClick={() => onNext(form)}
          className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-medium py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Next: Career Goals
        </button>
      </div>
    </div>
  )
}
