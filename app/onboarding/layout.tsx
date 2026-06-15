import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Started — Kairoo',
  description: 'Set up your career profile to get personalised guidance.',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {children}
    </div>
  )
}
