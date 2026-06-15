import type { Metadata } from 'next';
import { ArchitectureContent } from './ArchitectureContent';

export const metadata: Metadata = {
  title: `Technical Architecture - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} v2.0`,
  description:
    `The ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} v2.0 technical blueprint: Sense → Think → Act orchestration, layered system architecture, full tech stack, data/API contracts, caching, performance targets, security & compliance, scalability, and the technical roadmap.`,
  robots: { index: false },
};

export default function TechnicalArchitecturePage() {
  return <ArchitectureContent />;
}
