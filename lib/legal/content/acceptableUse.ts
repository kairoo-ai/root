import type { LegalConfig } from "@/lib/legal/config";

export const acceptableUse = (c: LegalConfig) => `
This Acceptable Use Policy applies to everyone using ${c.productName}.

## You may not
- Use the service for unlawful, harmful, deceptive, or infringing purposes.
- Submit content that is illegal, hateful, harassing, or violates others' rights.
- Attempt to generate disallowed content or misuse the AI features.
- Reverse-engineer, scrape, overload, or circumvent security or rate limits.
- Resell or share access in violation of your plan.

## Enforcement
We may remove content and suspend or terminate accounts that violate this policy. Report
abuse to **${c.contactEmail}**.
`;
