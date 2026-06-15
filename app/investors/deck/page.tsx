import type { Metadata } from "next";
import { DeckContent } from "./DeckContent";

export const metadata: Metadata = {
  title: `Investor Deck - Series A | ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description:
    `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} Series A: \$2.5M raise over 24 months for 15–20% equity. The full pitch deck, 12-month forecast, financial projections, and 90-day MVP launch plan.`,
};

export default function InvestorDeckPage() {
  return <DeckContent />;
}
