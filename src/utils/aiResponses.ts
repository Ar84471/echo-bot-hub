

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

// Main AI response generation with comprehensive guidelines
export const generateAIResponse = async (agent: Agent, userMessage: string, isGreeting: boolean = false): Promise<string> => {
  // Always use the reliable fallback for mobile stability
  return generateBasicGuidelinesFallback(agent, userMessage, isGreeting);
};

// Basic fallback that still follows guidelines
const generateBasicGuidelinesFallback = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    return `Hello! I'm **${agent.name}**, and I'm genuinely excited to help you today!

I'm your dedicated ${agent.type.toLowerCase()} specialist, designed to provide comprehensive, conversational assistance with ${agent.capabilities.join(', ')}.

**What makes me different:**
- I engage in real conversations, not just Q&A
- I provide thorough, detailed responses with context
- I adapt my style to match your needs
- I'm genuinely focused on being as helpful as possible

**How can I help you today?** Feel free to ask me anything - whether you need detailed explanations, creative brainstorming, problem-solving assistance, or just want to explore ideas together!`;
  }

  const message = userMessage.toLowerCase().trim();
  
  // Generate conversational, guidelines-based responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return `Hey there! I'm ${agent.name}, and I'm really glad you reached out!

I'm here to provide thorough, conversational assistance with ${agent.type.toLowerCase()} challenges. Whether you need detailed explanations, creative problem-solving, or just want to brainstorm ideas together - I'm all in!

What's on your mind today? I'm genuinely excited to help however I can!`;
  }
  
  if (message.includes('help') || message.includes('assist')) {
    return `Absolutely! I'm here to help, and I love what I do!

As your ${agent.type.toLowerCase()} specialist, I can provide comprehensive assistance with:

${agent.capabilities.map(cap => `• **${cap}** - Detailed guidance with practical applications`).join('\n')}

**My approach is always:**
- Direct and thorough - you'll get complete, useful answers
- Conversational and engaging - we're having a real discussion
- Context-rich - I provide background and examples
- Adaptable - I match my style to what works best for you

What specific challenge or topic would you like to dive into? I'm genuinely excited to explore this with you!`;
  }
  
  if (message.includes('what') || message.includes('how') || message.includes('why')) {
    return `That's a fantastic question! I love diving deep into topics and providing comprehensive explanations.

Here's how I'll approach your question about "${userMessage}":

**My Process:**
- First, I'll make sure I understand exactly what you're looking for
- Then I'll provide detailed, contextual information
- I'll include examples and practical applications where helpful
- Finally, I'll offer follow-up assistance and related insights

As **${agent.name}**, I specialize in ${agent.type.toLowerCase()} and can offer detailed insights on:

${agent.capabilities.map(cap => `• **${cap}** - In-depth analysis with practical applications`).join('\n')}

To give you the most valuable response, could you share a bit more context about what specifically interests you most about this topic? I'm here to provide as much detail and assistance as you need!`;
  }
  
  // Default comprehensive, guidelines-based response
  return `Thank you for reaching out with: "${userMessage}"

I'm **${agent.name}**, your dedicated ${agent.type.toLowerCase()} assistant, and I'm genuinely excited to help you with this!

**How I approach every interaction:**
- **Conversational & Engaging** - We're having a real discussion, not just Q&A
- **Thorough & Detailed** - You'll get comprehensive, useful responses
- **Context-Rich** - I provide background, examples, and practical insights
- **Genuinely Helpful** - My goal is to be as useful as possible

**My expertise includes:**
${agent.capabilities.map(cap => `• **${cap}** - Expert analysis with actionable insights`).join('\n')}

To give you the most helpful response possible, I'd love to understand more about:
- What specific outcomes you're looking for
- Any particular challenges you're facing
- Your preferred level of detail (high-level overview vs. deep dive)
- Any context that might be relevant

What aspect would be most valuable for us to explore together? I'm here to provide whatever depth of assistance you need!`;
};

export const getTypingDelay = (): number => {
  return 300 + Math.random() * 500;
};
