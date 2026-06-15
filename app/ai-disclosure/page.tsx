import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { legal } from "@/lib/legal/config";
import { aiDisclosure } from "@/lib/legal/content/aiDisclosure";

export const metadata: Metadata = { title: `AI Disclosure - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}` };

export default function AiDisclosurePage() {
  return <LegalLayout title="AI Disclosure" body={aiDisclosure(legal)} />;
}
