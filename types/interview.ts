export type InterviewType = 'behavioral' | 'technical' | 'system_design' | 'case_study'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type SessionStatus = 'in_progress' | 'completed'
export type QuestionType = 'behavioral' | 'technical' | 'situational'

export interface InterviewSession {
  id: string
  userId: string
  title: string
  type: InterviewType
  targetRole: string
  targetCompany: string | null
  personaId: string | null
  difficulty: Difficulty
  questionCount: number
  status: SessionStatus
  overallScore: number | null
  strengths: string[]
  improvements: string[]
  createdAt: Date
  updatedAt: Date
}

export interface InterviewExchange {
  id: string
  sessionId: string
  questionText: string
  questionType: QuestionType
  userAnswer: string | null
  aiFeedback: string | null
  starScore: number | null
  keywords: string[]
  keywordsUsed: string[]
  duration: number | null  // seconds
  order: number
  createdAt: Date
}

export interface SessionWithExchanges extends InterviewSession {
  exchanges: InterviewExchange[]
}

// API request/response shapes
export interface CreateSessionRequest {
  title: string
  type: InterviewType
  targetRole: string
  targetCompany?: string
  personaId?: string
  difficulty: Difficulty
  questionCount: 5 | 10 | 15
}

export interface SubmitAnswerRequest {
  exchangeId: string
  answer: string
  duration: number
}

export interface FeedbackResult {
  score: number
  whatWasGood: string
  whatWasMissing: string
  exampleImprovement: string
  keywordsUsed: string[]
}

export interface SessionAssessment {
  overallScore: number
  strengths: string[]
  improvements: string[]
  topActions: string[]
}
