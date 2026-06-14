import type { Metadata } from "next";
import { ramps } from "@/lib/design/tokens/colors";
import { typeScale } from "@/lib/design/tokens/typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierBadge } from "@/components/ui/TierBadge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import { Kbd } from "@/components/ui/Kbd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import { PageHeader } from "@/components/layout/PageHeader";
import { Prose } from "@/components/layout/Prose";
import { Hero } from "@/components/blocks/Hero";
import { FeatureGrid } from "@/components/blocks/FeatureGrid";
import { BentoGrid } from "@/components/blocks/BentoGrid";
import { PricingTable } from "@/components/blocks/PricingTable";
import { StatGrid } from "@/components/blocks/StatCounter";
import { TestimonialGrid } from "@/components/blocks/Testimonial";
import { CTA } from "@/components/blocks/CTA";
import { FAQ } from "@/components/blocks/FAQ";
import { LogoMarquee } from "@/components/blocks/LogoMarquee";
import { tiers } from "@/config/tiers";
import type { Feature, Testimonial, FAQItem } from "@/types";
import { PaginationDemo } from "./PaginationDemo";
import { InteractiveDemos } from "./InteractiveDemos";

export const metadata: Metadata = { title: "Kairoo — Style reference", robots: { index: false } };

const STEPS = ["50","100","200","300","400","500","600","700","800","900","950"] as const;

const SAMPLE_FEATURES: Feature[] = [
  { id: "f1", icon: "compass", title: "Chart the path", description: "Turn ambiguous goals into a clear, sequenced route." },
  { id: "f2", icon: "code", title: "Build with intent", description: "Every milestone is scoped, measurable, and tied to outcomes." },
  { id: "f3", icon: "trending-up", title: "Track momentum", description: "See progress as it happens with signals that matter." },
];

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { id: "t1", quote: "Kairoo turned a vague ambition into a weekly plan I actually follow.", name: "Ada Lovelace", role: "Staff Engineer", company: "Analytical" },
  { id: "t2", quote: "The momentum tracking is the first tool that kept me honest about progress.", name: "Grace Hopper", role: "VP Engineering", company: "Compiler Co" },
];

const SAMPLE_FAQ: FAQItem[] = [
  { id: "q1", question: "What is Kairoo?", answer: "An AI career copilot that turns goals into a sequenced, trackable plan." },
  { id: "q2", question: "Can I cancel anytime?", answer: "Yes — plans are month-to-month and you can downgrade or cancel whenever you like." },
];

const SAMPLE_STATS = [
  { value: 12000, suffix: "+", label: "Paths charted" },
  { value: 94, suffix: "%", label: "Hit their milestone" },
  { value: 4.9, label: "Average rating" },
];

const SAMPLE_LOGOS = [
  { name: "Northwind" },
  { name: "Acme" },
  { name: "Globex" },
  { name: "Initech" },
];

export default function StylePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-12">
      <h1 className="text-h1 text-foreground">Kairoo Design System</h1>

      <section className="space-y-4">
        <h2 className="text-h3 text-foreground">Color ramps</h2>
        {Object.entries(ramps).map(([name, r]) => (
          <div key={name}>
            <div className="text-caption text-muted-foreground mb-1">{name}</div>
            <div className="flex gap-1">
              {STEPS.map((s) => (
                <div key={s} className="flex-1">
                  <div className="h-10 rounded" style={{ background: r[s] }} />
                  <div className="text-[10px] text-muted-foreground text-center mt-1">{s}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 text-foreground">Semantic</h2>
        <div className="flex flex-wrap gap-3">
          {["bg-primary text-primary-foreground","bg-secondary text-secondary-foreground","bg-muted-surface text-muted-foreground","bg-accent text-accent-foreground","bg-accent-subtle text-accent-subtle-foreground","bg-destructive text-destructive-foreground"].map((c) => (
            <div key={c} className={`rounded-lg px-4 py-3 text-sm ${c}`}>{c.split(" ")[0]}</div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-h3 text-foreground">Type scale</h2>
        {Object.keys(typeScale).map((t) => (
          <div key={t} className={`text-${t} text-foreground`}>{t} — The right moment to grow</div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-foreground">Primitives</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <TierBadge tier="free" />
          <TierBadge tier="pro" />
          <TierBadge tier="enterprise" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4"><div className="text-foreground">Default</div></Card>
          <Card variant="glass" className="p-4"><div className="text-foreground">Glass</div></Card>
          <Card variant="elevated" className="p-4"><div className="text-foreground">Elevated</div></Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-foreground">Forms</h2>
        <div className="grid max-w-md gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="field-name" required>Name</Label>
            <Input id="field-name" placeholder="Ada Lovelace" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="field-email">Email (invalid)</Label>
            <Input id="field-email" type="email" defaultValue="not-an-email" invalid />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="field-note">Note</Label>
            <Textarea id="field-note" placeholder="A few words…" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Progress (60%)</Label>
          <Progress value={60} />
        </div>
        <PaginationDemo />
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-foreground">Feedback</h2>
        <div className="space-y-3">
          <Alert variant="neutral">
            <AlertTitle>Neutral</AlertTitle>
            <AlertDescription>A neutral, informational message.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>Something worth noting.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes were saved.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Double-check before continuing.</AlertDescription>
          </Alert>
          <Alert variant="error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
        </div>
        <div className="flex items-center gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Avatar size="sm" initials="AP" />
          <Avatar size="md" initials="KR" />
          <Avatar size="lg" initials="OO" />
        </div>
        <Separator />
        <div className="flex items-center gap-2 text-body text-foreground">
          Press <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to search
        </div>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Style", href: "/style" },
            { label: "Feedback" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-foreground">Layout</h2>
        <Section className="rounded-xl border border-border bg-muted-surface py-8">
          <Container>
            <Stack gap={6}>
              <PageHeader
                eyebrow="Eyebrow"
                title="Page header"
                subtitle="A concise subtitle that explains the purpose of the section below."
              />
              <Grid cols={3} gap="md">
                <Card className="p-4"><div className="text-foreground">Card one</div></Card>
                <Card className="p-4"><div className="text-foreground">Card two</div></Card>
                <Card className="p-4"><div className="text-foreground">Card three</div></Card>
              </Grid>
              <Prose>
                <h3>Prose</h3>
                <p>
                  This is a short prose block. It renders long-form copy with sensible
                  vertical rhythm, links, and emphasis using only design tokens.
                </p>
              </Prose>
            </Stack>
          </Container>
        </Section>
      </section>

      <section className="space-y-6">
        <h2 className="text-h3 text-foreground">Interactive (HeroUI v3)</h2>
        <p className="text-body text-muted-foreground">
          Live wrappers from <code>@/components/ui</code>, rendered on HeroUI&apos;s
          themed defaults (token-only). All requested primitives resolved during
          stabilization — none were skipped.
        </p>
        <InteractiveDemos />
      </section>

      <section className="space-y-10">
        <h2 className="text-h3 text-foreground">Blocks</h2>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">Hero</h3>
          <Hero
            eyebrow="The right moment"
            title="Grow on your own timeline"
            subtitle="A compact hero showcasing the marketing block with token-only styling."
            primaryCta={{ label: "Get started", href: "#" }}
            secondaryCta={{ label: "Learn more", href: "#" }}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">FeatureGrid</h3>
          <FeatureGrid items={SAMPLE_FEATURES} />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">BentoGrid</h3>
          <BentoGrid asSection={false} />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">PricingTable</h3>
          <PricingTable tiers={tiers} />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">StatGrid</h3>
          <StatGrid items={SAMPLE_STATS} cols={3} />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">TestimonialGrid</h3>
          <TestimonialGrid items={SAMPLE_TESTIMONIALS} cols={2} withSection={false} />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">CTA</h3>
          <CTA
            headline="Ready when you are"
            body="Start free and upgrade when the moment is right."
            primary={{ label: "Get started", href: "#" }}
            secondary={{ label: "Talk to us", href: "#" }}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">FAQ</h3>
          <FAQ items={SAMPLE_FAQ} section={false} />
        </div>

        <div className="space-y-3">
          <h3 className="text-h5 text-muted-foreground">LogoMarquee</h3>
          <LogoMarquee items={SAMPLE_LOGOS} />
        </div>
      </section>
    </main>
  );
}
