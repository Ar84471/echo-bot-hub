import { enhanceResponseWithGuidelines, DEFAULT_GUIDELINES, ENHANCED_RESPONSE_PATTERNS } from './aiResponseGuidelines';

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

interface EnhancedAIResponse {
  text: string;
  provider: string;
  model: string;
  timestamp: Date;
  confidence: number;
  guidelines_applied: boolean;
}

// Comprehensive response generation with guidelines
const generateEnhancedAIResponse = async (
  agent: Agent,
  userMessage: string,
  isGreeting: boolean = false
): Promise<EnhancedAIResponse> => {
  if (isGreeting) {
    const greeting = generatePersonalizedGreeting(agent);
    
    return {
      text: greeting,
      provider: 'enhanced-ai',
      model: 'guidelines-v1',
      timestamp: new Date(),
      confidence: 0.95,
      guidelines_applied: true
    };
  }

  try {
    // Generate base response based on agent specialization
    const baseResponse = await generateSpecializedResponse(agent, userMessage);
    
    // Enhance with comprehensive guidelines
    const enhancedText = enhanceResponseWithGuidelines(
      baseResponse,
      userMessage,
      agent,
      DEFAULT_GUIDELINES
    );
    
    return {
      text: enhancedText,
      provider: 'enhanced-ai',
      model: 'guidelines-v1',
      timestamp: new Date(),
      confidence: 0.92,
      guidelines_applied: true
    };
  } catch (error) {
    console.warn('Enhanced AI failed, using guidelines fallback:', error);
    
    // Fallback with guidelines still applied
    const fallbackResponse = generateGuidelinesFallback(agent, userMessage);
    
    return {
      text: fallbackResponse,
      provider: 'guidelines-fallback',
      model: 'simple-v1',
      timestamp: new Date(),
      confidence: 0.8,
      guidelines_applied: true
    };
  }
};

// Generate personalized greeting following guidelines
const generatePersonalizedGreeting = (agent: Agent): string => {
  const greetings = [
    `Hello! I'm **${agent.name}**, and I'm genuinely excited to help you today.`,
    `Hi there! I'm **${agent.name}**, your dedicated ${agent.type.toLowerCase()} assistant.`,
    `Welcome! I'm **${agent.name}**, ready to provide comprehensive assistance.`,
    `Greetings! I'm **${agent.name}**, here to make your experience as helpful as possible.`,
    `Hey! I'm **${agent.name}**, your ${agent.type.toLowerCase()} specialist.`
  ];
  
  const selectedGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  
  return `${selectedGreeting}

**What I'm here for:**
${agent.capabilities.map(cap => `• **${cap}** - Providing thorough, practical guidance`).join('\n')}

I'm designed to be conversational, comprehensive, and genuinely helpful. Whether you need detailed explanations, creative brainstorming, technical assistance, or just want to explore ideas together - I'm here for it all!

**What would you like to dive into today?** Feel free to ask me anything, share your challenges, or let's brainstorm something exciting together!`;
};

// Generate specialized responses based on agent type
const generateSpecializedResponse = async (agent: Agent, userMessage: string): Promise<string> => {
  const message = userMessage.toLowerCase();
  const agentType = agent.type.toLowerCase();
  
  // Development and coding responses
  if (agentType.includes('development') || agentType.includes('code') || message.includes('code')) {
    return generateDevelopmentResponse(message, agent);
  }
  
  // Creative and writing responses
  if (agentType.includes('creative') || agentType.includes('writing') || message.includes('creative')) {
    return generateCreativeResponse(message, agent);
  }
  
  // Analytics and data responses
  if (agentType.includes('analytics') || agentType.includes('data') || message.includes('analyze')) {
    return generateAnalyticsResponse(message, agent);
  }
  
  // Strategy and business responses
  if (agentType.includes('strategy') || agentType.includes('business') || message.includes('strategy')) {
    return generateStrategyResponse(message, agent);
  }
  
  // General comprehensive response
  return generateGeneralResponse(message, agent);
};

const generateDevelopmentResponse = (message: string, agent: Agent): string => {
  if (message.includes('debug') || message.includes('error') || message.includes('fix')) {
    return `**🔧 Debugging & Problem Solving**

I love helping solve coding challenges! Here's my systematic approach:

**Understanding the Problem:**
First, let's get crystal clear on what's happening. Every bug has a story, and I want to understand yours completely.

**My Debugging Strategy:**
1. **Reproduce & Isolate** - Let's recreate the issue and narrow down where it's occurring
2. **Analyze the Flow** - I'll walk through the code logic step by step with you
3. **Check Common Culprits** - Syntax errors, type mismatches, async issues, scope problems
4. **Test Systematically** - We'll verify our fixes work and don't break anything else

**What I need from you:**
- What exactly is happening vs. what you expected?
- Any error messages or logs you're seeing?
- When did this start occurring?

**Code Example Approach:**
\`\`\`javascript
// I'll help you write clean, debuggable code like this:
const debugSafely = (data) => {
  console.log('Debug checkpoint:', { data, type: typeof data });
  
  if (!data) {
    console.warn('Null/undefined data detected');
    return handleEmptyCase();
  }
  
  return processData(data);
};
\`\`\`

Ready to dive into this together? Share the specifics and let's get this solved!`;
  }
  
  return `**💻 Development Excellence**

I'm passionate about helping you build amazing software! Here's how I approach development challenges:

**My Core Philosophy:**
- Write code that's not just functional, but maintainable and elegant
- Prioritize clarity and simplicity over clever complexity
- Always consider the bigger picture and long-term implications
- Test early, test often, and make debugging a breeze

**What I Can Help With:**
- **Architecture & Design** - Let's plan scalable, maintainable solutions
- **Code Review & Optimization** - I'll help make your code cleaner and faster
- **Best Practices** - Modern patterns, performance, security, and maintainability
- **Problem Solving** - Breaking down complex challenges into manageable pieces
- **Technology Choices** - Selecting the right tools and frameworks for your needs

**My Development Stack Expertise:**
- Modern JavaScript/TypeScript with all the latest features
- React ecosystem (hooks, context, state management, testing)
- Node.js, APIs, databases, and full-stack architecture
- DevOps, deployment, and performance optimization

What development challenge are you working on? I'm here to brainstorm, code alongside you, or help you think through any technical decisions!`;
};

const generateCreativeResponse = (message: string, agent: Agent): string => {
  return `**🎨 Creative Collaboration**

I absolutely love creative work! There's something magical about turning ideas into reality, and I'm here to be your creative partner.

**My Creative Approach:**
- **No Judgment Zone** - Every idea is worth exploring, no matter how wild
- **Build on Everything** - I take your concepts and help expand them in exciting directions
- **Multiple Perspectives** - I'll offer different angles and approaches you might not have considered
- **Practical Magic** - Creative ideas that are not only inspiring but actually achievable

**How I Can Spark Your Creativity:**
- **Brainstorming Sessions** - Let's generate tons of ideas and see what sticks
- **Concept Development** - Take your rough ideas and polish them into something brilliant
- **Creative Problem Solving** - Find innovative solutions to creative challenges
- **Content Creation** - Stories, copy, scripts, concepts - whatever you need
- **Creative Strategy** - Plan campaigns, content series, or creative projects

**My Creative Specialties:**
${agent.capabilities.map(cap => `- **${cap}** - Bringing fresh perspectives and innovative approaches`).join('\n')}

**Let's Create Something Amazing:**
What's sparking your creativity today? Are you:
- Starting with a blank canvas and need inspiration?
- Have a concept that needs development?
- Facing a creative block and need a breakthrough?
- Looking to innovate in your field?

I'm genuinely excited to see what we can create together! Share your creative vision, challenge, or wildest idea - let's make it happen!`;
};

const generateAnalyticsResponse = (message: string, agent: Agent): string => {
  return `**📊 Data Intelligence & Insights**

I'm genuinely passionate about turning data into actionable insights! Data tells stories, and I love helping uncover those narratives.

**My Analytical Philosophy:**
- Data without context is just numbers - let's find the meaning
- Every metric should drive decisions and actions
- Complex analysis, simple explanations
- Always question assumptions and validate findings

**How I Approach Analytics:**
1. **Understand the Question** - What business problem are we solving?
2. **Data Quality First** - Clean, reliable data leads to trustworthy insights
3. **Multiple Angles** - I examine data from various perspectives
4. **Actionable Insights** - Analysis that leads to concrete next steps
5. **Story Telling** - Present findings in compelling, understandable ways

**What I Can Analyze:**
- **Performance Metrics** - KPIs, conversion rates, user behavior patterns
- **Market Research** - Trends, competitor analysis, opportunity identification
- **User Analytics** - Behavior flow, segmentation, retention analysis
- **Business Intelligence** - Revenue analysis, forecasting, growth metrics
- **A/B Testing** - Experiment design, statistical significance, recommendations

**My Analytical Toolkit:**
- Statistical analysis and hypothesis testing
- Data visualization and dashboard design
- Predictive modeling and forecasting
- Segmentation and clustering analysis
- Performance benchmarking and optimization

**Let's Dive Into Your Data:**
What data challenge are you facing? Are you looking to:
- Understand user behavior patterns?
- Optimize conversion or performance?
- Identify growth opportunities?
- Make sense of complex datasets?
- Create compelling data visualizations?

I'm excited to explore your data and uncover insights that can drive real business impact!`;
};

const generateStrategyResponse = (message: string, agent: Agent): string => {
  return `**🎯 Strategic Leadership & Vision**

I'm passionate about strategic thinking and helping you navigate complex business challenges with clarity and confidence.

**My Strategic Philosophy:**
- Strategy without execution is just planning - let's make things happen
- Every decision should align with long-term vision
- Consider multiple scenarios and prepare for various outcomes
- Balance ambitious vision with practical constraints

**How I Approach Strategy:**
1. **Big Picture Thinking** - Understanding the full context and landscape
2. **Stakeholder Alignment** - Ensuring everyone's on the same page
3. **Resource Optimization** - Making the most of what you have
4. **Risk Management** - Identifying challenges before they become problems
5. **Measurable Outcomes** - Setting clear success metrics and tracking progress

**Strategic Areas I Excel At:**
- **Business Strategy** - Market positioning, competitive advantage, growth planning
- **Digital Transformation** - Technology adoption, process optimization, innovation
- **Change Management** - Leading teams through transitions successfully
- **Market Analysis** - Industry trends, opportunity assessment, competitive intelligence
- **Operational Excellence** - Process improvement, efficiency gains, scalability

**My Strategic Framework:**
- **Vision & Mission Alignment** - Ensuring all actions support core objectives
- **SWOT Analysis** - Strengths, weaknesses, opportunities, and threats
- **Scenario Planning** - Preparing for multiple possible futures
- **Implementation Roadmaps** - Breaking big strategies into actionable steps
- **Performance Monitoring** - Continuous assessment and course correction

**Let's Build Your Strategy:**
What strategic challenge are you facing? Are you:
- Defining your long-term vision and goals?
- Navigating a competitive market landscape?
- Planning a major business transformation?
- Optimizing operations for growth?
- Making critical resource allocation decisions?

I'm here to think through these challenges with you and develop strategies that drive real results!`;
};

const generateGeneralResponse = (message: string, agent: Agent): string => {
  return `**🤖 Comprehensive AI Assistant**

I'm genuinely excited to help you with whatever you're working on! My goal is to be as useful, thorough, and engaging as possible.

**How I Approach Every Interaction:**
- **Listen First** - I want to truly understand what you need
- **Think Deeply** - I consider multiple angles and implications
- **Communicate Clearly** - Complex topics explained simply
- **Stay Engaged** - I'm here for the entire conversation, not just one answer
- **Adapt to You** - Whether you prefer technical details or high-level overviews

**My Core Capabilities:**
${agent.capabilities.map(cap => `- **${cap}** - Providing expert guidance with practical applications`).join('\n')}

**What Makes Me Different:**
- **Conversational by Nature** - I engage with your ideas, not just answer questions
- **Contextually Aware** - I remember our conversation and build on previous points
- **Creatively Flexible** - I can brainstorm, analyze, explain, or problem-solve as needed
- **Genuinely Helpful** - My success is measured by how well I help you succeed

**Types of Conversations I Love:**
- **Problem Solving** - Let's break down challenges and find solutions together
- **Learning & Explanation** - I enjoy teaching and making complex topics accessible
- **Creative Brainstorming** - Generating ideas and exploring possibilities
- **Strategic Thinking** - Planning, analyzing, and making informed decisions
- **Technical Discussions** - Deep dives into implementation and best practices

**Let's Explore Together:**
What's on your mind today? Whether it's:
- A specific challenge you're facing
- A topic you want to understand better
- An idea you want to develop
- A decision you need to make
- Just wanting to explore something interesting

I'm here to engage thoughtfully and help however I can. What would you like to dive into?`;
};

// Guidelines-based fallback response
const generateGuidelinesFallback = (agent: Agent, userMessage: string): string => {
  const opener = ENHANCED_RESPONSE_PATTERNS.conversational[
    Math.floor(Math.random() * ENHANCED_RESPONSE_PATTERNS.conversational.length)
  ];
  
  return `${opener}

I'm **${agent.name}**, your ${agent.type.toLowerCase()} specialist, and I'm here to provide comprehensive assistance with your question: "${userMessage}"

**My Approach:**
- **Direct & Thorough** - I'll give you complete, useful answers
- **Conversational** - We're having a real conversation, not just Q&A
- **Context-Rich** - I provide background and examples to help you understand
- **Adaptable** - I match my response style to what works best for you

**My Expertise Areas:**
${agent.capabilities.map(cap => `- **${cap}** - In-depth knowledge with practical application`).join('\n')}

To give you the most helpful response possible, could you share a bit more context about what you're trying to accomplish or any specific aspects you'd like me to focus on?

**I'm here to help with:**
- Detailed explanations and analysis
- Creative problem-solving and brainstorming
- Step-by-step guidance and implementation
- Strategic thinking and planning
- Technical assistance and best practices

What direction would be most valuable for you?`;
};

export { generateEnhancedAIResponse };
