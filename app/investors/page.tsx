import Link from "next/link";

export const metadata = { title: "Investors" };

const sections = [
  {
    href: "/investors/strategy",
    title: "Business Strategy",
    description: "Vision, business model, go-to-market, and the path to scale.",
  },
  {
    href: "/investors/market",
    title: "Market Analysis",
    description: "Market size, segmentation, competitive landscape, and trends.",
  },
  {
    href: "/investors/deck",
    title: "Investor Deck",
    description: "The full investor presentation and supporting resources.",
  },
  {
    href: "/investors/architecture",
    title: "Technical Architecture",
    description: "System design, platform stack, and engineering approach.",
  },
];

export default function InvestorsPage() {
  return (
    <>
      <main className="container mx-auto px-6 pt-32 pb-24">
        <header className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Investors</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to understand Kairoo as an investment opportunity.
          </p>
        </header>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <li key={section.href}>
              <Link
                href={section.href}
                className="block h-full rounded-2xl border border-border bg-card p-6 text-card-foreground transition-colors hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
