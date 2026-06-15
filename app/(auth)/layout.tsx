import Link from "next/link";
import Logo from "@/components/Logo";
import { SpotlightNew, BackgroundRipple } from "@/components/aceternity";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundRipple className="min-h-screen bg-background" numRings={5}>
      <SpotlightNew className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12" size={500}>
        {/* Subtle token aurora - uses CSS vars so it adapts to light/dark */}
        <div aria-hidden className="auth-aurora pointer-events-none fixed inset-0 -z-10" />

        {/* Logo mark */}
        <div className="mb-8">
          <Link href="/" aria-label="Go to homepage">
            <Logo size={36} />
          </Link>
        </div>

        {/* Clerk card renders here */}
        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-body-sm text-muted-foreground">
          By continuing, you agree to {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}&apos;s{" "}
          <Link href="/legal/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </SpotlightNew>
    </BackgroundRipple>
  );
}
