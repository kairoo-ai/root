export interface BankQuestion {
  id: string
  text: string
  type: 'behavioral' | 'technical' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard'
  category: string // 'leadership' | 'problem-solving' | 'communication' | 'technical-cs' | 'product' | 'data' | 'system-design'
  roles: string[] // e.g. ['Software Engineer', 'Product Manager'] — empty means all
}

export const bankQuestions: BankQuestion[] = [
  // Behavioral — Leadership
  { id: 'b1', text: 'Tell me about a time you led a team through a difficult situation.', type: 'behavioral', difficulty: 'medium', category: 'leadership', roles: [] },
  { id: 'b2', text: 'Describe a time you had to influence someone without direct authority.', type: 'behavioral', difficulty: 'medium', category: 'leadership', roles: [] },
  { id: 'b3', text: 'Give an example of when you set a goal and how you achieved it.', type: 'behavioral', difficulty: 'easy', category: 'leadership', roles: [] },
  // Behavioral — Problem Solving
  { id: 'b4', text: 'Tell me about the most complex problem you have ever solved.', type: 'behavioral', difficulty: 'hard', category: 'problem-solving', roles: [] },
  { id: 'b5', text: 'Describe a time when you had to make a decision with incomplete information.', type: 'behavioral', difficulty: 'medium', category: 'problem-solving', roles: [] },
  { id: 'b6', text: 'Tell me about a time you failed. What did you learn?', type: 'behavioral', difficulty: 'easy', category: 'problem-solving', roles: [] },
  // Behavioral — Communication
  { id: 'b7', text: 'Describe a time you had to deliver difficult feedback.', type: 'behavioral', difficulty: 'medium', category: 'communication', roles: [] },
  { id: 'b8', text: 'Tell me about a conflict with a colleague and how you resolved it.', type: 'behavioral', difficulty: 'medium', category: 'communication', roles: [] },
  { id: 'b9', text: 'Give an example of a time you had to explain a complex topic to a non-technical audience.', type: 'behavioral', difficulty: 'easy', category: 'communication', roles: [] },
  // Technical — SWE
  { id: 't1', text: 'Explain the difference between a process and a thread.', type: 'technical', difficulty: 'easy', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 't2', text: 'What are the tradeoffs between SQL and NoSQL databases?', type: 'technical', difficulty: 'medium', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer', 'Data Engineer'] },
  { id: 't3', text: 'How does garbage collection work in your primary language?', type: 'technical', difficulty: 'medium', category: 'technical-cs', roles: ['Software Engineer'] },
  { id: 't4', text: 'Explain eventual consistency and when you would accept it.', type: 'technical', difficulty: 'hard', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 't5', text: 'What is the difference between optimistic and pessimistic locking?', type: 'technical', difficulty: 'hard', category: 'technical-cs', roles: ['Software Engineer', 'Backend Engineer'] },
  // System Design
  { id: 's1', text: 'Design a URL shortener like bit.ly.', type: 'technical', difficulty: 'medium', category: 'system-design', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 's2', text: 'Design a notification system for a social media platform.', type: 'technical', difficulty: 'hard', category: 'system-design', roles: ['Software Engineer', 'Backend Engineer'] },
  { id: 's3', text: 'How would you design a rate limiter?', type: 'technical', difficulty: 'hard', category: 'system-design', roles: ['Software Engineer', 'Backend Engineer'] },
  // Product
  { id: 'p1', text: 'How would you improve our onboarding flow?', type: 'situational', difficulty: 'medium', category: 'product', roles: ['Product Manager', 'Product Designer'] },
  { id: 'p2', text: 'A key metric dropped 20% overnight. Walk me through your investigation.', type: 'situational', difficulty: 'hard', category: 'product', roles: ['Product Manager', 'Data Analyst'] },
  { id: 'p3', text: 'How do you prioritize features when every stakeholder says theirs is most important?', type: 'situational', difficulty: 'medium', category: 'product', roles: ['Product Manager'] },
  // Data
  { id: 'd1', text: 'What is the difference between supervised and unsupervised learning?', type: 'technical', difficulty: 'easy', category: 'data', roles: ['Data Scientist', 'ML Engineer'] },
  { id: 'd2', text: 'Explain how you would handle class imbalance in a classification problem.', type: 'technical', difficulty: 'medium', category: 'data', roles: ['Data Scientist', 'ML Engineer'] },
  { id: 'd3', text: 'Walk me through how you would design an A/B test.', type: 'technical', difficulty: 'medium', category: 'data', roles: ['Data Scientist', 'Data Analyst', 'Product Manager'] },
]
