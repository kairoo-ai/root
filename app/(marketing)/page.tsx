import type { Metadata } from "next";

import {
  HomeHero,
  HomePillars,
  HomeFeaturedTools,
  HomeWorkflow,
  HomeSocialProof,
  HomePricingTeaser,
  HomeClosingCTA,
} from "./HomeSections";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} - Your AI-Powered Career & Learning Command Center`,
  description:
    `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} merges 32+ AI-powered career tools, intelligent learning paths, and strategic business intelligence into one platform. Personalized roadmaps, interview coaching, salary negotiation, and enterprise team analytics - accelerate professional growth in one place.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} - Your AI-Powered Career & Learning Command Center`,
    description:
      "32+ AI tools for career, learning, and strategy. Personalized, contextual, and ready when you are.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomePillars />
      <HomeFeaturedTools />
      <HomeWorkflow />
      <HomeSocialProof />
      <HomePricingTeaser />
      <HomeClosingCTA />
    </>
  );
}
