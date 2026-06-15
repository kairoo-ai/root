import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Get Started - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description: 'Set up your career profile to get personalised guidance.',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="onboarding-container min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 relative">
      <div className="relative z-10 w-full max-w-xl flex justify-center">
        {children}
      </div>
    </div>
  )
}
