# Skill Gap Intelligence Dashboard - Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan. Each task is a checkbox step. Do NOT skip steps. Verify TypeScript compiles (`npx tsc --noEmit`) after every task group.

**Goal:** Build a full Skill Gap Intelligence Dashboard - DB table, two pages (assess + dashboard), four components, and three API routes - integrated with the existing Drizzle schema pattern and Aceternity/Framer Motion UI system.

**Architecture:** New `skill_assessments` Drizzle table → repository layer → three API routes → two App Router pages under `app/(app)/tools/skillGap/` → four bespoke components (`_components/`). AI runs via existing `/api/ai` route pattern (internal fetch from POST handler). No external chart libraries - SVG polygon radar drawn from scratch.

**Tech Stack:** Next.js 16 App Router, TypeScript, Drizzle ORM (pg), Tailwind CSS v4, Framer Motion v12, Aceternity components (`ShimmerLoader`, `StatefulButton`, `GlowingEffect`, `Timeline`), Clerk auth (`auth()` server-side), `react-markdown` (already installed).

---

## Task 1: Schema - Add `skillAssessments` Table

**File:** `data/schema/index.ts`

- [ ] **Step 1: Add imports**

At the top of `data/schema/index.ts`, the existing import line is:

```ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
```

Add `uuid` to the import:

```ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
```

- [ ] **Step 2: Append the table definition at the bottom of `data/schema/index.ts`**

```ts
// --- Skill Gap ---

export type SkillEntry = {
  name: string;
  level: number; // 0–5
  category: string;
};

export type TargetSkillEntry = {
  name: string;
  requiredLevel: number; // 0–5
  category: string;
  marketDemand: "high" | "medium" | "low";
};

export type SkillGap = {
  skill: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  delta: number;
  priority: "critical" | "important" | "nice";
  marketDemand: "high" | "medium" | "low";
};

export type LearningResource = {
  title: string;
  url: string;
  type: "course" | "book" | "article" | "video" | "practice";
};

export type LearningPlanItem = {
  skill: string;
  weeks: number;
  resources: LearningResource[];
};

export const skillAssessments = pgTable("skill_assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  currentRole: text("current_role").notNull(),
  targetRole: text("target_role").notNull(),
  currentSkills: jsonb("current_skills")
    .$type<SkillEntry[]>()
    .notNull()
    .default([]),
  targetSkills: jsonb("target_skills")
    .$type<TargetSkillEntry[]>()
    .notNull()
    .default([]),
  gaps: jsonb("gaps").$type<SkillGap[]>().notNull().default([]),
  learningPlan: jsonb("learning_plan")
    .$type<LearningPlanItem[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

## Task 2: Database Migration

**File:** create `data/migrations/0007_skill_assessments.sql`  
(Adjust the number to match the next migration in your `data/migrations/` directory.)

- [ ] **Step 3: Create migration SQL**

```sql
CREATE TABLE IF NOT EXISTS "skill_assessments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "current_role" text NOT NULL,
  "target_role" text NOT NULL,
  "current_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "target_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "gaps" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "learning_plan" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

Run with: `npx drizzle-kit push` (or the project's migration command).

---

## Task 3: Repository Layer

**File:** `data/repositories/skillAssessments.repo.ts`

- [ ] **Step 4: Create repository**

```ts
import { db } from "@/data/client";
import { skillAssessments } from "@/data/schema";
import { eq, desc } from "drizzle-orm";

export type SkillAssessment = typeof skillAssessments.$inferSelect;
export type NewSkillAssessment = typeof skillAssessments.$inferInsert;

export async function createSkillAssessment(
  data: NewSkillAssessment,
): Promise<SkillAssessment> {
  const [row] = await db
    .insert(skillAssessments)
    .values({ ...data, updatedAt: new Date() })
    .returning();
  return row;
}

export async function getSkillAssessments(
  userId: string,
): Promise<SkillAssessment[]> {
  return db
    .select()
    .from(skillAssessments)
    .where(eq(skillAssessments.userId, userId))
    .orderBy(desc(skillAssessments.createdAt));
}

export async function getSkillAssessmentById(
  id: string,
  userId: string,
): Promise<SkillAssessment | null> {
  const [row] = await db
    .select()
    .from(skillAssessments)
    .where(eq(skillAssessments.id, id))
    .limit(1);
  if (!row || row.userId !== userId) return null;
  return row;
}

export async function updateSkillAssessmentLearningPlan(
  id: string,
  userId: string,
  learningPlan: SkillAssessment["learningPlan"],
): Promise<SkillAssessment | null> {
  const [row] = await db
    .update(skillAssessments)
    .set({ learningPlan, updatedAt: new Date() })
    .where(eq(skillAssessments.id, id))
    .returning();
  if (!row || row.userId !== userId) return null;
  return row;
}
```

---

## Task 4: API Routes

### 4a. `POST /api/skill-assessments` + `GET /api/skill-assessments`

**File:** `app/api/skill-assessments/route.ts`

- [ ] **Step 5: Create route**

````ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createSkillAssessment,
  getSkillAssessments,
} from "@/data/repositories/skillAssessments.repo";
import type { SkillEntry, TargetSkillEntry } from "@/data/schema";

// Helper: call AI to compute gaps + target skills from role description
async function computeGapsViaAI(
  currentRole: string,
  targetRole: string,
  currentSkills: SkillEntry[],
  baseUrl: string,
): Promise<{
  targetSkills: TargetSkillEntry[];
  gaps: import("@/data/schema").SkillGap[];
}> {
  const prompt = `You are a career intelligence engine. Given:
- Current Role: ${currentRole}
- Target Role: ${targetRole}
- Current Skills (self-rated 0-5): ${JSON.stringify(currentSkills)}

Return ONLY valid JSON (no markdown, no explanation) with this exact shape:
{
  "targetSkills": [
    { "name": string, "requiredLevel": number (0-5), "category": string, "marketDemand": "high"|"medium"|"low" }
  ],
  "gaps": [
    { "skill": string, "category": string, "currentLevel": number, "requiredLevel": number, "delta": number, "priority": "critical"|"important"|"nice", "marketDemand": "high"|"medium"|"low" }
  ]
}
Include 8-12 target skills. Only include gaps where delta > 0. Sort gaps by priority then delta desc.`;

  const res = await fetch(`${baseUrl}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      featureId: "skillGapAnalyzer",
      inputs: { _raw: prompt },
    }),
  });

  if (!res.ok) throw new Error("AI call failed");

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }
  }

  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  return JSON.parse(cleaned) as {
    targetSkills: TargetSkillEntry[];
    gaps: import("@/data/schema").SkillGap[];
  };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    currentRole: string;
    targetRole: string;
    currentSkills: SkillEntry[];
  };

  if (
    !body.currentRole ||
    !body.targetRole ||
    !Array.isArray(body.currentSkills)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const baseUrl = req.nextUrl.origin;

  try {
    const { targetSkills, gaps } = await computeGapsViaAI(
      body.currentRole,
      body.targetRole,
      body.currentSkills,
      baseUrl,
    );

    const assessment = await createSkillAssessment({
      userId,
      currentRole: body.currentRole,
      targetRole: body.targetRole,
      currentSkills: body.currentSkills,
      targetSkills,
      gaps,
      learningPlan: [],
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to create assessment";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assessments = await getSkillAssessments(userId);
  return NextResponse.json(assessments);
}
````

### 4b. `GET /api/skill-assessments/[id]`

**File:** `app/api/skill-assessments/[id]/route.ts`

- [ ] **Step 6: Create dynamic route**

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSkillAssessmentById } from "@/data/repositories/skillAssessments.repo";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await getSkillAssessmentById(id, userId);
  if (!assessment)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(assessment);
}
```

### 4c. `POST /api/skill-assessments/[id]/learning-plan`

**File:** `app/api/skill-assessments/[id]/learning-plan/route.ts`

- [ ] **Step 7: Create learning plan generation route**

````ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getSkillAssessmentById,
  updateSkillAssessmentLearningPlan,
} from "@/data/repositories/skillAssessments.repo";
import type { LearningPlanItem } from "@/data/schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await getSkillAssessmentById(id, userId);
  if (!assessment)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const topGaps = assessment.gaps
    .filter((g) => g.priority === "critical" || g.priority === "important")
    .slice(0, 6);

  const prompt = `You are a learning plan architect. Create a concrete 4-8 week learning plan for these skill gaps:
${JSON.stringify(topGaps, null, 2)}

Context: transitioning from ${assessment.currentRole} to ${assessment.targetRole}.

Return ONLY valid JSON (no markdown, no explanation) as an array:
[
  {
    "skill": string,
    "weeks": number (1-4),
    "resources": [
      { "title": string, "url": string, "type": "course"|"book"|"article"|"video"|"practice" }
    ]
  }
]
Include 2-4 real, specific resources per skill. Use real URLs (Coursera, YouTube, docs, etc.).`;

  const aiRes = await fetch(`${req.nextUrl.origin}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      featureId: "learningPlanGenerator",
      inputs: { _raw: prompt },
    }),
  });

  if (!aiRes.ok)
    return NextResponse.json({ error: "AI call failed" }, { status: 500 });

  const reader = aiRes.body?.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }
  }

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  const learningPlan = JSON.parse(cleaned) as LearningPlanItem[];

  const updated = await updateSkillAssessmentLearningPlan(
    id,
    userId,
    learningPlan,
  );
  return NextResponse.json(updated);
}
````

---

## Task 5: Components

### 5a. `SkillRadarChart.tsx`

**File:** `app/(app)/tools/skillGap/_components/SkillRadarChart.tsx`

- [ ] **Step 8: Create SVG radar chart (no external lib)**

```tsx
"use client";
import { motion } from "framer-motion";
import type { SkillEntry, TargetSkillEntry } from "@/data/schema";

interface Props {
  currentSkills: SkillEntry[];
  targetSkills: TargetSkillEntry[];
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad - Math.PI / 2),
    y: cy + r * Math.sin(angleRad - Math.PI / 2),
  };
}

function polygonPoints(
  cx: number,
  cy: number,
  maxR: number,
  values: number[],
  maxVal: number,
) {
  return values
    .map((v, i) => {
      const angle = (2 * Math.PI * i) / values.length;
      const r = (v / maxVal) * maxR;
      const pt = polarToCartesian(cx, cy, r, angle);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");
}

export function SkillRadarChart({
  currentSkills,
  targetSkills,
  size = 300,
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 32;

  // Merge into unified axis list (by name, matched to target)
  const axes = targetSkills.slice(0, 10).map((ts) => {
    const current = currentSkills.find(
      (cs) => cs.name.toLowerCase() === ts.name.toLowerCase(),
    );
    return {
      name: ts.name,
      current: current?.level ?? 0,
      target: ts.requiredLevel,
    };
  });

  const n = axes.length;
  if (n < 3) return null;

  const gridLevels = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(cx, cy, maxR, Array(n).fill(level), 5)}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={0.5}
            opacity={0.4}
          />
        ))}

        {/* Axis spokes */}
        {axes.map((_, i) => {
          const angle = (2 * Math.PI * i) / n;
          const end = polarToCartesian(cx, cy, maxR, angle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              opacity={0.4}
            />
          );
        })}

        {/* Target polygon */}
        <motion.polygon
          points={polygonPoints(
            cx,
            cy,
            maxR,
            axes.map((a) => a.target),
            5,
          )}
          fill="hsl(var(--primary) / 0.08)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth={1.5}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Current polygon */}
        <motion.polygon
          points={polygonPoints(
            cx,
            cy,
            maxR,
            axes.map((a) => a.current),
            5,
          )}
          fill="hsl(160 84% 39% / 0.15)"
          stroke="hsl(160 84% 39%)"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Axis labels */}
        {axes.map((axis, i) => {
          const angle = (2 * Math.PI * i) / n;
          const labelR = maxR + 18;
          const pt = polarToCartesian(cx, cy, labelR, angle);
          const anchor =
            pt.x < cx - 5 ? "end" : pt.x > cx + 5 ? "start" : "middle";
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={10}
              fill="hsl(var(--muted-foreground))"
              className="font-medium"
            >
              {axis.name.length > 14 ? axis.name.slice(0, 13) + "…" : axis.name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-teal-500 inline-block rounded" />
          Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-primary/50 inline-block rounded" />
          Target Role
        </span>
      </div>
    </div>
  );
}
```

### 5b. `PriorityMatrix.tsx`

**File:** `app/(app)/tools/skillGap/_components/PriorityMatrix.tsx`

- [ ] **Step 9: Create 2x2 priority matrix**

```tsx
"use client";
import { motion } from "framer-motion";
import type { SkillGap } from "@/data/schema";

interface Props {
  gaps: SkillGap[];
}

type Quadrant = {
  label: string;
  sublabel: string;
  bg: string;
  border: string;
  dot: string;
  filter: (g: SkillGap) => boolean;
};

const quadrants: Quadrant[] = [
  {
    label: "Do First",
    sublabel: "High impact · High demand",
    bg: "bg-teal-500/8",
    border: "border-teal-500/20",
    dot: "bg-teal-400",
    filter: (g) => g.priority === "critical" && g.marketDemand === "high",
  },
  {
    label: "Plan",
    sublabel: "High impact · Lower demand",
    bg: "bg-blue-500/8",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
    filter: (g) => g.priority === "critical" && g.marketDemand !== "high",
  },
  {
    label: "Delegate / Async",
    sublabel: "Nice-to-have · High demand",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    filter: (g) => g.priority !== "critical" && g.marketDemand === "high",
  },
  {
    label: "Deprioritise",
    sublabel: "Nice-to-have · Lower demand",
    bg: "bg-muted/30",
    border: "border-border",
    dot: "bg-muted-foreground",
    filter: (g) => g.priority !== "critical" && g.marketDemand !== "high",
  },
];

export function PriorityMatrix({ gaps }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quadrants.map((q, qi) => {
        const items = gaps.filter(q.filter);
        return (
          <motion.div
            key={qi}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: qi * 0.07 }}
            className={`rounded-2xl border ${q.bg} ${q.border} p-4 min-h-[120px]`}
          >
            <p className="text-xs font-bold text-foreground mb-0.5">
              {q.label}
            </p>
            <p className="text-[10px] text-muted-foreground mb-3">
              {q.sublabel}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {items.length === 0 && (
                <p className="text-[10px] text-muted-foreground/50 italic">
                  None
                </p>
              )}
              {items.map((g) => (
                <span
                  key={g.skill}
                  className="inline-flex items-center gap-1 text-[10px] font-medium bg-background/60 border border-border rounded-full px-2 py-0.5"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${q.dot} shrink-0`}
                  />
                  {g.skill}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

### 5c. `SkillGapCard.tsx`

**File:** `app/(app)/tools/skillGap/_components/SkillGapCard.tsx`

- [ ] **Step 10: Create skill gap card**

```tsx
"use client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { SkillGap, LearningPlanItem } from "@/data/schema";

interface Props {
  gap: SkillGap;
  plan?: LearningPlanItem;
  index: number;
}

const priorityConfig: Record<
  SkillGap["priority"],
  { label: string; color: string }
> = {
  critical: {
    label: "Critical",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  important: {
    label: "Important",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  nice: {
    label: "Nice to have",
    color: "text-muted-foreground bg-muted/30 border-border",
  },
};

const demandConfig: Record<SkillGap["marketDemand"], string> = {
  high: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  medium: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  low: "text-muted-foreground bg-muted/30 border-border",
};

const resourceTypeIcon: Record<string, string> = {
  course: "🎓",
  book: "📖",
  article: "📄",
  video: "▶️",
  practice: "🛠",
};

export function SkillGapCard({ gap, plan, index }: Props) {
  const pCfg = priorityConfig[gap.priority];
  const dCfg = demandConfig[gap.marketDemand];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">{gap.skill}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {gap.category}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <span
            className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${pCfg.color}`}
          >
            {pCfg.label}
          </span>
          <span
            className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${dCfg}`}
          >
            {gap.marketDemand} demand
          </span>
        </div>
      </div>

      {/* Level progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Your level</span>
          <span className="font-semibold text-foreground">
            {gap.currentLevel} / 5
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${(gap.currentLevel / 5) * 100}%` }}
            transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Target level</span>
          <span className="font-semibold text-foreground">
            {gap.requiredLevel} / 5
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/30"
            style={{ width: `${(gap.requiredLevel / 5) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Gap:{" "}
          <span className="font-semibold text-foreground">
            +{gap.delta} levels
          </span>
          {plan && (
            <span className="ml-2 text-teal-400">
              · ~{plan.weeks} week{plan.weeks > 1 ? "s" : ""} to close
            </span>
          )}
        </p>
      </div>

      {/* Resources */}
      {plan && plan.resources.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Resources
          </p>
          {plan.resources.map((r, ri) => (
            <a
              key={ri}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span>{resourceTypeIcon[r.type] ?? "🔗"}</span>
              <span className="flex-1 truncate group-hover:underline underline-offset-2">
                {r.title}
              </span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
```

### 5d. `LearningPlanTimeline.tsx`

**File:** `app/(app)/tools/skillGap/_components/LearningPlanTimeline.tsx`

- [ ] **Step 11: Create weekly plan visualization**

```tsx
"use client";
import { motion } from "framer-motion";
import type { LearningPlanItem } from "@/data/schema";

interface Props {
  plan: LearningPlanItem[];
}

// Build week-by-week view: figure out which skills are active per week
function buildWeekMap(
  plan: LearningPlanItem[],
): Map<number, LearningPlanItem[]> {
  const map = new Map<number, LearningPlanItem[]>();
  let cursor = 1;
  for (const item of plan) {
    for (let w = cursor; w < cursor + item.weeks; w++) {
      const existing = map.get(w) ?? [];
      map.set(w, [...existing, item]);
    }
    cursor += item.weeks;
  }
  return map;
}

const weekColors = [
  "bg-teal-500/15 border-teal-500/25 text-teal-400",
  "bg-blue-500/15 border-blue-500/25 text-blue-400",
  "bg-violet-500/15 border-violet-500/25 text-violet-400",
  "bg-amber-500/15 border-amber-500/25 text-amber-400",
  "bg-pink-500/15 border-pink-500/25 text-pink-400",
  "bg-cyan-500/15 border-cyan-500/25 text-cyan-400",
];

export function LearningPlanTimeline({ plan }: Props) {
  if (plan.length === 0) return null;

  const weekMap = buildWeekMap(plan);
  const totalWeeks = Math.max(...Array.from(weekMap.keys()));

  return (
    <div className="space-y-3">
      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => {
        const items = weekMap.get(week) ?? [];
        return (
          <motion.div
            key={week}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: (week - 1) * 0.06 }}
            className="flex gap-4 items-start"
          >
            {/* Week pill */}
            <div className="shrink-0 w-14 h-7 rounded-lg bg-muted/40 border border-border flex items-center justify-center">
              <span className="text-[10px] font-bold text-muted-foreground">
                Wk {week}
              </span>
            </div>

            {/* Skills active this week */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {items.map((item, ii) => (
                <span
                  key={item.skill}
                  className={`inline-flex items-center text-[11px] font-semibold border rounded-xl px-3 py-1 ${weekColors[(ii + week) % weekColors.length]}`}
                >
                  {item.skill}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

---

## Task 6: Assess Page

**File:** `app/(app)/tools/skillGap/assess/page.tsx`

- [ ] **Step 12: Create assessment setup page**

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfile } from "@/data/repositories/profiles.repo";
import { AssessPageClient } from "./_client";

export const metadata = { title: "Assess Your Skills · Kairoo" };

export default async function AssessPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await getProfile(userId);

  return (
    <AssessPageClient
      prefillCurrentRole={profile?.currentRole ?? ""}
      prefillTargetRole={profile?.targetRole ?? ""}
      prefillSkills={(profile?.skills ?? []) as string[]}
    />
  );
}
```

**File:** `app/(app)/tools/skillGap/assess/_client.tsx`

- [ ] **Step 13: Create client for assess page**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Plus, Minus } from "lucide-react";
import { StatefulButton } from "@/components/aceternity/StatefulButton";
import type { SkillEntry } from "@/data/schema";

interface Props {
  prefillCurrentRole: string;
  prefillTargetRole: string;
  prefillSkills: string[];
}

const SKILL_CATEGORIES = [
  {
    category: "Technical",
    suggestions: [
      "Python",
      "SQL",
      "Cloud (AWS/GCP/Azure)",
      "System Design",
      "APIs / Backend",
      "Frontend / React",
      "Data Analysis",
      "DevOps / CI-CD",
    ],
  },
  {
    category: "Leadership",
    suggestions: [
      "Project Management",
      "Team Leadership",
      "Stakeholder Management",
      "Hiring / Interviews",
      "OKR Setting",
    ],
  },
  {
    category: "Communication",
    suggestions: [
      "Written Communication",
      "Presentations",
      "Negotiation",
      "Public Speaking",
    ],
  },
  {
    category: "Domain",
    suggestions: [
      "Product Strategy",
      "Market Research",
      "Financial Modeling",
      "UX / Design Thinking",
      "Legal / Compliance",
    ],
  },
];

function LevelSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-4">{value}</span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 accent-teal-500 cursor-pointer"
      />
      <span className="text-[10px] text-muted-foreground w-4 text-right">
        5
      </span>
    </div>
  );
}

export function AssessPageClient({
  prefillCurrentRole,
  prefillTargetRole,
  prefillSkills,
}: Props) {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState(prefillCurrentRole);
  const [targetRole, setTargetRole] = useState(prefillTargetRole);
  const [skills, setSkills] = useState<SkillEntry[]>(() =>
    prefillSkills
      .slice(0, 8)
      .map((name) => ({ name, level: 2, category: "Technical" })),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSkill = (name: string, category: string) => {
    if (skills.find((s) => s.name === name)) return;
    setSkills((prev) => [...prev, { name, level: 2, category }]);
  };

  const removeSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
  };

  const updateLevel = (name: string, level: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.name === name ? { ...s, level } : s)),
    );
  };

  const canSubmit =
    currentRole.trim() && targetRole.trim() && skills.length >= 3;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/skill-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRole,
          targetRole,
          currentSkills: skills,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({ error: "Failed" }))) as {
          error: string;
        };
        throw new Error(err.error);
      }
      const data = (await res.json()) as { id: string };
      router.push(`/tools/skillGap?id=${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Skill Gap Assessment
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rate your current skills and define your target role - AI will map the
          gap.
        </p>
      </div>

      <div className="space-y-6">
        {/* Roles */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground">Roles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Current Role <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Target Role <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Engineering Manager"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Skill rating */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Your Current Skills
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Minimum 3 skills
            </p>
          </div>

          {/* Category suggestion pills */}
          <div className="space-y-3">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                  {cat.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.suggestions.map((s) => {
                    const added = skills.some((sk) => sk.name === s);
                    return (
                      <button
                        key={s}
                        onClick={() =>
                          added ? removeSkill(s) : addSkill(s, cat.category)
                        }
                        className={`text-[11px] font-medium border rounded-full px-2.5 py-0.5 cursor-pointer transition-all ${
                          added
                            ? "bg-teal-500/15 border-teal-500/30 text-teal-400"
                            : "bg-background border-border text-muted-foreground hover:border-teal-500/30 hover:text-foreground"
                        }`}
                      >
                        {added ? "✓ " : "+ "}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Skill sliders */}
          <AnimatePresence>
            {skills.length > 0 && (
              <motion.div className="space-y-3 pt-2 border-t border-border">
                <p className="text-[11px] font-semibold text-muted-foreground pt-1">
                  Rate your level (0 = beginner, 5 = expert)
                </p>
                {skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-36 shrink-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {skill.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {skill.category}
                      </p>
                    </div>
                    <div className="flex-1">
                      <LevelSlider
                        value={skill.level}
                        onChange={(v) => updateLevel(skill.name, v)}
                      />
                    </div>
                    <button
                      onClick={() => removeSkill(skill.name)}
                      className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all cursor-pointer ${
            canSubmit && !loading
              ? "bg-teal-500 text-black hover:bg-teal-400"
              : "bg-teal-500/20 text-teal-400/50 cursor-not-allowed"
          }`}
        >
          <Zap className="w-4 h-4" />
          {loading ? "Analysing with AI…" : "Analyse My Skill Gap"}
        </button>
      </div>
    </div>
  );
}
```

---

## Task 7: Dashboard Page

**File:** `app/(app)/tools/skillGap/page.tsx`

- [ ] **Step 14: Create dashboard page (server component)**

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getSkillAssessments,
  getSkillAssessmentById,
} from "@/data/repositories/skillAssessments.repo";
import { SkillGapDashboardClient } from "./_client";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export const metadata = { title: "Skill Gap Dashboard · Kairoo" };

export default async function SkillGapPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await searchParams;
  const [assessments, current] = await Promise.all([
    getSkillAssessments(userId),
    id ? getSkillAssessmentById(id, userId) : Promise.resolve(null),
  ]);

  // If no assessments and no id param, send to assess page
  if (assessments.length === 0 && !id) {
    redirect("/tools/skillGap/assess");
  }

  const active = current ?? assessments[0] ?? null;

  return <SkillGapDashboardClient assessments={assessments} active={active} />;
}
```

**File:** `app/(app)/tools/skillGap/_client.tsx`

- [ ] **Step 15: Create dashboard client component**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Clock, Target } from "lucide-react";
import { SkillRadarChart } from "./_components/SkillRadarChart";
import { PriorityMatrix } from "./_components/PriorityMatrix";
import { SkillGapCard } from "./_components/SkillGapCard";
import { LearningPlanTimeline } from "./_components/LearningPlanTimeline";
import type { SkillAssessment } from "@/data/repositories/skillAssessments.repo";

interface Props {
  assessments: SkillAssessment[];
  active: SkillAssessment | null;
}

export function SkillGapDashboardClient({
  assessments,
  active: initialActive,
}: Props) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState("");

  const generatePlan = async () => {
    if (!active) return;
    setGeneratingPlan(true);
    setPlanError("");
    try {
      const res = await fetch(
        `/api/skill-assessments/${active.id}/learning-plan`,
        {
          method: "POST",
        },
      );
      if (!res.ok) {
        const err = (await res.json().catch(() => ({ error: "Failed" }))) as {
          error: string;
        };
        throw new Error(err.error);
      }
      const updated = (await res.json()) as SkillAssessment;
      setActive(updated);
    } catch (err: unknown) {
      setPlanError(
        err instanceof Error ? err.message : "Failed to generate plan",
      );
    } finally {
      setGeneratingPlan(false);
    }
  };

  if (!active) return null;

  const criticalGaps = active.gaps.filter((g) => g.priority === "critical");
  const totalWeeks = active.learningPlan.reduce((sum, p) => sum + p.weeks, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Skill Gap Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-foreground font-semibold">
              {active.currentRole}
            </span>
            {" → "}
            <span className="text-teal-400 font-semibold">
              {active.targetRole}
            </span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {assessments.length > 1 && (
            <select
              onChange={(e) => {
                const found = assessments.find((a) => a.id === e.target.value);
                if (found) setActive(found);
                router.push(`/tools/skillGap?id=${e.target.value}`, {
                  scroll: false,
                });
              }}
              value={active.id}
              className="text-xs bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-teal-500/50 cursor-pointer"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.targetRole} · {new Date(a.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => router.push("/tools/skillGap/assess")}
            className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500 text-black hover:bg-teal-400 transition-colors px-3 py-2 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Target,
            label: "Critical Gaps",
            value: criticalGaps.length,
            color: "text-red-400",
          },
          {
            icon: RefreshCw,
            label: "Total Gaps",
            value: active.gaps.length,
            color: "text-amber-400",
          },
          {
            icon: Clock,
            label: "Est. Weeks",
            value: totalWeeks > 0 ? `${totalWeeks}w` : "-",
            color: "text-teal-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-muted/30 flex items-center justify-center">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-extrabold text-foreground">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Radar + Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5 items-start">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">
            Skills Radar
          </h2>
          <SkillRadarChart
            currentSkills={active.currentSkills}
            targetSkills={active.targetSkills}
            size={280}
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">
            Priority Matrix
          </h2>
          <PriorityMatrix gaps={active.gaps} />
        </div>
      </div>

      {/* Gap cards */}
      {active.gaps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">
              All Skill Gaps
            </h2>
            {active.learningPlan.length === 0 && (
              <button
                onClick={generatePlan}
                disabled={generatingPlan}
                className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 border border-teal-500/20 hover:border-teal-500/40 bg-teal-500/8 rounded-xl px-3 py-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                {generatingPlan ? "Generating…" : "Generate Learning Plan"}
              </button>
            )}
          </div>
          {planError && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-4">
              {planError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.gaps.map((gap, i) => (
              <SkillGapCard
                key={gap.skill}
                gap={gap}
                plan={active.learningPlan.find((p) => p.skill === gap.skill)}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Learning timeline */}
      {active.learningPlan.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground mb-4">
            Learning Plan Timeline
          </h2>
          <LearningPlanTimeline plan={active.learningPlan} />
        </div>
      )}
    </div>
  );
}
```

Note: Add `import { Zap } from 'lucide-react'` at the top of `_client.tsx`.

---

## Task 8: TypeScript + Build Verification

- [ ] **Step 16: Run TypeScript check**

```bash
npx tsc --noEmit
```

Fix any type errors. Common issues:

- `uuid` import from `drizzle-orm/pg-core` - if not available, use `text('id').primaryKey()` with `crypto.randomUUID()` in repo instead, and update schema/migration accordingly.
- Missing `Zap` import in `_client.tsx` - add `import { Zap } from 'lucide-react'`.

- [ ] **Step 17: Run dev server and verify**

```bash
npm run dev
```

Navigate to `/tools/skillGap/assess` - complete form → should redirect to `/tools/skillGap?id=...` with radar, matrix, and gap cards.

---

## Summary

| Layer      | Files                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| Schema     | `data/schema/index.ts` (appended)                                                                       |
| Migration  | `data/migrations/0007_skill_assessments.sql`                                                            |
| Repository | `data/repositories/skillAssessments.repo.ts`                                                            |
| API Routes | `app/api/skill-assessments/route.ts`, `[id]/route.ts`, `[id]/learning-plan/route.ts`                    |
| Pages      | `app/(app)/tools/skillGap/page.tsx`, `_client.tsx`, `assess/page.tsx`, `assess/_client.tsx`             |
| Components | `_components/SkillRadarChart.tsx`, `PriorityMatrix.tsx`, `SkillGapCard.tsx`, `LearningPlanTimeline.tsx` |

**Total tasks: 17 steps across 8 task groups.**
