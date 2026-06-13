"use client";

import { useEffect, useState } from "react";

const KEY = "kairoo-cookie-consent"; // "accepted" | "rejected"

/** Reads stored consent. Other code (e.g. future GA) can call this before loading analytics. */
export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "accepted";
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (v: "accepted" | "rejected") => {
    localStorage.setItem(KEY, v);
    setVisible(false);
  };

  return (
    <div role="region" aria-label="Cookie consent" aria-live="polite" className="fixed inset-x-0 bottom-0 z-[var(--z-banner)] border-t border-border bg-card/95 backdrop-blur-[18px]">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground">
          We use strictly-necessary cookies, and optional analytics cookies only with your
          consent. See our <a href="/cookies" className="text-primary underline">Cookie Policy</a>.
        </p>
        <div className="flex gap-2">
          <button onClick={() => choose("rejected")} className="rounded-lg border border-border px-3 py-1.5 hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Reject</button>
          <button onClick={() => choose("accepted")} className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Accept</button>
        </div>
      </div>
    </div>
  );
}
