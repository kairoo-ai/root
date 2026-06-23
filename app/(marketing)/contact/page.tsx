import type { Metadata } from "next";

import { site } from "@/config/site";
import { routes } from "@/config/routes";
import type { FAQItem } from "@/types";

import ContactVisuals, {
  type ContactChannel,
} from "./ContactVisuals";

const contactTitle = `Contact ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} - Talk to us or book a demo`;
const contactDesc =
  `Get in touch with the ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} team. Send a message, book a product demo, reach support, or connect with investor relations.`;

export const metadata: Metadata = {
  title: contactTitle,
  description: contactDesc,
  alternates: { canonical: "/contact" },
  openGraph: { title: contactTitle, description: contactDesc, url: "/contact" },
  twitter: { card: "summary_large_image", title: contactTitle, description: contactDesc },
};

/**
 * Contact + demo page. Public-safe per CONTENT-MAP §6 (honest-public): no
 * fabricated metrics. Relocates the `/contact` IA unit (CONTENT-MAP §2/§3 -
 * "Contact + demo scheduling"). Support email + investor relations link are
 * sourced from @/config/site so they stay in sync.
 *
 * RSC-safe: this stays a Server Component (owns `metadata` + serializable data).
 * All animation/interactivity lives in the sibling `ContactVisuals` client
 * component; icons cross the boundary as NAME strings via IconRenderer.
 */

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "demo",
    question: "What happens after I request a demo?",
    answer:
      `We'll reply by email to find a time that works, then walk you through ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}'s career toolkit, learning paths, and team analytics - focused on your goals and team size.`,
  },
  {
    id: "trial",
    question: `Do I need to talk to anyone to try ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}?`,
    answer:
      "No. The Free plan lets you start on your own with one active career path and weekly AI check-ins. Reach out here when you want a guided tour or are evaluating Pro or Enterprise.",
  },
  {
    id: "support",
    question: "I'm an existing user with a question - where do I go?",
    answer: `Email our support team at ${site.supportEmail} and we'll help you out. This form works too; it just routes to the same place.`,
  },
  {
    id: "investors",
    question: "I'm an investor or partner. Who should I contact?",
    answer: `For investor relations and partnership inquiries, email ${site.investorEmail} or visit the investor relations hub linked on this page.`,
  },
];

const CHANNELS: ContactChannel[] = [
  {
    icon: "message-square",
    title: "Support",
    body: `Already using ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}? We're here to help - reach our support team directly.`,
    href: `mailto:${site.supportEmail}`,
    linkLabel: site.supportEmail,
  },
  {
    icon: "calendar-clock",
    title: "Book a demo",
    body: "Use the form and mention your team size - we'll set up a guided walkthrough tailored to your goals.",
  },
  {
    icon: "briefcase",
    badge: "Investors",
    title: "Investor relations",
    body: "Exploring an investment or partnership? Reach our IR team or review the investor materials.",
    href: routes.investors,
    linkLabel: "Visit investor relations",
    internal: true,
  },
];

export default function ContactPage() {
  return (
    <ContactVisuals
      supportEmail={site.supportEmail}
      investorEmail={site.investorEmail}
      investorsRoute={routes.investors}
      pricingRoute={routes.pricing}
      featuresRoute={routes.features}
      channels={CHANNELS}
      faq={FAQ_ITEMS}
    />
  );
}
