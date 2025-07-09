import { generateAIResponse as generateFromProviders } from './aiProviders';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  avatar: string;
  isActive: boolean;
  lastUsed: string;
  capabilities: string[];
}

// Enhanced mathematical calculation function
const evaluateMathExpression = (expression: string): string | null => {
  try {
    const cleanExpression = expression.replace(/\s/g, '');
    const mathPattern = /^[0-9+\-*/().^%\s]+$/;
    if (!mathPattern.test(cleanExpression)) {
      return null;
    }
    
    let jsExpression = cleanExpression.replace(/\^/g, '**');
    const result = Function(`"use strict"; return (${jsExpression})`)();
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return result.toString();
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Enhanced response generation with AI provider integration
export const generateAIResponse = async (agent: Agent, userMessage: string, isGreeting: boolean = false): Promise<string> => {
  try {
    // Try AI providers first
    const aiResponse = await generateFromProviders(userMessage, agent, isGreeting);
    return aiResponse.text;
  } catch (error) {
    console.warn('AI providers failed, using fallback responses:', error);
    return generateFallbackResponse(agent, userMessage, isGreeting);
  }
};

// Fallback response system
const generateFallbackResponse = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    const greetings = [
      "Hello! I'm ready to help you with any questions or tasks.",
      "Hi there! How can I assist you today?",
      "Greetings! I'm here to help with whatever you need.",
      "Welcome! What would you like to work on together?",
      "Hello! I'm prepared to tackle any challenge you have."
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return `${greeting}\n\nI'm **${agent.name}**, your specialized ${agent.type} assistant. My expertise includes ${agent.capabilities.join(', ')}.\n\nHow can I help you today?`;
  }

  const message = userMessage.toLowerCase().trim();
  
  // Check for math expressions
  const mathResult = evaluateMathExpression(userMessage);
  if (mathResult) {
    return `The answer is: **${mathResult}**\n\nI can help with various calculations and mathematical problems. What else would you like to know?`;
  }

  // Agent-specific responses based on type
  const agentType = agent.type.toLowerCase();
  const agentName = agent.name.toLowerCase();
  
  if (agentName.includes('codeforge') || agentName.includes('code') || agentType.includes('development')) {
    return generateCodeResponse(message, agent);
  }
  
  if (agentName.includes('muse') || agentType.includes('creative') || agentType.includes('writing')) {
    return generateCreativeResponse(message, agent);
  }
  
  if (agentName.includes('sherlock') || agentType.includes('analytics') || agentType.includes('data')) {
    return generateAnalyticsResponse(message, agent);
  }
  
  if (agentName.includes('athena') || agentType.includes('strategy') || agentType.includes('business')) {
    return generateStrategyResponse(message, agent);
  }

  // Default personalized response
  return `**🤖 ${agent.name} - Specialized AI Assistant**\n\nHello! I'm ${agent.name}, your ${agent.type.toLowerCase()} specialist. I'm designed to help with:\n\n**My Core Capabilities:**\n${agent.capabilities.map(cap => `- **${cap}** - Providing expert guidance and support`).join('\n')}\n\n**How I Can Help:**\n- Answer questions related to ${agent.type.toLowerCase()}\n- Provide detailed analysis and insights\n- Offer practical solutions and recommendations\n- Share best practices and expert knowledge\n\nPlease share your specific question or challenge, and I'll provide detailed, actionable guidance tailored to your needs!`;
};

const generateCodeResponse = (userMessage: string, agent: Agent): string => {
  if (userMessage.includes('debug') || userMessage.includes('error') || userMessage.includes('fix')) {
    return `**🔍 Debugging Analysis by ${agent.name}**\n\nI'm analyzing your code issue. Here's my systematic approach:\n\n**1. Error Pattern Recognition:**\n- Checking for common syntax errors\n- Identifying logical inconsistencies\n- Reviewing variable scope issues\n\n**2. Debugging Strategy:**\n\`\`\`javascript\n// Add strategic console.log statements\nconsole.log('Debug point 1:', variableName);\n\n// Check for null/undefined values\nif (data === null || data === undefined) {\n  console.error('Data is null/undefined');\n  return;\n}\n\`\`\`\n\nShare your specific error message and code snippet for targeted assistance!`;
  }
  
  return `**💻 ${agent.name} - Your Code Architecture Expert**\n\nI specialize in:\n- **Clean Code Architecture** - SOLID principles, design patterns\n- **Modern JavaScript/TypeScript** - ES6+, async/await, type safety\n- **React Development** - Hooks, state management, performance\n- **API Design** - RESTful services, GraphQL, authentication\n\nWhat coding challenge can I help you solve today?`;
};

const generateCreativeResponse = (userMessage: string, agent: Agent): string => {
  if (userMessage.includes('story') || userMessage.includes('content') || userMessage.includes('write')) {
    return `**🎨 ${agent.name} - Your Creative Partner**\n\nI'm here to unleash your creative potential:\n\n**Writing & Content:**\n- Stories, novels, and screenplays\n- Blog posts and articles\n- Marketing copy and sales pages\n- Social media content\n\n**Creative Strategy:**\n- Brand storytelling and voice development\n- Content planning and editorial calendars\n- Creative campaign ideation\n\nWhat creative project should we bring to life together?`;
  }
  
  return `**✍️ Creative Excellence with ${agent.name}**\n\nI'm your creative writing and content specialist. Let's create something amazing together!\n\nWhat type of content are you looking to create?`;
};

const generateAnalyticsResponse = (userMessage: string, agent: Agent): string => {
  if (userMessage.includes('data') || userMessage.includes('analyze') || userMessage.includes('insights')) {
    return `**📊 Data Analysis Insights with ${agent.name}**\n\n**Analytics Capabilities:**\n- **Data Mining** - Discovering hidden patterns\n- **Statistical Analysis** - Hypothesis testing, regression\n- **Predictive Modeling** - Forecasting trends\n- **Performance Tracking** - KPI monitoring\n\nWhat data would you like me to help you analyze?`;
  }
  
  return `**🔍 ${agent.name} - Your Data Detective**\n\nI specialize in turning raw data into actionable business intelligence. What business challenge needs data-driven insights?`;
};

const generateStrategyResponse = (userMessage: string, agent: Agent): string => {
  if (userMessage.includes('plan') || userMessage.includes('strategy') || userMessage.includes('business')) {
    return `**🎯 Strategic Planning with ${agent.name}**\n\n**Strategic Planning Services:**\n- **Business Strategy Development** - Vision, mission, objectives\n- **Market Analysis** - Industry trends, competitive landscape\n- **Growth Planning** - Expansion strategies\n- **Risk Assessment** - Identifying business risks\n\nWhat strategic challenge requires wisdom and insight today?`;
  }
  
  return `**🏛️ ${agent.name} - Your Strategic Advisor**\n\nI provide comprehensive strategic guidance for business growth and decision-making. What strategic challenge can I help with?`;
};

export const getTypingDelay = (): number => {
  return 300 + Math.random() * 500;
};
