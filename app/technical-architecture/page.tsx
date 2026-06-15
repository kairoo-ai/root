'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Activity,
  Brain,
  CheckCircle,
  Circle,
  CircuitBoard,
  Cloud,
  Cpu,
  Globe,
  Layers,
  Monitor,
  SatelliteDish,
  Server,
  Shield,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';

export default function TechnicalArchitecture() {
  const pageRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });
  const progressOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 0.55]);

  const heroStats = useMemo(
    () => [
      { label: 'Real-time AI jobs', value: '35k/min', hint: 'Gemini + GPT orchestration' },
      { label: 'Infra coverage', value: '12 regions', hint: 'Active-active global mesh' },
      { label: 'Automations/day', value: '2.4M', hint: 'Sense → reason → act loop' },
    ],
    []
  );

  const storyBeats = useMemo(
    () => [
      {
        title: 'Signal Ingestion Mesh',
        icon: SatelliteDish,
        description:
          'Streams telemetry from resumes, job boards, HRIS, and user interactions through an event backbone with schema evolution and PII classifiers.',
        details: ['Kafka + Redpanda backbone', 'Edge sanitization', 'Latency budget < 80ms'],
      },
      {
        title: 'Reasoning Fabric',
        icon: Brain,
        description:
          'Orchestrates Gemini, GPT-4.1, and in-house models through a policy-aware router that selects optimal context, temperature, and cost envelope per task.',
        details: ['Declarative prompt registry', 'Safety rails + audit log', 'Memory graph sync every 5 min'],
      },
      {
        title: 'Action Layer',
        icon: Workflow,
        description:
          'Automates follow-ups, learning plan updates, and executive dashboards with approval checkpoints and human-in-the-loop overrides.',
        details: ['Service mesh w/ retries', 'Fine-grained RBAC', 'Composable playbooks'],
      },
      {
        title: 'Continuous Intelligence Loop',
        icon: Activity,
        description:
          'Feedback signals retrain ranking models nightly while anomaly detectors surface drift and bias directly into observability boards.',
        details: ['Realtime feature store', 'Model drift monitors', 'Explainability snapshots'],
      },
    ],
    []
  );

  const flowStages = useMemo(
    () => [
      {
        title: 'Sense',
        gradient: 'from-cyan-500 to-blue-500',
        color: 'text-cyan-300',
        icon: SatelliteDish,
        bullets: ['API + webhook ingestion', 'Streaming ETL + enrichment', 'Edge privacy screening'],
      },
      {
        title: 'Think',
        gradient: 'from-purple-500 to-pink-500',
        color: 'text-purple-300',
        icon: Brain,
        bullets: ['Model router + context store', 'Toolformer-style planning', 'Evaluator ensemble'],
      },
      {
        title: 'Act',
        gradient: 'from-amber-500 to-rose-500',
        color: 'text-amber-200',
        icon: Workflow,
        bullets: ['Automation graph', 'Human approvals', 'Telemetry + learning artifacts'],
      },
    ],
    []
  );

  const flowNodes = useMemo(
    () => [
      {
        title: 'Experience Layer',
        icon: Monitor,
        color: 'from-sky-500/20 to-sky-500/5',
        border: 'border-sky-400/40',
        items: ['Next.js App Router UI', 'Adaptive theming + experiments', 'Offline-first surfaces'],
      },
      {
        title: 'Intelligence Layer',
        icon: Brain,
        color: 'from-fuchsia-500/20 to-fuchsia-500/5',
        border: 'border-fuchsia-400/40',
        items: ['Hybrid RAG engine', 'Vector + relational fusion', 'Knowledge graph updates'],
      },
      {
        title: 'Infrastructure Layer',
        icon: Cloud,
        color: 'from-emerald-500/20 to-emerald-500/5',
        border: 'border-emerald-400/40',
        items: ['Kubernetes + Wasm pods', 'Service mesh (Linkerd)', 'Observability via OpenTelemetry'],
      },
      {
        title: 'Trust Layer',
        icon: Shield,
        color: 'from-orange-500/20 to-orange-500/5',
        border: 'border-orange-400/40',
        items: ['Zero-trust IAM', 'Secrets lattice (Vault)', 'Compliance automation'],
      },
    ],
    []
  );

  const multiRegionStats = useMemo(
    () => [
      {
        region: 'US-East-1',
        role: 'Primary orchestration',
        latency: '40ms',
        shield: 'SOC2 + FedRAMP moderate',
        gradient: 'from-blue-500 to-cyan-500',
        icon: Server,
      },
      {
        region: 'EU-West-1',
        role: 'Low-latency cohort',
        latency: '55ms',
        shield: 'GDPR + AI Act ready',
        gradient: 'from-emerald-500 to-lime-500',
        icon: Globe,
      },
      {
        region: 'AP-Southeast-1',
        role: 'DR active-standby',
        latency: '72ms',
        shield: 'PDPA ready, 4h RTO',
        gradient: 'from-rose-500 to-orange-500',
        icon: Shield,
      },
    ],
    []
  );
  return (
    <>
      <Navigation />
      <motion.div
        className="fixed left-0 top-0 z-40 h-1 w-full origin-left bg-linear-to-r from-cyan-400 via-purple-500 to-rose-500"
        style={{ scaleX: scrollYProgress, opacity: progressOpacity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.15),transparent_55%)] blur-3xl"
        style={{ opacity: glowOpacity }}
      />
      <header className="pt-32 pb-16 text-center container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
              <Cpu className="w-4 h-4 mr-2" />
              Enterprise-Grade Architecture • V2 Technical Blueprint
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Technical Architecture
            <span className="block gradient-text mt-2">{process.env.APP_NAME || "Kairoo"} v2.0</span>
          </h1>
          <p className="max-w-4xl mx-auto mt-6 text-lg md:text-xl text-gray-300">
            Comprehensive full-stack architecture for scalable AI-powered career development platform. Built for
            enterprise performance with Next.js, Express.js, MongoDB, Redis, and advanced multimodal AI integration.
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Microservices Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Auto-Scaling Infrastructure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Multi-Modal AI Pipeline</span>
            </div>
          </div>

          <motion.div
            className="mt-12 grid gap-6 text-left md:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-card rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.05 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                <div className="mt-3 text-3xl font-black text-white">{stat.value}</div>
                <p className="mt-2 text-sm text-gray-300">{stat.hint}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-sm text-gray-300 backdrop-blur">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Story-driven blueprint: Sense → Think → Act across every surface
            </div>
          </div>
        </motion.div>
      </header>

      <main ref={pageRef} className="container mx-auto px-6 space-y-24 md:space-y-32">
        {/* Story Rail */}
        <section id="story" className="relative">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
            <div className="glass-card sticky top-28 hidden h-fit rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/20 to-purple-500/20 p-6 text-left text-white shadow-2xl lg:block">
              <div className="text-sm uppercase tracking-[0.3em] text-gray-200">Architecture Story</div>
              <h3 className="mt-4 text-2xl font-bold leading-tight">
                From signal ingestion to action, the system is orchestrated like a narrative arc.
              </h3>
              <p className="mt-4 text-sm text-gray-100">
                Follow the scroll to see how each subsystem hands context, intent, and execution to the next layer.
              </p>
              <div className="mt-6 space-y-2 text-xs text-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-6 rounded-full bg-cyan-300" />
                  Live stream contracts per minute
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-6 rounded-full bg-purple-300" />
                  Routing & policy guardrails
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-6 rounded-full bg-rose-300" />
                  Execution + learning feedback
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {storyBeats.map((beat, index) => (
                <motion.div
                  key={beat.title}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-6 text-left shadow-lg backdrop-blur"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500/30 to-purple-500/30 text-white">
                      <beat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Chapter {index + 1}</p>
                      <h4 className="text-xl font-semibold">{beat.title}</h4>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">{beat.description}</p>
                  <div className="mt-4 grid gap-2 text-sm text-gray-200 md:grid-cols-2">
                    {beat.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2">
                        <div className="h-1 w-4 rounded-full bg-linear-to-r from-cyan-400 to-purple-400" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Flowchart Narrative */}
        <section id="flow" className="space-y-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold"
          >
            Sense → Think → Act Flow
          </motion.h2>
          <div className="glass-card rounded-3xl border border-white/10 p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {flowStages.map((stage, index) => (
                <div key={stage.title} className="relative">
                  <motion.div
                    className={`rounded-2xl border bg-linear-to-br ${stage.gradient} px-6 py-8 text-left`}
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <stage.icon className="h-8 w-8" />
                      <span className="text-lg font-semibold">{stage.title}</span>
                    </div>
                    <ul className="mt-5 space-y-2 text-left text-sm text-white/90">
                      {stage.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  {index < flowStages.length - 1 && (
                    <div className="pointer-events-none absolute right-[-60px] top-1/2 hidden h-0.5 w-[70px] translate-y-1/2 bg-linear-to-r from-white/60 to-transparent md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Flow Grid */}
        <section id="flowchart" className="space-y-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold"
          >
            Layered Flowchart
          </motion.h2>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/2 p-8 shadow-2xl">
            <div className="grid gap-6 lg:grid-cols-2">
              {flowNodes.map((node, index) => (
                <motion.div
                  key={node.title}
                  className={`relative rounded-2xl border ${node.border} bg-linear-to-br ${node.color} p-6 text-left`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3 text-white">
                    <node.icon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">{node.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-white/80">
                    {node.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {index < flowNodes.length - 1 && (
                    <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Overview */}
        <section id="overview" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            System Architecture Overview
          </motion.h2>

          {/* Interactive Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="interactive-diagram glass-card p-8 rounded-2xl mb-12"
          >
            <div className="text-2xl font-bold mb-6 text-center">Interactive System Architecture</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Frontend Layer */}
              <div className="diagram-node p-6 rounded-lg bg-blue-500/20 border-2 border-blue-500 text-center">
                <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="font-bold">Frontend Layer</div>
                <div className="text-xs opacity-75">Next.js 15 + TypeScript</div>
              </div>

              {/* API Gateway */}
              <div className="diagram-node p-6 rounded-lg bg-green-500/20 border-2 border-green-500 text-center">
                <Server className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="font-bold">API Gateway</div>
                <div className="text-xs opacity-75">Nginx + Load Balancer</div>
              </div>

              {/* Microservices */}
              <div className="diagram-node p-6 rounded-lg bg-purple-500/20 border-2 border-purple-500 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="font-bold">AI Service</div>
                <div className="text-xs opacity-75">Python + FastAPI</div>
              </div>
            </div>
          </motion.div>

          {/* Architecture Layers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="architecture-layer glass-card p-6 rounded-2xl border-l-4 border-blue-500"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Layers className="w-6 h-6 mr-3 text-blue-400" />
                Frontend Architecture
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>• <strong>Next.js 15:</strong> App Router with Server Components</p>
                <p>• <strong>TypeScript:</strong> Full type safety and IntelliSense</p>
                <p>• <strong>Tailwind CSS:</strong> Utility-first styling with custom design system</p>
                <p>• <strong>Zustand:</strong> Lightweight state management</p>
                <p>• <strong>React Query:</strong> Server state management and caching</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="architecture-layer glass-card p-6 rounded-2xl border-l-4 border-green-500"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Server className="w-6 h-6 mr-3 text-green-400" />
                Backend Architecture
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>• <strong>Express.js:</strong> RESTful APIs with middleware architecture</p>
                <p>• <strong>Prisma ORM:</strong> Type-safe database access and migrations</p>
                <p>• <strong>JWT + OAuth2:</strong> Secure authentication and authorization</p>
                <p>• <strong>Redis:</strong> Session management and caching layer</p>
                <p>• <strong>Bull Queue:</strong> Background job processing</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Technology Stack */}
        <section id="tech-stack" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Complete Technology Stack
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Frontend Stack',
                icon: Monitor,
                color: 'text-blue-400',
                items: [
                  { name: 'Next.js 15', desc: 'App Router + Server Components' },
                  { name: 'TypeScript 5.0', desc: 'Full type safety' },
                  { name: 'Tailwind CSS', desc: 'Utility-first styling' },
                ],
              },
              {
                title: 'Backend Stack',
                icon: Server,
                color: 'text-green-400',
                items: [
                  { name: 'Node.js + Express', desc: 'RESTful API server' },
                  { name: 'Prisma ORM', desc: 'Type-safe database' },
                  { name: 'Redis Cache', desc: 'Session + Cache layer' },
                ],
              },
              {
                title: 'AI/ML Stack',
                icon: Cpu,
                color: 'text-purple-400',
                items: [
                  { name: 'Python + FastAPI', desc: 'ML model serving' },
                  { name: 'Google Gemini', desc: 'Language model' },
                  { name: 'Multimodal APIs', desc: 'Vision + Text processing' },
                ],
              },
            ].map((stack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl text-left"
              >
                <h3 className={`text-xl font-bold mb-6 ${stack.color} flex items-center`}>
                  <stack.icon className="w-6 h-6 mr-3" />
                  {stack.title}
                </h3>
                <div className="space-y-3">
                  {stack.items.map((item, i) => (
                    <div key={i} className="tech-stack-item p-3 rounded-lg bg-white/5 border-l-4" style={{ borderLeftColor: stack.color.replace('text-', '').replace('-400', '') }}>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Database Schema */}
        <section id="database" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Database Architecture & Schema
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Prisma Schema Design</h3>
              <div className="code-block bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto">
                <pre>{`// User Management
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
}`}</pre>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-4 text-green-400">MongoDB Collections</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <h4 className="font-bold mb-2">User Analytics Collection</h4>
                  <div className="code-block bg-gray-900 p-4 rounded-lg text-xs font-mono text-gray-300 overflow-x-auto">
                    <pre>{`{
  "_id": ObjectId(),
  "userId": "cuid_user_id",
  "events": [{
    "type": "tool_usage",
    "toolId": "interview_coach",
    "timestamp": ISODate(),
    "duration": 1200
  }]
}`}</pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* API Layer Design */}
        <section id="api" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            API Architecture & Endpoints
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-4 text-blue-400">RESTful API Structure</h3>
              <div className="code-block bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto">
                <pre>{`// Authentication & User Management
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
GET    /api/ai/jobs/:jobId/status`}</pre>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-4 text-purple-400">GraphQL Schema</h3>
              <div className="code-block bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto">
                <pre>{`type User {
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
}`}</pre>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Caching Strategy */}
        <section id="caching" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Multi-Layer Caching Strategy
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Monitor,
                  gradient: 'from-blue-500 to-cyan-500',
                  title: 'L1 - Browser Cache',
                  items: ['Service Worker caching', 'LocalStorage for user preferences', 'IndexedDB for offline data', 'HTTP cache headers (1-24h TTL)'],
                },
                {
                  icon: Server,
                  gradient: 'from-green-500 to-emerald-500',
                  title: 'L2 - CDN Cache',
                  items: ['CloudFlare edge caching', 'Static asset optimization', 'Image transformations', 'Geographic distribution'],
                },
                {
                  icon: Zap,
                  gradient: 'from-red-500 to-pink-500',
                  title: 'L3 - Redis Cache',
                  items: ['Session management', 'API response caching', 'User-specific data', 'Real-time analytics'],
                },
              ].map((layer, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto bg-linear-to-br ${layer.gradient} rounded-full flex items-center justify-center mb-4`}>
                    <layer.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{layer.title}</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    {layer.items.map((item, i) => (
                      <p key={i}>• {item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Performance Metrics */}
        <section id="performance" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Performance Targets & Monitoring
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-6 text-green-400">Performance Targets</h3>
              <div className="space-y-4">
                {[
                  { metric: 'First Contentful Paint', target: '< 1.2s', color: 'text-green-400' },
                  { metric: 'Largest Contentful Paint', target: '< 2.5s', color: 'text-blue-400' },
                  { metric: 'Time to Interactive', target: '< 3.8s', color: 'text-orange-400' },
                  { metric: 'API Response Time', target: '< 200ms', color: 'text-purple-400' },
                  { metric: 'AI Processing Time', target: '< 5s', color: 'text-red-400' },
                ].map((item, index) => (
                  <div key={index} className="performance-metric flex justify-between items-center p-3 bg-white/5 rounded-lg border-l-4" style={{ borderLeftColor: item.color.replace('text-', '').replace('-400', '') }}>
                    <span>{item.metric}</span>
                    <span className={`font-bold ${item.color}`}>{item.target}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-6 text-purple-400">Monitoring & Observability</h3>
              <div className="space-y-4">
                {[
                  { name: 'DataDog APM', desc: 'Application performance monitoring' },
                  { name: 'Grafana + Prometheus', desc: 'Metrics visualization & alerting' },
                  { name: 'Elasticsearch + Kibana', desc: 'Log aggregation & analysis' },
                  { name: 'Sentry', desc: 'Error tracking & debugging' },
                ].map((tool, index) => (
                  <div key={index} className="tech-stack-item p-4 rounded-lg bg-white/5 border-l-4 border-purple-500">
                    <div className="font-bold">{tool.name}</div>
                    <div className="text-xs text-gray-400">{tool.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Security Architecture */}
        <section id="security" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Security & Compliance Framework
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-left">
                <h3 className="text-xl font-bold mb-6 text-red-400">Security Layers</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Network Security',
                      items: ['WAF with DDoS protection', 'SSL/TLS 1.3 encryption', 'IP whitelisting for admin'],
                      color: 'red',
                    },
                    {
                      title: 'Application Security',
                      items: ['OAuth 2.0 + JWT authentication', 'Role-based access control (RBAC)', 'API rate limiting'],
                      color: 'orange',
                    },
                    {
                      title: 'Data Security',
                      items: ['AES-256 encryption at rest', 'PII data anonymization', 'Secure key management (HSM)'],
                      color: 'green',
                    },
                  ].map((layer, index) => (
                    <div key={index} className="architecture-layer p-4 rounded-lg bg-white/5 border-l-4" style={{ borderLeftColor: layer.color }}>
                      <h4 className="font-bold mb-2">{layer.title}</h4>
                      <div className="text-sm text-gray-300">
                        {layer.items.map((item, i) => (
                          <p key={i}>• {item}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold mb-6 text-green-400">Compliance Standards</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'SOC 2', desc: 'Type II Certified', color: 'green' },
                    { name: 'GDPR', desc: 'EU Compliant', color: 'blue' },
                    { name: 'HIPAA', desc: 'Healthcare Ready', color: 'purple' },
                    { name: 'ISO 27001', desc: 'Security Standard', color: 'orange' },
                  ].map((standard, index) => (
                    <div key={index} className={`p-4 bg-${standard.color}-500/10 border border-${standard.color}-500/20 rounded-lg text-center`}>
                      <div className={`text-2xl font-bold text-${standard.color}-400`}>{standard.name}</div>
                      <div className="text-xs text-gray-400">{standard.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Scalability & Infrastructure */}
        <section id="scalability" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Scalability & Infrastructure Plan
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Auto-Scaling Strategy</h3>
              <div className="code-block bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto">
                <pre>{`# Kubernetes HPA Configuration
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
        averageUtilization: 70`}</pre>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-left"
            >
              <h3 className="text-xl font-bold mb-4 text-green-400">Infrastructure as Code</h3>
              <div className="code-block bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto">
                <pre>{`# Terraform AWS Infrastructure
resource "aws_eks_cluster" "kairoo" {
  name     = "kairoo-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.28"
  
  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }
}`}</pre>
              </div>
            </motion.div>
          </div>

          {/* Multi-Region Deployment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl mt-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-purple-400">Multi-Region Deployment Architecture</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {multiRegionStats.map((region, index) => (
                <motion.div
                  key={region.region}
                  className="text-left rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${region.gradient} flex items-center justify-center text-white mb-4`}>
                    <region.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{region.region}</h4>
                  <p className="text-sm text-gray-300">{region.role}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-200">
                    <span>Latency Target</span>
                    <span className="font-semibold text-cyan-300">{region.latency}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-200">
                    <span>Compliance</span>
                    <span className="font-semibold text-purple-300">{region.shield}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Future Roadmap */}
        <section id="roadmap" className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Technical Roadmap & Future Enhancements
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quarter: 'Q1',
                  gradient: 'from-cyan-500 to-blue-500',
                  title: 'Foundation Phase',
                  color: 'text-cyan-400',
                  items: [
                    { done: true, text: 'Core microservices architecture' },
                    { done: true, text: 'Basic AI tool integration' },
                    { done: false, text: 'User authentication & RBAC' },
                    { done: false, text: 'MVP deployment on AWS' },
                  ],
                },
                {
                  quarter: 'Q2',
                  gradient: 'from-purple-500 to-pink-500',
                  title: 'Scaling Phase',
                  color: 'text-purple-400',
                  items: [
                    { done: false, text: 'Multi-region deployment' },
                    { done: false, text: 'Advanced caching layers' },
                    { done: false, text: 'Real-time analytics pipeline' },
                    { done: false, text: 'Enterprise integration APIs' },
                  ],
                },
                {
                  quarter: 'Q3',
                  gradient: 'from-orange-500 to-red-500',
                  title: 'Innovation Phase',
                  color: 'text-orange-400',
                  items: [
                    { done: false, text: 'Custom AI model training' },
                    { done: false, text: 'Edge computing deployment' },
                    { done: false, text: 'Blockchain integration' },
                    { done: false, text: 'VR/AR learning modules' },
                  ],
                },
              ].map((phase, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto bg-linear-to-br ${phase.gradient} rounded-full flex items-center justify-center mb-6`}>
                    <span className="text-white font-bold text-xl">{phase.quarter}</span>
                  </div>
                  <h4 className={`text-xl font-bold mb-4 ${phase.color}`}>{phase.title}</h4>
                  <div className="text-left space-y-3 text-sm text-gray-300">
                    {phase.items.map((item, i) => (
                      <div key={i} className="flex items-start">
                        {item.done ? (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                        )}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}

