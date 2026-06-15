'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { saveOnboardingStep, completeOnboarding } from '../actions'
import { StepWelcome } from './steps/StepWelcome'
import { StepImport } from './steps/StepImport'
import { StepCurrentSituation } from './steps/StepCurrentSituation'
import { StepCareerGoals } from './steps/StepCareerGoals'
import { StepBackground } from './steps/StepBackground'
import { StepOnlinePresence } from './steps/StepOnlinePresence'
import { StepPreferences } from './steps/StepPreferences'

const STEPS = ['Welcome', 'Import', 'Current Role', 'Career Goals', 'Background', 'Online Presence', 'Preferences']

interface WizardData {
  currentRole: string
  currentCompany: string
  yearsExperience: number | ''
  industry: string
  location: string
  targetRole: string
  targetTimeline: string
  careerGoalShort: string
  careerGoalLong: string
  skills: string[]
  education: { degree: string; field: string; institution: string; year: string }[]
  certifications: string[]
  resumeText: string
  githubUrl: string
  linkedinUrl: string
  portfolioUrl: string
  naukriUrl: string
  otherUrl: string
  workStyle: string
  learningStyle: string
}

const EMPTY: WizardData = {
  currentRole: '', currentCompany: '', yearsExperience: '', industry: '', location: '',
  targetRole: '', targetTimeline: '', careerGoalShort: '', careerGoalLong: '',
  skills: [], education: [], certifications: [], resumeText: '',
  githubUrl: '', linkedinUrl: '', portfolioUrl: '', naukriUrl: '', otherUrl: '',
  workStyle: '', learningStyle: '',
}

interface Props {
  initialStep?: number
  initialData?: Partial<WizardData>
}

export function OnboardingWizard({ initialStep = 0, initialData = {} }: Props) {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(Math.min(initialStep, 1))
  const [data, setData] = useState<WizardData>({ ...EMPTY, ...initialData })
  const [saving, setSaving] = useState(false)
  const [direction, setDirection] = useState(1)

  const next = async (patch: Partial<WizardData> = {}) => {
    const merged = { ...data, ...patch }
    setData(merged)
    setDirection(1)
    setSaving(true)

    if (step < STEPS.length - 1) {
      await saveOnboardingStep(step, merged as Parameters<typeof saveOnboardingStep>[1])
      setSaving(false)
      setStep(s => s + 1)
    } else {
      await completeOnboarding(merged as Parameters<typeof completeOnboarding>[0])
      router.push('/dashboard')
    }
  }

  const back = () => {
    setDirection(-1)
    setStep(s => Math.max(0, s - 1))
  }

  const variants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
  }

  // Stepper collapses labels on small screens — only show number + tick
  const stepperItems = STEPS.map((label, i) => ({
    label,
    state: i < step ? 'done' : i === step ? 'active' : 'pending',
  }))

  return (
    <div className="w-full max-w-xl">
      {/* Progress stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {stepperItems.map(({ label, state }, i) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full border text-[11px] font-bold flex items-center justify-center transition-all ${
                state === 'done' ? 'bg-teal-500 border-teal-500 text-black' :
                state === 'active' ? 'border-teal-400 text-teal-400' :
                'border-border text-muted-foreground'
              }`}>
                {state === 'done' ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-4 sm:w-8 transition-all ${state === 'done' ? 'bg-teal-500' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      {/* Step panel */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {step === 0 && (
              <StepWelcome userName={user?.firstName ?? 'there'} onNext={() => next()} />
            )}
            {step === 1 && (
              <StepImport onNext={() => next()} onBack={back} />
            )}
            {step === 2 && (
              <StepCurrentSituation data={data} onNext={d => next(d)} onBack={back} />
            )}
            {step === 3 && (
              <StepCareerGoals data={data} currentRole={data.currentRole} onNext={d => next(d)} onBack={back} />
            )}
            {step === 4 && (
              <StepBackground data={data} onNext={d => next(d)} onBack={back} />
            )}
            {step === 5 && (
              <StepOnlinePresence data={data} onNext={d => next(d)} onBack={back} />
            )}
            {step === 6 && (
              <StepPreferences data={data} onNext={d => next(d)} onBack={back} saving={saving} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
