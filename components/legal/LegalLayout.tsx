import RichText from "@/components/RichText";
import { legal } from "@/lib/legal/config";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export default function LegalLayout({ title, body }: { title: string; body: string }) {
  return (
    <main id="main-content" aria-labelledby="legal-title" className="mx-auto max-w-3xl px-6 py-16">
      <h1 id="legal-title" className="text-h1 text-foreground">{title}</h1>
      <p className="text-caption text-muted-foreground mt-2">
        Last updated {formatDate(legal.effectiveDate)}
      </p>
      {legal.draft && (
        <div className="mt-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-800 dark:text-warning-300">
          <strong>DRAFT — pending legal review.</strong> This document is provided for
          transparency and is not yet finalized or legal advice.
        </div>
      )}
      <div className="mt-8">
        <RichText>{body}</RichText>
      </div>
    </main>
  );
}
