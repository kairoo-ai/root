import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Get Started — ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description: 'Set up your career profile to get personalised guidance.',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen w-full bg-gradient-to-br from-[#060f1e] via-[#071426] to-[#081830] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="aurora-bg opacity-30" />
      <div className="relative z-10 w-full max-w-xl flex justify-center">
        {children}
      </div>
    </div>
  )
}
