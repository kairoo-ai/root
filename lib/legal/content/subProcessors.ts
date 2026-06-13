import type { LegalConfig } from "@/lib/legal/config";

export const subProcessors = (c: LegalConfig) => `
${c.productName} uses the following sub-processors to provide the service. We update this list
when it changes.

| Sub-processor | Purpose | Region |
|---|---|---|
${c.subProcessors.map((s) => `| ${s.name} | ${s.purpose} | ${s.region} |`).join("\n")}

Questions: **${c.contactEmail}**.
`;
