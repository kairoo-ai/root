'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Map, Briefcase, FileText, Zap, ArrowRight } from 'lucide-react'
import { CardSpotlight, StatefulButton } from '@/components/aceternity'
import { cn } from '@/lib/utils'

const tools = [
  { id: 'dynamicRoadmaps', name: 'Dynamic Roadmaps', desc: 'AI-generated step-by-step career plans tailored to your goal.', icon: Map, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', href: '/tools/dynamicRoadmaps' },
  { id: 'interviewPrep', name: 'Interview Prep', desc: 'Practice role-specific questions and get real-time AI feedback.', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', href: '/tools/interviewPrep' },
  { id: 'resumeBuilder', name: 'Resume Builder', desc: 'Craft ATS-optimised resumes with AI suggestions and scoring.', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', href: '/tools/resumeBuilder' },
  { id: 'skillGapAnalysis', name: 'Skill Gap Analysis', desc: 'Identify what you\'re missing and a clear path to fill it fast.', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', href: '/tools/skillGapAnalysis' },
]

export function QuickLaunch() {
  const router = useRouter()
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Quick Launch</h2>
        <StatefulButton onClick={() => router.push('/tools')} className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer" variant="ghost">
          All 38 tools →
        </StatefulButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool, i) => (
          <motion.div key={tool.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
            <CardSpotlight
              className={cn('group rounded-xl border bg-card p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg', tool.border)}
              onClick={() => router.push(tool.href)}
            >
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', tool.bg)}>
                <tool.icon className={cn('w-4.5 h-4.5', tool.color)} />
              </div>
              <div className="font-semibold text-sm text-foreground mb-1">{tool.name}</div>
              <div className="text-[11.5px] text-muted-foreground leading-relaxed mb-3">{tool.desc}</div>
              <div className={cn('inline-flex items-center gap-1 text-[10px] font-semibold', tool.color)}>
                Launch <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
