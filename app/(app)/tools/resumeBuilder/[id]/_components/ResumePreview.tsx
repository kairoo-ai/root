'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Printer } from 'lucide-react'
import type { ResumeSections, ResumeTemplateId } from '@/types/resume'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import { Cover } from '@/components/aceternity'

const TEMPLATES: Array<{ id: ResumeTemplateId; label: string; accent: string; desc: string }> = [
  { id: 'minimal', label: 'Minimal', accent: 'from-white/10 to-white/5', desc: 'Clean & simple' },
  { id: 'modern', label: 'Modern', accent: 'from-violet-500/20 to-violet-500/5', desc: 'Bold accents' },
  { id: 'executive', label: 'Executive', accent: 'from-blue-500/20 to-blue-500/5', desc: 'Authoritative' },
  { id: 'creative', label: 'Creative', accent: 'from-emerald-500/20 to-emerald-500/5', desc: 'Stand out' },

]

interface Props {
  sections: ResumeSections
  templateId: ResumeTemplateId
  onTemplateChange: (id: ResumeTemplateId) => void
}

export default function ResumePreview({ sections, templateId, onTemplateChange }: Props) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = printRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Resume</title><style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; color: #111; background: white; }
      @page { margin: 0.5in; }
    </style></head><body>${content}</body></html>`)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  const TemplateComponent = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
  }[templateId]

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Template switcher + print */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-0.5">
          {TEMPLATES.map((t) => (
            <motion.button
              key={t.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTemplateChange(t.id)}
              className={`relative shrink-0 rounded-xl border transition-all overflow-hidden ${templateId === t.id
                  ? 'border-violet-500/60 ring-1 ring-violet-500/40'
                  : 'border-white/10 hover:border-white/25'
                }`}
            >
              <Cover className={`bg-linear-to-br ${t.accent} px-3 py-2 min-w-[80px]`}>
                <div className="text-xs font-semibold text-white">{t.label}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{t.desc}</div>
              </Cover>
              {templateId === t.id && (
                <motion.div
                  layoutId="template-active"
                  className="absolute inset-0 bg-violet-500/10 rounded-xl"
                />
              )}
            </motion.button>
          ))}
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print / Export
        </button>
      </div>

      {/* Preview container - scaled A4 */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-white">
        <div ref={printRef} className="w-full min-h-full">
          <TemplateComponent sections={sections} />
        </div>
      </div>
    </div>
  )
}
