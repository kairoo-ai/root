# Make All Listed Tools Real - Design

**Date:** 2026-06-13
**Status:** Approved pending user spec review

## Problem

The app advertises "32+ AI-powered tools" but only 5 are real. The cause is two
parallel maps that must agree yet live in different files and can silently drift:

- `generateInputsForTool(toolId)` in `lib/ai-tools.ts` - defines a tool's input
  fields. Only 5 of ~38 defined; the rest fall back to one generic text box.
- `generatePrompt(toolId, inputs)` in `app/api/ai/route.ts` - builds the Gemini
  prompt. Only 5 defined; the rest fall back to `JSON.stringify(inputs)`.

A tool "works" only when BOTH maps have a matching entry and the prompt's field
references (`inputs.role`) line up with the input map's field ids. Today most
tools have neither, so they silently produce generic, low-value output while the
UI presents them as finished features.

## Goal

Every tool the UI exposes either (a) genuinely works end-to-end with real,
distinct inputs and a real prompt, or (b) is clearly labeled as not-yet-built.
No tool may silently fall through to the generic prompt while looking finished.

Out of scope: persistence, auth, accounts, the pitch pages
(`investor-deck`, `market-analysis`, `business-strategy`,
`technical-architecture`), and the fake-data charts. Budget is $0 / free Gemini
usage only - every tool remains a single stateless Gemini call.

## Architecture: one source of truth

Collapse the two parallel maps into a single registry in `lib/ai-tools.ts`.
Each tool is ONE object that colocates its display metadata, its inputs, and its
prompt builder, so inputs and prompt can no longer drift:

```ts
export interface ToolInput {
  id: string;
  label: string; // NEW: visible label, not just placeholder
  type: "text" | "textarea" | "number" | "select";
  placeholder: string;
  options?: string[];
  required?: boolean; // NEW: gate the Generate button
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: "career" | "learning";
  status: "ready" | "coming-soon"; // coming-soon tools render but cannot run
  inputs: ToolInput[];
  buildPrompt: (inputs: Record<string, string>) => string;
}

export const tools: Tool[] = [
  /* ~38 definitions */
];

export function getTool(id: string): Tool | undefined;
```

Backward-compatible exports so existing imports keep working:

- `careerTools` = `tools.filter(t => t.category === 'career')`
- `learningFeatures` = `tools.filter(t => t.category === 'learning')`
- `generateInputsForTool(id)` = `getTool(id)?.inputs ?? [genericInput]`

Prompt builders contain no secrets, so it is safe for this shared file to be
imported by both the client (`FeatureModal`) and the server (`route.ts`).

### Data flow (unchanged shape, single backing definition)

```
FeatureModal (client)
  ├─ reads tool.inputs  → renders fields
  └─ POST /api/ai { toolId, inputs }
          │
          ▼
route.ts (server)
  ├─ getTool(toolId).buildPrompt(inputs)   ← same registry
  └─ Gemini generateContent → { result }
```

`route.ts` no longer defines prompts. It imports `getTool`, calls `buildPrompt`,
and keeps a generic fallback ONLY for an unknown/malformed `toolId` (defensive,
not a normal path).

## Scope of tools

**32 career tools - all made real** (distinct inputs + prompt each):
dynamicRoadmaps, documentSuite, interviewCoach, salaryCoach, careerSimulator,
projectGenerator, trendsAnalyzer, reviewAssistant, bioGenerator, skillScenarios,
jobMatcher, planner90Day, emailAssistant, meetingPrep, postWriter, goalRefiner,
ideaValidator, learningTutor, contractReviewer, networkingStrategist,
burnoutCoach, budgetProposer, pitchRefiner, retroHelper, healthCheck, sideHustle,
speakingCoach, conflictMediator, mockupFeedback, jargonBuster, decisionCopilot,
stakeholderMapper.

**6 learning features:**

- Made real (`status: 'ready'`): `pathGeneration`, `projectLearning`,
  `aiTutor` (as one-shot Q&A - no conversation memory, honestly framed).
- Labeled `status: 'coming-soon'` (require a DB + accounts we don't have;
  faking them as one-shot prompts would be more bragging):
  `progressTracking`, `enterpriseAnalytics`, `dynamicAdaptation`.

## Prompt + input design principles

For each `ready` tool:

- Inputs are the MINIMUM needed for a good answer (usually 1–3 fields). The
  primary field is `required`; use `textarea` for free-form context, `select`
  for closed sets.
- Prompts: assign a role, state the task, list 3–6 concrete output sections,
  request markdown (the UI already renders markdown), and degrade gracefully when
  optional fields are blank (no `undefined` leaking into the prompt).
- Field ids referenced in `buildPrompt` MUST exist in that tool's `inputs`. This
  is guaranteed by colocation and verified by the consistency check below.

## Constraint: do NOT touch brand / UI / UX

Other sessions own rebranding and a UI/UX overhaul. `FeatureModal.tsx` is already
modified in the working tree by another session. Therefore this work touches the
**logic/data layer only** - `lib/ai-tools.ts` and `app/api/ai/route.ts` - plus a
throwaway verification script. No component edits, no styling, no copy, no colors,
no marketing pages.

The new `label`, `required`, and `status` fields are added to the data so the
in-progress UI overhaul _can_ consume them later, but we do NOT edit any component
to render them. Backward-compatible exports keep `FeatureModal` working untouched.

## Honesty handled server-side (no UI edit needed)

Because we can't edit `FeatureModal`, `coming-soon` tools are handled in
`route.ts`: if `getTool(toolId).status === 'coming-soon'`, the route returns
`{ result: "This feature isn't built yet - it needs user accounts and saved data
the app doesn't have today." }` (HTTP 200) so the existing modal renders the
honest message in place of a faked AI answer. No prompt is sent to Gemini.

## Error handling

- Server: unknown `toolId` → 400 with a clear message (was: silent generic
  prompt). `coming-soon` toolId → 200 with the honest message above. Gemini errors
  → existing 500 with message. Missing API key → existing 500.
- Client: unchanged. `FeatureModal` already renders `data.result` and falls back
  to "Failed to generate response"; we leave it to the UI session to improve.

## Testing / verification

No test framework is set up; verification is lightweight and concrete:

1. **Consistency check** - a small script/assert that every `buildPrompt`'s
   referenced field ids are a subset of that tool's declared input ids, and every
   tool has a non-empty prompt. Run once; fix any mismatch.
2. `npm run build` / typecheck passes.
3. Manual smoke: run 3–4 representative tools (e.g. interviewCoach, jobMatcher,
   sideHustle) in the browser and confirm real, tool-specific output; confirm a
   `coming-soon` tool shows the note and cannot call the API.

## Honesty follow-ups (noted, not done this round)

- README still claims learning-platform features (analytics, evolving paths) with
  no backend. Recommend a later pass to align copy with reality.
- Gemini API key in `.env.local` was exposed in-session; rotate it.
