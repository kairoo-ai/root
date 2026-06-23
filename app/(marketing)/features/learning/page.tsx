import type { Metadata } from "next";

import { CTA } from "@/components/blocks/CTA";
import { features } from "@/engines/ai/features/registry";
import {
  LearningVisuals,
  type ToolCard,
  type ComingSoonCard,
} from "./LearningVisuals";

const learningTitle = `Intelligent Learning Paths - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`;
const learningDesc =
  "Curated AI learning paths, a 24/7 tutor, and project-based learning that turns any skill goal into a sequenced, hands-on curriculum.";

export const metadata: Metadata = {
  title: learningTitle,
  description: learningDesc,
  alternates: { canonical: "/features/learning" },
  openGraph: { title: learningTitle, description: learningDesc, url: "/features/learning" },
  twitter: { card: "summary_large_image", title: learningTitle, description: learningDesc },
};

// Single source of truth: the learning features come straight from the AI
// registry, so this page can never drift from what the engine actually offers.
const learning = features.filter((f) => f.category === "learning");

const ready = learning.filter((f) => f.status === "ready");
const comingSoon = learning.filter((f) => f.status === "coming-soon");

// Derive plain, serializable data for the client visuals layer. We pass only
// strings (icon NAMES, copy) across the server→client boundary - never icon
// component refs or functions - so this RSC page stays build-safe.
const readyItems: ToolCard[] = ready.map((f) => ({
  id: f.id,
  icon: f.icon,
  title: f.name,
  description: f.description,
}));

const comingSoonItems: ComingSoonCard[] = comingSoon.map((f) => ({
  id: f.id,
  icon: f.icon,
  name: f.name,
  description: f.description,
}));

export default function LearningFeaturesPage() {
  return (
    <>
      <LearningVisuals ready={readyItems} comingSoon={comingSoonItems} />

      <CTA
        headline="Pick a skill. Get a path."
        body="Start free with the Explorer plan and generate your first AI learning path in minutes - no credit card required."
        primary={{ label: "Get started free", href: "/sign-up" }}
        secondary={{ label: "Explore all features", href: "/features" }}
      />
    </>
  );
}
