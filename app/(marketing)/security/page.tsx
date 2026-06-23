import type { Metadata } from "next";

import { CTA } from "@/components/blocks/CTA";
import type { FAQItem } from "@/types";
import type { StatCounterProps } from "@/components/blocks/StatCounter";

import {
  SecurityHero,
  SecurityStats,
  SecurityLayers,
  SecurityDeepDive,
  SecurityLifecycle,
  SecurityPractices,
  SecurityCompliance,
  SecurityPerformance,
  SecurityFAQ,
  type LayerVM,
  type ComplianceVM,
  type PracticeVM,
  type TargetVM,
  type DeepDiveTab,
  type LifecycleStep,
} from "./SecurityVisuals";

const securityTitle = `Security & Trust | ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`;
const securityDesc =
  `How ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} protects your data: a layered security model across network, application, and data; our compliance posture (SOC 2, GDPR, HIPAA, ISO 27001) framed honestly as in-progress; and the performance targets we hold ourselves to.`;

export const metadata: Metadata = {
  title: securityTitle,
  description: securityDesc,
  alternates: { canonical: "/security" },
  openGraph: { title: securityTitle, description: securityDesc, url: "/security" },
  twitter: { card: "summary_large_image", title: securityTitle, description: securityDesc },
};

/* -------------------------------------------------------------------------- */
/*  Data - PUBLIC-SAFE & HONEST.                                              */
/*  Compliance is framed as "compliance-ready / in progress", NOT certified.  */
/*  Performance figures are stated as TARGETS, not measured guarantees.       */
/*  Stack references reflect the REAL app (Next.js + engines/ai Gemini).      */
/*                                                                            */
/*  RSC-SAFE: this file stays a server component (keeps `export const         */
/*  metadata`). All animation/interactivity lives in ./SecurityVisuals, and   */
/*  icons cross the boundary as NAME strings (IconRenderer keys), never as     */
/*  lucide component references.                                               */
/* -------------------------------------------------------------------------- */

// Honest reframing of the architecture badges: nothing is claimed as
// "certified" - each entry is described as ready / in progress / aligned.
const COMPLIANCE: ComplianceVM[] = [
  {
    name: "SOC 2",
    scope: "Security, availability & confidentiality controls",
    posture:
      "Targeting SOC 2 Type II. Controls are being implemented and documented ahead of a formal third-party audit.",
    status: "in-progress",
    statusLabel: "In progress",
    statusIcon: "clock-3",
    statusVariant: "info",
  },
  {
    name: "GDPR",
    scope: "EU/EEA personal data protection",
    posture:
      "Built to be GDPR-ready: data-subject access and deletion, lawful-basis handling, and EU data-processing practices.",
    status: "aligned",
    statusLabel: "Aligned",
    statusIcon: "check-circle",
    statusVariant: "success",
  },
  {
    name: "HIPAA",
    scope: "Protected health information (where applicable)",
    posture:
      "HIPAA-ready architecture for healthcare use cases. A signed BAA and full safeguards are part of our enterprise roadmap.",
    status: "in-progress",
    statusLabel: "In progress",
    statusIcon: "clock-3",
    statusVariant: "info",
  },
  {
    name: "ISO 27001",
    scope: "Information security management",
    posture:
      "Designing our information-security management system against ISO/IEC 27001 controls as we scale toward certification.",
    status: "in-progress",
    statusLabel: "In progress",
    statusIcon: "clock-3",
    statusVariant: "info",
  },
];

// Three defense layers - verbatim controls preserved from the source
// architecture page (network / application / data). Laid out as a Bento.
const LAYERS: LayerVM[] = [
  {
    title: "Network security",
    icon: "network",
    tag: "Layer 01 - Edge",
    summary:
      "Traffic is filtered, encrypted, and rate-shaped before it ever reaches the app.",
    controls: [
      "Web application firewall with DDoS protection",
      "SSL / TLS 1.3 encryption in transit",
      "IP allow-listing for administrative access",
    ],
    coverage: 96,
    span: "wide",
  },
  {
    title: "Application security",
    icon: "app-window",
    tag: "Layer 02 - Runtime",
    summary:
      "Every request is authenticated, authorized, and scoped to least privilege.",
    controls: [
      "OAuth 2.0 + JWT authentication",
      "Role-based access control (RBAC)",
      "API rate limiting and abuse protection",
    ],
    coverage: 94,
    span: "cell",
  },
  {
    title: "Data security",
    icon: "database",
    tag: "Layer 03 - Core",
    summary: "Your data is encrypted at rest, minimized, and isolated by design.",
    controls: [
      "AES-256 encryption at rest",
      "PII anonymization and data minimization",
      "Secure key management (HSM-backed)",
    ],
    coverage: 98,
    span: "cell",
  },
];

// Dense, tabbed control deep-dive - HeroUI Tabs. Mirrors the three defense
// layers with the concrete controls behind each, framed honestly.
const DEEP_DIVE: DeepDiveTab[] = [
  {
    id: "network",
    label: "Network",
    icon: "network",
    headline: "Hardened at the edge",
    blurb:
      "Nothing reaches application code until it has been inspected, encrypted, and rate-shaped.",
    controls: [
      { icon: "shield-half", title: "Web application firewall", detail: "Inline WAF with DDoS absorption and anomaly rules at the edge." },
      { icon: "lock-keyhole", title: "TLS 1.3 in transit", detail: "Modern ciphers only; HSTS and forward secrecy enforced." },
      { icon: "fingerprint", title: "Admin allow-listing", detail: "Privileged surfaces are reachable only from known IP ranges." },
      { icon: "gauge", title: "Rate shaping", detail: "Per-client throttling protects the platform from abusive bursts." },
    ],
  },
  {
    id: "application",
    label: "Application",
    icon: "app-window",
    headline: "Least privilege, every request",
    blurb:
      "Authentication, authorization, and abuse protection wrap every call into the product.",
    controls: [
      { icon: "key-round", title: "OAuth 2.0 + JWT", detail: "Short-lived, scoped tokens issued through a controlled flow." },
      { icon: "user-check", title: "Role-based access control", detail: "Permissions are scoped to the minimum a role requires." },
      { icon: "siren", title: "Abuse protection", detail: "API rate limiting and abuse heuristics on sensitive endpoints." },
      { icon: "bot", title: "Gated AI gateway", detail: "Model calls route through engines/ai - authenticated and auditable." },
    ],
  },
  {
    id: "data",
    label: "Data",
    icon: "database",
    headline: "Protected at rest, minimized by design",
    blurb:
      "Your data is encrypted, isolated, and reduced to only what a feature genuinely needs.",
    controls: [
      { icon: "file-lock-2", title: "AES-256 at rest", detail: "Stored data is encrypted with industry-standard symmetric keys." },
      { icon: "eye-off", title: "PII minimization", detail: "We collect less, and anonymize wherever the product allows." },
      { icon: "server-cog", title: "HSM-backed keys", detail: "Key material is generated and held in hardware-backed storage." },
      { icon: "scan-eye", title: "Access auditing", detail: "Reads and writes to sensitive records leave an immutable trail." },
    ],
  },
];

// Data lifecycle / threat-response timeline - horizontal stepper.
const LIFECYCLE: LifecycleStep[] = [
  { icon: "lock-keyhole", title: "Encrypted in transit", detail: "TLS 1.3 secures every byte from your device to our edge." },
  { icon: "shield-half", title: "Inspected & authorized", detail: "WAF, auth, and RBAC validate the request before it runs." },
  { icon: "file-lock-2", title: "Stored & minimized", detail: "AES-256 at rest, with PII reduced to what's truly needed." },
  { icon: "scan-eye", title: "Monitored continuously", detail: "APM, logs, and error tracking watch for anomalies in real time." },
  { icon: "siren", title: "Responded to fast", detail: "Alerts route to on-call so regressions get fixed before they spread." },
];

const PRACTICES: PracticeVM[] = [
  {
    title: "Encryption everywhere",
    icon: "lock",
    description:
      "TLS 1.3 in transit and AES-256 at rest, so your data is protected on the wire and on disk.",
  },
  {
    title: "Least-privilege access",
    icon: "key-round",
    description:
      "Role-based access control and HSM-backed key management keep credentials and secrets tightly scoped.",
  },
  {
    title: "Data minimization",
    icon: "eye-off",
    description:
      "We collect only what a feature needs and anonymize PII wherever the product allows.",
  },
  {
    title: "Continuous monitoring",
    icon: "activity",
    description:
      "Application performance monitoring, metrics, log aggregation, and error tracking give us real-time visibility into the platform.",
  },
];

// Performance figures from the architecture page, restated as TARGETS.
const PERF_TARGETS: TargetVM[] = [
  { metric: "First Contentful Paint (FCP)", target: "< 1.2s", note: "First content visible" },
  { metric: "Largest Contentful Paint (LCP)", target: "< 2.5s", note: "Main content loaded" },
  { metric: "Time to Interactive (TTI)", target: "< 3.8s", note: "Page fully responsive" },
  { metric: "API response time", target: "< 200ms", note: "Typical request latency" },
  { metric: "AI processing time", target: "< 5s", note: "Per AI-assisted action" },
];

// Headline metrics for the animated count-up band - derived from the
// performance targets and the layered model, stated as targets/figures.
const PERF_STATS: StatCounterProps[] = [
  { value: 1.2, prefix: "<", suffix: "s", label: "First Contentful Paint target" },
  { value: 200, prefix: "<", suffix: "ms", label: "API response time target" },
  { value: 256, label: "AES-bit encryption at rest" },
  { value: 3, label: "Defense-in-depth layers" },
];

const MONITORING = [
  "Application performance monitoring (APM)",
  "Metrics visualization & alerting",
  "Centralized log aggregation & search",
  "Real-time error tracking",
];

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "certified",
    question: `Is ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} certified for SOC 2, ISO 27001, or HIPAA today?`,
    answer:
      `We are intentionally precise here: ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} is built to be compliance-ready and our controls are mapped to these frameworks, but we do not claim active certifications we have not yet completed. SOC 2 Type II, ISO 27001, and full HIPAA safeguards (including a BAA) are in progress on our roadmap. GDPR practices are already part of how we handle personal data.`,
  },
  {
    id: "encryption",
    question: "How is my data encrypted?",
    answer:
      "Data is encrypted in transit with TLS 1.3 and at rest with AES-256. Encryption keys are managed through secure, HSM-backed key management, and administrative access is restricted with IP allow-listing and role-based access control.",
  },
  {
    id: "stack",
    question: `What does ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} run on?`,
    answer:
      "The product is built on Next.js with a Gemini-backed AI gateway in our engines/ai layer. AI-assisted features call our models through this controlled gateway rather than exposing model access directly, so requests stay authenticated, rate-limited, and auditable.",
  },
  {
    id: "performance",
    question: "Are the performance numbers guarantees?",
    answer:
      "They are targets, not contractual guarantees. We hold ourselves to these thresholds for paint, interactivity, API latency, and AI processing, and we monitor them continuously so we can catch and fix regressions quickly.",
  },
];

import { FaqJsonLd } from "@/components/SchemaOrg";

/* -------------------------------------------------------------------------- */

export default function SecurityPage() {
  return (
    <>
      <FaqJsonLd
        entries={FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <SecurityHero
        titleLead="Security built in,"
        titleHighlight="claims kept"
        titleTail="honest"
        subtitle={`${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} protects your career and learning data with a layered security model, a transparent compliance posture, and performance targets we measure ourselves against - no overstated badges, just the practices behind them.`}
        primaryCta={{ label: "Talk to us about security", href: "/contact" }}
        secondaryCta={{ label: "See how it works", href: "/how-it-works" }}
        badges={[
          { icon: "lock", label: "TLS 1.3 + AES-256" },
          { icon: "shield-check", label: "Defense in depth" },
          { icon: "eye-off", label: "Data minimization" },
          { icon: "activity", label: "Continuous monitoring" },
        ]}
      />

      {/* Performance targets as an animated count-up band. */}
      <SecurityStats
        heading="Fast is a feature - and a target"
        subtitle="A secure product still has to feel instant. These are figures we design and monitor against - targets, not guarantees."
        stats={PERF_STATS}
        note="We describe our posture as compliance-ready and in progress rather than overstating certifications - where a framework is fully reflected in how we operate today, we say so; where it's on our roadmap, we say that too."
      />

      {/* Defense-in-depth layers as an asymmetric Bento of spotlight cards. */}
      <SecurityLayers
        heading="A layered security model"
        subtitle="Security is enforced at every layer - from the edge of the network, through the application, down to the data itself."
        layers={LAYERS}
      />

      {/* Dense, tabbed control deep-dive (HeroUI Tabs). */}
      <SecurityDeepDive
        heading="Every layer, control by control"
        subtitle="Switch between the network, application, and data layers to see the concrete controls behind each one."
        tabs={DEEP_DIVE}
      />

      {/* Data lifecycle / threat-response timeline. */}
      <SecurityLifecycle
        heading="What happens to a request, end to end"
        subtitle="From the moment data leaves your device to the moment we respond to an anomaly - every stage is accounted for."
        steps={LIFECYCLE}
      />

      {/* Security practices as a 3D-tilt grid. */}
      <SecurityPractices
        heading="How we operate, day to day"
        subtitle="The principles that shape every feature we ship."
        practices={PRACTICES}
      />

      {/* Compliance posture cards + procurement callout. */}
      <SecurityCompliance
        heading="Where we stand on the frameworks"
        subtitle={`Each framework below shows what it covers and exactly where ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} sits today - stated plainly.`}
        items={COMPLIANCE}
        callout={{
          body:
            "Working through a procurement or vendor-security review? Reach out and we'll share our current documentation and walk you through the controls behind each framework.",
          cta: { label: "Request security docs", href: "/contact" },
        }}
      />

      {/* Detailed speed targets + monitoring split panel. */}
      <SecurityPerformance
        heading="The thresholds we hold ourselves to"
        subtitle="A secure product still has to feel instant. These are the thresholds we design and monitor against. They are targets, not guarantees."
        targets={PERF_TARGETS}
        monitoring={MONITORING}
      />

      <SecurityFAQ
        heading="Security questions, answered straight"
        subtitle="No hedging, no overstated badges - here's exactly where we stand."
        items={FAQ_ITEMS}
      />

      <CTA
        headline="Security questions before you commit?"
        body="Tell us about your requirements and we'll walk you through our controls, documentation, and roadmap."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Compare plans", href: "/pricing" }}
      />
    </>
  );
}
