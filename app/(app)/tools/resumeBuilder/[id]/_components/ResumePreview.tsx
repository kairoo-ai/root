'use client'

import { useRef } from 'react'
import { Printer } from 'lucide-react'
import type { ResumeSections, ResumeTemplateId } from '@/types/resume'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'
import CreativeTemplate from './templates/CreativeTemplate'

const TEMPLATES: Array<{ id: ResumeTemplateId; label: string }> = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'modern', label: 'Modern' },
  { id: 'executive', label: 'Executive' },
  { id: 'creative', label: 'Creative' },
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                templateId === t.id
                  ? 'bg-violet-600 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print / Export
        </button>
      </div>

      {/* Preview container — scaled A4 */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-white">
        <div ref={printRef} className="w-full min-h-full">
          <TemplateComponent sections={sections} />
        </div>
      </div>
    </div>
  )
}
