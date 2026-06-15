import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { terms } from "@/lib/legal/content/terms";

export const metadata: Metadata = { title: `Terms of Service - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}` };

export default function TermsPage() {
  return <LegalLayout title="Terms of Service" body={terms(legal)} />;
}
