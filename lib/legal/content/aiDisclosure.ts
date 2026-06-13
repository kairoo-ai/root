import type { LegalConfig } from "@/lib/legal/config";

export const aiDisclosure = (c: LegalConfig) => `
${c.productName} uses artificial intelligence to assist your career development.

## How it works
Features like coaching, interview prep, and learning suggestions generate responses using an
AI model. The content you submit is processed by our AI provider, **Google (Gemini API)**, to
produce output.

## Important limitations
- AI output **can be inaccurate, outdated, or incomplete**, and may not fit your situation.
- It is **not professional, legal, financial, medical, or career advice**.
- We do **not guarantee outcomes** (such as employment or compensation).
- Always review AI output and apply your own judgment; keep a human in the loop for decisions.

## Your data & AI
Do not submit sensitive information you would not want processed by a third-party AI service.
See our [Privacy Policy](/privacy) and [Sub-processors](/sub-processors).

## Contact
**${c.contactEmail}**.
`;
