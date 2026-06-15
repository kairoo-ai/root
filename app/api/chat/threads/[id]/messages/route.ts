import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getChatThreadById, appendMessagesToThread } from '@/data/repositories/chatThreads.repo'
import type { ChatMessage } from '@/data/schema'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const thread = await getChatThreadById(id, userId)
  if (!thread) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json() as { content: string; inputs?: Record<string, string> }
  if (!body.content?.trim()) return NextResponse.json({ error: 'content required' }, { status: 400 })

  // Build context-aware prompt: include last 6 messages as context
  const recentMessages = thread.messages.slice(-6)
  const conversationContext = recentMessages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n')

  const fullPrompt = conversationContext
    ? `${conversationContext}\n\nUser: ${body.content}`
    : body.content

  // Stream from existing /api/ai route
  const aiRes = await fetch(`${req.nextUrl.origin}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      featureId: thread.featureId,
      inputs: { ...(body.inputs ?? {}), _conversationContext: fullPrompt },
    }),
  })

  if (!aiRes.ok || !aiRes.body) {
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }

  // Create a transform stream: pass chunks to client AND collect full response
  let assistantContent = ''
  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: body.content,
    timestamp: new Date().toISOString(),
  }

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
  const writer = writable.getWriter()
  const reader = aiRes.body.getReader()

  // Pump in background - collect full text, then persist
  ;(async () => {
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += new TextDecoder().decode(value, { stream: true })
        await writer.write(value)
      }
    } finally {
      await writer.close()
      // After stream ends, persist both messages to DB
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date().toISOString(),
      }
      await appendMessagesToThread(id, userId, [userMessage, assistantMessage]).catch(() => {
        // Non-fatal: stream already delivered to client
      })
    }
  })()

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Thread-Id': id,
      'X-User-Message-Id': userMessage.id,
    },
  })
}
