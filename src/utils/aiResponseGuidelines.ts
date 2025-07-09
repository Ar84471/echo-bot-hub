
// Comprehensive AI response guidelines and enhancement system
export interface ResponseGuidelines {
  directAndThorough: boolean;
  conversationalTone: boolean;
  provideContext: boolean;
  engageCreatively: boolean;
  adaptToUserStyle: boolean;
  acknowledgeUncertainty: boolean;
  focusOnHelpfulness: boolean;
}

export const DEFAULT_GUIDELINES: ResponseGuidelines = {
  directAndThorough: true,
  conversationalTone: true,
  provideContext: true,
  engageCreatively: true,
  adaptToUserStyle: true,
  acknowledgeUncertainty: true,
  focusOnHelpfulness: true,
};

// Enhanced response patterns following the guidelines
export const ENHANCED_RESPONSE_PATTERNS = {
  conversational: [
    "That's a great question! Let me dive into this for you.",
    "I'd be happy to help you understand this better.",
    "Absolutely! Here's what I can share about that:",
    "That's fascinating - let me break this down for you.",
    "I love this question! Here's my take on it:",
    "Great point! Let me explore this with you.",
    "That's an interesting perspective. Here's what I think:",
  ],
  
  thorough: [
    "Let me give you a comprehensive overview:",
    "Here's a detailed explanation to help you understand:",
    "I'll walk you through this step by step:",
    "Let me provide you with the full picture:",
    "Here's everything you need to know about this:",
  ],
  
  contextual: [
    "To give you some background context:",
    "Here's why this matters:",
    "Let me put this in perspective:",
    "To understand this better, consider:",
    "The key thing to understand is:",
  ],
  
  creative: [
    "Let's think about this creatively:",
    "Here's an interesting way to approach this:",
    "I have some creative ideas for you:",
    "Let's brainstorm this together:",
    "Here's a fresh perspective on this:",
  ],
  
  uncertain: [
    "While I'm not entirely certain, here's what I believe:",
    "I'm not 100% sure, but based on what I know:",
    "This is my best understanding, though you might want to verify:",
    "I think this is likely correct, but let me explain my reasoning:",
    "From what I can tell, it seems like:",
  ]
};

// Function to enhance responses with guidelines
export const enhanceResponseWithGuidelines = (
  baseResponse: string,
  userMessage: string,
  agent: any,
  guidelines: ResponseGuidelines = DEFAULT_GUIDELINES
): string => {
  const message = userMessage.toLowerCase();
  const agentType = agent.type.toLowerCase();
  
  // Detect user style and intent
  const isCreativeRequest = message.includes('creative') || message.includes('brainstorm') || 
                           message.includes('imagine') || message.includes('idea');
  const isTechnicalRequest = message.includes('how') || message.includes('technical') || 
                            message.includes('explain') || message.includes('code');
  const isCasualTone = message.includes('hey') || message.includes('sup') || 
                       message.length < 20;
  
  // Select appropriate opening based on context
  let opener = '';
  if (isCreativeRequest && guidelines.engageCreatively) {
    opener = ENHANCED_RESPONSE_PATTERNS.creative[
      Math.floor(Math.random() * ENHANCED_RESPONSE_PATTERNS.creative.length)
    ];
  } else if (isTechnicalRequest && guidelines.directAndThorough) {
    opener = ENHANCED_RESPONSE_PATTERNS.thorough[
      Math.floor(Math.random() * ENHANCED_RESPONSE_PATTERNS.thorough.length)
    ];
  } else if (guidelines.conversationalTone) {
    opener = ENHANCED_RESPONSE_PATTERNS.conversational[
      Math.floor(Math.random() * ENHANCED_RESPONSE_PATTERNS.conversational.length)
    ];
  }
  
  // Build enhanced response
  let enhancedResponse = '';
  
  // Add conversational opener if guidelines allow
  if (guidelines.conversationalTone && opener) {
    enhancedResponse += `${opener}\n\n`;
  }
  
  // Add context if beneficial
  if (guidelines.provideContext && (isTechnicalRequest || isCreativeRequest)) {
    const contextOpener = ENHANCED_RESPONSE_PATTERNS.contextual[
      Math.floor(Math.random() * ENHANCED_RESPONSE_PATTERNS.contextual.length)
    ];
    enhancedResponse += `${contextOpener}\n\n`;
  }
  
  // Add the main response content
  enhancedResponse += baseResponse;
  
  // Add helpful follow-up based on agent type
  if (guidelines.focusOnHelpfulness) {
    enhancedResponse += `\n\n**How else can I help?**\n`;
    
    if (agentType.includes('development') || agentType.includes('code')) {
      enhancedResponse += `- Need help with implementation details?\n- Want to explore alternative approaches?\n- Have questions about best practices?\n- Looking for debugging assistance?`;
    } else if (agentType.includes('creative') || agentType.includes('writing')) {
      enhancedResponse += `- Want to brainstorm more ideas?\n- Need help refining this concept?\n- Looking for different creative angles?\n- Want to explore variations on this theme?`;
    } else if (agentType.includes('analytics') || agentType.includes('data')) {
      enhancedResponse += `- Need deeper analysis on specific metrics?\n- Want to explore different data perspectives?\n- Looking for visualization suggestions?\n- Need help interpreting the results?`;
    } else {
      enhancedResponse += `- Need more details on any specific aspect?\n- Want to explore related topics?\n- Have follow-up questions?\n- Looking for practical next steps?`;
    }
  }
  
  return enhancedResponse;
};

// Response quality assessment
export const assessResponseQuality = (response: string): {
  score: number;
  feedback: string[];
  improvements: string[];
} => {
  const feedback: string[] = [];
  const improvements: string[] = [];
  let score = 0;
  
  // Check for conversational tone
  if (/^(that's|i'd|let me|here's|absolutely)/i.test(response)) {
    score += 20;
    feedback.push('✓ Conversational and engaging tone');
  } else {
    improvements.push('• Add more conversational elements');
  }
  
  // Check for thoroughness
  if (response.length > 200) {
    score += 20;
    feedback.push('✓ Comprehensive and detailed');
  } else {
    improvements.push('• Provide more thorough explanations');
  }
  
  // Check for structure
  if (response.includes('\n') || response.includes('**')) {
    score += 20;
    feedback.push('✓ Well-structured and organized');
  } else {
    improvements.push('• Improve response structure');
  }
  
  // Check for helpfulness indicators
  if (response.includes('help') || response.includes('assist') || response.includes('support')) {
    score += 20;
    feedback.push('✓ Demonstrates helpfulness');
  } else {
    improvements.push('• Include more helpful language');
  }
  
  // Check for context and examples
  if (response.includes('example') || response.includes('context') || response.includes('background')) {
    score += 20;
    feedback.push('✓ Provides context and examples');
  } else {
    improvements.push('• Add more context and examples');
  }
  
  return { score, feedback, improvements };
};
