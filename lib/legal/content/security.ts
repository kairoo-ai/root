import type { LegalConfig } from "@/lib/legal/config";

export const security = (c: LegalConfig) => `
We take security seriously at ${c.productName}.

## Practices
- Encryption in transit (HTTPS/TLS).
- Access controls and least-privilege for internal systems.
- Vetted infrastructure and AI sub-processors (see [Sub-processors](/sub-processors)).
- Ongoing improvement of our security posture as we grow.

## Reporting
To report a vulnerability or security concern, contact **${c.contactEmail}**.

_This overview will expand with formal certifications and controls as the product matures._
`;
