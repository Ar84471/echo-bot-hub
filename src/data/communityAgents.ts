
import { Agent } from '@/types/agent';

export interface CommunityAgent extends Agent {
  downloads: number;
  rating: number;
  author: string;
  tags: string[];
  featured: boolean;
  price: 'free' | 'premium';
}

export const communityAgents: CommunityAgent[] = [
  {
    id: 'productivity-master',
    name: 'Productivity Master',
    description: 'AI assistant specialized in task management, scheduling, and productivity optimization',
    type: 'Productivity',
    avatar: '📅',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['Task Management', 'Scheduling', 'Goal Setting', 'Time Tracking'],
    downloads: 15420,
    rating: 4.8,
    author: 'ProductivityPro',
    tags: ['productivity', 'tasks', 'scheduling', 'goals'],
    featured: true,
    price: 'free'
  },
  {
    id: 'design-wizard',
    name: 'Design Wizard',
    description: 'Creative AI for UI/UX design, color theory, and visual composition',
    type: 'Design',
    avatar: '🎨',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['UI Design', 'Color Theory', 'Typography', 'Brand Design'],
    downloads: 12890,
    rating: 4.9,
    author: 'DesignStudio',
    tags: ['design', 'ui', 'ux', 'creative'],
    featured: true,
    price: 'premium'
  },
  {
    id: 'code-mentor',
    name: 'Code Mentor',
    description: 'Advanced programming tutor for multiple languages and frameworks',
    type: 'Education',
    avatar: '👨‍🏫',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['Code Review', 'Programming Tutoring', 'Algorithm Design', 'Best Practices'],
    downloads: 18750,
    rating: 4.7,
    author: 'CodeAcademy',
    tags: ['programming', 'education', 'mentoring', 'code-review'],
    featured: true,
    price: 'free'
  },
  {
    id: 'social-media-guru',
    name: 'Social Media Guru',
    description: 'Expert in social media strategy, content creation, and engagement',
    type: 'Marketing',
    avatar: '📱',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['Content Strategy', 'Social Media Planning', 'Engagement Analysis', 'Trend Analysis'],
    downloads: 9630,
    rating: 4.6,
    author: 'SocialExperts',
    tags: ['social-media', 'marketing', 'content', 'engagement'],
    featured: false,
    price: 'premium'
  },
  {
    id: 'fitness-coach',
    name: 'AI Fitness Coach',
    description: 'Personal trainer AI for workout planning and nutrition guidance',
    type: 'Health',
    avatar: '💪',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['Workout Planning', 'Nutrition Advice', 'Progress Tracking', 'Motivation'],
    downloads: 7420,
    rating: 4.5,
    author: 'FitnessTech',
    tags: ['fitness', 'health', 'workout', 'nutrition'],
    featured: false,
    price: 'free'
  },
  {
    id: 'language-tutor',
    name: 'Language Tutor',
    description: 'Multilingual AI teacher for language learning and practice',
    type: 'Education',
    avatar: '🗣️',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['Language Learning', 'Grammar Correction', 'Conversation Practice', 'Cultural Context'],
    downloads: 11200,
    rating: 4.8,
    author: 'LinguaAI',
    tags: ['language', 'education', 'learning', 'multilingual'],
    featured: false,
    price: 'free'
  },
  {
    id: 'investment-advisor',
    name: 'Investment Advisor',
    description: 'Financial AI for investment analysis and portfolio optimization',
    type: 'Finance',
    avatar: '💰',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['Investment Analysis', 'Portfolio Management', 'Risk Assessment', 'Market Research'],
    downloads: 5890,
    rating: 4.4,
    author: 'FinanceBot',
    tags: ['finance', 'investment', 'portfolio', 'analysis'],
    featured: false,
    price: 'premium'
  },
  {
    id: 'travel-planner',
    name: 'Travel Planner',
    description: 'AI travel assistant for trip planning and destination recommendations',
    type: 'Lifestyle',
    avatar: '✈️',
    isActive: false,
    lastUsed: 'Never',
    capabilities: ['Trip Planning', 'Destination Research', 'Budget Optimization', 'Itinerary Creation'],
    downloads: 8750,
    rating: 4.7,
    author: 'TravelTech',
    tags: ['travel', 'planning', 'destinations', 'lifestyle'],
    featured: false,
    price: 'free'
  }
];

export const getAgentsByCategory = (category: string) => {
  return communityAgents.filter(agent => 
    agent.type.toLowerCase() === category.toLowerCase()
  );
};

export const getFeaturedAgents = () => {
  return communityAgents.filter(agent => agent.featured);
};

export const searchAgents = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return communityAgents.filter(agent => 
    agent.name.toLowerCase().includes(lowercaseQuery) ||
    agent.description.toLowerCase().includes(lowercaseQuery) ||
    agent.tags.some(tag => tag.includes(lowercaseQuery))
  );
};
