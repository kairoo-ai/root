import { SparklesCore } from '@/components/aceternity/SparklesCore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[oklch(0.09_0.005_255)] flex items-center justify-center overflow-hidden">
      {/* Subtle sparkle background */}
      <SparklesCore
        particleCount={30}
        particleColor="#14b8a6"
        minSize={0.5}
        maxSize={1.5}
        speed={0.2}
      />
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center font-black text-white text-lg">
            K
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Kairoo</span>
          <span className="text-[10px] font-semibold text-teal-400 border border-teal-500/30 bg-teal-500/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">AI</span>
        </div>
        {children}
      </div>
    </div>
  )
}
