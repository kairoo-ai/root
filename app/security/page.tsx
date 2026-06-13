import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { security } from "@/lib/legal/content/security";

export const metadata: Metadata = { title: "Security — Kairoo" };

export default function SecurityPage() {
  return <LegalLayout title="Security" body={security(legal)} />;
}
