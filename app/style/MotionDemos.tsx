"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import AuroraBackground from "@/components/motion/AuroraBackground";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/motion/ThreeDCard";

export function MotionDemos() {
  return (
    <>
      <p className="text-body text-muted-foreground">
        New component states, plus Aceternity motion primitives — all token-only.
      </p>

      <div className="space-y-3">
        <h3 className="text-h5 text-muted-foreground">AuroraBackground</h3>
        <div className="relative h-56 overflow-hidden rounded-xl border border-border bg-background">
          <AuroraBackground intensity="vivid" className="absolute! z-0!" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <span className="text-body text-foreground">Aurora preview (vivid)</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-h5 text-muted-foreground">Button — new states</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href="#">As link (asChild)</a>
          </Button>
          <Button isLoading>Loading</Button>
          <Button variant="secondary" isLoading>Saving…</Button>
          <Button size="icon" aria-label="Add">+</Button>
          <Button size="icon" variant="outline" aria-label="Search">⌕</Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-h5 text-muted-foreground">Card — interactive &amp; glass</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card variant="interactive" className="p-4">
            <div className="text-foreground">Interactive</div>
            <div className="text-caption text-muted-foreground">Hover to lift</div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="text-foreground">Glass</div>
            <div className="text-caption text-muted-foreground">Backdrop blur</div>
          </Card>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-h5 text-muted-foreground">Input — sizes</h3>
        <div className="grid max-w-md gap-3">
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium (default)" />
          <Input size="lg" placeholder="Large" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-h5 text-muted-foreground">Badge — sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm" variant="info">Small</Badge>
          <Badge size="md" variant="info">Medium</Badge>
          <Badge size="sm" variant="success">Small</Badge>
          <Badge size="md" variant="success">Medium</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-h5 text-muted-foreground">Spotlight (Aceternity)</h3>
        <div className="relative h-56 overflow-hidden rounded-xl border border-border bg-background">
          <Spotlight className="-top-20 left-0 md:left-32" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <span className="text-body text-foreground">Spotlight preview</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-h5 text-muted-foreground">3D Card (Aceternity)</h3>
        <CardContainer containerClassName="!py-6">
          <CardBody className="relative h-auto w-80 rounded-xl border border-border bg-card p-6">
            <CardItem translateZ={50} className="text-h5 text-foreground">
              Tilt on hover
            </CardItem>
            <CardItem
              as="p"
              translateZ={30}
              className="mt-2 text-body-sm text-muted-foreground"
            >
              A perspective card whose layers lift toward the cursor.
            </CardItem>
            <CardItem translateZ={60} className="mt-4">
              <Button size="sm">Action</Button>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </>
  );
}
