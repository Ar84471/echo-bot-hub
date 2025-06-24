
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  avatar: string;
  capabilities: string[];
  category: string;
  isPopular: boolean;
  usageCount: number;
  rating: number;
  tags: string[];
  prompt: string;
}

export const agentTemplates: AgentTemplate[] = [
  {
    id: 'customer-service',
    name: 'Customer Service Assistant',
    description: 'Professional customer support agent that handles inquiries, complaints, and provides helpful solutions with empathy and efficiency.',
    type: 'Customer Support',
    avatar: '🎧',
    capabilities: ['Customer Support', 'Problem Solving', 'Email Writing', 'Conflict Resolution'],
    category: 'Business',
    isPopular: true,
    usageCount: 2847,
    rating: 4.8,
    tags: ['support', 'customer', 'help'],
    prompt: 'You are a professional customer service representative. Always be polite, empathetic, and solution-focused.'
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Comprehensive research specialist that gathers information, analyzes data, and provides detailed reports on any topic.',
    type: 'Research Engine',
    avatar: '🔍',
    capabilities: ['Research', 'Data Analysis', 'Summarization', 'Fact Checking'],
    category: 'Academic',
    isPopular: true,
    usageCount: 1923,
    rating: 4.7,
    tags: ['research', 'analysis', 'data'],
    prompt: 'You are a thorough research assistant. Provide accurate, well-sourced information and detailed analysis.'
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Creative writing specialist for blogs, social media, marketing copy, and engaging content across all platforms.',
    type: 'Creative Synthesizer',
    avatar: '✍️',
    capabilities: ['Creative Writing', 'Content Generation', 'Social Media', 'Copywriting'],
    category: 'Marketing',
    isPopular: true,
    usageCount: 3156,
    rating: 4.9,
    tags: ['content', 'writing', 'creative'],
    prompt: 'You are a creative content writer. Create engaging, original content that captures attention and drives engagement.'
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Expert data analyst that interprets complex datasets, creates visualizations, and provides actionable business insights.',
    type: 'Data Analyst',
    avatar: '📊',
    capabilities: ['Data Analysis', 'Statistics', 'Visualization', 'Business Intelligence'],
    category: 'Analytics',
    isPopular: false,
    usageCount: 876,
    rating: 4.6,
    tags: ['data', 'analytics', 'statistics'],
    prompt: 'You are a skilled data analyst. Interpret data accurately and provide clear, actionable insights.'
  },
  {
    id: 'personal-trainer',
    name: 'Fitness Coach',
    description: 'Personal fitness trainer that creates workout plans, provides nutrition advice, and motivates users to achieve their health goals.',
    type: 'Health Advisor',
    avatar: '💪',
    capabilities: ['Fitness Planning', 'Nutrition Advice', 'Motivation', 'Health Tracking'],
    category: 'Health',
    isPopular: false,
    usageCount: 654,
    rating: 4.5,
    tags: ['fitness', 'health', 'workout'],
    prompt: 'You are an encouraging fitness coach. Create personalized workout plans and provide motivational support.'
  },
  {
    id: 'coding-mentor',
    name: 'Programming Mentor',
    description: 'Expert coding instructor that teaches programming concepts, reviews code, and helps debug technical issues.',
    type: 'Code Architect',
    avatar: '💻',
    capabilities: ['Code Review', 'Programming Education', 'Debugging', 'Best Practices'],
    category: 'Technology',
    isPopular: true,
    usageCount: 1542,
    rating: 4.8,
    tags: ['coding', 'programming', 'education'],
    prompt: 'You are an experienced programming mentor. Explain concepts clearly and help improve coding skills.'
  }
];

export const categories = [
  'All',
  'Business',
  'Academic',
  'Marketing',
  'Analytics',
  'Health',
  'Technology'
];
