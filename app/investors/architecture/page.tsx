import type { Metadata } from 'next';
import { ArchitectureContent } from './ArchitectureContent';

const archTitle = `Technical Architecture - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} v2.0`;
const archDesc =
  `The ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} v2.0 technical blueprint: Sense → Think → Act orchestration, layered system architecture, full tech stack, data/API contracts, caching, performance targets, security & compliance, scalability, and the technical roadmap.`;

export const metadata: Metadata = {
  title: archTitle,
  description: archDesc,
  alternates: { canonical: "/investors/architecture" },
  robots: { index: false, follow: false },
  openGraph: { title: archTitle, description: archDesc, url: "/investors/architecture" },
  twitter: { card: "summary_large_image", title: archTitle, description: archDesc },
};

export default function TechnicalArchitecturePage() {
  return <ArchitectureContent />;
}
