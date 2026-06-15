'use client'

import { useRef, useState } from 'react'
import {
  FileText,
  Linkedin,
  Github,
  GitBranch,
  Code2,
  Terminal,
  MessageSquare,
  BookOpen,
  Database,
  Palette,
  Layers,
  Briefcase,
  Building2,
  GraduationCap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import type { ConnectorInfo } from '@/lib/connectors/registry'

export interface ConnectorStatus {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

const ICON_MAP: Record<string, LucideIcon> = {
  'resume-pdf': FileText,
  'linkedin-paste': Linkedin,
  'linkedin-zip': Linkedin,
  github: Github,
  gitlab: GitBranch,
  leetcode: Code2,
  codeforces: Terminal,
  codechef: Terminal,
  hackerrank: Terminal,
  hackerearth: Terminal,
  stackoverflow: MessageSquare,
  devto: BookOpen,
  kaggle: Database,
  behance: Palette,
  dribbble: Layers,
  wellfound: Briefcase,
  naukri: Building2,
  'learning-paste': GraduationCap,
}

interface Props {
  connector: ConnectorInfo
  onImport: (id: string, input: string, file?: File) => Promise<void>
  status: ConnectorStatus
}

export default function ConnectorCard({ connector, onImport, status }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const Icon = ICON_MAP[connector.id] ?? FileText
  const isFileInput = connector.inputType === 'pdf' || connector.inputType === 'zip'
  const isPaste = connector.inputType === 'paste'

  const handleImport = async () => {
    if (isFileInput) {
      if (!file) return
      await onImport(connector.id, '', file)
    } else {
      if (!inputValue.trim()) return
      await onImport(connector.id, inputValue.trim())
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const acceptAttr = connector.inputType === 'pdf' ? '.pdf,application/pdf' : '.zip,application/zip'

  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <Icon size={16} className="text-teal-500" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground leading-tight">{connector.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{connector.description}</div>
        </div>
      </div>

      {/* Input area */}
      <div className="flex flex-col gap-2">
        {isFileInput ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border border-dashed border-border hover:border-teal-500/60 bg-background/50 hover:bg-teal-500/5 transition-colors px-4 py-4 text-center cursor-pointer group"
            >
              <Upload size={16} className="mx-auto mb-1.5 text-muted-foreground group-hover:text-teal-500 transition-colors" />
              {file ? (
                <span className="text-xs text-foreground font-medium">{file.name}</span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {connector.inputPlaceholder || `Drop your ${connector.inputType.toUpperCase()} here`}
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptAttr}
              onChange={handleFileChange}
              className="sr-only"
            />
            <button
              onClick={handleImport}
              disabled={!file || status.status === 'loading'}
              className="w-full rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 transition-colors flex items-center justify-center gap-2"
            >
              {status.status === 'loading' ? (
                <Loader2 size={13} className="animate-spin" />
              ) : null}
              Import
            </button>
          </>
        ) : isPaste ? (
          <>
            <textarea
              rows={3}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={connector.inputPlaceholder}
              className="w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-teal-500/60 transition"
            />
            <button
              onClick={handleImport}
              disabled={!inputValue.trim() || status.status === 'loading'}
              className="w-full rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 transition-colors flex items-center justify-center gap-2"
            >
              {status.status === 'loading' ? (
                <Loader2 size={13} className="animate-spin" />
              ) : null}
              Import
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={connector.inputPlaceholder}
              onKeyDown={e => { if (e.key === 'Enter') handleImport() }}
              className="flex-1 min-w-0 rounded-xl border border-border bg-background/50 px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-500/60 transition"
            />
            <button
              onClick={handleImport}
              disabled={!inputValue.trim() || status.status === 'loading'}
              className="flex-shrink-0 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 transition-colors flex items-center gap-1.5"
            >
              {status.status === 'loading' ? (
                <Loader2 size={13} className="animate-spin" />
              ) : null}
              Import
            </button>
          </div>
        )}
      </div>

      {/* Status line */}
      {status.status !== 'idle' && (
        <div className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${
          status.status === 'loading'
            ? 'bg-muted/40 text-muted-foreground'
            : status.status === 'success'
            ? 'bg-teal-500/10 text-teal-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {status.status === 'loading' && <Loader2 size={13} className="animate-spin mt-px flex-shrink-0" />}
          {status.status === 'success' && <CheckCircle2 size={13} className="mt-px flex-shrink-0" />}
          {status.status === 'error' && <AlertCircle size={13} className="mt-px flex-shrink-0" />}
          <span className="leading-snug">{status.status === 'loading' ? 'Importing...' : status.message}</span>
        </div>
      )}
    </div>
  )
}
