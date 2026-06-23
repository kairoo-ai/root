import type { Metadata } from "next";

import { tiers } from "@/config/tiers";
import type { FAQItem } from "@/types";

import PricingVisuals, {
  type PricingObjection,
} from "./PricingVisuals";

const pricingTitle = `Pricing - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`;
const pricingDesc =
  "Simple, transparent pricing for your AI career copilot. Start free, upgrade to Pro for unlimited paths and daily coaching, or talk to us about Enterprise. No card required to begin.";

export const metadata: Metadata = {
  title: pricingTitle,
  description: pricingDesc,
  alternates: { canonical: "/pricing" },
  openGraph: { title: pricingTitle, description: pricingDesc, url: "/pricing" },
  twitter: { card: "summary_large_image", title: pricingTitle, description: pricingDesc },
};

/**
 * Objection-handling trio - surfaced under the plans so the three most common
 * pre-purchase hesitations are answered before the FAQ. Icons are passed as
 * NAME strings (resolved via @/components/IconRenderer inside the client
 * visuals) to keep this file a clean RSC boundary. Copy is honest/defensible:
 * it reflects the real free tier and product setup.
 */
const objections: readonly PricingObjection[] = [
  {
    icon: "shield-check",
    title: "No-risk trial",
    body: "Start on the free Explorer plan with no credit card. Pro includes a free trial, and you can downgrade or cancel anytime - keep full access to your free plan.",
  },
  {
    icon: "clock",
    title: "Quick setup",
    body: `Get to your first AI career check-in in under five minutes. Tell ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} your goals and your copilot maps an actionable path - no lengthy onboarding or imports required.`,
  },
  {
    icon: "headset",
    title: "Expert support",
    body: "Every plan includes community access and guided help. Pro adds priority support, and Enterprise comes with a dedicated success manager to onboard your team.",
  },
] as const;

const pricingFaq: FAQItem[] = [
  {
    id: "free-plan",
    question: "Is the free plan really free?",
    answer:
      "Yes. The Explorer plan is $0 forever and needs no credit card. It includes one active career path, weekly AI check-ins, and community access - enough to experience your AI copilot before deciding to upgrade.",
  },
  {
    id: "free-vs-pro",
    question: "What's the difference between Free and Pro?",
    answer:
      "Explorer (free) gives you a single active career path with weekly AI check-ins. Pro unlocks unlimited career paths, daily AI coaching, skill-gap analysis, and priority support - designed for people actively driving a transition or promotion.",
  },
  {
    id: "billing",
    question: "How does Pro billing work?",
    answer:
      "Pro is billed monthly at the price shown above. You can start with a free trial, and upgrade, downgrade, or cancel at any time. If you cancel, you keep access to the free Explorer plan.",
  },
  {
    id: "enterprise",
    question: "What's included in Enterprise?",
    answer:
      "Enterprise includes everything in Pro plus team dashboards, SSO and audit logs, and a dedicated success manager. Pricing is custom and based on team size and rollout needs - contact sales to scope a plan for your organization.",
  },
  {
    id: "switch-plans",
    question: "Can I change plans later?",
    answer:
      "Anytime. Upgrade to unlock more capability the moment you need it, or move back down without losing your account. Your career paths and history stay with you across plan changes.",
  },
  {
    id: "data",
    question: "Is my data private and secure?",
    answer:
      "Your career data is handled with privacy in mind, encrypted in transit, and never sold. We are building toward independent security and privacy attestations and design our practices to be SOC 2 and GDPR compliance-ready.",
  },
];

import { FaqJsonLd, ProductJsonLd } from "@/components/SchemaOrg";
import { JsonLd } from "@/components/jsonld";
import { site } from "@/config/site";

export default function PricingPage() {
  return (
    <>
      <FaqJsonLd
        entries={pricingFaq.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <ProductJsonLd name="Explorer" description="Free forever plan with 1 active career path" price={0} />
      <ProductJsonLd name="Pro" description="Unlimited career paths, daily AI coaching, skill gap analysis" price={19} />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Kairoo Enterprise",
          description: "Everything in Pro plus team dashboards, SSO & audit logs, dedicated success manager",
          url: `${site.baseUrl}/pricing`,
        }}
      />
      <PricingVisuals tiers={tiers} objections={objections} faq={pricingFaq} />
    </>
  );
}
