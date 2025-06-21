
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

const responseTemplates = {
  greeting: [
    "Hello! I'm ready to help you with any questions or tasks.",
    "Hi there! How can I assist you today?",
    "Greetings! I'm here to help with whatever you need.",
    "Welcome! What would you like to work on together?",
    "Hello! I'm prepared to tackle any challenge you have."
  ],
  
  general: [
    "I understand your request. Let me help you with that.",
    "That's an interesting question. Here's what I think:",
    "I can definitely help you with this.",
    "Let me analyze that for you.",
    "Great question! Here's my response:",
    "I'm processing your request and here's what I found:",
    "Based on your input, here's my analysis:",
    "I can provide some insights on this topic."
  ]
};

// Enhanced mathematical calculation function
const evaluateMathExpression = (expression: string): string | null => {
  try {
    // Clean the expression
    const cleanExpression = expression.replace(/\s/g, '');
    
    // Basic validation - only allow numbers, operators, parentheses
    const mathPattern = /^[0-9+\-*/().^%\s]+$/;
    if (!mathPattern.test(cleanExpression)) {
      return null;
    }
    
    // Replace ^ with ** for JavaScript exponentiation
    let jsExpression = cleanExpression.replace(/\^/g, '**');
    
    // Simple evaluation using Function constructor (safer than eval)
    const result = Function(`"use strict"; return (${jsExpression})`)();
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return result.toString();
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Generate contextual responses based on user input
const generateContextualResponse = (agent: Agent, userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  // Check for mathematical expressions first
  const mathResult = evaluateMathExpression(userMessage);
  if (mathResult !== null) {
    return `The answer is: ${userMessage} = ${mathResult}`;
  }
  
  // Handle coding questions
  if (message.includes('code') || message.includes('function') || message.includes('bug') || message.includes('debug') || message.includes('programming')) {
    return `I can help you with coding! For "${userMessage}", I'd suggest checking your syntax, variable names, and logic flow. What specific programming language or framework are you working with?`;
  }
  
  // Handle creative requests
  if (message.includes('write') || message.includes('story') || message.includes('creative') || message.includes('poem') || message.includes('article')) {
    return `I'd be happy to help with creative writing! For your request about "${userMessage}", I can help you brainstorm ideas, structure content, or provide writing tips. What specific type of creative work are you looking for?`;
  }
  
  // Handle data/analysis requests
  if (message.includes('analyze') || message.includes('data') || message.includes('chart') || message.includes('statistics') || message.includes('report')) {
    return `I can assist with data analysis! Regarding "${userMessage}", I can help you understand data patterns, create summaries, or explain statistical concepts. What kind of analysis are you looking to perform?`;
  }
  
  // Handle questions
  if (message.includes('what') || message.includes('how') || message.includes('why') || message.includes('when') || message.includes('where') || message.includes('?')) {
    return `Great question about "${userMessage}"! I'm here to provide information and explanations. Could you be more specific about what aspect you'd like me to focus on?`;
  }
  
  // Handle greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
    return `Hello! Nice to meet you. I'm ${agent.name}, and I'm here to help with ${agent.capabilities.join(', ')}. What would you like to work on?`;
  }
  
  // Default response with agent personality
  const responses = [
    `I understand you're asking about "${userMessage}". As ${agent.name}, I can help you with ${agent.capabilities[0] || 'various tasks'}. Could you provide more context?`,
    `That's an interesting topic! Regarding "${userMessage}", I'd be happy to assist. What specific aspect would you like me to focus on?`,
    `Thanks for your message about "${userMessage}". I'm equipped to help with ${agent.type.toLowerCase()} tasks. How can I best assist you?`,
    `I see you're interested in "${userMessage}". Based on my capabilities in ${agent.capabilities.slice(0, 2).join(' and ')}, I can definitely help. What would you like to know?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateAIResponse = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    const greetings = responseTemplates.greeting;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Always return a contextual response
  return generateContextualResponse(agent, userMessage);
};

export const getTypingDelay = (): number => {
  return 800 + Math.random() * 1200; // 0.8-2 seconds for better responsiveness
};
