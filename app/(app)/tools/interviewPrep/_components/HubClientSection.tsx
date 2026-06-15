'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LampEffect } from '@/components/aceternity'
import { cn } from '@/lib/utils'
import { COMPANY_PACKS } from '@/data/content/companyInterviewPacks'
import { SessionModeCard } from './SessionModeCard'
import type { InterviewType } from '@/types/interview'

const MODES: InterviewType[] = ['behavioral', 'technical', 'system_design', 'case_study']

export function HubClientSection() {
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  function handleModeClick(type: InterviewType) {
    const params = new URLSearchParams({ type })
    if (selectedCompany) {
      const pack = COMPANY_PACKS.find((c) => c.id === selectedCompany)
      if (pack) params.set('company', pack.name)
    }
    router.push(`/tools/interviewPrep/setup?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <LampEffect className="pt-8 pb-4">
        <h1 className="text-center text-3xl font-bold text-foreground">Interview Prep</h1>
        <p className="mt-2 text-center text-muted-foreground">
          AI-powered practice for your dream role
        </p>
      </LampEffect>

      {/* Company selection */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Company Pack</p>
          {selectedCompany && (
            <button
              onClick={() => setSelectedCompany(null)}
              className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Skip (General)
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {COMPANY_PACKS.map((c) => (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCompany(c.id === selectedCompany ? null : c.id)}
              className={cn(
                'flex min-w-[120px] flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors shrink-0',
                selectedCompany === c.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <span className="text-xl">{c.logo}</span>
              <span className="font-semibold">{c.name}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  c.tier === 'faang'
                    ? 'bg-violet-500/10 text-violet-500'
                    : c.tier === 'tier2'
                      ? 'bg-sky-500/10 text-sky-500'
                      : 'bg-emerald-500/10 text-emerald-600',
                )}
              >
                {c.tier === 'faang' ? 'FAANG' : c.tier === 'tier2' ? 'Tier 2' : 'Startup'}
              </span>
            </motion.button>
          ))}
        </div>
        {!selectedCompany && (
          <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
            Select a company to tailor questions, or pick a mode below for a general interview.
          </p>
        )}
      </div>

      {/* Mode selector */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">
          Start New Session
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MODES.map((type) => (
            <div
              key={type}
              className="cursor-pointer"
              onClick={() => handleModeClick(type)}
            >
              <SessionModeCard type={type} selected={false} onClick={() => {}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
