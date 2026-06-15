'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, FileText, Clock, Trash2, ArrowRight } from 'lucide-react'
import type { ResumeRow } from '@/types/resume'

export default function ResumeBuilderPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<ResumeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/resumes')
      .then((r) => r.json())
      .then((data: ResumeRow[]) => setResumes(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const createNew = async (fromProfile = false) => {
    setCreating(true)
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromProfile }),
      })
      if (res.ok) {
        const data = (await res.json()) as ResumeRow
        router.push(`/tools/resumeBuilder/${data.id}`)
      }
    } finally {
      setCreating(false)
    }
  }

  const deleteResume = async (id: string) => {
    await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
    setResumes((prev) => prev.filter((r) => r.id !== id))
  }

  const scoreColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500/15 text-emerald-400'
    if (score >= 40) return 'bg-amber-500/15 text-amber-400'
    return 'bg-red-500/15 text-red-400'
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
        <p className="text-white/50 mt-1 text-sm">
          Create tailored, ATS-optimized resumes for every application.
        </p>
      </div>

      {/* Create action cards */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => createNew(false)}
          disabled={creating}
          className="flex flex-col gap-2 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 text-violet-400" />
          <div>
            <div className="text-sm font-semibold text-white">Start from scratch</div>
            <div className="text-xs text-white/40 mt-0.5">Blank resume with all sections</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => createNew(true)}
          disabled={creating}
          className="flex flex-col gap-2 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-sm font-semibold text-white">Import from profile</div>
            <div className="text-xs text-white/40 mt-0.5">Pre-fill with your onboarding data</div>
          </div>
        </motion.button>
      </div>

      {/* Resume grid */}
      {loading ? (
        <div className="text-sm text-white/40">Loading…</div>
      ) : resumes.length === 0 ? (
        <div className="text-sm text-white/40">No resumes yet. Create one above.</div>
      ) : (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            My Resumes
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                whileHover={{ y: -2 }}
                className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => router.push(`/tools/resumeBuilder/${resume.id}`)}
              >
                <div className="flex items-start justify-between">
                  <FileText className="w-5 h-5 text-violet-400" />
                  {resume.atsScore !== null && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreColor(resume.atsScore)}`}
                    >
                      {resume.atsScore}%
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-white">{resume.name}</div>
                  {resume.targetRole && (
                    <div className="text-xs text-white/50 mt-0.5">
                      {resume.targetRole}
                      {resume.targetCompany ? ` @ ${resume.targetCompany}` : ''}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-white/30">
                  <Clock className="w-3 h-3" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </div>

                {/* Hover actions */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteResume(resume.id)
                    }}
                    className="p-1 rounded-md hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
