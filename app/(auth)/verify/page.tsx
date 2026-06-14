'use client'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

export default function VerifyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[oklch(0.12_0.006_255)] border border-white/10 rounded-2xl p-8 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
        <Mail className="w-6 h-6 text-teal-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
      <p className="text-zinc-400 text-sm leading-relaxed">
        We've sent a verification link to your email address. Click it to activate your Kairoo account.
      </p>
    </motion.div>
  )
}
