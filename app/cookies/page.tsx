import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { cookies } from "@/lib/legal/content/cookies";

export const metadata: Metadata = { title: `Cookie Policy - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}` };

export default function CookiesPage() {
  return <LegalLayout title="Cookie Policy" body={cookies(legal)} />;
}
