'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, CheckCircle2, Target, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { ResumeRow, ResumeSections, ResumeTemplateId } from '@/types/resume'
import ResumeEditorPanel from './_components/ResumeEditorPanel'
import ResumePreview from './_components/ResumePreview'
import ATSSidebar from './_components/ATSSidebar'
import { TailorModal } from './_components/TailorModal'
import { CoverLetterPanel } from './_components/CoverLetterPanel'

type SaveState = 'idle' | 'saving' | 'saved'
type LeftTab = 'resume' | 'cover-letter'

export default function ResumeEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [resume, setResume] = useState<ResumeRow | null>(null)
  const [sections, setSections] = useState<ResumeSections | null>(null)
  const [templateId, setTemplateId] = useState<ResumeTemplateId>('minimal')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [showAts, setShowAts] = useState(false)
  const [tailorOpen, setTailorOpen] = useState(false)
  const [leftTab, setLeftTab] = useState<LeftTab>('resume')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load
  useEffect(() => {
    fetch(`/api/resumes/${id}`)
      .then((r) => r.json())
      .then((data: ResumeRow) => {
        setResume(data)
        setSections(data.sections)
        setTemplateId(data.templateId)
      })
  }, [id])

  // Debounced auto-save
  const save = useCallback(
    async (next: ResumeSections, tpl: ResumeTemplateId) => {
      setSaveState('saving')
      await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: next, templateId: tpl }),
      })
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    },
    [id]
  )

  const handleSectionsChange = (next: ResumeSections) => {
    setSections(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(next, templateId), 1200)
  }

  const handleTemplateChange = (tpl: ResumeTemplateId) => {
    setTemplateId(tpl)
    if (sections) save(sections, tpl)
  }

  if (!resume || !sections) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-white/40">
        Loading resume…
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/tools/resumeBuilder" className="text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-semibold text-white">{resume.name}</span>
          {resume.targetRole && (
            <span className="text-xs text-white/40">
              {resume.targetRole}
              {resume.targetCompany ? ` @ ${resume.targetCompany}` : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {saveState === 'saving' && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-white/40 flex items-center gap-1"
            >
              <Save className="w-3 h-3 animate-pulse" /> Saving…
            </motion.span>
          )}
          {saveState === 'saved' && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-400 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Saved
            </motion.span>
          )}

          <button
            onClick={() => setTailorOpen(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tailor to Job
          </button>

          <button
            onClick={() => setShowAts(!showAts)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              showAts
                ? 'border-violet-500/50 bg-violet-600/20 text-violet-300'
                : 'border-white/10 text-white/50 hover:text-white/80'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            ATS Score{resume.atsScore !== null ? ` · ${resume.atsScore}%` : ''}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor — 60% */}
        <div className="w-[60%] h-full overflow-y-auto border-r border-white/10 flex flex-col">
          {/* Tab toggle */}
          <div className="flex items-center gap-1 px-5 pt-4 pb-3 shrink-0 border-b border-white/5">
            <button
              type="button"
              onClick={() => setLeftTab('resume')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                leftTab === 'resume'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('cover-letter')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                leftTab === 'cover-letter'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Cover Letter
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {leftTab === 'resume' ? (
              <ResumeEditorPanel
                sections={sections}
                onChange={handleSectionsChange}
                targetRole={resume.targetRole ?? ''}
                targetCompany={resume.targetCompany ?? ''}
                jobDescription={resume.jobDescription ?? ''}
              />
            ) : (
              <CoverLetterPanel resumeId={id} />
            )}
          </div>
        </div>

        {/* Preview — 40% */}
        <div className="flex-1 h-full overflow-hidden p-5">
          <ResumePreview
            sections={sections}
            templateId={templateId}
            onTemplateChange={handleTemplateChange}
          />
        </div>

        {/* ATS Sidebar — slides in */}
        {showAts && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-[280px] shrink-0 h-full overflow-hidden border-l border-white/10 p-4"
          >
            <ATSSidebar
              resumeId={id}
              initialScore={resume.atsScore}
              jobDescription={resume.jobDescription ?? ''}
              sections={sections}
              onScoreUpdate={(score) =>
                setResume((prev) => (prev ? { ...prev, atsScore: score } : prev))
              }
            />
          </motion.div>
        )}
      </div>

      <TailorModal
        resumeId={id}
        isOpen={tailorOpen}
        onClose={() => setTailorOpen(false)}
        onTailored={(tailoredSections) => {
          setSections(tailoredSections)
        }}
      />
    </div>
  )
}
