'use client';

import { type ReactNode, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import {
  Activity,
  Brain,
  CheckCircle2,
  Circle,
  Cloud,
  Cpu,
  Database,
  Globe,
  Layers,
  type LucideIcon,
  Monitor,
  SatelliteDish,
  Server,
  Shield,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Grid } from '@/components/layout/Grid';
import { Stack } from '@/components/layout/Stack';
import { Prose } from '@/components/layout/Prose';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Tabs } from '@/components/ui/Tabs';
import { Hero } from '@/components/blocks/Hero';
import { StatGrid } from '@/components/blocks/StatCounter';
import { CTA } from '@/components/blocks/CTA';
import { CardSpotlight } from '@/components/blocks/CardSpotlight';
import AuroraBackground from '@/components/motion/AuroraBackground';

/* ---------------------------------------------------------------------------
 * Motion helpers — all respect prefers-reduced-motion.
 * ------------------------------------------------------------------------- */
const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Section heading with eyebrow + optional "blueprint" framing badge. */
function SectionHeading({
  eyebrow,
  title,
  intro,
  blueprint,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  blueprint?: boolean;
}) {
  return (
    <Reveal>
      <Stack gap={4} className="mb-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-overline text-primary">{eyebrow}</p>
          {blueprint ? (
            <Badge variant="info" size="sm">
              Blueprint · vision
            </Badge>
          ) : null}
        </div>
        <h2 className="text-h2 text-foreground">{title}</h2>
        {intro ? <p className="text-body-lg text-muted-foreground">{intro}</p> : null}
      </Stack>
    </Reveal>
  );
}

/* A token-skinned code block. */
function CodeBlock({ title, lang, code }: { title: string; lang: string; code: string }) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted-surface px-4 py-2.5">
        <span className="text-caption font-medium text-foreground">{title}</span>
        <Badge variant="neutral" size="sm" className="font-mono uppercase tracking-wider">
          {lang}
        </Badge>
      </div>
      <pre className="overflow-x-auto bg-card p-4 text-body-sm leading-relaxed">
        <code className="font-mono text-muted-foreground">{code}</code>
      </pre>
    </Card>
  );
}

/* Small icon medallion using accent token surface. */
function IconBadge({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-subtle text-accent-subtle-foreground">
      <Icon className="size-6" aria-hidden />
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */
const HERO_STATS = [
  { value: 35, suffix: 'k/min', label: 'Real-time AI jobs · Gemini + GPT orchestration' },
  { value: 12, suffix: ' regions', label: 'Infra coverage · active-active global mesh' },
  { value: 2.4, suffix: 'M/day', label: 'Automations · sense → reason → act loop' },
];

const STORY_BEATS: {
  title: string;
  Icon: LucideIcon;
  description: string;
  details: string[];
}[] = [
  {
    title: 'Signal Ingestion Mesh',
    Icon: SatelliteDish,
    description:
      'Streams telemetry from resumes, job boards, HRIS, and user interactions through an event backbone with schema evolution and PII classifiers.',
    details: ['Kafka + Redpanda backbone', 'Edge sanitization', 'Latency budget < 80ms'],
  },
  {
    title: 'Reasoning Fabric',
    Icon: Brain,
    description:
      'Orchestrates Gemini, GPT-4.1, and in-house models through a policy-aware router that selects optimal context, temperature, and cost envelope per task.',
    details: ['Declarative prompt registry', 'Safety rails + audit log', 'Memory graph sync every 5 min'],
  },
  {
    title: 'Action Layer',
    Icon: Workflow,
    description:
      'Automates follow-ups, learning plan updates, and executive dashboards with approval checkpoints and human-in-the-loop overrides.',
    details: ['Service mesh w/ retries', 'Fine-grained RBAC', 'Composable playbooks'],
  },
  {
    title: 'Continuous Intelligence Loop',
    Icon: Activity,
    description:
      'Feedback signals retrain ranking models nightly while anomaly detectors surface drift and bias directly into observability boards.',
    details: ['Realtime feature store', 'Model drift monitors', 'Explainability snapshots'],
  },
];

const FLOW_STAGES: { title: string; Icon: LucideIcon; bullets: string[] }[] = [
  {
    title: 'Sense',
    Icon: SatelliteDish,
    bullets: ['API + webhook ingestion', 'Streaming ETL + enrichment', 'Edge privacy screening'],
  },
  {
    title: 'Think',
    Icon: Brain,
    bullets: ['Model router + context store', 'Toolformer-style planning', 'Evaluator ensemble'],
  },
  {
    title: 'Act',
    Icon: Workflow,
    bullets: ['Automation graph', 'Human approvals', 'Telemetry + learning artifacts'],
  },
];

const FLOW_NODES: { title: string; Icon: LucideIcon; items: string[] }[] = [
  {
    title: 'Experience Layer',
    Icon: Monitor,
    items: ['Next.js App Router UI', 'Adaptive theming + experiments', 'Offline-first surfaces'],
  },
  {
    title: 'Intelligence Layer',
    Icon: Brain,
    items: ['Hybrid RAG engine', 'Vector + relational fusion', 'Knowledge graph updates'],
  },
  {
    title: 'Infrastructure Layer',
    Icon: Cloud,
    items: ['Kubernetes + Wasm pods', 'Service mesh (Linkerd)', 'Observability via OpenTelemetry'],
  },
  {
    title: 'Trust Layer',
    Icon: Shield,
    items: ['Zero-trust IAM', 'Secrets lattice (Vault)', 'Compliance automation'],
  },
];

const SYSTEM_NODES: { title: string; sub: string; Icon: LucideIcon }[] = [
  { title: 'Frontend Layer', sub: 'Next.js 15 + TypeScript', Icon: Monitor },
  { title: 'API Gateway', sub: 'Nginx + Load Balancer', Icon: Server },
  { title: 'AI Service', sub: 'Python + FastAPI', Icon: Cpu },
];

const ARCH_LAYERS: { title: string; Icon: LucideIcon; items: { name: string; desc: string }[] }[] = [
  {
    title: 'Frontend Architecture',
    Icon: Layers,
    items: [
      { name: 'Next.js 15', desc: 'App Router with Server Components' },
      { name: 'TypeScript', desc: 'Full type safety and IntelliSense' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling with custom design system' },
      { name: 'Zustand', desc: 'Lightweight state management' },
      { name: 'React Query', desc: 'Server state management and caching' },
    ],
  },
  {
    title: 'Backend Architecture',
    Icon: Server,
    items: [
      { name: 'Express.js', desc: 'RESTful APIs with middleware architecture' },
      { name: 'Prisma ORM', desc: 'Type-safe database access and migrations' },
      { name: 'JWT + OAuth2', desc: 'Secure authentication and authorization' },
      { name: 'Redis', desc: 'Session management and caching layer' },
      { name: 'Bull Queue', desc: 'Background job processing' },
    ],
  },
];

const TECH_STACKS: { title: string; Icon: LucideIcon; items: { name: string; desc: string }[] }[] = [
  {
    title: 'Frontend Stack',
    Icon: Monitor,
    items: [
      { name: 'Next.js 15', desc: 'App Router + Server Components' },
      { name: 'TypeScript 5.0', desc: 'Full type safety' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling' },
    ],
  },
  {
    title: 'Backend Stack',
    Icon: Server,
    items: [
      { name: 'Node.js + Express', desc: 'RESTful API server' },
      { name: 'Prisma ORM', desc: 'Type-safe database' },
      { name: 'Redis Cache', desc: 'Session + Cache layer' },
    ],
  },
  {
    title: 'AI/ML Stack',
    Icon: Cpu,
    items: [
      { name: 'Python + FastAPI', desc: 'ML model serving' },
      { name: 'Google Gemini', desc: 'Language model' },
      { name: 'Multimodal APIs', desc: 'Vision + Text processing' },
    ],
  },
];

const CACHE_LAYERS: { title: string; Icon: LucideIcon; items: string[] }[] = [
  {
    title: 'L1 — Browser Cache',
    Icon: Monitor,
    items: [
      'Service Worker caching',
      'LocalStorage for user preferences',
      'IndexedDB for offline data',
      'HTTP cache headers (1-24h TTL)',
    ],
  },
  {
    title: 'L2 — CDN Cache',
    Icon: Globe,
    items: [
      'CloudFlare edge caching',
      'Static asset optimization',
      'Image transformations',
      'Geographic distribution',
    ],
  },
  {
    title: 'L3 — Redis Cache',
    Icon: Zap,
    items: [
      'Session management',
      'API response caching',
      'User-specific data',
      'Real-time analytics',
    ],
  },
];

const PERF_TARGETS = [
  { metric: 'First Contentful Paint', target: '< 1.2s' },
  { metric: 'Largest Contentful Paint', target: '< 2.5s' },
  { metric: 'Time to Interactive', target: '< 3.8s' },
  { metric: 'API Response Time', target: '< 200ms' },
  { metric: 'AI Processing Time', target: '< 5s' },
];

const MONITORING = [
  { name: 'DataDog APM', desc: 'Application performance monitoring' },
  { name: 'Grafana + Prometheus', desc: 'Metrics visualization & alerting' },
  { name: 'Elasticsearch + Kibana', desc: 'Log aggregation & analysis' },
  { name: 'Sentry', desc: 'Error tracking & debugging' },
];

const SECURITY_LAYERS = [
  {
    title: 'Network Security',
    items: ['WAF with DDoS protection', 'SSL/TLS 1.3 encryption', 'IP whitelisting for admin'],
  },
  {
    title: 'Application Security',
    items: ['OAuth 2.0 + JWT authentication', 'Role-based access control (RBAC)', 'API rate limiting'],
  },
  {
    title: 'Data Security',
    items: ['AES-256 encryption at rest', 'PII data anonymization', 'Secure key management (HSM)'],
  },
];

const COMPLIANCE = [
  { name: 'SOC 2', desc: 'Type II Certified' },
  { name: 'GDPR', desc: 'EU Compliant' },
  { name: 'HIPAA', desc: 'Healthcare Ready' },
  { name: 'ISO 27001', desc: 'Security Standard' },
];

const REGIONS: { region: string; role: string; latency: string; shield: string; Icon: LucideIcon }[] = [
  {
    region: 'US-East-1',
    role: 'Primary orchestration',
    latency: '40ms',
    shield: 'SOC2 + FedRAMP moderate',
    Icon: Server,
  },
  {
    region: 'EU-West-1',
    role: 'Low-latency cohort',
    latency: '55ms',
    shield: 'GDPR + AI Act ready',
    Icon: Globe,
  },
  {
    region: 'AP-Southeast-1',
    role: 'DR active-standby',
    latency: '72ms',
    shield: 'PDPA ready, 4h RTO',
    Icon: Shield,
  },
];

const ROADMAP: {
  quarter: string;
  title: string;
  items: { done: boolean; text: string }[];
}[] = [
  {
    quarter: 'Q1',
    title: 'Foundation Phase',
    items: [
      { done: true, text: 'Core microservices architecture' },
      { done: true, text: 'Basic AI tool integration' },
      { done: false, text: 'User authentication & RBAC' },
      { done: false, text: 'MVP deployment on AWS' },
    ],
  },
  {
    quarter: 'Q2',
    title: 'Scaling Phase',
    items: [
      { done: false, text: 'Multi-region deployment' },
      { done: false, text: 'Advanced caching layers' },
      { done: false, text: 'Real-time analytics pipeline' },
      { done: false, text: 'Enterprise integration APIs' },
    ],
  },
  {
    quarter: 'Q3',
    title: 'Innovation Phase',
    items: [
      { done: false, text: 'Custom AI model training' },
      { done: false, text: 'Edge computing deployment' },
      { done: false, text: 'Blockchain integration' },
      { done: false, text: 'VR/AR learning modules' },
    ],
  },
];

const PRISMA_CODE = `// User Management
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  profile       Profile?
  subscriptions Subscription[]
  sessions      Session[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Learning System
model LearningPath {
  id          String @id @default(cuid())
  title       String
  description String
  modules     Module[]
  difficulty  Difficulty
  estimatedHours Int
  tags        Tag[]
  createdAt   DateTime @default(now())
}`;

const MONGO_CODE = `{
  "_id": ObjectId(),
  "userId": "cuid_user_id",
  "events": [{
    "type": "tool_usage",
    "toolId": "interview_coach",
    "timestamp": ISODate(),
    "duration": 1200
  }]
}`;

const REST_CODE = `// Authentication & User Management
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

// Career Tools API
GET    /api/tools
POST   /api/tools/:toolId/execute
GET    /api/tools/:toolId/history

// Learning Paths API
GET    /api/learning/paths
POST   /api/learning/paths/:pathId/enroll
GET    /api/learning/progress/:userId

// AI Processing API
POST   /api/ai/multimodal/analyze
POST   /api/ai/text/generate
GET    /api/ai/jobs/:jobId/status`;

const GRAPHQL_CODE = `type User {
  id: ID!
  email: String!
  profile: Profile
  learningPaths: [LearningPath!]!
}

type LearningPath {
  id: ID!
  title: String!
  description: String!
  modules: [Module!]!
  progress(userId: ID!): Progress
}

type Query {
  user(id: ID!): User
  learningPaths: [LearningPath!]!
  aiTools: [AiTool!]!
}

type Mutation {
  executeAiTool(
    toolId: ID!
    input: AiToolInput!
  ): AiToolResult!
}`;

const HPA_CODE = `# Kubernetes HPA Configuration
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: kairoo-api-hpa
spec:
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70`;

const TERRAFORM_CODE = `# Terraform AWS Infrastructure
resource "aws_eks_cluster" "kairoo" {
  name     = "kairoo-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }
}`;

/* ---------------------------------------------------------------------------
 * Page content
 * ------------------------------------------------------------------------- */
export function ArchitectureContent() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <>
      {/* Scroll progress rail (decorative, token-driven) */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-16 z-40 h-0.5 origin-left bg-primary"
          style={{ scaleX }}
        />
      ) : null}

      {/* HERO */}
      <div className="relative isolate overflow-hidden">
        <AuroraBackground intensity="vivid" className="absolute! inset-0 -z-10" />
        <Hero
          eyebrow="Enterprise-Grade Architecture · V2 Technical Blueprint"
          title="Technical Architecture — Kairoo v2.0"
          subtitle="Comprehensive full-stack architecture for a scalable, AI-powered career development platform. Built for enterprise performance with Next.js, Express.js, MongoDB, Redis, and advanced multimodal AI integration."
        />
        <Container className="-mt-6 pb-16">
          <Reveal>
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <Badge variant="success" size="md">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-success" aria-hidden />
                Microservices Architecture
              </Badge>
              <Badge variant="info" size="md">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-info" aria-hidden />
                Auto-Scaling Infrastructure
              </Badge>
              <Badge variant="neutral" size="md">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-accent" aria-hidden />
                Multi-Modal AI Pipeline
              </Badge>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <Alert variant="info" className="mx-auto mb-10 max-w-3xl">
              <AlertTitle>Read this as a blueprint.</AlertTitle>
              <AlertDescription>
                This page is the V2 target architecture. Sections marked{' '}
                <Badge variant="info" size="sm">
                  Blueprint · vision
                </Badge>{' '}
                describe systems and scale we are building toward — not all of it is shipped today.
                The figures below are aspirational targets for the orchestration platform.
              </AlertDescription>
            </Alert>
          </Reveal>

          <Reveal delay={0.1}>
            <Card variant="glass" className="p-8">
              <StatGrid items={HERO_STATS} cols={3} gap="lg" />
            </Card>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-body-sm text-muted-foreground">
                <Sparkles className="size-4 text-accent" aria-hidden />
                Story-driven blueprint: Sense → Think → Act across every surface
              </span>
            </div>
          </Reveal>
        </Container>
      </div>

      {/* STORY RAIL */}
      <Section>
        <Grid cols={1} gap="lg" className="lg:grid-cols-[320px_1fr]">
          <div ref={railRef} className="hidden lg:block">
            <Card variant="glass" className="sticky top-24 p-6">
              <p className="text-overline text-primary">Architecture Story</p>
              <h3 className="mt-4 text-h4 text-foreground">
                From signal ingestion to action, the system is orchestrated like a narrative arc.
              </h3>
              <p className="mt-4 text-body text-muted-foreground">
                Follow the scroll to see how each subsystem hands context, intent, and execution to
                the next layer.
              </p>
              <Stack gap={2} className="mt-6">
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <span className="h-1 w-6 rounded-full bg-primary" aria-hidden />
                  Live stream contracts per minute
                </div>
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <span className="h-1 w-6 rounded-full bg-accent" aria-hidden />
                  Routing &amp; policy guardrails
                </div>
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <span className="h-1 w-6 rounded-full bg-info" aria-hidden />
                  Execution + learning feedback
                </div>
              </Stack>
            </Card>
          </div>

          <Stack gap={6}>
            {STORY_BEATS.map((beat, i) => (
              <Reveal key={beat.title} delay={i * 0.05}>
                <CardSpotlight className="p-6">
                  <div className="flex items-center gap-4">
                    <IconBadge Icon={beat.Icon} />
                    <div>
                      <p className="text-overline text-muted-foreground">Chapter {i + 1}</p>
                      <h4 className="text-h5 text-foreground">{beat.title}</h4>
                    </div>
                  </div>
                  <p className="mt-4 text-body text-muted-foreground">{beat.description}</p>
                  <Grid cols={2} gap="sm" className="mt-4">
                    {beat.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-center gap-2 text-body-sm text-foreground"
                      >
                        <span className="h-1 w-4 rounded-full bg-primary" aria-hidden />
                        {detail}
                      </div>
                    ))}
                  </Grid>
                </CardSpotlight>
              </Reveal>
            ))}
          </Stack>
        </Grid>
      </Section>

      {/* SENSE → THINK → ACT */}
      <Section>
        <SectionHeading
          eyebrow="Operating loop"
          title="Sense → Think → Act flow"
          intro="Every surface follows the same arc: capture signal, reason over it, then act with guardrails and learn from the result."
          blueprint
        />
        <Grid cols={3} gap="lg">
          {FLOW_STAGES.map((stage, i) => (
            <Reveal key={stage.title} delay={i * 0.08}>
              <Card variant="interactive" className="relative h-full p-6">
                <div className="flex items-center gap-3">
                  <IconBadge Icon={stage.Icon} />
                  <span className="text-h5 text-foreground">{stage.title}</span>
                </div>
                <Stack gap={2} className="mt-5">
                  {stage.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {bullet}
                    </div>
                  ))}
                </Stack>
                {i < FLOW_STAGES.length - 1 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-7 top-1/2 hidden h-0.5 w-7 -translate-y-1/2 bg-border md:block"
                  />
                ) : null}
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* LAYERED FLOWCHART */}
      <Section>
        <SectionHeading
          eyebrow="System decomposition"
          title="Layered flowchart"
          intro="Four cooperating layers — Experience, Intelligence, Infrastructure, and Trust — each with explicit responsibilities."
          blueprint
        />
        <Grid cols={2} gap="lg">
          {FLOW_NODES.map((node, i) => (
            <Reveal key={node.title} delay={i * 0.06}>
              <Card variant="glass" className="h-full p-6">
                <div className="flex items-center gap-3">
                  <IconBadge Icon={node.Icon} />
                  <h3 className="text-h5 text-foreground">{node.title}</h3>
                </div>
                <Stack gap={2} className="mt-4">
                  {node.items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {item}
                    </div>
                  ))}
                </Stack>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* SYSTEM OVERVIEW */}
      <Section>
        <SectionHeading
          eyebrow="High level"
          title="System architecture overview"
          intro="The request path: a Next.js frontend talks to an Nginx API gateway, which routes into the Python/FastAPI AI service and supporting microservices."
        />
        <Reveal>
          <Card variant="elevated" className="mb-8 p-8">
            <h3 className="mb-6 text-center text-h5 text-foreground">Interactive system architecture</h3>
            <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center">
              {SYSTEM_NODES.map((node, i) => (
                <div key={node.title} className="flex flex-col items-center gap-4 md:flex-row">
                  <Card variant="interactive" className="w-full p-6 text-center md:w-48">
                    <node.Icon className="mx-auto mb-2 size-8 text-primary" aria-hidden />
                    <div className="font-semibold text-foreground">{node.title}</div>
                    <div className="text-caption text-muted-foreground">{node.sub}</div>
                  </Card>
                  {i < SYSTEM_NODES.length - 1 ? (
                    <span className="text-h4 text-muted-foreground" aria-hidden>
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        <Grid cols={2} gap="lg">
          {ARCH_LAYERS.map((layer, i) => (
            <Reveal key={layer.title} delay={i * 0.08}>
              <Card variant="default" className="h-full border-l-4 border-l-primary p-6">
                <div className="mb-4 flex items-center gap-3">
                  <layer.Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="text-h5 text-foreground">{layer.title}</h3>
                </div>
                <Stack gap={2}>
                  {layer.items.map((item) => (
                    <p key={item.name} className="text-body text-muted-foreground">
                      <span className="font-semibold text-foreground">{item.name}:</span> {item.desc}
                    </p>
                  ))}
                </Stack>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* TECH STACK */}
      <Section>
        <SectionHeading
          eyebrow="Toolchain"
          title="Complete technology stack"
          intro="The full picture across frontend, backend, and AI/ML — the target blueprint stack for the V2 platform."
          blueprint
        />
        <Grid cols={3} gap="lg">
          {TECH_STACKS.map((stack, i) => (
            <Reveal key={stack.title} delay={i * 0.08}>
              <Card variant="glass" className="h-full p-6">
                <div className="mb-6 flex items-center gap-3">
                  <stack.Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="text-h5 text-foreground">{stack.title}</h3>
                </div>
                <Stack gap={3}>
                  {stack.items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-lg border-l-2 border-l-accent bg-muted-surface p-3"
                    >
                      <div className="font-semibold text-foreground">{item.name}</div>
                      <div className="text-caption text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </Stack>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* DATA + API (tabbed code) */}
      <Section>
        <SectionHeading
          eyebrow="Contracts"
          title="Data & API architecture"
          intro="The persistence and interface contracts: a Prisma relational schema, MongoDB analytics collections, and both REST and GraphQL surfaces."
          blueprint
        />
        <Reveal>
          <Tabs defaultSelectedKey="database" aria-label="Data and API architecture">
            <Tabs.List aria-label="Data and API sections">
              <Tabs.Tab id="database">Database</Tabs.Tab>
              <Tabs.Tab id="api">API</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel id="database" className="pt-6">
              <Grid cols={2} gap="lg">
                <Stack gap={4}>
                  <div className="flex items-center gap-2">
                    <Database className="size-5 text-primary" aria-hidden />
                    <h3 className="text-h5 text-foreground">Prisma schema design</h3>
                  </div>
                  <CodeBlock title="schema.prisma" lang="prisma" code={PRISMA_CODE} />
                </Stack>
                <Stack gap={4}>
                  <div className="flex items-center gap-2">
                    <Database className="size-5 text-accent" aria-hidden />
                    <h3 className="text-h5 text-foreground">MongoDB collections</h3>
                  </div>
                  <p className="text-body-sm text-muted-foreground">User Analytics Collection</p>
                  <CodeBlock title="user_analytics" lang="json" code={MONGO_CODE} />
                </Stack>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel id="api" className="pt-6">
              <Grid cols={2} gap="lg">
                <Stack gap={4}>
                  <h3 className="text-h5 text-foreground">RESTful API structure</h3>
                  <CodeBlock title="REST endpoints" lang="http" code={REST_CODE} />
                </Stack>
                <Stack gap={4}>
                  <h3 className="text-h5 text-foreground">GraphQL schema</h3>
                  <CodeBlock title="schema.graphql" lang="graphql" code={GRAPHQL_CODE} />
                </Stack>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </Reveal>
      </Section>

      {/* CACHING */}
      <Section>
        <SectionHeading
          eyebrow="Latency strategy"
          title="Multi-layer caching strategy"
          intro="Three cooperating cache tiers — browser, CDN edge, and Redis — keep responses fast and the origin cool."
          blueprint
        />
        <Grid cols={3} gap="lg">
          {CACHE_LAYERS.map((layer, i) => (
            <Reveal key={layer.title} delay={i * 0.08}>
              <Card variant="interactive" className="h-full p-6 text-center">
                <span className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-full bg-accent-subtle text-accent-subtle-foreground">
                  <layer.Icon className="size-8" aria-hidden />
                </span>
                <h4 className="mb-3 text-h5 text-foreground">{layer.title}</h4>
                <Stack gap={2}>
                  {layer.items.map((item) => (
                    <p key={item} className="text-body-sm text-muted-foreground">
                      {item}
                    </p>
                  ))}
                </Stack>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* PERFORMANCE */}
      <Section>
        <SectionHeading
          eyebrow="SLOs"
          title="Performance targets & monitoring"
          intro="Hard latency budgets across the rendering and AI pipeline, backed by a full observability stack."
          blueprint
        />
        <Grid cols={2} gap="lg">
          <Reveal>
            <Card variant="default" className="h-full p-6">
              <h3 className="mb-6 text-h5 text-foreground">Performance targets</h3>
              <Stack gap={3}>
                {PERF_TARGETS.map((item) => (
                  <div
                    key={item.metric}
                    className="flex items-center justify-between rounded-lg border-l-2 border-l-primary bg-muted-surface p-3"
                  >
                    <span className="text-body text-foreground">{item.metric}</span>
                    <Badge variant="success" size="md" className="font-mono">
                      {item.target}
                    </Badge>
                  </div>
                ))}
              </Stack>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card variant="default" className="h-full p-6">
              <h3 className="mb-6 text-h5 text-foreground">Monitoring &amp; observability</h3>
              <Stack gap={3}>
                {MONITORING.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded-lg border-l-2 border-l-accent bg-muted-surface p-4"
                  >
                    <div className="font-semibold text-foreground">{tool.name}</div>
                    <div className="text-caption text-muted-foreground">{tool.desc}</div>
                  </div>
                ))}
              </Stack>
            </Card>
          </Reveal>
        </Grid>
      </Section>

      {/* SECURITY & COMPLIANCE */}
      <Section>
        <SectionHeading
          eyebrow="Trust"
          title="Security & compliance framework"
          intro="Defense in depth across network, application, and data layers — mapped to the compliance standards we are building toward."
          blueprint
        />
        <Grid cols={2} gap="lg">
          <Reveal>
            <Card variant="glass" className="h-full p-6">
              <h3 className="mb-6 text-h5 text-foreground">Security layers</h3>
              <Stack gap={4}>
                {SECURITY_LAYERS.map((layer) => (
                  <div
                    key={layer.title}
                    className="rounded-lg border-l-2 border-l-destructive bg-muted-surface p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Shield className="size-4 text-destructive" aria-hidden />
                      <h4 className="font-semibold text-foreground">{layer.title}</h4>
                    </div>
                    <Stack gap={1}>
                      {layer.items.map((item) => (
                        <p key={item} className="text-body-sm text-muted-foreground">
                          {item}
                        </p>
                      ))}
                    </Stack>
                  </div>
                ))}
              </Stack>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card variant="glass" className="h-full p-6">
              <h3 className="mb-6 text-h5 text-foreground">Compliance standards</h3>
              <Grid cols={2} gap="md">
                {COMPLIANCE.map((standard) => (
                  <Card key={standard.name} variant="default" className="p-4 text-center">
                    <div className="text-h4 text-primary">{standard.name}</div>
                    <Badge variant="success" size="sm" className="mt-2">
                      {standard.desc}
                    </Badge>
                  </Card>
                ))}
              </Grid>
            </Card>
          </Reveal>
        </Grid>
      </Section>

      {/* SCALABILITY */}
      <Section>
        <SectionHeading
          eyebrow="Elasticity"
          title="Scalability & infrastructure plan"
          intro="Horizontal auto-scaling via Kubernetes HPA and reproducible infrastructure-as-code on AWS EKS, deployed across multiple regions."
          blueprint
        />
        <Grid cols={2} gap="lg" className="mb-8">
          <Reveal>
            <Stack gap={4}>
              <h3 className="text-h5 text-foreground">Auto-scaling strategy</h3>
              <CodeBlock title="hpa.yaml" lang="yaml" code={HPA_CODE} />
            </Stack>
          </Reveal>
          <Reveal delay={0.08}>
            <Stack gap={4}>
              <h3 className="text-h5 text-foreground">Infrastructure as code</h3>
              <CodeBlock title="eks.tf" lang="hcl" code={TERRAFORM_CODE} />
            </Stack>
          </Reveal>
        </Grid>

        <Reveal>
          <Card variant="elevated" className="p-8">
            <h3 className="mb-6 text-h4 text-foreground">Multi-region deployment architecture</h3>
            <Grid cols={3} gap="lg">
              {REGIONS.map((region, i) => (
                <Reveal key={region.region} delay={i * 0.08}>
                  <Card variant="glass" className="h-full p-6">
                    <IconBadge Icon={region.Icon} />
                    <h4 className="mt-4 text-h5 text-foreground">{region.region}</h4>
                    <p className="text-body-sm text-muted-foreground">{region.role}</p>
                    <div className="mt-4 flex items-center justify-between text-body-sm">
                      <span className="text-muted-foreground">Latency target</span>
                      <Badge variant="info" size="sm" className="font-mono">
                        {region.latency}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-body-sm">
                      <span className="text-muted-foreground">Compliance</span>
                      <span className="text-right font-medium text-foreground">{region.shield}</span>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </Grid>
          </Card>
        </Reveal>
      </Section>

      {/* ROADMAP */}
      <Section>
        <SectionHeading
          eyebrow="Sequencing"
          title="Technical roadmap & future enhancements"
          intro="A phased path from foundation to scale to innovation — including custom model training, edge compute, blockchain, and VR/AR learning modules."
          blueprint
        />
        <Grid cols={3} gap="lg">
          {ROADMAP.map((phase, i) => (
            <Reveal key={phase.quarter} delay={i * 0.08}>
              <Card variant="interactive" className="h-full p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-h5 font-bold text-primary-foreground">
                    {phase.quarter}
                  </span>
                  <h4 className="text-h5 text-foreground">{phase.title}</h4>
                </div>
                <Stack gap={3}>
                  {phase.items.map((item) => (
                    <div key={item.text} className="flex items-start gap-2">
                      {item.done ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                      ) : (
                        <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      )}
                      <span
                        className={
                          item.done
                            ? 'text-body-sm text-foreground'
                            : 'text-body-sm text-muted-foreground'
                        }
                      >
                        {item.text}
                      </span>
                      {item.done ? (
                        <span className="sr-only"> (shipped)</span>
                      ) : (
                        <span className="sr-only"> (planned)</span>
                      )}
                    </div>
                  ))}
                </Stack>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      {/* CLOSING CTA */}
      <CTA
        headline="Want the full technical deep-dive?"
        body="This blueprint pairs with our deck, market sizing, and strategy. Reach out to walk the architecture end-to-end."
        primary={{ label: 'View the investor deck', href: '/investors/deck' }}
        secondary={{ label: 'Back to investors', href: '/investors' }}
      />
    </>
  );
}

export default ArchitectureContent;
