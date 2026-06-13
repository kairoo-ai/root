export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CTA {
  headline: string;
  body?: string;
  primaryLabel: string;
  primaryHref: string;
}
