export async function GET() {
  const content = `# Kairoo - AI Career Development Platform
> Kairoo merges 38+ AI-powered career tools, intelligent learning paths, and strategic business intelligence into one platform.

## Docs
- Features & Tools: https://kairoo.com/features
- How It Works: https://kairoo.com/how-it-works
- Pricing: https://kairoo.com/pricing
- Security & Trust: https://kairoo.com/security
- About: https://kairoo.com/about

## Key Facts
- 38+ AI career tools (roadmaps, interview coach, salary coach, etc.)
- Intelligent learning paths with AI tutor
- Team analytics and enterprise skill matrix
- Free Explorer plan, Pro at $19/mo, Enterprise custom
- Built on Next.js with Gemini AI engine
- SOC 2 and GDPR compliance-ready

## Contact
- Support: support@kairoo.com
- Investors: investors@kairoo.com
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
