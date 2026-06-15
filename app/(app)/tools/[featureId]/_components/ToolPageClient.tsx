'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { FeatureDef } from '@/engines/ai/features/registry'
import { ChatThread } from './ChatThread'
import { ChatInput } from './ChatInput'
import { ThreadSidebar } from './ThreadSidebar'
import type { ChatMessage } from '@/data/schema'
import type { ChatThread as ChatThreadRecord } from '@/data/repositories/chatThreads.repo'
import { cn } from '@/lib/utils'

interface Props {
  feature: Omit<FeatureDef, 'buildUserPrompt' | 'systemAddendum'>
}

function extractFollowUps(content: string): string[] {
  const lines = content.split('\n').filter(l => l.trim().endsWith('?'))
  if (lines.length >= 2) {
    return lines.slice(-3).map(l => l.replace(/^[\d\-*. ]+/, '').trim()).slice(0, 3)
  }
  return [
    'Tell me more about the most important point',
    'How do I prioritize this for my situation?',
    'What are the common mistakes to avoid here?',
  ]
}

export function ToolPageClient({ feature }: Props) {
  const router = useRouter()

  const [threads, setThreads] = useState<ChatThreadRecord[]>([])
  const [activeThread, setActiveThread] = useState<ChatThreadRecord | null>(null)
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([])

  const [streamingContent, setStreamingContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const [inputValue, setInputValue] = useState('')
  const [followUps, setFollowUps] = useState<string[]>([])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [error, setError] = useState('')

  const [formInputs, setFormInputs] = useState<Record<string, string>>({})
  const [showInitialForm, setShowInitialForm] = useState(true)

  useEffect(() => {
    fetch(`/api/chat/threads?featureId=${feature.id}`)
      .then(r => r.json())
      .then((data: ChatThreadRecord[]) => {
        if (!Array.isArray(data)) return
        setThreads(data)
        if (data.length > 0) {
          setShowInitialForm(false)
          setActiveThread(data[0])
          setDisplayMessages(data[0].messages)
        }
      })
      .catch(() => { })
  }, [feature.id])

  const sendMessage = useCallback(async (content: string, isFirstMessage = false) => {
    if (!content.trim() || isStreaming) return
    setError('')
    setFollowUps([])
    setIsStreaming(true)
    setStreamingContent('')

    const optimisticUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    let threadId = activeThread?.id ?? null

    if (!threadId) {
      try {
        const res = await fetch('/api/chat/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featureId: feature.id, firstUserMessage: content }),
        })
        const newThread = await res.json() as ChatThreadRecord
        threadId = newThread.id
        setActiveThread(newThread)
        setThreads(prev => [newThread, ...prev])
        setDisplayMessages(newThread.messages)
      } catch {
        setError('Failed to create thread')
        setIsStreaming(false)
        return
      }
    } else {
      setDisplayMessages(prev => [...prev, optimisticUserMsg])
    }

    abortRef.current = new AbortController()
    let full = ''

    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ...(isFirstMessage ? { inputs: formInputs } : {}),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: 'Request failed' })) as { error: string }
        throw new Error(errBody.error)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        full += chunk
        setStreamingContent(full)
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: full,
        timestamp: new Date().toISOString(),
      }

      setDisplayMessages(prev => [
        ...prev.filter(m => m.id !== optimisticUserMsg.id),
        optimisticUserMsg,
        assistantMsg,
      ])

      setThreads(prev =>
        prev.map(t =>
          t.id === threadId
            ? {
              ...t,
              messages: [...t.messages, optimisticUserMsg, assistantMsg],
              updatedAt: new Date(),
            }
            : t
        )
      )

      setFollowUps(extractFollowUps(full))
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
      setInputValue('')
    }
  }, [activeThread, feature.id, formInputs, isStreaming])

  const handleStop = () => {
    abortRef.current?.abort()
    setIsStreaming(false)
    if (streamingContent) {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: streamingContent + ' [stopped]',
        timestamp: new Date().toISOString(),
      }
      setDisplayMessages(prev => [...prev, assistantMsg])
    }
    setStreamingContent('')
  }

  const startNewChat = () => {
    setActiveThread(null)
    setDisplayMessages([])
    setFollowUps([])
    setStreamingContent('')
    setError('')
    setShowInitialForm(true)
    setFormInputs({})
    setInputValue('')
  }

  const handleThreadSelect = (thread: ChatThreadRecord) => {
    setActiveThread(thread)
    setDisplayMessages(thread.messages)
    setFollowUps([])
    setShowInitialForm(false)
    setError('')
  }

  const handleThreadDelete = async (threadId: string) => {
    await fetch(`/api/chat/threads/${threadId}`, { method: 'DELETE' })
    setThreads(prev => prev.filter(t => t.id !== threadId))
    if (activeThread?.id === threadId) startNewChat()
  }

  const canSubmitForm = feature.inputs.filter(i => i.required).every(i => formInputs[i.id]?.trim())

  const handleFormSubmit = () => {
    const parts = feature.inputs
      .filter(i => formInputs[i.id]?.trim())
      .map(i => `**${i.label}:** ${formInputs[i.id]}`)
      .join('\n')
    setShowInitialForm(false)
    sendMessage(parts, true)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <ThreadSidebar
        threads={threads}
        activeThreadId={activeThread?.id ?? null}
        onSelect={handleThreadSelect}
        onDelete={handleThreadDelete}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
        featureName={feature.name}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-base shrink-0">
              {feature.icon}
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">{feature.name}</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">{feature.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border hover:border-teal-500/30 rounded-xl px-3 py-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New chat
          </button>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 shrink-0"
            >
              <p className="text-xs text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {showInitialForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto flex items-center justify-center px-4 py-8"
            >
              <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">{feature.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                </div>

                {feature.inputs.map(field => (
                  <div key={field.id}>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      {field.label}
                      {field.required && <span className="text-teal-400 ml-0.5">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        placeholder={field.placeholder}
                        value={formInputs[field.id] ?? ''}
                        onChange={e => setFormInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                        rows={3}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 resize-none transition-colors"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formInputs[field.id] ?? ''}
                        onChange={e => setFormInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                        aria-label={field.label}
                        title={field.label}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-teal-500/50 cursor-pointer transition-colors"
                      >
                        <option value="">Select…</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={formInputs[field.id] ?? ''}
                        onChange={e => setFormInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 transition-colors"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={!canSubmitForm || feature.status === 'coming-soon'}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer',
                    canSubmitForm && feature.status !== 'coming-soon'
                      ? 'bg-teal-500 text-black hover:bg-teal-400'
                      : 'bg-teal-500/20 text-teal-400/50 cursor-not-allowed'
                  )}
                >
                  <Zap className="w-4 h-4" />
                  {feature.status === 'coming-soon' ? 'Coming Soon' : 'Start Chat'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ChatThread
                messages={displayMessages}
                streamingContent={streamingContent}
                isStreaming={isStreaming}
                followUpSuggestions={followUps}
                onFollowUp={s => {
                  setInputValue(s)
                  sendMessage(s)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar - only shown in chat mode */}
        {!showInitialForm && (
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => sendMessage(inputValue)}
            onStop={handleStop}
            isStreaming={isStreaming}
            disabled={feature.status === 'coming-soon'}
            placeholder={`Ask ${feature.name} anything…`}
          />
        )}
      </div>
    </div>
  )
}
