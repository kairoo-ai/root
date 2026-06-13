import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { aiDisclosure } from "@/lib/legal/content/aiDisclosure";

export const metadata: Metadata = { title: "AI Disclosure — Kairoo" };

export default function AiDisclosurePage() {
  return <LegalLayout title="AI Disclosure" body={aiDisclosure(legal)} />;
}
