import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: 'w-full',
          card: 'bg-[oklch(0.12_0.006_255)] border border-white/10 shadow-2xl rounded-2xl',
          headerTitle: 'text-white font-bold',
          headerSubtitle: 'text-zinc-400',
          socialButtonsBlockButton: 'border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors',
          dividerLine: 'bg-white/10',
          dividerText: 'text-zinc-500',
          formFieldLabel: 'text-zinc-300',
          formFieldInput: 'bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-teal-500/50 focus:ring-teal-500/20 rounded-lg',
          formButtonPrimary: 'bg-teal-500 hover:bg-teal-600 text-black font-semibold rounded-lg transition-colors',
          footerActionLink: 'text-teal-400 hover:text-teal-300',
          identityPreviewText: 'text-zinc-300',
          identityPreviewEditButton: 'text-teal-400',
          formFieldInputShowPasswordButton: 'text-zinc-400',
          alertText: 'text-red-400',
          formResendCodeLink: 'text-teal-400',
        },
      }}
    />
  )
}
