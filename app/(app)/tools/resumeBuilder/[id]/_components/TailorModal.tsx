'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { GooeyInput, StatefulButton } from '@/components/aceternity'
import type { ResumeSections } from '@/types/resume'

interface TailorModalProps {
  resumeId: string
  isOpen: boolean
  onClose: () => void
  onTailored: (sections: ResumeSections) => void
}

export function TailorModal({ resumeId, isOpen, onClose, onTailored }: TailorModalProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleTailor = async () => {
    if (!jobDescription.trim()) return
    setStatus('loading')
    try {
      const res = await fetch(`/api/resumes/${resumeId}/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, targetRole, targetCompany }),
      })
      if (!res.ok) throw new Error('Failed')
      const { sections } = (await res.json()) as { sections: ResumeSections }
      onTailored(sections)
      setStatus('success')
      setTimeout(onClose, 800)
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Tailor to Job</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Paste the job description and we&apos;ll rewrite your resume to match it — keywords,
              tone, and emphasis.
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <GooeyInput
                  placeholder="Target role (e.g. Product Manager)"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
                <GooeyInput
                  placeholder="Company (optional)"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                />
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here…"
                rows={8}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {status === 'error' && (
                <p className="text-xs text-red-400">Tailoring failed. Please try again.</p>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <StatefulButton
                onClick={handleTailor}
                disabled={!jobDescription.trim() || status === 'loading'}
                className="px-5"
              >
                {status === 'loading' ? 'Tailoring…' : status === 'success' ? 'Done!' : 'Tailor Resume'}
              </StatefulButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
