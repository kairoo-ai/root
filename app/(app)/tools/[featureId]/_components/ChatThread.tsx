'use client'
import { useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { FollowUpSuggestions } from './FollowUpSuggestions'
import type { ChatMessage as ChatMessageType } from '@/data/schema'

interface Props {
  messages: ChatMessageType[]
  streamingContent: string
  isStreaming: boolean
  followUpSuggestions: string[]
  onFollowUp: (s: string) => void
}

export function ChatThread({
  messages,
  streamingContent,
  isStreaming,
  followUpSuggestions,
  onFollowUp,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, streamingContent])

  const streamingPlaceholder: ChatMessageType = {
    id: '__streaming__',
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth">
      {messages.map((msg, i) => (
        <ChatMessage key={msg.id} message={msg} index={i} />
      ))}

      {isStreaming && (
        <ChatMessage
          message={streamingPlaceholder}
          isStreaming
          streamingContent={streamingContent}
          index={messages.length}
        />
      )}

      {!isStreaming && followUpSuggestions.length > 0 && (
        <FollowUpSuggestions suggestions={followUpSuggestions} onSelect={onFollowUp} />
      )}

      <div ref={bottomRef} />
    </div>
  )
}
