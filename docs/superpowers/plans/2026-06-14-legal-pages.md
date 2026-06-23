# Kairoo Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Kairoo's baseline legal pages - Privacy Policy, Terms of Service, Cookie Policy (+ consent banner), Acceptable Use, AI Disclosure - plus enterprise stubs (DPA, Sub-processors, Security), all config-driven and marked DRAFT pending legal review, with footer links.

**Architecture:** A single `lib/legal/config.ts` holds the legally-significant variables (entity, jurisdiction, contacts, effective date, sub-processors). Each policy's text lives as a markdown-returning function in `lib/legal/content/*.ts` that interpolates the config. A shared `components/legal/LegalLayout.tsx` renders title + last-updated + a DRAFT banner + the body via the existing branded `RichText` component. Thin route files under `app/<slug>/page.tsx` wire each. A consent-ready `CookieConsent` banner is added (so GA can drop in later). Footer gets a legal-links section.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, the design-system tokens + `RichText` (react-markdown + remark-gfm), lucide-react.

**Source of truth for scope:** `docs/superpowers/specs/2026-06-13-rebrand-and-legal-design.md` §4.

**ENVIRONMENT:** `node`/`npm`/`npx` NOT on default shell PATH - prefix every command with `export PATH="/opt/homebrew/bin:$PATH"`. Verify with `npx tsc --noEmit` and `npm run build`. **Never run `npm run dev`.** Branch: `latest`.

**⚠️ LEGAL CAVEAT (carry into every page):** This is AI-drafted boilerplate, not legal advice. Pages render a visible "DRAFT - pending legal review" banner until the owner clears it (`config.draft = false`) after a lawyer reviews and the §4.3 open decisions are filled.

**Testing note:** No unit-test runner. Verify per task with `tsc --noEmit` + `npm run build` + `npm run lint:colors` (legal files must be token-only) + route-list checks. Commit after each task.

---

## File Structure

**Create:**

- `lib/legal/config.ts` - entity, jurisdiction, contacts, dates, sub-processors, `draft` flag
- `lib/legal/content/privacy.ts`, `terms.ts`, `cookies.ts`, `acceptableUse.ts`, `aiDisclosure.ts`, `dpa.ts`, `subProcessors.ts`, `security.ts` - each exports `(c: LegalConfig) => string` (markdown)
- `components/legal/LegalLayout.tsx` - shared page chrome (title, updated date, DRAFT banner, RichText body)
- `components/CookieConsent.tsx` - dismissible, consent-ready banner
- `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/cookies/page.tsx`, `app/acceptable-use/page.tsx`, `app/ai-disclosure/page.tsx`, `app/dpa/page.tsx`, `app/sub-processors/page.tsx`, `app/security/page.tsx`

**Modify:**

- `components/Footer.tsx` - legal links section
- `app/layout.tsx` - mount `<CookieConsent />`
- `app/sitemap.ts` (create if absent) - include legal routes
- `scripts/check-no-raw-colors.mjs` - no change expected (legal files are token-only)

---

## Task 1: Legal config

**Files:** Create `lib/legal/config.ts`

- [ ] **Step 1: Write the config**

```ts
// Single source for legally-significant values. Fill the TODOs and set draft=false
// only AFTER a lawyer reviews. Everything renders from here.
export type SubProcessor = { name: string; purpose: string; region: string };

export type LegalConfig = {
  productName: string;
  legalEntity: string; // TODO: confirm the registered entity that owns Kairoo
  jurisdiction: string; // TODO: confirm governing-law country/state
  effectiveDate: string; // ISO date shown as "Last updated"
  contactEmail: string; // general/privacy contact
  dpoEmail: string; // data requests
  websiteUrl: string;
  draft: boolean; // true => show DRAFT banner sitewide on legal pages
  subProcessors: SubProcessor[];
};

export const legal: LegalConfig = {
  productName: "Kairoo",
  legalEntity: "Kairoo (operated by Matters AI)", // TODO confirm registered entity
  jurisdiction: "India", // TODO confirm governing law
  effectiveDate: "2026-06-14",
  contactEmail: "privacy+kairoo@mreshank.com", // TODO confirm
  dpoEmail: "privacy+kairoo@mreshank.com", // TODO confirm
  websiteUrl: "https://kairoo.mreshank.com", // TODO confirm domain
  draft: true,
  subProcessors: [
    {
      name: "Google (Gemini API)",
      purpose: "AI generation of career guidance from user input",
      region: "USA / Global",
    },
    {
      name: "Vercel",
      purpose: "Application hosting & delivery",
      region: "USA / Global",
    },
  ],
};
```

- [ ] **Step 2: Typecheck + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit` → no errors.

```bash
git add lib/legal/config.ts
git commit -m "feat(legal): config source for entity/jurisdiction/contacts/sub-processors"
```

---

## Task 2: Shared LegalLayout

**Files:** Create `components/legal/LegalLayout.tsx`

- [ ] **Step 1: Write the layout**

```tsx
import RichText from "@/components/RichText";
import { legal } from "@/lib/legal/config";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function LegalLayout({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-h1 text-foreground">{title}</h1>
      <p className="text-caption text-muted-foreground mt-2">
        Last updated {formatDate(legal.effectiveDate)}
      </p>
      {legal.draft && (
        <div className="mt-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <strong>DRAFT - pending legal review.</strong> This document is
          provided for transparency and is not yet finalized or legal advice.
        </div>
      )}
      <div className="mt-8">
        <RichText>{body}</RichText>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success.

```bash
git add components/legal/LegalLayout.tsx
git commit -m "feat(legal): shared LegalLayout (title, updated date, DRAFT banner, RichText)"
```

---

## Task 3: Privacy Policy

**Files:** Create `lib/legal/content/privacy.ts`, `app/privacy/page.tsx`

- [ ] **Step 1: Content**

Create `lib/legal/content/privacy.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const privacy = (c: LegalConfig) => `
${c.productName} ("we", "us") provides AI-powered career development tools. This Privacy
Policy explains what we collect, why, and your rights. It is operated by ${c.legalEntity}
and governed by the laws of ${c.jurisdiction}.

## Information we collect
- **Account data:** name, email, and authentication details when you create an account.
- **Profile & career data:** information you provide for career tools (e.g., resume text, goals, interview answers, skills).
- **Usage data:** how you interact with the product (features used, timestamps, device/browser).
- **Cookies:** see our [Cookie Policy](/cookies).

## How we use it
To provide and improve the service, generate AI guidance, personalize learning, maintain
security, and communicate with you. We do **not** sell your personal data.

## AI processing (important)
When you use AI features, the content you submit is sent to our AI provider, **Google
(Gemini API)**, to generate a response. Do not submit information you would not want
processed by a third-party AI service. See our [AI Disclosure](/ai-disclosure) and
[Sub-processors](/sub-processors).

## Legal bases (GDPR)
We process data to perform our contract with you, with your consent (where required), and
for our legitimate interests in operating and improving the service.

## Your rights
Depending on your location (incl. **GDPR** and **CCPA**), you may access, correct, delete,
or export your data, and object to or restrict processing. To exercise these, contact
**${c.dpoEmail}**. California residents have the right to know and delete, and to not be
discriminated against for exercising these rights.

## Retention
We keep personal data only as long as needed for the purposes above or as required by law,
then delete or anonymize it. You can request deletion of your account at any time.

## Sub-processors & transfers
We share data with vetted sub-processors (see [Sub-processors](/sub-processors)) who may
process it outside your country under appropriate safeguards.

## Security
We use reasonable technical and organizational measures to protect your data. See our
[Security](/security) overview.

## Children
${c.productName} is not directed to children under 16, and we do not knowingly collect their data.

## Changes
We may update this policy; material changes will be posted here with a new "last updated" date.

## Contact
Questions or requests: **${c.contactEmail}**.
`;
```

- [ ] **Step 2: Route**

Create `app/privacy/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { privacy } from "@/lib/legal/content/privacy";

export const metadata: Metadata = { title: "Privacy Policy - Kairoo" };

export default function PrivacyPage() {
  return <LegalLayout title="Privacy Policy" body={privacy(legal)} />;
}
```

- [ ] **Step 3: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success; `/privacy` in route list.

```bash
git add lib/legal/content/privacy.ts app/privacy/page.tsx
git commit -m "feat(legal): Privacy Policy (GDPR/CCPA + AI disclosure) draft"
```

---

## Task 4: Terms of Service

**Files:** Create `lib/legal/content/terms.ts`, `app/terms/page.tsx`

- [ ] **Step 1: Content**

Create `lib/legal/content/terms.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const terms = (c: LegalConfig) => `
These Terms govern your use of ${c.productName}, operated by ${c.legalEntity}. By using the
service you agree to them. They are governed by the laws of ${c.jurisdiction}.

## Your account
You must provide accurate information, keep your credentials secure, and are responsible for
activity under your account. You must be at least 16 years old.

## Acceptable use
Your use must follow our [Acceptable Use Policy](/acceptable-use).

## Plans & billing
${c.productName} offers a **Free** tier, a paid **Pro** tier, and **Enterprise/Team** plans.
Paid plans are billed in advance and renew automatically until cancelled; you can cancel
anytime, effective at the end of the current billing period. Fees are non-refundable except
where required by law.

## AI-generated content - no guarantees
${c.productName} uses AI to generate career guidance, learning suggestions, and similar
output. **This output may be inaccurate or incomplete and is not professional, legal,
financial, or career advice.** You are responsible for how you use it; we do not guarantee
any outcome (e.g., a job, raise, or result). See our [AI Disclosure](/ai-disclosure).

## Intellectual property
We own the service and its content (excluding your inputs). You retain rights to content you
submit and grant us a license to process it to provide the service.

## Termination
You may stop using the service anytime. We may suspend or terminate access for breach of
these Terms or the Acceptable Use Policy.

## Disclaimers & limitation of liability
The service is provided "as is" without warranties. To the maximum extent permitted by law,
${c.legalEntity} is not liable for indirect, incidental, or consequential damages, and our
total liability is limited to the amount you paid in the 12 months before the claim.

## Changes
We may update these Terms; continued use after changes means you accept them.

## Contact
**${c.contactEmail}**.
`;
```

- [ ] **Step 2: Route**

Create `app/terms/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { terms } from "@/lib/legal/content/terms";

export const metadata: Metadata = { title: "Terms of Service - Kairoo" };

export default function TermsPage() {
  return <LegalLayout title="Terms of Service" body={terms(legal)} />;
}
```

- [ ] **Step 3: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success; `/terms` in route list.

```bash
git add lib/legal/content/terms.ts app/terms/page.tsx
git commit -m "feat(legal): Terms of Service (tiers, billing, AI disclaimer) draft"
```

---

## Task 5: Cookie Policy

**Files:** Create `lib/legal/content/cookies.ts`, `app/cookies/page.tsx`

- [ ] **Step 1: Content**

Create `lib/legal/content/cookies.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const cookies = (c: LegalConfig) => `
${c.productName} uses cookies and similar technologies. This policy explains the categories
and your choices.

## Categories
- **Strictly necessary:** required for the site to work (e.g., authentication, security, theme preference). Always on.
- **Analytics (optional):** help us understand usage to improve the product. Off until you consent.
- **Preferences (optional):** remember choices you make.

## Your choices
You can accept or reject optional cookies via our consent banner, and change your choice
anytime by clearing the stored preference. Strictly-necessary cookies cannot be disabled.

## Analytics
Analytics are only loaded after you consent. (No third-party analytics run until then.)

## Contact
**${c.contactEmail}**.
`;
```

- [ ] **Step 2: Route**

Create `app/cookies/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { cookies } from "@/lib/legal/content/cookies";

export const metadata: Metadata = { title: "Cookie Policy - Kairoo" };

export default function CookiesPage() {
  return <LegalLayout title="Cookie Policy" body={cookies(legal)} />;
}
```

- [ ] **Step 3: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success; `/cookies` in route list.

```bash
git add lib/legal/content/cookies.ts app/cookies/page.tsx
git commit -m "feat(legal): Cookie Policy draft (consent-ready categories)"
```

---

## Task 6: Acceptable Use + AI Disclosure

**Files:** Create `lib/legal/content/acceptableUse.ts`, `aiDisclosure.ts`, `app/acceptable-use/page.tsx`, `app/ai-disclosure/page.tsx`

- [ ] **Step 1: Acceptable Use content**

Create `lib/legal/content/acceptableUse.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const acceptableUse = (c: LegalConfig) => `
This Acceptable Use Policy applies to everyone using ${c.productName}.

## You may not
- Use the service for unlawful, harmful, deceptive, or infringing purposes.
- Submit content that is illegal, hateful, harassing, or violates others' rights.
- Attempt to generate disallowed content or misuse the AI features.
- Reverse-engineer, scrape, overload, or circumvent security or rate limits.
- Resell or share access in violation of your plan.

## Enforcement
We may remove content and suspend or terminate accounts that violate this policy. Report
abuse to **${c.contactEmail}**.
`;
```

- [ ] **Step 2: AI Disclosure content**

Create `lib/legal/content/aiDisclosure.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const aiDisclosure = (c: LegalConfig) => `
${c.productName} uses artificial intelligence to assist your career development.

## How it works
Features like coaching, interview prep, and learning suggestions generate responses using an
AI model. The content you submit is processed by our AI provider, **Google (Gemini API)**, to
produce output.

## Important limitations
- AI output **can be inaccurate, outdated, or incomplete**, and may not fit your situation.
- It is **not professional, legal, financial, medical, or career advice**.
- We do **not guarantee outcomes** (such as employment or compensation).
- Always review AI output and apply your own judgment; keep a human in the loop for decisions.

## Your data & AI
Do not submit sensitive information you would not want processed by a third-party AI service.
See our [Privacy Policy](/privacy) and [Sub-processors](/sub-processors).

## Contact
**${c.contactEmail}**.
`;
```

- [ ] **Step 3: Routes**

Create `app/acceptable-use/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { acceptableUse } from "@/lib/legal/content/acceptableUse";

export const metadata: Metadata = { title: "Acceptable Use Policy - Kairoo" };

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use Policy" body={acceptableUse(legal)} />
  );
}
```

Create `app/ai-disclosure/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { aiDisclosure } from "@/lib/legal/content/aiDisclosure";

export const metadata: Metadata = { title: "AI Disclosure - Kairoo" };

export default function AiDisclosurePage() {
  return <LegalLayout title="AI Disclosure" body={aiDisclosure(legal)} />;
}
```

- [ ] **Step 4: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success; `/acceptable-use` and `/ai-disclosure` in route list.

```bash
git add lib/legal/content/acceptableUse.ts lib/legal/content/aiDisclosure.ts app/acceptable-use/page.tsx app/ai-disclosure/page.tsx
git commit -m "feat(legal): Acceptable Use + AI Disclosure drafts"
```

---

## Task 7: Enterprise stubs (DPA, Sub-processors, Security)

**Files:** Create `lib/legal/content/dpa.ts`, `subProcessors.ts`, `security.ts`, `app/dpa/page.tsx`, `app/sub-processors/page.tsx`, `app/security/page.tsx`

- [ ] **Step 1: DPA content (stub)**

Create `lib/legal/content/dpa.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const dpa = (c: LegalConfig) => `
This Data Processing Agreement (DPA) applies where ${c.legalEntity} processes personal data
on behalf of a business customer (controller) under GDPR Article 28 and similar laws.

## Summary
- **Roles:** customer is controller; ${c.productName} is processor.
- **Scope:** processing is limited to providing the service.
- **Sub-processors:** listed at [Sub-processors](/sub-processors); we notify of changes.
- **Security:** see [Security](/security).
- **International transfers:** under appropriate safeguards (e.g., SCCs) where applicable.
- **Sub-processor obligations, audit rights, and breach notification** are included in the full DPA.

A signable DPA is **available on request** - contact **${c.contactEmail}**. (Full executable
version pending finalization.)
`;
```

- [ ] **Step 2: Sub-processors content (renders the config list)**

Create `lib/legal/content/subProcessors.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const subProcessors = (c: LegalConfig) => `
${c.productName} uses the following sub-processors to provide the service. We update this list
when it changes.

| Sub-processor | Purpose | Region |
|---|---|---|
${c.subProcessors.map((s) => `| ${s.name} | ${s.purpose} | ${s.region} |`).join("\n")}

Questions: **${c.contactEmail}**.
`;
```

- [ ] **Step 3: Security content (stub)**

Create `lib/legal/content/security.ts`:

```ts
import type { LegalConfig } from "@/lib/legal/config";

export const security = (c: LegalConfig) => `
We take security seriously at ${c.productName}.

## Practices
- Encryption in transit (HTTPS/TLS).
- Access controls and least-privilege for internal systems.
- Vetted infrastructure and AI sub-processors (see [Sub-processors](/sub-processors)).
- Ongoing improvement of our security posture as we grow.

## Reporting
To report a vulnerability or security concern, contact **${c.contactEmail}**.

_This overview will expand with formal certifications and controls as the product matures._
`;
```

- [ ] **Step 4: Routes**

Create `app/dpa/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { dpa } from "@/lib/legal/content/dpa";

export const metadata: Metadata = {
  title: "Data Processing Agreement - Kairoo",
};

export default function DpaPage() {
  return <LegalLayout title="Data Processing Agreement" body={dpa(legal)} />;
}
```

Create `app/sub-processors/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { subProcessors } from "@/lib/legal/content/subProcessors";

export const metadata: Metadata = { title: "Sub-processors - Kairoo" };

export default function SubProcessorsPage() {
  return <LegalLayout title="Sub-processors" body={subProcessors(legal)} />;
}
```

Create `app/security/page.tsx`:

```tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { security } from "@/lib/legal/content/security";

export const metadata: Metadata = { title: "Security - Kairoo" };

export default function SecurityPage() {
  return <LegalLayout title="Security" body={security(legal)} />;
}
```

- [ ] **Step 5: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success; `/dpa`, `/sub-processors`, `/security` in route list.

```bash
git add lib/legal/content/dpa.ts lib/legal/content/subProcessors.ts lib/legal/content/security.ts app/dpa/page.tsx app/sub-processors/page.tsx app/security/page.tsx
git commit -m "feat(legal): enterprise stubs - DPA, Sub-processors, Security"
```

---

## Task 8: Cookie consent banner (consent-ready for GA)

**Files:** Create `components/CookieConsent.tsx`; modify `app/layout.tsx`

- [ ] **Step 1: Component**

Create `components/CookieConsent.tsx`:

```tsx
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
    <div className="fixed inset-x-0 bottom-0 z-[var(--z-banner)] border-t border-border bg-card/95 backdrop-blur-[18px]">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          We use strictly-necessary cookies, and optional analytics cookies only
          with your consent. See our{" "}
          <a href="/cookies" className="text-primary underline">
            Cookie Policy
          </a>
          .
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => choose("rejected")}
            className="rounded-lg border border-border px-3 py-1.5 hover:bg-accent"
          >
            Reject
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground hover:bg-teal-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount in layout**

In `app/layout.tsx`, add `import CookieConsent from "@/components/CookieConsent";` and render `<CookieConsent />` inside `<Providers>` after the `<div ...>{children}</div>` (so it overlays).

- [ ] **Step 3: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build && npm run lint:colors` → all pass.

```bash
git add components/CookieConsent.tsx app/layout.tsx
git commit -m "feat(legal): consent-ready cookie banner + analytics-consent helper"
```

---

## Task 9: Footer legal links + sitemap

**Files:** Modify `components/Footer.tsx`; create `app/sitemap.ts` (if absent)

- [ ] **Step 1: Footer links**

In `components/Footer.tsx`, add a "Legal" links group (use `next/link` and token classes) linking to: `/privacy`, `/terms`, `/cookies`, `/acceptable-use`, `/ai-disclosure`, `/security`. Match the existing footer markup/styles; use `text-muted-foreground hover:text-foreground` for links. Do not use raw colors.

- [ ] **Step 2: Sitemap**

Create `app/sitemap.ts` (if it doesn't exist):

```ts
import type { MetadataRoute } from "next";
import { legal } from "@/lib/legal/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = legal.websiteUrl.replace(/\/$/, "");
  const routes = [
    "",
    "/privacy",
    "/terms",
    "/cookies",
    "/acceptable-use",
    "/ai-disclosure",
    "/dpa",
    "/sub-processors",
    "/security",
  ];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(legal.effectiveDate + "T00:00:00Z"),
  }));
}
```

- [ ] **Step 3: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build && npm run lint:colors` → all pass; `grep -rn "AstraPath" components/Footer.tsx` shows none.

```bash
git add components/Footer.tsx app/sitemap.ts
git commit -m "feat(legal): footer legal links + sitemap with legal routes"
```

---

## Task 10: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full checks**

Run:

```bash
export PATH="/opt/homebrew/bin:$PATH"
npx tsc --noEmit && npm run lint:colors && npm run build
```

Expected: all pass; the build route list includes `/privacy`, `/terms`, `/cookies`, `/acceptable-use`, `/ai-disclosure`, `/dpa`, `/sub-processors`, `/security`.

- [ ] **Step 2: Confirm DRAFT + config wiring**

Confirm every legal page shows the DRAFT banner (because `legal.draft === true`) and that no policy text hardcodes the entity/contact/jurisdiction (all come from `config.ts`). Grep: `grep -rn "privacy@kairoo\|kairoo.mreshank.com\|India" lib/legal/content/` → expected: NO matches (all such values come via the `c.*` interpolation, not literals).

- [ ] **Step 3: Final commit (if any tweaks)**

```bash
git add -A
git commit -m "chore(legal): final verification pass"
```

---

## Self-Review Notes (coverage vs spec §4)

- §4.2 ship-now: Privacy (T3), Terms (T4), Cookie Policy + consent banner (T5, T8), Acceptable Use (T6), AI Disclosure (T6). ✅
- §4.2 enterprise stubs: DPA, Sub-processors, Security (T7). ✅
- §4.1 AI/Gemini disclosure in Privacy + AI Disclosure. ✅
- §4.3 open decisions surfaced as `config.ts` TODOs (entity, jurisdiction, contact, retention via Privacy copy; Gemini terms noted). ✅
- §4.4 routes, shared layout, last-updated date, DRAFT note. ✅
- Lawyer-review caveat enforced via `draft` flag + banner. ✅
- GA out of scope but consent-ready (T8 `hasAnalyticsConsent`). ✅
- Reuses branded `RichText` (no generic `prose`). ✅
