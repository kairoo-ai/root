import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { subProcessors } from "@/lib/legal/content/subProcessors";

export const metadata: Metadata = { title: "Sub-processors — Kairoo" };

export default function SubProcessorsPage() {
  return <LegalLayout title="Sub-processors" body={subProcessors(legal)} />;
}
