'use client'
import { useState } from 'react'
import { X, Plus, GraduationCap, Award } from 'lucide-react'
import { Combobox } from '../Combobox'
import { SKILLS } from '@/lib/data/static/skills'
import { DEGREE_TYPES, FIELDS_OF_STUDY } from '@/lib/data/static/education'
import { cn } from '@/lib/utils'

interface EducationEntry {
  degree: string
  field: string
  institution: string
  year: string
}

interface FormData {
  skills: string[]
  education: EducationEntry[]
  certifications: string[]
  resumeText: string
}

interface Props {
  data: FormData
  onNext: (d: FormData) => void
  onBack: () => void
}

const BLANK_EDU: EducationEntry = { degree: '', field: '', institution: '', year: '' }

export function StepBackground({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<FormData>({
    skills: data.skills ?? [],
    education: data.education?.length ? data.education : [],
    certifications: data.certifications ?? [],
    resumeText: data.resumeText ?? '',
  })
  const [skillSearch, setSkillSearch] = useState('')
  const [certInput, setCertInput] = useState('')
  const [eduFieldVal, setEduFieldVal] = useState<Record<number, string>>({})

  const filteredSkills = skillSearch
    ? SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).slice(0, 40)
    : SKILLS.slice(0, 40)

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill],
    }))
  }

  const addCert = () => {
    const t = certInput.trim()
    if (!t || form.certifications.includes(t)) return
    setForm(f => ({ ...f, certifications: [...f.certifications, t] }))
    setCertInput('')
  }

  const removeCert = (c: string) => setForm(f => ({ ...f, certifications: f.certifications.filter(x => x !== c) }))

  const addEdu = () => setForm(f => ({ ...f, education: [...f.education, { ...BLANK_EDU }] }))
  const removeEdu = (i: number) => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))
  const setEdu = (i: number, k: keyof EducationEntry, v: string) =>
    setForm(f => { const edu = [...f.education]; edu[i] = { ...edu[i], [k]: v }; return { ...f, education: edu } })

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-foreground">Skills & background</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Pick your strongest skills and add education credentials.</p>
      </div>

      <div className="space-y-5">
        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2">Skills</label>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.skills.map(s => (
                <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-500/50 text-teal-400 font-medium">
                  {s}
                  <button type="button" onClick={() => toggleSkill(s)} className="cursor-pointer hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
          <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
            placeholder="Search 446 skills..."
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors mb-2" />
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredSkills.filter(s => !form.skills.includes(s)).map(s => (
              <button key={s} type="button" onClick={() => toggleSkill(s)}
                className="text-xs px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:border-teal-500/30 hover:text-teal-400 font-medium transition-all cursor-pointer shrink-0">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3" /> Education
            </label>
            <button type="button" onClick={addEdu}
              className="text-[10px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-colors">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.education.map((edu, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/40 p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Degree {i + 1}</span>
                  <button type="button" aria-label="Remove education" onClick={() => removeEdu(i)} className="text-muted-foreground/50 hover:text-red-400 cursor-pointer transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-muted-foreground/60 mb-1">Degree type</label>
                    <select aria-label="Degree type" value={edu.degree} onChange={e => setEdu(i, 'degree', e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-xs text-foreground outline-none focus:border-teal-500/50 transition-colors cursor-pointer">
                      <option value="">Select...</option>
                      {DEGREE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground/60 mb-1">Graduation year</label>
                    <input value={edu.year} onChange={e => setEdu(i, 'year', e.target.value)}
                      placeholder="e.g. 2024" maxLength={4}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground/60 mb-1">Field of study</label>
                  <Combobox
                    value={eduFieldVal[i] !== undefined ? eduFieldVal[i] : edu.field}
                    onChange={v => { setEdu(i, 'field', v); setEduFieldVal(p => ({ ...p, [i]: v })) }}
                    options={FIELDS_OF_STUDY}
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground/60 mb-1">Institution</label>
                  <input value={edu.institution} onChange={e => setEdu(i, 'institution', e.target.value)}
                    placeholder="e.g. IIT Bombay, BITS Pilani"
                    className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors" />
                </div>
              </div>
            ))}
            {form.education.length === 0 && (
              <button type="button" onClick={addEdu}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground/50 py-4 hover:border-teal-500/30 hover:text-muted-foreground transition-all cursor-pointer text-xs">
                <Plus className="w-3.5 h-3.5" /> Add education
              </button>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Award className="w-3 h-3" /> Certifications
          </label>
          <div className="flex gap-2 mb-2">
            <input value={certInput} onChange={e => setCertInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCert() } }}
              placeholder="e.g. AWS Solutions Architect, Google Data Analytics"
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors" />
            <button type="button" onClick={addCert}
              className="px-3 py-2 rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-400 hover:bg-teal-500/25 transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {form.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.certifications.map(c => (
                <span key={c} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-muted/20 border border-border text-muted-foreground font-medium">
                  {c}
                  <button type="button" onClick={() => removeCert(c)} className="cursor-pointer hover:text-foreground transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resume paste */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Paste your resume <span className="font-normal text-muted-foreground/50">(optional but powerful — AI uses this verbatim)</span>
          </label>
          <textarea value={form.resumeText} onChange={e => setForm(f => ({ ...f, resumeText: e.target.value }))}
            placeholder="Paste your full resume text here. The AI will use it to write better cover letters, improve your resume, and tailor interview answers..."
            rows={4}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 resize-none transition-colors font-mono text-[11px]" />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button type="button" onClick={onBack} className="flex-none text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-border">Back</button>
        <button type="button" onClick={() => onNext(form)} className="flex-1 bg-teal-500 text-black font-bold py-2.5 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer text-sm">Next: Online Presence</button>
      </div>
    </div>
  )
}
