'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const code = String(children).replace(/\n$/, '')
  const lang = className?.replace('language-', '') ?? 'text'

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-border bg-muted/30">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="text-foreground font-mono">{code}</code>
      </pre>
    </div>
  )
}

interface Props {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: Props) {
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className ?? ''}`}>
      <ReactMarkdown
        components={{
          code({ className: cls, children, ...rest }) {
            const isBlock = /language-/.test(cls ?? '')
            if (isBlock) {
              return <CodeBlock className={cls}>{children}</CodeBlock>
            }
            return (
              <code
                className="text-[11px] font-mono bg-muted/50 border border-border rounded px-1 py-0.5 text-teal-300"
                {...rest}
              >
                {children}
              </code>
            )
          },
          p({ children }) {
            return <p className="text-sm text-foreground leading-relaxed mb-3 last:mb-0">{children}</p>
          },
          h1({ children }) {
            return <h1 className="text-base font-bold text-foreground mt-4 mb-2">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="text-sm font-bold text-foreground mt-3 mb-1.5">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="text-xs font-bold text-foreground mt-2 mb-1">{children}</h3>
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1 my-2 text-sm text-foreground">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1 my-2 text-sm text-foreground">{children}</ol>
          },
          li({ children }) {
            return <li className="text-sm text-foreground leading-relaxed">{children}</li>
          },
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-teal-500/40 pl-4 my-3 italic text-muted-foreground">
                {children}
              </blockquote>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
