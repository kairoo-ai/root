import { site } from "@/config/site";

export async function GET() {
  const content = `/* TEAM */
  Founder & CEO: TODO
  CTO: TODO
  Design: TODO

/* SITE */
  Language: TypeScript, Next.js 16, Tailwind CSS
  Engine: Gemini AI
  Database: Neon PostgreSQL (Drizzle ORM)
  Hosting: Vercel

/* THANKS */
  Thanks to all our early users and contributors.
  Built with care by the Kairoo team.

/* CONTACT */
  GitHub: https://github.com/kairoo
  LinkedIn: https://linkedin.com/company/kairoo
  Email: hello@${site.baseUrl.replace(/^https?:\/\//, "")}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
