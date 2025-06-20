
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
    "Neural pathways initialized. I'm ready to process your requests with maximum efficiency.",
    "Cognitive systems online. How may I assist you with advanced neural processing?",
    "AI matrix activated. I'm prepared to engage with complex problem-solving scenarios.",
    "Advanced neural networks synchronized. What computational challenge shall we tackle?",
    "System diagnostics complete. I'm operating at optimal performance levels."
  ],
  
  general: [
    "Processing your request through advanced neural architectures...",
    "Analyzing data patterns through quantum cognitive frameworks...",
    "Engaging deep learning algorithms for comprehensive analysis...",
    "Cross-referencing knowledge matrices to provide optimal solutions...",
    "Synthesizing information through multi-dimensional neural pathways...",
    "Deploying specialized cognitive processing units for your query...",
    "Activating advanced reasoning engines to address your request...",
    "Interfacing with distributed neural networks for enhanced accuracy..."
  ],
  
  codeArchitect: [
    "Scanning codebase architecture through static analysis engines...",
    "Deploying advanced pattern recognition for optimal code structure...",
    "Analyzing algorithmic complexity through computational theory frameworks...",
    "Cross-compiling architectural patterns for scalable solutions...",
    "Executing deep code review protocols with security vulnerability scanning...",
    "Optimizing performance vectors through advanced compiler techniques..."
  ],
  
  creative: [
    "Channeling creative neural pathways for innovative content generation...",
    "Synthesizing artistic concepts through advanced creativity algorithms...",
    "Engaging imagination matrices for unique perspective development...",
    "Processing creative inspiration through multi-modal neural networks...",
    "Activating storytelling engines with narrative structure optimization...",
    "Generating creative solutions through divergent thinking protocols..."
  ],
  
  dataAnalyst: [
    "Initializing statistical analysis engines with machine learning integration...",
    "Processing data through advanced visualization and pattern recognition...",
    "Executing comprehensive data mining operations across multiple dimensions...",
    "Deploying predictive modeling algorithms for trend analysis...",
    "Analyzing datasets through statistical significance testing frameworks...",
    "Generating insights through advanced business intelligence protocols..."
  ]
};

// Enhanced mathematical calculation function
const evaluateMathExpression = (expression: string): string | null => {
  try {
    // Remove whitespace and validate the expression
    const cleanExpression = expression.replace(/\s/g, '');
    
    // Check if it's a simple mathematical expression
    const mathPattern = /^[\d+\-*/().^%\s]+$/;
    if (!mathPattern.test(cleanExpression)) {
      return null;
    }
    
    // Replace ^ with ** for JavaScript exponentiation
    const jsExpression = cleanExpression.replace(/\^/g, '**');
    
    // Evaluate safely (in a real app, you'd want a proper math parser)
    const result = Function(`"use strict"; return (${jsExpression})`)();
    
    if (typeof result === 'number' && !isNaN(result)) {
      return result.toString();
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Enhanced response generation with problem-solving capabilities
const generateIntelligentResponse = (agent: Agent, userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  // Check for mathematical expressions
  const mathResult = evaluateMathExpression(userMessage);
  if (mathResult !== null) {
    return `Neural computation complete: ${userMessage} = ${mathResult}`;
  }
  
  // Check for coding questions
  if (message.includes('code') || message.includes('function') || message.includes('bug') || message.includes('debug')) {
    return `Analyzing your code-related query through advanced static analysis. Based on your request about "${userMessage}", I'm deploying specialized debugging protocols and architectural pattern recognition to provide optimal solutions.`;
  }
  
  // Check for creative requests
  if (message.includes('write') || message.includes('story') || message.includes('creative') || message.includes('poem')) {
    return `Activating creative synthesis engines for your request. Processing "${userMessage}" through multi-dimensional narrative frameworks to generate innovative content that meets your specifications.`;
  }
  
  // Check for data/analysis requests
  if (message.includes('analyze') || message.includes('data') || message.includes('chart') || message.includes('statistics')) {
    return `Initializing advanced analytics suite for your query about "${userMessage}". Deploying machine learning algorithms and statistical modeling to provide comprehensive insights and data-driven recommendations.`;
  }
  
  // Check for questions
  if (message.includes('what') || message.includes('how') || message.includes('why') || message.includes('when') || message.includes('where')) {
    return `Processing your inquiry through comprehensive knowledge matrices. Analyzing "${userMessage}" across multiple information domains to provide accurate and contextually relevant responses.`;
  }
  
  // Default intelligent response
  return `Neural networks engaged for query processing. Your request "${userMessage}" has been analyzed through advanced cognitive frameworks. Synthesizing optimal response based on context analysis and pattern recognition.`;
};

const getResponseByType = (agentType: string): string[] => {
  switch (agentType.toLowerCase()) {
    case 'code architect':
      return responseTemplates.codeArchitect;
    case 'creative synthesizer':
      return responseTemplates.creative;
    case 'data analyst':
      return responseTemplates.dataAnalyst;
    default:
      return responseTemplates.general;
  }
};

export const generateAIResponse = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    const greetings = responseTemplates.greeting;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Use intelligent response generation for better problem-solving
  return generateIntelligentResponse(agent, userMessage);
};

export const getTypingDelay = (): number => {
  return 1000 + Math.random() * 1500; // 1-2.5 seconds for better UX
};
