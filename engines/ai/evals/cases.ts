// Eval cases for the Kairoo AI engine — exercises the gateway, base prompt,
// and guardrails without any UI or auth layer. Run via `npm run evals`.
// All feature ids are verified against engines/ai/features/registry.ts.

export type EvalCase = {
  name: string;
  featureId: string;
  inputs: Record<string, string>;
  /** At least one of these strings (case-insensitive) must appear in the output. */
  expectIncludesAny?: string[];
  /** None of these phrases may appear in the output (guardrail / brand voice check). */
  bannedPhrases?: string[];
  /** Output must be at least this many characters. */
  minLength?: number;
};

// Feature ids used: dynamicRoadmaps, interviewCoach, goalRefiner
// All three have status:'ready' in the registry and have well-defined inputs.
// - dynamicRoadmaps: exercises the career roadmap path (phases / milestones)
// - interviewCoach:  exercises structured Q&A output with STAR guidance
// - goalRefiner:     short single-input feature; good smoke test for SMART output

export const cases: EvalCase[] = [
  {
    name: "roadmap returns a structured, non-hype plan",
    featureId: "dynamicRoadmaps",
    inputs: {
      goal: "Become a Senior Data Scientist",
      background: "2 years as a data analyst",
    },
    expectIncludesAny: ["phase", "month", "step"],
    bannedPhrases: [
      "unlimited potential",
      "game-changer",
      "revolutionize",
      "unleash",
    ],
    minLength: 200,
  },
  {
    name: "interview coach returns STAR structure and follow-ups",
    featureId: "interviewCoach",
    inputs: {
      role: "Software Engineer",
      question: "Tell me about a time you resolved a production incident",
    },
    expectIncludesAny: ["star", "answer", "follow-up", "pitfall"],
    bannedPhrases: [
      "unlimited potential",
      "game-changer",
      "revolutionize",
      "unleash",
    ],
    minLength: 200,
  },
  {
    name: "goal refiner returns SMART goal with milestones",
    featureId: "goalRefiner",
    inputs: {
      goal: "I want to get better at public speaking",
    },
    expectIncludesAny: ["smart", "specific", "measurable", "milestone"],
    bannedPhrases: [
      "unlimited potential",
      "game-changer",
      "revolutionize",
      "unleash",
    ],
    minLength: 150,
  },
];
