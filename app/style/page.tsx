import type { Metadata } from "next";
import { ramps } from "@/lib/design/tokens/colors";
import { typeScale } from "@/lib/design/tokens/typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierBadge } from "@/components/ui/TierBadge";

export const metadata: Metadata = { title: "Kairoo — Style reference", robots: { index: false } };

const STEPS = ["50","100","200","300","400","500","600","700","800","900","950"] as const;

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
    </main>
  );
}
