"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "kairoo-rebrand-banner-dismissed";

interface RebrandBannerProps {
  forceHide?: boolean;
}

/**
  * Dismissible "AstraPath AI is now Kairoo" announcement.
  * Persists dismissal in localStorage so returning users aren't nagged.
  * Transitions smoothly and soothingly when appearing or disappearing.
  */
export default function RebrandBanner({ forceHide = false }: RebrandBannerProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(DISMISS_KEY) !== "1") {
      // Small timeout to allow the transition to animate in smoothly after mounting
      const timer = setTimeout(() => {
        setDismissed(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  const show = !dismissed && !forceHide;

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className={`relative z-50 bg-brand-navy/50 text-brand-mist transition-all duration-500 ease-in-out fade-in-translate-full fade-out-translate-full origin-top overflow-hidden ${
        show
          ? "opacity-100 max-h-16 translate-y-0"
          : "opacity-0 max-h-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
        <span>
          <strong>AstraPath AI is now {process.env.APP_NAME || "Kairoo"}.</strong> Same mission — the right moment to grow.
        </span>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1 focus-visible:ring-offset-brand-navy"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
