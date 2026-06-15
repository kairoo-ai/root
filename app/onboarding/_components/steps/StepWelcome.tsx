'use client'
import { Zap, Brain, Target } from 'lucide-react'
import { TypewriterEffect, StatefulButton } from '@/components/aceternity'

export function StepWelcome({ userName, onNext }: { userName: string; onNext: () => void }) {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto mb-5 text-2xl font-black text-black shadow-lg shadow-teal-500/20">
        K
      </div>
      <TypewriterEffect
        words={`Welcome to Kairoo, ${userName}`.split(' ').map(w => ({ text: w }))}
        className="text-2xl font-black justify-center mb-2"
      />
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
        Takes 2 minutes. After this, <strong className="text-foreground">all 38 AI tools</strong> will know everything about you — and you'll never have to type your job title or goals again.
      </p>
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { icon: Brain, label: 'AI remembers you', color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { icon: Zap, label: 'Tools auto-fill', color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { icon: Target, label: 'Goal-driven advice', color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(item => (
          <div key={item.label} className={`rounded-xl ${item.bg} p-3 flex flex-col items-center gap-2`}>
            <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
            <span className="text-[10px] font-semibold text-muted-foreground text-center">{item.label}</span>
          </div>
        ))}
      </div>
      <StatefulButton onClick={onNext} size="lg" className="w-full">
        Let&apos;s set up your profile →
      </StatefulButton>
      <p className="text-[11px] text-muted-foreground mt-3">You can update this anytime in Settings → Profile</p>
    </div>
  )
}
