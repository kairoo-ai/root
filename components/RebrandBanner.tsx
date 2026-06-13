"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "kairoo-rebrand-banner-dismissed";

/**
 * Dismissible "AstraPath AI is now Kairoo" announcement.
 * Persists dismissal in localStorage so returning users aren't nagged.
 * Renders nothing until mounted (avoids hydration mismatch) and nothing once dismissed.
 */
export default function RebrandBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) !== "1") {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div role="region" aria-label="Site announcement" className="relative z-50 bg-brand-navy text-brand-mist">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
        <span>
          <strong>AstraPath AI is now Kairoo.</strong> Same mission — the right moment to grow.
        </span>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1 focus-visible:ring-offset-brand-navy"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
