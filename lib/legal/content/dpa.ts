import type { LegalConfig } from "@/lib/legal/config";

export const dpa = (c: LegalConfig) => `
This Data Processing Agreement (DPA) applies where ${c.legalEntity} processes personal data
on behalf of a business customer (controller) under GDPR Article 28 and similar laws.

## Summary
- **Roles:** customer is controller; ${c.productName} is processor.
- **Scope:** processing is limited to providing the service.
- **Sub-processors:** listed at [Sub-processors](/sub-processors); we notify of changes.
- **Security:** see [Security](/security).
- **International transfers:** under appropriate safeguards (e.g., SCCs) where applicable.
- **Sub-processor obligations, audit rights, and breach notification** will be addressed in the full DPA, available on request.

A signable DPA is **available on request** — contact **${c.contactEmail}**. (Full executable
version pending finalization.)
`;
