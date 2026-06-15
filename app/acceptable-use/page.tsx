import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { acceptableUse } from "@/lib/legal/content/acceptableUse";

export const metadata: Metadata = { title: `Acceptable Use Policy - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}` };

export default function AcceptableUsePage() {
  return <LegalLayout title="Acceptable Use Policy" body={acceptableUse(legal)} />;
}
