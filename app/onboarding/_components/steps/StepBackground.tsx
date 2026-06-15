'use client'

import { useState, useRef } from 'react'
import { X, Plus, GraduationCap } from 'lucide-react'
import { SKILLS } from '@/lib/data/static/skills'
import { DEGREE_TYPES, FIELDS_OF_STUDY } from '@/lib/data/static/education'
import type { WizardData, EducationEntry } from '../OnboardingWizard'

const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'TypeScript', 'Node.js', 'SQL', 'Java', 'AWS',
  'Docker', 'Git', 'CSS', 'HTML', 'REST APIs', 'MongoDB', 'PostgreSQL', 'Machine Learning',
]

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

const EMPTY_EDU: EducationEntry = { degree: '', field: '', institution: '', year: '' }

export function StepBackground({ data, onNext, onBack }: Props) {
  const [skills, setSkills] = useState<string[]>(data.skills)
  const [skillInput, setSkillInput] = useState('')
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false)
  const skillBlurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [education, setEducation] = useState<EducationEntry[]>(data.education ?? [])
  const [eduForm, setEduForm] = useState<EducationEntry>(EMPTY_EDU)

  const [certifications, setCertifications] = useState<string>(
    Array.isArray(data.certifications) ? data.certifications.join('\n') : ''
  )
  const [resumeText, setResumeText] = useState(data.resumeText)

  // Skills
  const filteredSkills = skillInput.trim()
    ? SKILLS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)).slice(0, 8)
    : []

  const addSkill = (s: string) => {
    const trimmed = s.trim()
    if (trimmed && !skills.includes(trimmed)) setSkills(prev => [...prev, trimmed])
    setSkillInput('')
    setSkillDropdownOpen(false)
  }

  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s))

  // Education
  const addEducation = () => {
    if (!eduForm.degree && !eduForm.institution) return
    setEducation(prev => [...prev, eduForm])
    setEduForm(EMPTY_EDU)
  }

  const removeEducation = (i: number) => setEducation(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-white">Your background</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Skills, education, and optionally your resume.</p>
      </div>

      <div className="space-y-5">
        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Skills</label>

          {/* Selected skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map(s => (
                <span
                  key={s}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-teal-500/20 border border-teal-500/50 text-teal-400 font-medium"
                >
                  {s}
                  <button onClick={() => removeSkill(s)} className="cursor-pointer hover:text-red-400 transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search input with dropdown */}
          <div className="relative mb-2">
            <input
              value={skillInput}
              onChange={e => { setSkillInput(e.target.value); setSkillDropdownOpen(true) }}
              onFocus={() => { if (skillBlurTimer.current) clearTimeout(skillBlurTimer.current); if (skillInput.trim()) setSkillDropdownOpen(true) }}
              onBlur={() => { skillBlurTimer.current = setTimeout(() => setSkillDropdownOpen(false), 150) }}
              onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
              placeholder="Search or type a skill..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
            />
            {skillDropdownOpen && filteredSkills.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {filteredSkills.map(s => (
                  <div
                    key={s}
                    onMouseDown={() => addSkill(s)}
                    className="px-3 py-2 hover:bg-zinc-700 cursor-pointer text-sm text-zinc-200"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular skills quick-add */}
          <div>
            <p className="text-[10px] text-zinc-500 mb-1.5">Popular skills</p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.filter(s => !skills.includes(s)).map(s => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="text-[11px] px-2.5 py-1 rounded-lg border bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500 transition-all cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5 inline mr-0.5" />{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3 h-3" /> Education
          </label>

          {/* Added entries */}
          {education.length > 0 && (
            <div className="space-y-2 mb-3">
              {education.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{entry.degree}{entry.field ? ` — ${entry.field}` : ''}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {entry.institution}{entry.year ? `, ${entry.year}` : ''}
                    </div>
                  </div>
                  <button onClick={() => removeEducation(i)} className="cursor-pointer text-zinc-500 hover:text-red-400 transition-colors mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add entry form */}
          <div className="space-y-2 p-3 rounded-xl border border-zinc-700/50 bg-zinc-800/30">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Degree</label>
                <select
                  value={eduForm.degree}
                  onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
                >
                  <option value="">Select degree</option>
                  {DEGREE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Field of study</label>
                <Combobox
                  id="eduField"
                  value={eduForm.field}
                  onChange={v => setEduForm(f => ({ ...f, field: v }))}
                  options={FIELDS_OF_STUDY}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Institution</label>
                <input
                  value={eduForm.institution}
                  onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))}
                  placeholder="e.g. IIT Delhi"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 mb-1">Graduation year</label>
                <input
                  value={eduForm.year ?? ''}
                  onChange={e => setEduForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="e.g. 2022"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
                />
              </div>
            </div>
            <button
              onClick={addEducation}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-teal-400 border border-teal-500/30 rounded-lg py-2 hover:bg-teal-500/10 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            Certifications{' '}
            <span className="font-normal text-zinc-500">(optional)</span>
          </label>
          <textarea
            value={certifications}
            onChange={e => setCertifications(e.target.value)}
            placeholder="e.g. AWS Solutions Architect, PMP, CFA (one per line or comma-separated)"
            rows={2}
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none"
          />
        </div>

        {/* Resume paste */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            Paste your resume{' '}
            <span className="font-normal text-zinc-500">(optional but powerful — AI uses this verbatim)</span>
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your full resume text here. The AI will use it to write better cover letters, improve your resume, prep tailored interview answers, and more..."
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none font-mono text-[11px]"
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
          onClick={() => onNext({
            skills,
            education,
            certifications: certifications.split(/[\n,]+/).map(c => c.trim()).filter(Boolean),
            resumeText,
          })}
          className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-medium py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Next: Online Presence
        </button>
      </div>
    </div>
  )
}
