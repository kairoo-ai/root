import type { Metadata } from "next";
import { DeckContent } from "./DeckContent";

const deckTitle = `Investor Deck - Series A | ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`;
const deckDesc =
  `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} Series A: \$2.5M raise over 24 months for 15–20% equity. The full pitch deck, 12-month forecast, financial projections, and 90-day MVP launch plan.`;

export const metadata: Metadata = {
  title: deckTitle,
  description: deckDesc,
  alternates: { canonical: "/investors/deck" },
  openGraph: { title: deckTitle, description: deckDesc, url: "/investors/deck" },
  twitter: { card: "summary_large_image", title: deckTitle, description: deckDesc },
};

export default function InvestorDeckPage() {
  return <DeckContent />;
}
