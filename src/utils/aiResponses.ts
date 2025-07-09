
import { generateEnhancedAIResponse } from './enhancedAI';

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

// Enhanced response generation with automatic AI provider configuration
export const generateAIResponse = async (agent: Agent, userMessage: string, isGreeting: boolean = false): Promise<string> => {
  try {
    // Use the enhanced AI system that automatically handles providers
    const enhancedResponse = await generateEnhancedAIResponse(agent, userMessage, isGreeting);
    return enhancedResponse.text;
  } catch (error) {
    console.warn('Enhanced AI failed, using basic fallback:', error);
    return generateBasicFallback(agent, userMessage, isGreeting);
  }
};

// Basic fallback for absolute reliability
const generateBasicFallback = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    return `Hello! I'm **${agent.name}**, your ${agent.type.toLowerCase()} specialist. I'm here to provide expert assistance with ${agent.capabilities.join(', ')}. How can I help you today?`;
  }

  const message = userMessage.toLowerCase().trim();
  
  // Enhanced contextual responses based on user input
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return `Hello! I'm ${agent.name}, ready to assist you with ${agent.type.toLowerCase()} tasks. What would you like to work on?`;
  }
  
  if (message.includes('help') || message.includes('assist')) {
    return `I'm here to help! As your ${agent.type.toLowerCase()} specialist, I can assist with:\n\n${agent.capabilities.map(cap => `• **${cap}** - Providing expert guidance and solutions`).join('\n')}\n\nWhat specific challenge can I help you tackle?`;
  }
  
  if (message.includes('what') || message.includes('how') || message.includes('why')) {
    return `Great question! Let me provide you with a comprehensive answer.\n\nAs ${agent.name}, I specialize in ${agent.type.toLowerCase()} and can offer detailed insights on topics like:\n\n${agent.capabilities.map(cap => `• ${cap}`).join('\n')}\n\nCould you provide a bit more context about what specifically you'd like to know? This will help me give you the most accurate and helpful response.`;
  }
  
  // Default comprehensive response
  return `Thank you for your message: "${userMessage}"\n\nI'm ${agent.name}, your dedicated ${agent.type.toLowerCase()} assistant. I'm designed to provide thoughtful, detailed assistance with:\n\n${agent.capabilities.map(cap => `• **${cap}** - Expert analysis and practical solutions`).join('\n')}\n\nTo give you the most helpful response, could you tell me more about what you're trying to accomplish or what specific aspect you'd like me to focus on?`;
};

export const getTypingDelay = (): number => {
  return 300 + Math.random() * 500;
};
