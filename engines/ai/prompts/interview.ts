import type { InterviewType, Difficulty, InterviewExchange } from '@/types/interview'

export function buildFirstQuestionPrompt(
  type: InterviewType,
  targetRole: string,
  targetCompany: string | null,
  difficulty: Difficulty,
): string {
  const companyLine = targetCompany ? ` at ${targetCompany}` : ''
  const difficultyMap: Record<Difficulty, string> = {
    easy: 'entry-level, straightforward',
    medium: 'mid-level, moderately challenging',
    hard: 'senior-level, complex and probing',
  }
  const typeInstructions: Record<InterviewType, string> = {
    behavioral: 'Ask a behavioral question using the STAR method framework (Situation, Task, Action, Result).',
    technical: 'Ask a technical question relevant to the role. Be specific about a concrete problem or concept.',
    system_design: 'Ask a system design question. Start with a high-level prompt that leaves room for the candidate to clarify requirements.',
    case_study: 'Present a realistic business case or product scenario relevant to the role.',
  }
  return `You are an expert ${type.replace('_', ' ')} interviewer for a ${difficultyMap[difficulty]} ${targetRole} role${companyLine}.

${typeInstructions[type]}

Return ONLY valid JSON in this exact shape - no markdown, no extra text:
{
  "questionText": "...",
  "questionType": "behavioral" | "technical" | "situational",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

The keywords array must contain 4-6 concepts or terms the ideal answer should include.`
}

export function buildNextQuestionPrompt(
  type: InterviewType,
  targetRole: string,
  targetCompany: string | null,
  difficulty: Difficulty,
  previousExchanges: Pick<InterviewExchange, 'questionText' | 'userAnswer' | 'starScore'>[],
  questionNumber: number,
  totalQuestions: number,
): string {
  const companyLine = targetCompany ? ` at ${targetCompany}` : ''
  const history = previousExchanges
    .map((e, i) => `Q${i + 1}: ${e.questionText}\nA${i + 1}: ${e.userAnswer ?? '(no answer)'}\nScore: ${e.starScore ?? 'N/A'}/100`)
    .join('\n\n')

  return `You are conducting a ${type.replace('_', ' ')} interview for a ${targetRole} role${companyLine}.

Previous exchanges:
${history}

You are now generating question ${questionNumber} of ${totalQuestions}. Based on the candidate's previous answers, choose a question that:
- Probes an area they showed weakness in OR explores a new dimension
- Matches ${difficulty} difficulty
- Builds natural conversational flow

Return ONLY valid JSON:
{
  "questionText": "...",
  "questionType": "behavioral" | "technical" | "situational",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`
}

export function buildFeedbackPrompt(
  questionText: string,
  questionType: string,
  userAnswer: string,
  keywords: string[],
  targetRole: string,
): string {
  return `You are an expert interview coach evaluating a ${targetRole} candidate.

Question: ${questionText}
Expected keywords/concepts: ${keywords.join(', ')}

Candidate's answer:
${userAnswer}

Evaluate this answer and return ONLY valid JSON:
{
  "score": <0-100 integer>,
  "whatWasGood": "<1-2 sentences on strengths>",
  "whatWasMissing": "<1-2 sentences on gaps>",
  "exampleImprovement": "<rewrite 1-3 key sentences to show improvement>",
  "keywordsUsed": ["<keywords from the expected list that the candidate actually used>"]
}

Scoring guide: 0-40 = poor structure/content, 41-60 = adequate, 61-80 = good, 81-100 = excellent.
For behavioral questions, score heavily on STAR structure.
For technical questions, score on correctness and depth.`
}

export function buildSessionAssessmentPrompt(
  exchanges: Pick<InterviewExchange, 'questionText' | 'userAnswer' | 'starScore' | 'aiFeedback'>[],
  targetRole: string,
): string {
  const summary = exchanges
    .map((e, i) => `Q${i + 1} (score ${e.starScore ?? 'N/A'}): ${e.questionText}`)
    .join('\n')

  return `You are summarizing a complete mock interview for a ${targetRole} candidate.

Questions and scores:
${summary}

Generate an overall assessment. Return ONLY valid JSON:
{
  "overallScore": <0-100 integer, weighted average>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>", "<area to improve 3>"],
  "topActions": ["<specific action 1>", "<specific action 2>", "<specific action 3>"]
}`
}
