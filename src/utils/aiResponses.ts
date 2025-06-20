
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
  
  const responses = getResponseByType(agent.type);
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add some context-awareness based on user message
  const contextualResponses = [
    `${baseResponse} Based on your query about "${userMessage.slice(0, 30)}${userMessage.length > 30 ? '...' : ''}", I'm formulating a comprehensive response.`,
    `${baseResponse} Your request has been prioritized in my processing queue for immediate analysis.`,
    `${baseResponse} I'm leveraging my specialized capabilities in ${agent.capabilities[Math.floor(Math.random() * agent.capabilities.length)]} to address this.`,
    baseResponse
  ];
  
  return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
};

export const getTypingDelay = (): number => {
  return 1500 + Math.random() * 2500; // 1.5-4 seconds
};
