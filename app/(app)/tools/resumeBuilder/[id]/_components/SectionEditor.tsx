'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import { Plus, Trash2, Wand2 } from 'lucide-react'
import type { ResumeSections, ExperienceEntry, EducationEntry, SkillCategory, ProjectEntry, CertificationEntry } from '@/types/resume'
import BulletEditor from './BulletEditor'
import { useAIStream } from '@/hooks/useAIStream'

interface Props {
  sectionKey: keyof ResumeSections
  sections: ResumeSections
  onChange: (sections: ResumeSections) => void
  targetRole: string
  targetCompany: string
  jobDescription: string
}

function field(
  label: string,
  value: string,
  onSet: (v: string) => void,
  opts?: { multiline?: boolean; placeholder?: string }
) {
  const className =
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all resize-none'
  return (
    <div className="flex flex-col gap-1" key={label}>
      <label className="text-xs text-white/50 uppercase tracking-wider">{label}</label>
      {opts?.multiline ? (
        <textarea
          rows={4}
          className={className}
          value={value}
          placeholder={opts.placeholder}
          onChange={(e) => onSet(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={className}
          value={value}
          placeholder={opts?.placeholder}
          onChange={(e) => onSet(e.target.value)}
        />
      )}
    </div>
  )
}

export default function SectionEditor({ sectionKey, sections, onChange, targetRole, targetCompany, jobDescription }: Props) {
  const { stream, isStreaming } = useAIStream()

  const update = (patch: Partial<ResumeSections>) => onChange({ ...sections, ...patch })

  // ── Contact ──────────────────────────────────────────────────────────────
  if (sectionKey === 'contact') {
    const c = sections.contact
    const set = (k: keyof typeof c) => (v: string) => update({ contact: { ...c, [k]: v } })
    return (
      <div className="grid grid-cols-2 gap-3">
        {field('Full Name', c.name, set('name'), { placeholder: 'Jane Smith' })}
        {field('Email', c.email, set('email'), { placeholder: 'jane@example.com' })}
        {field('Phone', c.phone, set('phone'), { placeholder: '+1 555 000 0000' })}
        {field('Location', c.location, set('location'), { placeholder: 'San Francisco, CA' })}
        {field('LinkedIn', c.linkedin, set('linkedin'), { placeholder: 'linkedin.com/in/janesmith' })}
        {field('GitHub', c.github, set('github'), { placeholder: 'github.com/janesmith' })}
        <div className="col-span-2">
          {field('Portfolio', c.portfolio, set('portfolio'), { placeholder: 'janesmith.dev' })}
        </div>
      </div>
    )
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  if (sectionKey === 'summary') {
    const handleAI = async () => {
      const result = await stream('resumeSection', {
        section: 'summary',
        currentContent: sections.summary.text,
        targetRole,
        targetCompany,
        jobDescription,
      })
      update({ summary: { text: result } })
    }

    return (
      <div className="flex flex-col gap-2">
        <textarea
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
          value={sections.summary.text}
          placeholder="Results-driven software engineer with 5+ years…"
          onChange={(e) => update({ summary: { text: e.target.value } })}
        />
        <button
          onClick={handleAI}
          disabled={isStreaming}
          className="self-end flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-3.5 h-3.5" />
          {isStreaming ? 'Generating…' : 'AI Improve'}
        </button>
      </div>
    )
  }

  // ── Experience ────────────────────────────────────────────────────────────
  if (sectionKey === 'experience') {
    const entries = sections.experience
    const addEntry = () =>
      update({
        experience: [
          ...entries,
          { id: nanoid(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, bullets: [''], location: '' },
        ],
      })
    const removeEntry = (id: string) => update({ experience: entries.filter((e) => e.id !== id) })
    const patchEntry = (id: string, patch: Partial<ExperienceEntry>) =>
      update({ experience: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })

    return (
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="grid grid-cols-2 gap-2">
              {field('Company', entry.company, (v) => patchEntry(entry.id, { company: v }), { placeholder: 'Acme Corp' })}
              {field('Role', entry.role, (v) => patchEntry(entry.id, { role: v }), { placeholder: 'Senior Engineer' })}
              {field('Start Date', entry.startDate, (v) => patchEntry(entry.id, { startDate: v }), { placeholder: 'Jan 2022' })}
              {field('End Date', entry.endDate, (v) => patchEntry(entry.id, { endDate: v }), { placeholder: 'Present' })}
              <div className="col-span-2">
                {field('Location', entry.location, (v) => patchEntry(entry.id, { location: v }), { placeholder: 'Remote' })}
              </div>
            </div>
            <BulletEditor
              bullets={entry.bullets}
              onChange={(bullets) => patchEntry(entry.id, { bullets })}
              onAIGenerate={async () => {
                const result = await stream('resumeSection', {
                  section: 'experience bullets',
                  currentContent: entry.bullets.join('\n'),
                  targetRole,
                  targetCompany,
                  jobDescription,
                })
                const newBullets = result.split('\n').filter(Boolean).map((b) => b.replace(/^[-•]\s*/, ''))
                patchEntry(entry.id, { bullets: newBullets })
              }}
              isStreaming={isStreaming}
              role={entry.role}
              company={entry.company}
              jobDescription={jobDescription}
            />
            <button
              onClick={() => removeEntry(entry.id)}
              className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </button>
      </div>
    )
  }

  // ── Education ─────────────────────────────────────────────────────────────
  if (sectionKey === 'education') {
    const entries = sections.education
    const addEntry = () =>
      update({
        education: [
          ...entries,
          { id: nanoid(), institution: '', degree: '', field: '', startDate: '', endDate: '' },
        ],
      })
    const removeEntry = (id: string) => update({ education: entries.filter((e) => e.id !== id) })
    const patchEntry = (id: string, patch: Partial<EducationEntry>) =>
      update({ education: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })

    return (
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="grid grid-cols-2 gap-2">
              {field('Institution', entry.institution, (v) => patchEntry(entry.id, { institution: v }), { placeholder: 'MIT' })}
              {field('Degree', entry.degree, (v) => patchEntry(entry.id, { degree: v }), { placeholder: 'B.S.' })}
              {field('Field', entry.field, (v) => patchEntry(entry.id, { field: v }), { placeholder: 'Computer Science' })}
              {field('GPA', entry.gpa ?? '', (v) => patchEntry(entry.id, { gpa: v }), { placeholder: '3.9' })}
              {field('Start', entry.startDate, (v) => patchEntry(entry.id, { startDate: v }), { placeholder: 'Sep 2018' })}
              {field('End', entry.endDate, (v) => patchEntry(entry.id, { endDate: v }), { placeholder: 'May 2022' })}
            </div>
            <button onClick={() => removeEntry(entry.id)} className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button onClick={addEntry} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>
    )
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  if (sectionKey === 'skills') {
    const cats = sections.skills
    const addCat = () => update({ skills: [...cats, { category: '', items: [] }] })
    const removeCat = (i: number) => update({ skills: cats.filter((_, idx) => idx !== i) })
    const patchCat = (i: number, patch: Partial<SkillCategory>) =>
      update({ skills: cats.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) })

    return (
      <div className="flex flex-col gap-3">
        {cats.map((cat, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
            {field('Category', cat.category, (v) => patchCat(i, { category: v }), { placeholder: 'Languages' })}
            {field('Items (comma-separated)', cat.items.join(', '), (v) => patchCat(i, { items: v.split(',').map((s) => s.trim()).filter(Boolean) }), { placeholder: 'TypeScript, Python, Go' })}
            <button onClick={() => removeCat(i)} className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button onClick={addCat} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>
    )
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (sectionKey === 'projects') {
    const entries = sections.projects
    const addEntry = () =>
      update({ projects: [...entries, { id: nanoid(), name: '', description: '', bullets: [''], tech: [], url: '' }] })
    const removeEntry = (id: string) => update({ projects: entries.filter((e) => e.id !== id) })
    const patchEntry = (id: string, patch: Partial<ProjectEntry>) =>
      update({ projects: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })

    return (
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
            {field('Project Name', entry.name, (v) => patchEntry(entry.id, { name: v }), { placeholder: 'OpenMetrics' })}
            {field('Description', entry.description, (v) => patchEntry(entry.id, { description: v }), { multiline: true, placeholder: 'One-line description' })}
            {field('Tech Stack (comma-separated)', entry.tech.join(', '), (v) => patchEntry(entry.id, { tech: v.split(',').map((s) => s.trim()).filter(Boolean) }), { placeholder: 'React, Go, Postgres' })}
            {field('URL (optional)', entry.url ?? '', (v) => patchEntry(entry.id, { url: v }), { placeholder: 'https://github.com/…' })}
            <BulletEditor
              bullets={entry.bullets}
              onChange={(bullets) => patchEntry(entry.id, { bullets })}
              onAIGenerate={async () => {
                const result = await stream('resumeSection', {
                  section: 'project bullets',
                  currentContent: entry.bullets.join('\n'),
                  targetRole,
                  targetCompany,
                  jobDescription,
                })
                const newBullets = result.split('\n').filter(Boolean).map((b) => b.replace(/^[-•]\s*/, ''))
                patchEntry(entry.id, { bullets: newBullets })
              }}
              isStreaming={isStreaming}
              role={targetRole}
              company={entry.name}
              jobDescription={jobDescription}
            />
            <button onClick={() => removeEntry(entry.id)} className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button onClick={addEntry} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>
    )
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (sectionKey === 'certifications') {
    const entries = sections.certifications
    const addEntry = () =>
      update({ certifications: [...entries, { name: '', issuer: '', date: '', url: '' }] })
    const removeEntry = (i: number) => update({ certifications: entries.filter((_, idx) => idx !== i) })
    const patchEntry = (i: number, patch: Partial<CertificationEntry>) =>
      update({ certifications: entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) })

    return (
      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="grid grid-cols-2 gap-2">
              {field('Name', entry.name, (v) => patchEntry(i, { name: v }), { placeholder: 'AWS Solutions Architect' })}
              {field('Issuer', entry.issuer, (v) => patchEntry(i, { issuer: v }), { placeholder: 'Amazon' })}
              {field('Date', entry.date, (v) => patchEntry(i, { date: v }), { placeholder: 'Mar 2024' })}
              {field('URL (optional)', entry.url ?? '', (v) => patchEntry(i, { url: v }), { placeholder: 'https://…' })}
            </div>
            <button onClick={() => removeEntry(i)} className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button onClick={addEntry} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Certification
        </button>
      </div>
    )
  }

  return null
}
