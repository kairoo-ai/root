# Resume Builder - Full Implementation Plan

_Date: 2026-06-15_

## Overview

Visual Resume Builder with two-pane editor (accordion left / live preview right), 4 templates, per-section AI generation, ATS keyword scoring, and auto-save. Built on Drizzle + Neon, App Router API routes, Framer Motion, and Aceternity components.

---

## Task List (22 tasks)

1. Drizzle schema - `resumes` table
2. DB migration
3. Repository - `resumes.repo.ts`
4. AI registry entry - `resumeSection` feature
5. API route - `POST /api/resumes`
6. API route - `GET /api/resumes`
7. API route - `GET /api/resumes/[id]`
8. API route - `PATCH /api/resumes/[id]`
9. API route - `POST /api/resumes/[id]/ats-score`
10. API route - `DELETE /api/resumes/[id]`
11. Type file - `types/resume.ts`
12. Component - `ResumeEditorPanel.tsx`
13. Component - `SectionEditor.tsx`
14. Component - `BulletEditor.tsx`
15. Component - `ATSSidebar.tsx`
16. Component - `ResumePreview.tsx`
17. Template - `MinimalTemplate.tsx`
18. Template - `ModernTemplate.tsx`
19. Template - `ExecutiveTemplate.tsx`
20. Template - `CreativeTemplate.tsx`
21. Page - `app/(app)/tools/resumeBuilder/page.tsx` (hub)
22. Page - `app/(app)/tools/resumeBuilder/[id]/page.tsx` (editor)

---

## Task 1 - Drizzle Schema

**File:** `data/schema/index.ts` (append at bottom)

```ts
export const resumes = pgTable("resumes", {
  id: text("id").primaryKey(), // nanoid
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull().default("Untitled Resume"),
  targetRole: text("target_role"),
  targetCompany: text("target_company"),
  jobDescription: text("job_description"),
  sections: jsonb("sections").$type<ResumeSections>().notNull(),
  templateId: text("template_id", {
    enum: ["minimal", "modern", "executive", "creative"],
  })
    .notNull()
    .default("minimal"),
  atsScore: integer("ats_score"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

> Note: `ResumeSections` is imported from `@/types/resume` - but schema/index.ts has no runtime dependency on types; use `import type` at the top of the file.

---

## Task 2 - DB Migration

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## Task 3 - Repository

**File:** `data/repositories/resumes.repo.ts`

```ts
import { db } from "@/data/client";
import { resumes } from "@/data/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { ResumeSections, ResumeTemplateId } from "@/types/resume";

export type Resume = typeof resumes.$inferSelect;
export type ResumeInsert = typeof resumes.$inferInsert;

// ── List ──────────────────────────────────────────────────────────────────────
export async function listResumes(userId: string): Promise<Resume[]> {
  return db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.updatedAt));
}

// ── Get ───────────────────────────────────────────────────────────────────────
export async function getResume(
  userId: string,
  id: string,
): Promise<Resume | null> {
  const [row] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
    .limit(1);
  return row ?? null;
}

// ── Create ────────────────────────────────────────────────────────────────────
export async function createResume(
  userId: string,
  data: {
    name?: string;
    targetRole?: string;
    targetCompany?: string;
    jobDescription?: string;
    sections: ResumeSections;
    templateId?: ResumeTemplateId;
    isDefault?: boolean;
  },
): Promise<Resume> {
  const [row] = await db
    .insert(resumes)
    .values({
      id: nanoid(),
      userId,
      name: data.name ?? "Untitled Resume",
      targetRole: data.targetRole ?? null,
      targetCompany: data.targetCompany ?? null,
      jobDescription: data.jobDescription ?? null,
      sections: data.sections,
      templateId: data.templateId ?? "minimal",
      isDefault: data.isDefault ?? false,
    })
    .returning();
  return row;
}

// ── Update ────────────────────────────────────────────────────────────────────
export async function updateResume(
  userId: string,
  id: string,
  data: Partial<
    Pick<
      Resume,
      | "name"
      | "targetRole"
      | "targetCompany"
      | "jobDescription"
      | "templateId"
      | "atsScore"
      | "isDefault"
    > & { sections: ResumeSections }
  >,
): Promise<Resume | null> {
  const [row] = await db
    .update(resumes)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
    .returning();
  return row ?? null;
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteResume(userId: string, id: string): Promise<void> {
  await db
    .delete(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
}
```

---

## Task 4 - AI Registry Entry

**File:** `engines/ai/features/registry.ts` - add to the `features` array:

```ts
  {
    id: 'resumeSection',
    name: 'Resume Section Optimizer',
    icon: 'file-text',
    color: 'violet-400',
    description: 'AI-improves a single resume section using your target role and job description',
    category: 'career',
    status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'section', label: 'Section name', type: 'text', placeholder: 'e.g. summary', required: true },
      { id: 'currentContent', label: 'Current content', type: 'textarea', placeholder: 'Paste existing section text or JSON', required: true },
      { id: 'targetRole', label: 'Target role', type: 'text', placeholder: 'e.g. Senior Software Engineer' },
      { id: 'targetCompany', label: 'Target company (optional)', type: 'text', placeholder: 'e.g. Google' },
      { id: 'jobDescription', label: 'Job description (optional)', type: 'textarea', placeholder: 'Paste JD for ATS alignment' },
    ],
    systemAddendum: `You are an expert resume writer and ATS optimization specialist. Always output:
- Tight, metric-driven bullet points (use numbers wherever plausible: "Reduced latency by 40%")
- No filler phrases ("responsible for", "worked on")
- Active voice
- For the summary section: 3-4 sentences, first person omitted, starts with job title or expertise
- Return ONLY the improved content - no preamble, no explanation`,
    buildUserPrompt: (i) =>
      `Improve the "${i.section}" section of my resume.\n` +
      line('Current content', i.currentContent) +
      line('Target role', i.targetRole) +
      line('Target company', i.targetCompany) +
      line('Job description', i.jobDescription) +
      `\nReturn the improved ${i.section} content only.`,
  },
```

---

## Task 5 - POST /api/resumes

**File:** `app/api/resumes/route.ts`

```ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createResume, listResumes } from "@/data/repositories/resumes.repo";
import { getProfile } from "@/data/repositories/profiles.repo";
import {
  buildEmptySections,
  buildSectionsFromProfile,
} from "@/lib/resume-utils";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await listResumes(userId);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    name,
    targetRole,
    targetCompany,
    jobDescription,
    templateId,
    fromProfile,
  } = body as {
    name?: string;
    targetRole?: string;
    targetCompany?: string;
    jobDescription?: string;
    templateId?: string;
    fromProfile?: boolean;
  };

  let sections = buildEmptySections();

  if (fromProfile) {
    const profile = await getProfile(userId);
    if (profile) sections = buildSectionsFromProfile(profile);
  }

  const resume = await createResume(userId, {
    name: name ?? (fromProfile ? "From Profile" : "Untitled Resume"),
    targetRole,
    targetCompany,
    jobDescription,
    sections,
    templateId:
      (templateId as "minimal" | "modern" | "executive" | "creative") ??
      "minimal",
  });

  return NextResponse.json(resume, { status: 201 });
}
```

---

## Task 6 - GET /api/resumes (covered in Task 5 above)

---

## Task 7 - GET /api/resumes/[id]

**File:** `app/api/resumes/[id]/route.ts`

```ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  getResume,
  updateResume,
  deleteResume,
} from "@/data/repositories/resumes.repo";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const resume = await getResume(userId, id);
  if (!resume)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(resume);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const updated = await updateResume(userId, id, body);
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteResume(userId, id);
  return new NextResponse(null, { status: 204 });
}
```

---

## Task 8 - POST /api/resumes/[id]/ats-score

**File:** `app/api/resumes/[id]/ats-score/route.ts`

```ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getResume, updateResume } from "@/data/repositories/resumes.repo";
import { computeAtsScore } from "@/lib/resume-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const resume = await getResume(userId, id);
  if (!resume)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const jd: string = body.jobDescription ?? resume.jobDescription ?? "";

  if (!jd.trim()) {
    return NextResponse.json(
      { error: "No job description provided" },
      { status: 400 },
    );
  }

  const { score, found, missing } = computeAtsScore(resume.sections, jd);

  await updateResume(userId, id, { atsScore: score, jobDescription: jd });

  return NextResponse.json({ score, found, missing });
}
```

---

## Task 11 - Types

**File:** `types/resume.ts`

```ts
export type ResumeTemplateId = "minimal" | "modern" | "executive" | "creative";

export interface ContactSection {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface SummarySection {
  text: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
  location: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  tech: string[];
  url?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeSections {
  contact: ContactSection;
  summary: SummarySection;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
}

export interface ResumeRow {
  id: string;
  userId: string;
  name: string;
  targetRole: string | null;
  targetCompany: string | null;
  jobDescription: string | null;
  sections: ResumeSections;
  templateId: ResumeTemplateId;
  atsScore: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Utility - `lib/resume-utils.ts`

```ts
import type {
  ResumeSections,
  ContactSection,
  ExperienceEntry,
  EducationEntry,
  SkillCategory,
} from "@/types/resume";
import type { UserProfile } from "@/data/repositories/profiles.repo";
import { nanoid } from "nanoid";

export function buildEmptySections(): ResumeSections {
  return {
    contact: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: { text: "" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };
}

export function buildSectionsFromProfile(profile: UserProfile): ResumeSections {
  const contact: ContactSection = {
    name: "",
    email: "",
    phone: "",
    location: profile.location ?? "",
    linkedin: profile.linkedinUrl ?? "",
    github: profile.githubUrl ?? "",
    portfolio: profile.portfolioUrl ?? "",
  };

  const education: EducationEntry[] = (profile.education ?? []).map((e) => ({
    id: nanoid(),
    institution: e.institution,
    degree: e.degree,
    field: e.field,
    startDate: "",
    endDate: e.year ? String(e.year) : "",
  }));

  const skills: SkillCategory[] =
    profile.skills && profile.skills.length > 0
      ? [{ category: "Skills", items: profile.skills }]
      : [];

  // If they pasted raw resume text, put it in summary as a starting point
  const summary = {
    text: profile.resumeText ? profile.resumeText.slice(0, 600) : "",
  };

  return {
    contact,
    summary,
    experience: [],
    education,
    skills,
    projects: [],
    certifications: [],
  };
}

// Tokenize a string into lowercase words/phrases
function tokenize(text: string): Set<string> {
  const words = text.toLowerCase().match(/\b[a-z][a-z0-9.+#-]{1,}\b/g) ?? [];
  return new Set(words);
}

export function computeAtsScore(
  sections: ResumeSections,
  jobDescription: string,
): { score: number; found: string[]; missing: string[] } {
  const jdTokens = tokenize(jobDescription);

  // Flatten all resume text
  const resumeText = [
    sections.summary.text,
    ...sections.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...sections.skills.flatMap((s) => s.items),
    ...sections.projects.flatMap((p) => [
      ...p.bullets,
      ...p.tech,
      p.description,
    ]),
  ].join(" ");
  const resumeTokens = tokenize(resumeText);

  // Filter JD tokens to "meaningful" keywords (length >= 3, not stop words)
  const stopWords = new Set([
    "and",
    "the",
    "for",
    "with",
    "that",
    "this",
    "you",
    "are",
    "have",
    "will",
    "from",
    "our",
    "your",
    "they",
    "but",
    "not",
  ]);
  const keywords = [...jdTokens].filter(
    (t) => t.length >= 3 && !stopWords.has(t),
  );

  const found = keywords.filter((k) => resumeTokens.has(k));
  const missing = keywords.filter((k) => !resumeTokens.has(k)).slice(0, 20);

  const score =
    keywords.length > 0
      ? Math.round((found.length / keywords.length) * 100)
      : 0;

  return { score: Math.min(score, 100), found: found.slice(0, 30), missing };
}
```

---

## Task 12 - ResumeEditorPanel

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/ResumeEditorPanel.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Wand2 } from "lucide-react";
import type { ResumeSections } from "@/types/resume";
import SectionEditor from "./SectionEditor";

interface Props {
  sections: ResumeSections;
  onChange: (sections: ResumeSections) => void;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
}

const SECTION_ORDER: Array<keyof ResumeSections> = [
  "contact",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

const SECTION_LABELS: Record<keyof ResumeSections, string> = {
  contact: "Contact",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
};

export default function ResumeEditorPanel({
  sections,
  onChange,
  targetRole,
  targetCompany,
  jobDescription,
}: Props) {
  const [openSection, setOpenSection] =
    useState<keyof ResumeSections>("summary");

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto pr-2">
      {SECTION_ORDER.map((key) => (
        <div
          key={key}
          className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
        >
          <button
            onClick={() =>
              setOpenSection(
                openSection === key ? ("" as keyof ResumeSections) : key,
              )
            }
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
          >
            <span>{SECTION_LABELS[key]}</span>
            <motion.div
              animate={{ rotate: openSection === key ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-white/40" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {openSection === key && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-1">
                  <SectionEditor
                    sectionKey={key}
                    sections={sections}
                    onChange={onChange}
                    targetRole={targetRole}
                    targetCompany={targetCompany}
                    jobDescription={jobDescription}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
```

---

## Task 13 - SectionEditor

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/SectionEditor.tsx`

```tsx
"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Trash2, Wand2 } from "lucide-react";
import type {
  ResumeSections,
  ExperienceEntry,
  EducationEntry,
  SkillCategory,
  ProjectEntry,
  CertificationEntry,
} from "@/types/resume";
import BulletEditor from "./BulletEditor";
import { useAIStream } from "@/hooks/useAIStream";

interface Props {
  sectionKey: keyof ResumeSections;
  sections: ResumeSections;
  onChange: (sections: ResumeSections) => void;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
}

function field(
  label: string,
  value: string,
  onSet: (v: string) => void,
  opts?: { multiline?: boolean; placeholder?: string },
) {
  const className =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all resize-none";
  return (
    <div className="flex flex-col gap-1" key={label}>
      <label className="text-xs text-white/50 uppercase tracking-wider">
        {label}
      </label>
      {opts?.multiline ? (
        <textarea
          rows={4}
          className={className}
          value={value}
          placeholder={opts.placeholder}
          onChange={(e) => onSet(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={className}
          value={value}
          placeholder={opts?.placeholder}
          onChange={(e) => onSet(e.target.value)}
        />
      )}
    </div>
  );
}

export default function SectionEditor({
  sectionKey,
  sections,
  onChange,
  targetRole,
  targetCompany,
  jobDescription,
}: Props) {
  const { stream, isStreaming } = useAIStream();

  const update = (patch: Partial<ResumeSections>) =>
    onChange({ ...sections, ...patch });

  // ── Contact ──────────────────────────────────────────────────────────────
  if (sectionKey === "contact") {
    const c = sections.contact;
    const set = (k: keyof typeof c) => (v: string) =>
      update({ contact: { ...c, [k]: v } });
    return (
      <div className="grid grid-cols-2 gap-3">
        {field("Full Name", c.name, set("name"), { placeholder: "Jane Smith" })}
        {field("Email", c.email, set("email"), {
          placeholder: "jane@example.com",
        })}
        {field("Phone", c.phone, set("phone"), {
          placeholder: "+1 555 000 0000",
        })}
        {field("Location", c.location, set("location"), {
          placeholder: "San Francisco, CA",
        })}
        {field("LinkedIn", c.linkedin, set("linkedin"), {
          placeholder: "linkedin.com/in/janesmith",
        })}
        {field("GitHub", c.github, set("github"), {
          placeholder: "github.com/janesmith",
        })}
        <div className="col-span-2">
          {field("Portfolio", c.portfolio, set("portfolio"), {
            placeholder: "janesmith.dev",
          })}
        </div>
      </div>
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  if (sectionKey === "summary") {
    const handleAI = async () => {
      const result = await stream("resumeSection", {
        section: "summary",
        currentContent: sections.summary.text,
        targetRole,
        targetCompany,
        jobDescription,
      });
      update({ summary: { text: result } });
    };

    return (
      <div className="flex flex-col gap-2">
        <textarea
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
          value={sections.summary.text}
          placeholder="Results-driven software engineer with 5+ years…"
          onChange={(e) => update({ summary: { text: e.target.value } })}
        />
        <button
          onClick={handleAI}
          disabled={isStreaming}
          className="self-end flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-3.5 h-3.5" />
          {isStreaming ? "Generating…" : "AI Improve"}
        </button>
      </div>
    );
  }

  // ── Experience ────────────────────────────────────────────────────────────
  if (sectionKey === "experience") {
    const entries = sections.experience;
    const addEntry = () =>
      update({
        experience: [
          ...entries,
          {
            id: nanoid(),
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            bullets: [""],
            location: "",
          },
        ],
      });
    const removeEntry = (id: string) =>
      update({ experience: entries.filter((e) => e.id !== id) });
    const patchEntry = (id: string, patch: Partial<ExperienceEntry>) =>
      update({
        experience: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      });

    return (
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5"
          >
            <div className="grid grid-cols-2 gap-2">
              {field(
                "Company",
                entry.company,
                (v) => patchEntry(entry.id, { company: v }),
                { placeholder: "Acme Corp" },
              )}
              {field(
                "Role",
                entry.role,
                (v) => patchEntry(entry.id, { role: v }),
                { placeholder: "Senior Engineer" },
              )}
              {field(
                "Start Date",
                entry.startDate,
                (v) => patchEntry(entry.id, { startDate: v }),
                { placeholder: "Jan 2022" },
              )}
              {field(
                "End Date",
                entry.endDate,
                (v) => patchEntry(entry.id, { endDate: v }),
                { placeholder: "Present" },
              )}
              <div className="col-span-2">
                {field(
                  "Location",
                  entry.location,
                  (v) => patchEntry(entry.id, { location: v }),
                  { placeholder: "Remote" },
                )}
              </div>
            </div>
            <BulletEditor
              bullets={entry.bullets}
              onChange={(bullets) => patchEntry(entry.id, { bullets })}
              onAIGenerate={async () => {
                const result = await stream("resumeSection", {
                  section: "experience bullets",
                  currentContent: entry.bullets.join("\n"),
                  targetRole,
                  targetCompany,
                  jobDescription,
                });
                const newBullets = result
                  .split("\n")
                  .filter(Boolean)
                  .map((b) => b.replace(/^[-•]\s*/, ""));
                patchEntry(entry.id, { bullets: newBullets });
              }}
              isStreaming={isStreaming}
            />
            <button
              onClick={() => removeEntry(entry.id)}
              className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </button>
      </div>
    );
  }

  // ── Education ─────────────────────────────────────────────────────────────
  if (sectionKey === "education") {
    const entries = sections.education;
    const addEntry = () =>
      update({
        education: [
          ...entries,
          {
            id: nanoid(),
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
          },
        ],
      });
    const removeEntry = (id: string) =>
      update({ education: entries.filter((e) => e.id !== id) });
    const patchEntry = (id: string, patch: Partial<EducationEntry>) =>
      update({
        education: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      });

    return (
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5"
          >
            <div className="grid grid-cols-2 gap-2">
              {field(
                "Institution",
                entry.institution,
                (v) => patchEntry(entry.id, { institution: v }),
                { placeholder: "MIT" },
              )}
              {field(
                "Degree",
                entry.degree,
                (v) => patchEntry(entry.id, { degree: v }),
                { placeholder: "B.S." },
              )}
              {field(
                "Field",
                entry.field,
                (v) => patchEntry(entry.id, { field: v }),
                { placeholder: "Computer Science" },
              )}
              {field(
                "GPA",
                entry.gpa ?? "",
                (v) => patchEntry(entry.id, { gpa: v }),
                { placeholder: "3.9" },
              )}
              {field(
                "Start",
                entry.startDate,
                (v) => patchEntry(entry.id, { startDate: v }),
                { placeholder: "Sep 2018" },
              )}
              {field(
                "End",
                entry.endDate,
                (v) => patchEntry(entry.id, { endDate: v }),
                { placeholder: "May 2022" },
              )}
            </div>
            <button
              onClick={() => removeEntry(entry.id)}
              className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>
    );
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  if (sectionKey === "skills") {
    const cats = sections.skills;
    const addCat = () =>
      update({ skills: [...cats, { category: "", items: [] }] });
    const removeCat = (i: number) =>
      update({ skills: cats.filter((_, idx) => idx !== i) });
    const patchCat = (i: number, patch: Partial<SkillCategory>) =>
      update({
        skills: cats.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
      });

    return (
      <div className="flex flex-col gap-3">
        {cats.map((cat, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5"
          >
            {field(
              "Category",
              cat.category,
              (v) => patchCat(i, { category: v }),
              { placeholder: "Languages" },
            )}
            {field(
              "Items (comma-separated)",
              cat.items.join(", "),
              (v) =>
                patchCat(i, {
                  items: v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }),
              { placeholder: "TypeScript, Python, Go" },
            )}
            <button
              onClick={() => removeCat(i)}
              className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addCat}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>
    );
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (sectionKey === "projects") {
    const entries = sections.projects;
    const addEntry = () =>
      update({
        projects: [
          ...entries,
          {
            id: nanoid(),
            name: "",
            description: "",
            bullets: [""],
            tech: [],
            url: "",
          },
        ],
      });
    const removeEntry = (id: string) =>
      update({ projects: entries.filter((e) => e.id !== id) });
    const patchEntry = (id: string, patch: Partial<ProjectEntry>) =>
      update({
        projects: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      });

    return (
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5"
          >
            {field(
              "Project Name",
              entry.name,
              (v) => patchEntry(entry.id, { name: v }),
              { placeholder: "OpenMetrics" },
            )}
            {field(
              "Description",
              entry.description,
              (v) => patchEntry(entry.id, { description: v }),
              { multiline: true, placeholder: "One-line description" },
            )}
            {field(
              "Tech Stack (comma-separated)",
              entry.tech.join(", "),
              (v) =>
                patchEntry(entry.id, {
                  tech: v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }),
              { placeholder: "React, Go, Postgres" },
            )}
            {field(
              "URL (optional)",
              entry.url ?? "",
              (v) => patchEntry(entry.id, { url: v }),
              { placeholder: "https://github.com/…" },
            )}
            <BulletEditor
              bullets={entry.bullets}
              onChange={(bullets) => patchEntry(entry.id, { bullets })}
              onAIGenerate={async () => {
                const result = await stream("resumeSection", {
                  section: "project bullets",
                  currentContent: entry.bullets.join("\n"),
                  targetRole,
                  targetCompany,
                  jobDescription,
                });
                const newBullets = result
                  .split("\n")
                  .filter(Boolean)
                  .map((b) => b.replace(/^[-•]\s*/, ""));
                patchEntry(entry.id, { bullets: newBullets });
              }}
              isStreaming={isStreaming}
            />
            <button
              onClick={() => removeEntry(entry.id)}
              className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>
    );
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (sectionKey === "certifications") {
    const entries = sections.certifications;
    const addEntry = () =>
      update({
        certifications: [
          ...entries,
          { name: "", issuer: "", date: "", url: "" },
        ],
      });
    const removeEntry = (i: number) =>
      update({ certifications: entries.filter((_, idx) => idx !== i) });
    const patchEntry = (i: number, patch: Partial<CertificationEntry>) =>
      update({
        certifications: entries.map((e, idx) =>
          idx === i ? { ...e, ...patch } : e,
        ),
      });

    return (
      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5"
          >
            <div className="grid grid-cols-2 gap-2">
              {field("Name", entry.name, (v) => patchEntry(i, { name: v }), {
                placeholder: "AWS Solutions Architect",
              })}
              {field(
                "Issuer",
                entry.issuer,
                (v) => patchEntry(i, { issuer: v }),
                { placeholder: "Amazon" },
              )}
              {field("Date", entry.date, (v) => patchEntry(i, { date: v }), {
                placeholder: "Mar 2024",
              })}
              {field(
                "URL (optional)",
                entry.url ?? "",
                (v) => patchEntry(i, { url: v }),
                { placeholder: "https://…" },
              )}
            </div>
            <button
              onClick={() => removeEntry(i)}
              className="self-end flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addEntry}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-white/20 hover:border-violet-400/40 text-white/50 hover:text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Certification
        </button>
      </div>
    );
  }

  return null;
}
```

---

## Task 14 - BulletEditor

Uses Aceternity `DraggableCard` for drag-to-reorder; each bullet has a per-item AI button.

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/BulletEditor.tsx`

```tsx
"use client";

import { useRef } from "react";
import { motion, Reorder } from "framer-motion";
import { Wand2, Plus, Trash2, GripVertical } from "lucide-react";

interface Props {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  onAIGenerate: () => Promise<void>;
  isStreaming: boolean;
}

export default function BulletEditor({
  bullets,
  onChange,
  onAIGenerate,
  isStreaming,
}: Props) {
  const set = (i: number, v: string) =>
    onChange(bullets.map((b, idx) => (idx === i ? v : b)));
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i));
  const add = () => onChange([...bullets, ""]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/50 uppercase tracking-wider">
          Bullets
        </span>
        <button
          onClick={onAIGenerate}
          disabled={isStreaming}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-3 h-3" />
          {isStreaming ? "Generating…" : "AI Improve All"}
        </button>
      </div>

      <Reorder.Group
        axis="y"
        values={bullets}
        onReorder={onChange}
        className="flex flex-col gap-1.5"
      >
        {bullets.map((bullet, i) => (
          <Reorder.Item
            key={bullet + i}
            value={bullet}
            className="flex items-center gap-2"
          >
            <motion.div
              className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors"
              whileDrag={{ scale: 1.02 }}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </motion.div>
            <input
              type="text"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              value={bullet}
              placeholder="Reduced page load time by 35% through…"
              onChange={(e) => set(i, e.target.value)}
            />
            <button
              onClick={() => remove(i)}
              className="text-white/30 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button
        onClick={add}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-dashed border-white/20 hover:border-violet-400/40 text-white/40 hover:text-white/60 transition-colors"
      >
        <Plus className="w-3 h-3" /> Add Bullet
      </button>
    </div>
  );
}
```

---

## Task 15 - ATSSidebar

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/ATSSidebar.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Target, ChevronRight } from "lucide-react";

interface AtsResult {
  score: number;
  found: string[];
  missing: string[];
}

interface Props {
  resumeId: string;
  initialScore: number | null;
  jobDescription: string;
  onScoreUpdate: (score: number) => void;
}

export default function ATSSidebar({
  resumeId,
  initialScore,
  jobDescription: initialJD,
  onScoreUpdate,
}: Props) {
  const [jd, setJd] = useState(initialJD);
  const [result, setResult] = useState<AtsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showJdInput, setShowJdInput] = useState(!initialJD);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd }),
      });
      if (res.ok) {
        const data = (await res.json()) as AtsResult;
        setResult(data);
        onScoreUpdate(data.score);
      }
    } finally {
      setLoading(false);
    }
  };

  const scoreColor =
    (result?.score ?? initialScore ?? 0) >= 70
      ? "text-emerald-400"
      : (result?.score ?? initialScore ?? 0) >= 40
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 h-full overflow-y-auto">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-semibold text-white">ATS Score</span>
      </div>

      {/* Score ring */}
      <div className="flex items-center justify-center py-2">
        <div className={`text-5xl font-bold tabular-nums ${scoreColor}`}>
          {result?.score ?? initialScore ?? "–"}
          {(result || initialScore !== null) && (
            <span className="text-xl text-white/40">/100</span>
          )}
        </div>
      </div>

      {/* JD input */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setShowJdInput(!showJdInput)}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${showJdInput ? "rotate-90" : ""}`}
          />
          {jd ? "Edit job description" : "Paste job description"}
        </button>

        {showJdInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2"
          >
            <textarea
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
              value={jd}
              placeholder="Paste the full job description here…"
              onChange={(e) => setJd(e.target.value)}
            />
            <button
              onClick={analyze}
              disabled={loading || !jd.trim()}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white transition-colors"
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </motion.div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-3">
          {result.found.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Matched Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.found.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" /> {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.missing.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Missing Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30"
                  >
                    <XCircle className="w-2.5 h-2.5" /> {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Task 16 - ResumePreview

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/ResumePreview.tsx`

```tsx
"use client";

import { useRef } from "react";
import { Printer } from "lucide-react";
import type { ResumeSections, ResumeTemplateId } from "@/types/resume";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";

const TEMPLATES: Array<{ id: ResumeTemplateId; label: string }> = [
  { id: "minimal", label: "Minimal" },
  { id: "modern", label: "Modern" },
  { id: "executive", label: "Executive" },
  { id: "creative", label: "Creative" },
];

interface Props {
  sections: ResumeSections;
  templateId: ResumeTemplateId;
  onTemplateChange: (id: ResumeTemplateId) => void;
}

export default function ResumePreview({
  sections,
  templateId,
  onTemplateChange,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Resume</title><style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; color: #111; background: white; }
      @page { margin: 0.5in; }
    </style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const TemplateComponent = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
  }[templateId];

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Template switcher + print */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                templateId === t.id
                  ? "bg-violet-600 text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print / Export
        </button>
      </div>

      {/* Preview container - scaled A4 */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-white">
        <div ref={printRef} className="w-full min-h-full">
          <TemplateComponent sections={sections} />
        </div>
      </div>
    </div>
  );
}
```

---

## Task 17 - MinimalTemplate

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/templates/MinimalTemplate.tsx`

Clean, ATS-safe, single-column, black-on-white.

```tsx
import type { ResumeSections } from "@/types/resume";

interface Props {
  sections: ResumeSections;
}

export default function MinimalTemplate({ sections }: Props) {
  const {
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = sections;

  return (
    <div className="p-10 font-[Inter,sans-serif] text-[#111] text-[13px] leading-[1.5]">
      {/* Header */}
      <div className="mb-5 border-b border-[#e0e0e0] pb-4">
        <h1 className="text-[26px] font-bold tracking-tight text-[#111]">
          {contact.name || "Your Name"}
        </h1>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#555]">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
          {contact.portfolio && <span>{contact.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary.text && (
        <Section title="Summary">
          <p className="text-[13px] text-[#333]">{summary.text}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[14px]">{e.role}</span>
                <span className="text-[11px] text-[#777]">
                  {e.startDate}
                  {e.startDate ? " - " : ""}
                  {e.isCurrent ? "Present" : e.endDate}
                </span>
              </div>
              <div className="text-[12px] text-[#555]">
                {e.company}
                {e.location ? ` · ${e.location}` : ""}
              </div>
              <ul className="mt-1 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[13px]">
                  {e.institution}
                </span>
                <span className="text-[11px] text-[#777]">
                  {e.startDate}
                  {e.startDate ? " - " : ""}
                  {e.endDate}
                </span>
              </div>
              <div className="text-[12px] text-[#555]">
                {e.degree}
                {e.field ? `, ${e.field}` : ""}
                {e.gpa ? ` · GPA ${e.gpa}` : ""}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          {skills.map((s, i) => (
            <div key={i} className="text-[12.5px]">
              {s.category && (
                <span className="font-semibold">{s.category}: </span>
              )}
              <span className="text-[#333]">{s.items.join(", ")}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[13px]">{p.name}</span>
                {p.tech.length > 0 && (
                  <span className="text-[11px] text-[#777]">
                    {p.tech.join(", ")}
                  </span>
                )}
              </div>
              {p.description && (
                <p className="text-[12px] text-[#555]">{p.description}</p>
              )}
              <ul className="mt-0.5 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                {p.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} className="text-[12.5px]">
              <span className="font-semibold">{c.name}</span>
              {c.issuer && <span className="text-[#555]"> · {c.issuer}</span>}
              {c.date && <span className="text-[#777]"> · {c.date}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5 border-b border-[#e8e8e8] pb-0.5">
        {title}
      </h2>
      {children}
    </div>
  );
}
```

---

## Task 18 - ModernTemplate

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/templates/ModernTemplate.tsx`

Two-column: narrow left sidebar (contact + skills) + wide right main body.

```tsx
import type { ResumeSections } from "@/types/resume";

interface Props {
  sections: ResumeSections;
}

export default function ModernTemplate({ sections }: Props) {
  const {
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = sections;

  return (
    <div className="flex font-[Inter,sans-serif] text-[13px] leading-[1.55] min-h-full">
      {/* Sidebar */}
      <div className="w-[200px] min-h-full bg-[#1a1a2e] text-white p-6 flex flex-col gap-5 shrink-0">
        <div>
          <h1 className="text-[17px] font-bold leading-tight">
            {contact.name || "Your Name"}
          </h1>
        </div>

        <SideSection title="Contact">
          <div className="flex flex-col gap-0.5 text-[11px] text-white/70">
            {contact.email && (
              <span className="break-all">{contact.email}</span>
            )}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
            {contact.linkedin && (
              <span className="break-all">{contact.linkedin}</span>
            )}
            {contact.github && (
              <span className="break-all">{contact.github}</span>
            )}
          </div>
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            {skills.map((s, i) => (
              <div key={i} className="mb-1.5">
                {s.category && (
                  <div className="text-[10px] font-semibold uppercase text-white/50 tracking-wider mb-0.5">
                    {s.category}
                  </div>
                )}
                <div className="text-[11px] text-white/80">
                  {s.items.join(" · ")}
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((c, i) => (
              <div key={i} className="text-[11px] text-white/70 mb-1">
                <div className="font-medium text-white/90">{c.name}</div>
                {c.issuer && <div>{c.issuer}</div>}
                {c.date && <div className="text-white/50">{c.date}</div>}
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-8 bg-white text-[#111]">
        {summary.text && (
          <MainSection title="Profile">
            <p>{summary.text}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience">
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-[14px]">{e.role}</div>
                    <div className="text-[12px] text-[#555]">
                      {e.company}
                      {e.location ? ` · ${e.location}` : ""}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#888] shrink-0 ml-4 pt-0.5">
                    {e.startDate}
                    {e.startDate ? "–" : ""}
                    {e.isCurrent ? "Present" : e.endDate}
                  </div>
                </div>
                <ul className="mt-1.5 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection title="Education">
            {education.map((e) => (
              <div key={e.id} className="mb-2.5">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{e.institution}</div>
                    <div className="text-[12px] text-[#555]">
                      {e.degree}
                      {e.field ? `, ${e.field}` : ""}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#888]">
                    {e.startDate}
                    {e.startDate ? "–" : ""}
                    {e.endDate}
                  </div>
                </div>
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((p) => (
              <div key={p.id} className="mb-3">
                <div className="font-semibold">{p.name}</div>
                {p.description && (
                  <p className="text-[12px] text-[#555]">{p.description}</p>
                )}
                <ul className="mt-1 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                {p.tech.length > 0 && (
                  <div className="mt-0.5 text-[11px] text-[#777]">
                    {p.tech.join(" · ")}
                  </div>
                )}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40 mb-1.5">
        {title}
      </div>
      {children}
    </div>
  );
}

function MainSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a2e] border-b-2 border-[#1a1a2e] pb-0.5 mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
```

---

## Task 19 - ExecutiveTemplate

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/templates/ExecutiveTemplate.tsx`

Centered header, wide margins, serif-like treatment using Georgia.

```tsx
import type { ResumeSections } from "@/types/resume";

interface Props {
  sections: ResumeSections;
}

export default function ExecutiveTemplate({ sections }: Props) {
  const {
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = sections;

  return (
    <div className="p-10 font-[Georgia,serif] text-[13px] leading-[1.6] text-[#1a1a1a]">
      {/* Header - centered */}
      <div className="text-center mb-6 pb-5 border-b-2 border-[#1a1a1a]">
        <h1 className="text-[28px] font-bold tracking-wide uppercase">
          {contact.name || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 text-[11px] text-[#555]">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </div>

      {summary.text && (
        <ESection title="Executive Profile">
          <p className="italic text-[13.5px] text-[#333] leading-relaxed">
            {summary.text}
          </p>
        </ESection>
      )}

      {experience.length > 0 && (
        <ESection title="Professional Experience">
          {experience.map((e) => (
            <div key={e.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-[14px]">{e.role}</span>
                  <span className="text-[#555] ml-2">
                    &mdash; {e.company}
                    {e.location ? `, ${e.location}` : ""}
                  </span>
                </div>
                <span className="text-[11px] text-[#777] shrink-0 ml-4">
                  {e.startDate}
                  {e.startDate ? " – " : ""}
                  {e.isCurrent ? "Present" : e.endDate}
                </span>
              </div>
              <ul className="mt-1.5 ml-5 list-disc text-[12.5px] text-[#333] space-y-0.5">
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </ESection>
      )}

      {education.length > 0 && (
        <ESection title="Education">
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{e.institution}</span>
                <span className="text-[11px] text-[#777]">
                  {e.startDate}
                  {e.startDate ? "–" : ""}
                  {e.endDate}
                </span>
              </div>
              <div className="text-[12px] text-[#555]">
                {e.degree}
                {e.field ? `, ${e.field}` : ""}
                {e.gpa ? ` · GPA ${e.gpa}` : ""}
              </div>
            </div>
          ))}
        </ESection>
      )}

      {skills.length > 0 && (
        <ESection title="Core Competencies">
          <div className="flex flex-wrap gap-x-6 gap-y-0.5">
            {skills
              .flatMap((s) => s.items)
              .map((item, i) => (
                <span key={i} className="text-[12.5px]">
                  · {item}
                </span>
              ))}
          </div>
        </ESection>
      )}
    </div>
  );
}

function ESection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[11.5px] font-bold uppercase tracking-[0.15em] text-[#1a1a1a] mb-2">
        {title}
      </h2>
      <div className="border-t border-[#ccc] pt-2">{children}</div>
    </div>
  );
}
```

---

## Task 20 - CreativeTemplate

**File:** `app/(app)/tools/resumeBuilder/[id]/_components/templates/CreativeTemplate.tsx`

Accent color strip on left, bold section headers, modern sans-serif.

```tsx
import type { ResumeSections } from "@/types/resume";

interface Props {
  sections: ResumeSections;
}

const ACCENT = "#6d28d9"; // violet-700

export default function CreativeTemplate({ sections }: Props) {
  const {
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = sections;

  return (
    <div className="flex font-[Inter,sans-serif] text-[13px] leading-[1.55] min-h-full">
      {/* Left accent strip */}
      <div className="w-3 shrink-0" style={{ background: ACCENT }} />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-[28px] font-black tracking-tight"
            style={{ color: ACCENT }}
          >
            {contact.name || "Your Name"}
          </h1>
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-[11px] text-[#555]">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
            {contact.linkedin && <span>{contact.linkedin}</span>}
            {contact.github && <span>{contact.github}</span>}
            {contact.portfolio && <span>{contact.portfolio}</span>}
          </div>
        </div>

        {summary.text && (
          <CSection title="About" accent={ACCENT}>
            <p className="text-[13px] text-[#333]">{summary.text}</p>
          </CSection>
        )}

        {experience.length > 0 && (
          <CSection title="Experience" accent={ACCENT}>
            {experience.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[14px] text-[#111]">
                    {e.role}
                  </span>
                  <span className="text-[11px] text-[#888]">
                    {e.startDate}
                    {e.startDate ? "–" : ""}
                    {e.isCurrent ? "Present" : e.endDate}
                  </span>
                </div>
                <div className="text-[12px]" style={{ color: ACCENT }}>
                  {e.company}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                <ul className="mt-1 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CSection>
        )}

        {skills.length > 0 && (
          <CSection title="Skills" accent={ACCENT}>
            {skills.map((s, i) => (
              <div key={i} className="mb-1.5">
                {s.category && (
                  <span
                    className="font-semibold text-[12px]"
                    style={{ color: ACCENT }}
                  >
                    {s.category}:{" "}
                  </span>
                )}
                <span className="text-[12.5px] text-[#333]">
                  {s.items.join(" · ")}
                </span>
              </div>
            ))}
          </CSection>
        )}

        {education.length > 0 && (
          <CSection title="Education" accent={ACCENT}>
            {education.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{e.institution}</span>
                  <span className="text-[11px] text-[#888]">
                    {e.startDate}
                    {e.startDate ? "–" : ""}
                    {e.endDate}
                  </span>
                </div>
                <div className="text-[12px] text-[#555]">
                  {e.degree}
                  {e.field ? `, ${e.field}` : ""}
                </div>
              </div>
            ))}
          </CSection>
        )}

        {projects.length > 0 && (
          <CSection title="Projects" accent={ACCENT}>
            {projects.map((p) => (
              <div key={p.id} className="mb-3">
                <div className="font-bold text-[13px]">{p.name}</div>
                {p.tech.length > 0 && (
                  <div className="text-[11px] text-[#888]">
                    {p.tech.join(" · ")}
                  </div>
                )}
                {p.description && (
                  <p className="text-[12px] text-[#555]">{p.description}</p>
                )}
                <ul className="mt-0.5 ml-4 list-disc text-[12.5px] text-[#333] space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CSection>
        )}
      </div>
    </div>
  );
}

function CSection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2
        className="text-[11px] font-black uppercase tracking-[0.15em] mb-1.5"
        style={{ color: accent }}
      >
        {title}
      </h2>
      <div className="border-t-2 pt-2" style={{ borderColor: accent }}>
        {children}
      </div>
    </div>
  );
}
```

---

## Task 21 - Resume Hub Page

**File:** `app/(app)/tools/resumeBuilder/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  Clock,
  Target,
  Trash2,
  ArrowRight,
} from "lucide-react";
import type { ResumeRow } from "@/types/resume";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/resumes")
      .then((r) => r.json())
      .then((data: ResumeRow[]) => setResumes(data))
      .finally(() => setLoading(false));
  }, []);

  const createNew = async (fromProfile = false) => {
    setCreating(true);
    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromProfile }),
    });
    if (res.ok) {
      const data = (await res.json()) as ResumeRow;
      router.push(`/tools/resumeBuilder/${data.id}`);
    }
    setCreating(false);
  };

  const deleteResume = async (id: string) => {
    await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
        <p className="text-white/50 mt-1 text-sm">
          Create tailored, ATS-optimized resumes for every application.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => createNew(false)}
          disabled={creating}
          className="flex flex-col gap-2 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all text-left"
        >
          <Plus className="w-5 h-5 text-violet-400" />
          <div>
            <div className="text-sm font-semibold text-white">
              Start from scratch
            </div>
            <div className="text-xs text-white/40 mt-0.5">
              Blank resume with all sections
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => createNew(true)}
          disabled={creating}
          className="flex flex-col gap-2 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all text-left"
        >
          <FileText className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-sm font-semibold text-white">
              Import from profile
            </div>
            <div className="text-xs text-white/40 mt-0.5">
              Pre-fill with your onboarding data
            </div>
          </div>
        </motion.button>
      </div>

      {/* Resume grid */}
      {loading ? (
        <div className="text-sm text-white/40">Loading…</div>
      ) : resumes.length === 0 ? (
        <div className="text-sm text-white/40">
          No resumes yet. Create one above.
        </div>
      ) : (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            My Resumes
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                whileHover={{ y: -2 }}
                className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => router.push(`/tools/resumeBuilder/${resume.id}`)}
              >
                <div className="flex items-start justify-between">
                  <FileText className="w-5 h-5 text-violet-400" />
                  {resume.atsScore !== null && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${resume.atsScore >= 70 ? "bg-emerald-500/15 text-emerald-400" : resume.atsScore >= 40 ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}
                    >
                      {resume.atsScore}%
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-white">
                    {resume.name}
                  </div>
                  {resume.targetRole && (
                    <div className="text-xs text-white/50 mt-0.5">
                      {resume.targetRole}
                      {resume.targetCompany ? ` @ ${resume.targetCompany}` : ""}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-white/30">
                  <Clock className="w-3 h-3" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResume(resume.id);
                    }}
                    className="p-1 rounded-md hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Task 22 - Editor Page

**File:** `app/(app)/tools/resumeBuilder/[id]/page.tsx`

Handles data fetch, debounced auto-save, two-pane layout, and ATS sidebar toggle.

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Save, CheckCircle2, Target, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type {
  ResumeRow,
  ResumeSections,
  ResumeTemplateId,
} from "@/types/resume";
import ResumeEditorPanel from "./_components/ResumeEditorPanel";
import ResumePreview from "./_components/ResumePreview";
import ATSSidebar from "./_components/ATSSidebar";

type SaveState = "idle" | "saving" | "saved";

export default function ResumeEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<ResumeRow | null>(null);
  const [sections, setSections] = useState<ResumeSections | null>(null);
  const [templateId, setTemplateId] = useState<ResumeTemplateId>("minimal");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [showAts, setShowAts] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load
  useEffect(() => {
    fetch(`/api/resumes/${id}`)
      .then((r) => r.json())
      .then((data: ResumeRow) => {
        setResume(data);
        setSections(data.sections);
        setTemplateId(data.templateId);
      });
  }, [id]);

  // Debounced auto-save
  const save = useCallback(
    async (next: ResumeSections, tpl: ResumeTemplateId) => {
      setSaveState("saving");
      await fetch(`/api/resumes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: next, templateId: tpl }),
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    },
    [id],
  );

  const handleSectionsChange = (next: ResumeSections) => {
    setSections(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(next, templateId), 1200);
  };

  const handleTemplateChange = (tpl: ResumeTemplateId) => {
    setTemplateId(tpl);
    if (sections) save(sections, tpl);
  };

  if (!resume || !sections) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-white/40">
        Loading resume…
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/tools/resumeBuilder"
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-semibold text-white">
            {resume.name}
          </span>
          {resume.targetRole && (
            <span className="text-xs text-white/40">
              {resume.targetRole}
              {resume.targetCompany ? ` @ ${resume.targetCompany}` : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {saveState === "saving" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-white/40 flex items-center gap-1"
            >
              <Save className="w-3 h-3 animate-pulse" /> Saving…
            </motion.span>
          )}
          {saveState === "saved" && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-400 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Saved
            </motion.span>
          )}

          <button
            onClick={() => setShowAts(!showAts)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              showAts
                ? "border-violet-500/50 bg-violet-600/20 text-violet-300"
                : "border-white/10 text-white/50 hover:text-white/80"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            ATS Score{resume.atsScore !== null ? ` · ${resume.atsScore}%` : ""}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor - 60% */}
        <div className="w-[60%] h-full overflow-y-auto border-r border-white/10 p-5">
          <ResumeEditorPanel
            sections={sections}
            onChange={handleSectionsChange}
            targetRole={resume.targetRole ?? ""}
            targetCompany={resume.targetCompany ?? ""}
            jobDescription={resume.jobDescription ?? ""}
          />
        </div>

        {/* Preview - 40% */}
        <div className="flex-1 h-full overflow-hidden p-5">
          <ResumePreview
            sections={sections}
            templateId={templateId}
            onTemplateChange={handleTemplateChange}
          />
        </div>

        {/* ATS Sidebar - slides in */}
        {showAts && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[280px] shrink-0 h-full overflow-hidden border-l border-white/10 p-4"
          >
            <ATSSidebar
              resumeId={id}
              initialScore={resume.atsScore}
              jobDescription={resume.jobDescription ?? ""}
              onScoreUpdate={(score) =>
                setResume((prev) =>
                  prev ? { ...prev, atsScore: score } : prev,
                )
              }
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
```

---

## Supporting Hook - `useAIStream`

**File:** `hooks/useAIStream.ts`

```ts
"use client";

import { useState } from "react";

export function useAIStream() {
  const [isStreaming, setIsStreaming] = useState(false);

  const stream = async (
    featureId: string,
    inputs: Record<string, string>,
  ): Promise<string> => {
    setIsStreaming(true);
    let result = "";
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, inputs }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }
    } finally {
      setIsStreaming(false);
    }
    return result;
  };

  return { stream, isStreaming };
}
```

---

## Execution Order

1. `types/resume.ts`
2. Append `resumes` table to `data/schema/index.ts` (add `import type { ResumeSections } from '@/types/resume'` at top)
3. Run migration (`npx drizzle-kit generate && npx drizzle-kit migrate`)
4. `lib/resume-utils.ts`
5. `data/repositories/resumes.repo.ts`
6. `hooks/useAIStream.ts`
7. Add `resumeSection` feature to `engines/ai/features/registry.ts`
8. `app/api/resumes/route.ts`
9. `app/api/resumes/[id]/route.ts`
10. `app/api/resumes/[id]/ats-score/route.ts`
11. Templates (MinimalTemplate → ModernTemplate → ExecutiveTemplate → CreativeTemplate)
12. `BulletEditor.tsx`
13. `SectionEditor.tsx`
14. `ResumeEditorPanel.tsx`
15. `ATSSidebar.tsx`
16. `ResumePreview.tsx`
17. Hub page
18. Editor page
19. `npx tsc --noEmit` to catch type errors
20. Test: create from profile → editor opens → sections edit → auto-save → ATS score

---

## Notes on `any`-free compliance

- All `jsonb` columns use `.$type<T>()` generics
- All component props are fully typed via `types/resume.ts`
- `SectionEditor` uses discriminated string literal narrowing on `sectionKey` rather than generic casting

## Aceternity components integration

- `BulletEditor` uses Framer Motion `Reorder.Group` / `Reorder.Item` for drag-to-reorder (replaces `DraggableCard` which is designed for card-level drag, not inline lists - `Reorder` is the correct Framer Motion primitive for ordered lists)
- `GlowingEffect` should wrap the "Create new" cards on the hub page and can be added post-implementation as a visual polish pass
- `StatefulButton` can replace the plain `<button>` on the ATS "Analyze" action
- `ShimmerLoader` can replace the plain "Loading resume…" text in the editor page loading state
