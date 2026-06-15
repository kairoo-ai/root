'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Target, ChevronRight, Info } from 'lucide-react'
import type { ResumeSections } from '@/types/resume'

interface AtsResult {
  score: number
  found: string[]
  missing: string[]
}

interface Dimension {
  label: string
  score: number
  tip: string
}

interface Props {
  resumeId: string
  initialScore: number | null
  jobDescription: string
  sections: ResumeSections | null
  onScoreUpdate: (score: number) => void
}

function computeDimensions(sections: ResumeSections, jobDescription: string): Dimension[] {
  const jdWords = jobDescription
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3)

  const resumeText = [
    sections.summary?.text ?? '',
    ...(sections.experience?.flatMap((e) => e.bullets) ?? []),
    ...(sections.skills?.flatMap((s) => s.items) ?? []),
    ...(sections.projects?.flatMap((p) => p.bullets) ?? []),
  ]
    .join(' ')
    .toLowerCase()

  const keywordMatch =
    jdWords.length > 0
      ? Math.round(
          (jdWords.filter((w) => resumeText.includes(w)).length / Math.min(jdWords.length, 30)) *
            100
        )
      : 0

  const allBullets = sections.experience?.flatMap((e) => e.bullets) ?? []
  const bulletCount = allBullets.length
  const quantifiedBullets = allBullets.filter((b) => /\d+/.test(b)).length
  const impact = bulletCount > 0 ? Math.round((quantifiedBullets / bulletCount) * 100) : 0

  const totalBulletWords =
    allBullets.join(' ').split(' ').filter(Boolean).length
  const avgBulletWords = bulletCount > 0 ? totalBulletWords / bulletCount : 0
  const clarity = Math.round(Math.max(0, Math.min(100, 100 - Math.abs(avgBulletWords - 15) * 5)))

  const sectionCount = [
    sections.summary?.text,
    sections.experience?.length,
    sections.education?.length,
    sections.skills?.length,
    sections.projects?.length,
  ].filter(Boolean).length
  const completeness = Math.round((sectionCount / 5) * 100)

  const contactFields = [
    sections.contact?.email,
    sections.contact?.phone,
    sections.contact?.linkedin,
  ].filter(Boolean).length
  const formatting = Math.round((contactFields / 3) * 40 + 60)

  return [
    { label: 'Keyword Match', score: keywordMatch, tip: 'How well your resume mirrors the job description' },
    { label: 'Impact Metrics', score: impact, tip: 'Percentage of bullets with numbers/metrics' },
    { label: 'Clarity', score: clarity, tip: 'Bullet length consistency (target ~15 words)' },
    { label: 'Completeness', score: completeness, tip: 'How many key sections are filled' },
    { label: 'Formatting', score: formatting, tip: 'Contact info completeness' },
  ]
}

function dimensionColor(score: number) {
  if (score >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-400' }
  if (score >= 40) return { bar: 'bg-amber-500', text: 'text-amber-400' }
  return { bar: 'bg-red-500', text: 'text-red-400' }
}

export default function ATSSidebar({
  resumeId,
  initialScore,
  jobDescription: initialJD,
  sections,
  onScoreUpdate,
}: Props) {
  const [jd, setJd] = useState(initialJD)
  const [result, setResult] = useState<AtsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showJdInput, setShowJdInput] = useState(!initialJD)
  const [hoveredDim, setHoveredDim] = useState<string | null>(null)

  const analyze = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      })
      if (res.ok) {
        const data = (await res.json()) as AtsResult
        setResult(data)
        onScoreUpdate(data.score)
      }
    } finally {
      setLoading(false)
    }
  }

  const displayScore = result?.score ?? initialScore ?? 0
  const scoreColor =
    displayScore >= 70
      ? 'text-emerald-400'
      : displayScore >= 40
        ? 'text-amber-400'
        : 'text-red-400'

  const dimensions = sections && jd.trim() ? computeDimensions(sections, jd) : null

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 h-full overflow-y-auto">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-semibold text-white">ATS Score</span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-center py-2">
        <div className={`text-5xl font-bold tabular-nums ${scoreColor}`}>
          {result?.score ?? initialScore ?? '–'}
          {(result || initialScore !== null) && <span className="text-xl text-white/40">/100</span>}
        </div>
      </div>

      {/* JD input */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowJdInput(!showJdInput)}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showJdInput ? 'rotate-90' : ''}`} />
          {jd ? 'Edit job description' : 'Paste job description'}
        </button>

        {showJdInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2"
          >
            <textarea
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
              value={jd}
              placeholder="Paste the full job description here…"
              onChange={(e) => setJd(e.target.value)}
            />
            <button
              type="button"
              onClick={analyze}
              disabled={loading || !jd.trim()}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white transition-colors"
            >
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </motion.div>
        )}
      </div>

      {/* 5-Dimension breakdown */}
      {dimensions && (
        <div className="flex flex-col gap-3">
          <span className="text-xs text-white/50 uppercase tracking-wider">Score Breakdown</span>
          {dimensions.map((dim) => {
            const { bar, text } = dimensionColor(dim.score)
            return (
              <div key={dim.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-white/70">{dim.label}</span>
                    <button
                      type="button"
                      aria-label={`Info about ${dim.label}`}
                      onMouseEnter={() => setHoveredDim(dim.label)}
                      onMouseLeave={() => setHoveredDim(null)}
                      className="text-white/20 hover:text-white/50 transition-colors"
                    >
                      <Info className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                  <span className={`text-xs font-semibold tabular-nums ${text}`}>{dim.score}</span>
                </div>
                {hoveredDim === dim.label && (
                  <p className="text-xs text-white/40 leading-relaxed">{dim.tip}</p>
                )}
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${bar}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Keyword results */}
      {result && (
        <div className="flex flex-col gap-3">
          {result.found.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/50 uppercase tracking-wider">Matched Keywords</span>
              <div className="flex flex-wrap gap-1.5">
                {result.found.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" /> {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.missing.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/50 uppercase tracking-wider">Missing Keywords</span>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30"
                  >
                    <XCircle className="w-2.5 h-2.5" /> {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
