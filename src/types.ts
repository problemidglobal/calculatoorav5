export type CategoryType =
  | 'finance'
  | 'business'
  | 'math'
  | 'health'
  | 'fitness'
  | 'education'
  | 'science'
  | 'engineering'
  | 'programming'
  | 'daily-life'
  | 'marketing'
  | 'creator-tools'
  | 'productivity'
  | 'conversion'
  | 'home-tools'
  | 'lifestyle'
  | 'diy'
  | 'tech'
  | 'construction'
  | 'country'
  | 'legal'
  | 'language'
  | 'communication'
  | 'data-science'
  | 'ai'
  | 'cybersecurity'
  | 'gaming'
  | 'sports'
  | 'food'
  | 'beauty'
  | 'fashion'
  | 'pet'
  | 'gardening'
  | 'personal-safety'
  | 'insurance'
  | 'retirement'
  | 'crypto'
  | 'real-estate-pro'
  | 'small-business'
  | 'freelance-creator'
  | 'mobile-app'
  | 'web-ops'
  | 'adv-marketing'
  | 'photography'
  | 'video-streaming'
  | 'music'
  | 'home-utilities'
  | 'environment'
  | 'transportation'
  | 'events'
  | 'trades'
  | 'medical-edu'
  | 'science-lab'
  | 'advanced-math'
  | 'language-learning'
  | 'medical-pro'
  | 'manufacturing'
  | 'retail'
  | 'restaurant'
  | 'transport-pro'
  | 'agriculture'
  | 'project-management'
  | 'security-privacy'
  | 'career'
  | 'logistics'
  | 'energy'
  | 'space-astronomy'
  | 'weather-climate'
  | 'software-engineering'
  | 'automotive'
  | 'home-improvement'
  | 'travel'
  | 'human-resources'
  | 'supply-chain'
  | 'architecture-design'
  | 'video-production'
  | 'real-world-tools'
  | 'home-services'
  | 'fashion-lifestyle';

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind accent colors
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'range' | 'date';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: any }[];
  helpText?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Calculator {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  description: string;
  inputs: CalculatorInput[];
  formula: string;
  explanation: string;
  example: string;
  faq: FAQItem[];
  relatedSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  keywords?: string[];
  relatedTools?: string[];
  // Dynamic calculation logic
  calculate: (inputs: Record<string, any>) => {
    results: { label: string; value: string | number; unit?: string; isPrimary?: boolean }[];
    chartData?: any; // For custom custom SVG chart visualization
    breakdown?: any; // Detailed schedule (e.g. amortization)
  };
}
