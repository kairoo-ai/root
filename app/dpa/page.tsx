import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { dpa } from "@/lib/legal/content/dpa";

export const metadata: Metadata = { title: "Data Processing Agreement — Kairoo" };

export default function DpaPage() {
  return <LegalLayout title="Data Processing Agreement" body={dpa(legal)} />;
}
