import type { LegalConfig } from "@/lib/legal/config";

export const terms = (c: LegalConfig) => `
These Terms govern your use of ${c.productName}, operated by ${c.legalEntity}. By using the
service you agree to them. They are governed by the laws of ${c.jurisdiction}.

## Your account
You must provide accurate information, keep your credentials secure, and are responsible for
activity under your account. You must be at least 16 years old.

## Acceptable use
Your use must follow our [Acceptable Use Policy](/acceptable-use).

## Plans & billing
${c.productName} offers a **Free** tier, a paid **Pro** tier, and **Enterprise/Team** plans.
Paid plans are billed in advance and renew automatically until cancelled; you can cancel
anytime, effective at the end of the current billing period. Fees are non-refundable except
where required by law.

## AI-generated content — no guarantees
${c.productName} uses AI to generate career guidance, learning suggestions, and similar
output. **This output may be inaccurate or incomplete and is not professional, legal,
financial, or career advice.** You are responsible for how you use it; we do not guarantee
any outcome (e.g., a job, raise, or result). See our [AI Disclosure](/ai-disclosure).

## Intellectual property
We own the service and its content (excluding your inputs). You retain rights to content you
submit and grant us a license to process it to provide the service.

## Termination
You may stop using the service anytime. We may suspend or terminate access for breach of
these Terms or the Acceptable Use Policy.

## Disclaimers & limitation of liability
The service is provided "as is" without warranties. To the maximum extent permitted by law,
${c.legalEntity} is not liable for indirect, incidental, or consequential damages, and our
total liability is limited to the amount you paid in the 12 months before the claim.

## Changes
We may update these Terms; continued use after changes means you accept them.

## Contact
**${c.contactEmail}**.
`;
