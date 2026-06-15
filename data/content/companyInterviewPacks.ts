// data/content/companyInterviewPacks.ts

export interface CompanyPack {
  id: string
  name: string
  logo: string  // emoji or short text
  tier: 'faang' | 'tier2' | 'startup'
  focusAreas: string[]
  behavioralStyle: string
  technicalFocus: string[]
  questions: Array<{
    text: string
    type: 'behavioral' | 'technical' | 'system_design' | 'case_study'
    difficulty: 'easy' | 'medium' | 'hard'
    hints: string[]
    framework: 'STAR' | 'SOAR' | 'CAR'
  }>
}

export const COMPANY_PACKS: CompanyPack[] = [
  {
    id: 'google',
    name: 'Google',
    logo: 'G',
    tier: 'faang',
    focusAreas: ['Leadership', 'Googleyness', 'Problem-solving'],
    behavioralStyle: 'Structured STAR with emphasis on data-driven impact and scale',
    technicalFocus: ['algorithms', 'distributed systems', 'code quality'],
    questions: [
      { text: 'Tell me about a time you had to make a decision with incomplete information.', type: 'behavioral', difficulty: 'medium', hints: ['Focus on your decision-making process', 'Quantify the outcome', 'Describe what you learned'], framework: 'STAR' },
      { text: 'Design a URL shortener like bit.ly that handles 100M daily requests.', type: 'system_design', difficulty: 'hard', hints: ['Start with requirements clarification', 'Discuss hashing strategy', 'Address database sharding and caching'], framework: 'SOAR' },
      { text: 'How would you improve Google Maps?', type: 'case_study', difficulty: 'medium', hints: ['Define user segments', 'Identify pain points with data', 'Prioritize with impact/effort matrix'], framework: 'SOAR' },
      { text: 'Describe a project where you had to influence without authority.', type: 'behavioral', difficulty: 'medium', hints: ['Show stakeholder alignment skills', 'Demonstrate communication strategy', 'Highlight measurable outcome'], framework: 'STAR' },
      { text: 'Write a function to find the longest substring without repeating characters.', type: 'technical', difficulty: 'medium', hints: ['Sliding window technique', 'Use a hash set', 'O(n) time complexity possible'], framework: 'CAR' },
    ]
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'M',
    tier: 'faang',
    focusAreas: ['Move Fast', 'Social Impact', 'Scale'],
    behavioralStyle: 'Direct storytelling, emphasis on speed and iteration',
    technicalFocus: ['react', 'distributed systems', 'machine learning basics'],
    questions: [
      { text: 'Tell me about a time you moved fast and broke something. What did you learn?', type: 'behavioral', difficulty: 'medium', hints: ['Be honest about the failure', 'Show what you fixed and how quickly', 'Highlight the learning'], framework: 'STAR' },
      { text: 'Design Facebook News Feed.', type: 'system_design', difficulty: 'hard', hints: ['Fanout on write vs read tradeoffs', 'Ranking algorithm design', 'Handle celebrity accounts differently'], framework: 'SOAR' },
      { text: 'How would you detect fake accounts on Instagram?', type: 'case_study', difficulty: 'hard', hints: ['Define what "fake" means first', 'Feature engineering for ML', 'Balance false positives'], framework: 'SOAR' },
      { text: 'Implement LRU cache.', type: 'technical', difficulty: 'medium', hints: ['Use HashMap + Doubly Linked List', 'O(1) get and put', 'Handle capacity edge cases'], framework: 'CAR' },
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'A',
    tier: 'faang',
    focusAreas: ['Leadership Principles', 'Customer Obsession', 'Ownership'],
    behavioralStyle: 'Extremely structured STAR, each answer maps to a Leadership Principle',
    technicalFocus: ['aws services', 'scalability', 'operational excellence'],
    questions: [
      { text: 'Tell me about a time you earned the trust of your team.', type: 'behavioral', difficulty: 'medium', hints: ['Map to Customer Obsession or Earn Trust LP', 'Quantify team size and impact', 'Show consistency over time'], framework: 'STAR' },
      { text: 'Describe a time you dove deep into data to solve a problem.', type: 'behavioral', difficulty: 'medium', hints: ['Dive Deep LP', 'Show the analysis process', 'Explain what others missed'], framework: 'STAR' },
      { text: 'Design Amazon Prime delivery logistics system.', type: 'system_design', difficulty: 'hard', hints: ['Route optimization algorithms', 'Real-time tracking architecture', 'Handle peak seasons'], framework: 'SOAR' },
      { text: 'How would you reduce cart abandonment by 15%?', type: 'case_study', difficulty: 'medium', hints: ['Analyze the funnel first', 'Propose A/B testable solutions', 'Prioritize by ROI'], framework: 'SOAR' },
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: 'S',
    tier: 'tier2',
    focusAreas: ['Developer Experience', 'Reliability', 'Craft'],
    behavioralStyle: 'Detailed technical depth expected even for behavioral questions',
    technicalFocus: ['payments', 'api design', 'reliability engineering'],
    questions: [
      { text: 'How would you design a payments API for maximum developer experience?', type: 'case_study', difficulty: 'hard', hints: ['Start with the developer journey', 'Idempotency keys design', 'Error handling philosophy'], framework: 'SOAR' },
      { text: 'Tell me about a system you built that needed to be extremely reliable.', type: 'behavioral', difficulty: 'medium', hints: ['Quantify reliability (nines)', 'Describe failure modes you designed for', 'Monitoring and alerting setup'], framework: 'STAR' },
    ]
  },
  {
    id: 'startup',
    name: 'Startup',
    logo: '🚀',
    tier: 'startup',
    focusAreas: ['Generalist', 'Scrappiness', 'Culture Fit'],
    behavioralStyle: 'Conversational, emphasis on ownership and wearing multiple hats',
    technicalFocus: ['shipping fast', 'pragmatic architecture', 'full-stack'],
    questions: [
      { text: 'Tell me about a time you had to ship something with 10% of the resources you needed.', type: 'behavioral', difficulty: 'easy', hints: ['Show prioritization skills', 'Demonstrate creative problem-solving', 'Highlight what you cut and why'], framework: 'STAR' },
      { text: 'How do you decide what NOT to build?', type: 'case_study', difficulty: 'medium', hints: ['Framework for prioritization', 'How you say no to stakeholders', 'Data-driven decision making'], framework: 'SOAR' },
    ]
  },
]
