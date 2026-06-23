import { site } from "@/config/site";

const base = site.baseUrl.replace(/\/$/, "");

export async function GET() {
  const content = `# ${site.name} - AI Career Development Platform
> ${site.name} merges 38+ AI-powered career tools, intelligent learning paths, and strategic business intelligence into one platform.

## Docs
- Features & Tools: ${base}/features
- How It Works: ${base}/how-it-works
- Pricing: ${base}/pricing
- Security & Trust: ${base}/security
- About: ${base}/about

## Key Facts
- 38+ AI career tools (roadmaps, interview coach, salary coach, etc.)
- Intelligent learning paths with AI tutor
- Team analytics and enterprise skill matrix
- Free Explorer plan, Pro at $19/mo, Enterprise custom
- Built on Next.js with Gemini AI engine
- SOC 2 and GDPR compliance-ready

## Contact
- Support: ${site.supportEmail}
- Investors: ${site.investorEmail}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
