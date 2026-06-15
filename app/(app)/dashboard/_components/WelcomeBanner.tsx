'use client'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Zap, Calendar } from 'lucide-react'
import { SparklesCore, GridDotBackground } from '@/components/aceternity'

export function WelcomeBanner() {
  const { user } = useUser()
  const router = useRouter()
  const firstName = user?.firstName ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl"
    >
      <GridDotBackground variant="dots" className="rounded-xl overflow-hidden border border-teal-500/15 bg-gradient-to-br from-teal-500/8 via-transparent to-cyan-500/4 p-6">
        <SparklesCore particleCount={20} particleColor="#14b8a6" minSize={0.5} maxSize={1.5} speed={0.2} />
        <div className="relative z-10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1">{greeting} ✦</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-1.5">
          Ready to level up, {firstName}?
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg">
          Your AI career tools are ready. Pick up where you left off or start something new.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push('/roadmaps')}
            className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Continue Roadmap
          </button>
          <button
            onClick={() => router.push('/tools')}
            className="flex items-center gap-2 text-xs font-medium border border-border text-muted-foreground px-4 py-2 rounded-lg hover:bg-card hover:text-foreground transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            Browse All Tools
          </button>
        </div>
      </div>
      </GridDotBackground>
    </motion.div>
  )
}
