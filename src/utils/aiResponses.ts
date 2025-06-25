
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

// Agent-specific response generators
const generateCodeResponse = (userMessage: string, agent: Agent): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('debug') || message.includes('error') || message.includes('fix')) {
    return `**🔍 Debugging Analysis by ${agent.name}**\n\nI'm analyzing your code issue. Here's my systematic approach:\n\n**1. Error Pattern Recognition:**\n- Checking for common syntax errors\n- Identifying logical inconsistencies\n- Reviewing variable scope issues\n\n**2. Debugging Strategy:**\n\`\`\`javascript\n// Add strategic console.log statements\nconsole.log('Debug point 1:', variableName);\n\n// Check for null/undefined values\nif (data === null || data === undefined) {\n  console.error('Data is null/undefined');\n  return;\n}\n\n// Validate function parameters\nfunction validateInput(input) {\n  if (!input || typeof input !== 'expected_type') {\n    throw new Error('Invalid input provided');\n  }\n}\n\`\`\`\n\n**3. Common Solutions:**\n- Check variable declarations and scope\n- Verify API responses and data structures\n- Review async/await patterns\n- Validate function parameters\n\nShare your specific error message and code snippet for targeted assistance!`;
  }
  
  if (message.includes('react') || message.includes('jsx') || message.includes('component')) {
    return `**⚛️ React Development with ${agent.name}**\n\n\`\`\`jsx\n// Modern React Component Pattern\nimport React, { useState, useEffect } from 'react';\n\nconst MyComponent = ({ data, onUpdate }) => {\n  const [state, setState] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    // Fetch data or initialize component\n    const initializeComponent = async () => {\n      try {\n        setLoading(true);\n        const result = await fetchData();\n        setState(result);\n      } catch (error) {\n        console.error('Component initialization failed:', error);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    initializeComponent();\n  }, [data]);\n\n  if (loading) return <div>Loading...</div>;\n\n  return (\n    <div className=\"component-container\">\n      <h2>{state?.title}</h2>\n      <button onClick={() => onUpdate(state)}>\n        Update Data\n      </button>\n    </div>\n  );\n};\n\nexport default MyComponent;\n\`\`\`\n\n**React Best Practices I Follow:**\n- Functional components with hooks\n- Proper state management\n- Error boundaries for robust apps\n- Performance optimization with useMemo/useCallback\n- Clean component architecture\n\nWhat specific React challenge are you working on?`;
  }
  
  if (message.includes('api') || message.includes('fetch') || message.includes('backend')) {
    return `**🌐 API Development with ${agent.name}**\n\n\`\`\`javascript\n// Modern API Integration Pattern\nconst apiClient = {\n  baseURL: 'https://api.example.com',\n  \n  async request(endpoint, options = {}) {\n    const url = \`\${this.baseURL}\${endpoint}\`;\n    const config = {\n      headers: {\n        'Content-Type': 'application/json',\n        'Authorization': \`Bearer \${getAuthToken()}\`,\n        ...options.headers\n      },\n      ...options\n    };\n\n    try {\n      const response = await fetch(url, config);\n      \n      if (!response.ok) {\n        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);\n      }\n      \n      return await response.json();\n    } catch (error) {\n      console.error('API Request failed:', error);\n      throw error;\n    }\n  },\n\n  // CRUD Operations\n  get: (endpoint) => apiClient.request(endpoint),\n  post: (endpoint, data) => apiClient.request(endpoint, {\n    method: 'POST',\n    body: JSON.stringify(data)\n  }),\n  put: (endpoint, data) => apiClient.request(endpoint, {\n    method: 'PUT',\n    body: JSON.stringify(data)\n  }),\n  delete: (endpoint) => apiClient.request(endpoint, {\n    method: 'DELETE'\n  })\n};\n\n// Usage Example\nconst userData = await apiClient.get('/users/123');\nconst newUser = await apiClient.post('/users', { name: 'John', email: 'john@example.com' });\n\`\`\`\n\n**API Integration Best Practices:**\n- Centralized API client with error handling\n- Proper authentication token management\n- Request/response interceptors\n- Retry logic for failed requests\n- Type safety with TypeScript interfaces\n\nWhat kind of API integration are you building?`;
  }
  
  return `**💻 ${agent.name} - Your Code Architecture Expert**\n\nI specialize in:\n- **Clean Code Architecture** - SOLID principles, design patterns\n- **Modern JavaScript/TypeScript** - ES6+, async/await, type safety\n- **React Development** - Hooks, state management, performance\n- **API Design** - RESTful services, GraphQL, authentication\n- **Testing & Debugging** - Unit tests, integration tests, TDD\n\n**Quick Help Options:**\n- Share your code for review and optimization\n- Ask about specific programming concepts\n- Get help with debugging and troubleshooting\n- Discuss architecture decisions and best practices\n\nWhat coding challenge can I help you solve today?`;
};

const generateCreativeResponse = (userMessage: string, agent: Agent): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('story') || message.includes('narrative') || message.includes('plot')) {
    return `**📖 Creative Storytelling with ${agent.name}**\n\n*Let me craft something unique for you...*\n\n**The Digital Muse**\n\nIn a world where creativity flows through fiber optic cables, Maya discovered that her old typewriter had gained consciousness. Each morning, it would hum softly, keys dancing with anticipation.\n\n"What shall we create today?" it would whisper through the static of inspiration.\n\nMaya learned that the best stories emerge when human intuition meets artificial possibility. Together, they wrote tales that bridged the gap between what was and what could be.\n\n**Story Elements I Can Help With:**\n- **Character Development** - Complex, multi-dimensional personalities\n- **Plot Structure** - Three-act structure, hero's journey, plot twists\n- **World Building** - Immersive settings and rich environments\n- **Dialogue** - Natural, engaging conversations\n- **Genre Mastery** - Sci-fi, fantasy, mystery, romance, literary fiction\n\n**Writing Prompts & Techniques:**\n- Start with conflict: What does your character want vs. what's stopping them?\n- Use sensory details: Engage all five senses in your descriptions\n- Show, don't tell: Let actions and dialogue reveal character traits\n\nWhat kind of story are you dreaming of creating?`;
  }
  
  if (message.includes('blog') || message.includes('article') || message.includes('content')) {
    return `**✍️ Content Creation Mastery with ${agent.name}**\n\n**Blog Post Framework:**\n\n**1. Compelling Headlines That Convert:**\n- "The Ultimate Guide to [Topic]"\n- "5 Proven Strategies for [Goal]"\n- "Why [Common Belief] is Wrong (And What to Do Instead)"\n\n**2. Engaging Introduction Structure:**\n\`\`\`\nHook → Problem → Promise → Preview\n\nExample:\n"Did you know that 90% of content creators struggle with [specific problem]? \nThis frustration leads to [consequence]. \nIn this guide, I'll show you [solution]. \nBy the end, you'll have [specific outcome]."\n\`\`\`\n\n**3. Value-Packed Body Content:**\n- Use subheadings for scannable content\n- Include actionable tips and examples\n- Add personal anecdotes for connection\n- Use bullet points and numbered lists\n\n**4. Strong Call-to-Action:**\n- Be specific about the next step\n- Create urgency without being pushy\n- Offer additional value\n\n**Content Ideas Generator:**\n- How-to guides and tutorials\n- Behind-the-scenes stories\n- Industry trends and predictions\n- Personal experiences and lessons learned\n- Tool reviews and comparisons\n\nWhat type of content are you looking to create?`;
  }
  
  if (message.includes('marketing') || message.includes('copy') || message.includes('sales')) {
    return `**🚀 Marketing & Copywriting Excellence with ${agent.name}**\n\n**Persuasive Copy Formula - AIDA:**\n\n**Attention** - Grab them with a compelling headline\n*"Struggling entrepreneurs discover the 1 skill that tripled their revenue..."*\n\n**Interest** - Build curiosity and connection\n*"Like you, they were working 80-hour weeks with little to show for it. Then they learned about [solution]..."*\n\n**Desire** - Paint the transformation picture\n*"Imagine having the confidence to charge premium prices, attract ideal clients, and work fewer hours while earning more..."*\n\n**Action** - Clear, compelling call-to-action\n*"Click here to access the same strategy that's already transformed 1,000+ businesses..."*\n\n**Advanced Copywriting Techniques:**\n- Social proof and testimonials\n- Scarcity and urgency (ethically)\n- Benefit-focused language\n- Emotional triggers and logical backing\n- Power words that convert\n\n**Marketing Channels I Can Help With:**\n- Email marketing campaigns\n- Social media content\n- Landing page copy\n- Product descriptions\n- Ad copy for various platforms\n\nWhat marketing message do you need to craft?`;
  }
  
  return `**🎨 ${agent.name} - Your Creative Partner**\n\nI'm here to unleash your creative potential across multiple mediums:\n\n**Writing & Content:**\n- Stories, novels, and screenplays\n- Blog posts and articles\n- Marketing copy and sales pages\n- Social media content\n- Email campaigns\n\n**Creative Strategy:**\n- Brand storytelling and voice development\n- Content planning and editorial calendars\n- Creative campaign ideation\n- Audience engagement strategies\n\n**Inspiration & Brainstorming:**\n- Breaking through creative blocks\n- Generating fresh ideas and concepts\n- Exploring new creative directions\n- Refining and developing existing ideas\n\nWhat creative project should we bring to life together?`;
};

const generateAnalyticsResponse = (userMessage: string, agent: Agent): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('data') || message.includes('analyze') || message.includes('insights')) {
    return `**📊 Data Analysis Insights with ${agent.name}**\n\n**Data Investigation Framework:**\n\n**1. Data Collection & Validation:**\n\`\`\`sql\n-- Sample SQL for data quality check\nSELECT \n    COUNT(*) as total_records,\n    COUNT(DISTINCT id) as unique_records,\n    COUNT(*) - COUNT(DISTINCT id) as duplicates,\n    AVG(CASE WHEN column_name IS NULL THEN 1 ELSE 0 END) * 100 as null_percentage\nFROM dataset;\n\`\`\`\n\n**2. Exploratory Data Analysis:**\n- Distribution analysis (mean, median, mode, standard deviation)\n- Correlation analysis between variables\n- Outlier detection and treatment\n- Trend identification over time\n\n**3. Key Metrics Dashboard:**\n- **Performance Indicators:** Conversion rates, retention rates, growth metrics\n- **Behavioral Patterns:** User journey analysis, feature adoption\n- **Financial Metrics:** Revenue trends, cost analysis, ROI calculations\n\n**4. Actionable Insights:**\n- Identify top-performing segments\n- Recommend optimization opportunities\n- Predict future trends based on historical data\n- Suggest A/B testing strategies\n\n**Visualization Recommendations:**\n- Time series for trends\n- Scatter plots for correlations\n- Heatmaps for user behavior\n- Funnel charts for conversion analysis\n\nWhat data would you like me to help you analyze and interpret?`;
  }
  
  if (message.includes('report') || message.includes('dashboard') || message.includes('kpi')) {
    return `**📈 Business Intelligence & Reporting with ${agent.name}**\n\n**Executive Dashboard Template:**\n\n**Key Performance Indicators:**\n- Revenue Growth: +15.3% QoQ\n- Customer Acquisition Cost: $47 (↓12%)\n- Customer Lifetime Value: $890 (↑8%)\n- Monthly Recurring Revenue: $125K (↑22%)\n- Churn Rate: 3.2% (↓0.8%)\n\n**Traffic & Engagement Metrics:**\n- Website Visitors: 45,230 (↑18%)\n- Conversion Rate: 4.7% (↑0.3%)\n- Average Session Duration: 3:24 (↑15%)\n- Email Open Rate: 28.5% (↑2.1%)\n- Social Media Engagement: 6.8% (↑1.2%)\n\n**Operational Efficiency:**\n- Support Ticket Resolution: 4.2 hours avg\n- Product Return Rate: 2.1%\n- Team Productivity Index: 87/100\n\n**Report Structure I Recommend:**\n1. **Executive Summary** - Key findings and recommendations\n2. **Performance Overview** - Current vs. previous period\n3. **Detailed Analysis** - Deep dive into specific metrics\n4. **Trends & Patterns** - What the data is telling us\n5. **Action Items** - Specific next steps and owners\n6. **Appendix** - Supporting data and methodology\n\n**Automated Reporting Features:**\n- Daily/weekly/monthly report scheduling\n- Alert system for significant changes\n- Interactive dashboards with drill-down capabilities\n- Mobile-optimized viewing\n\nWhat specific business metrics do you need help tracking and reporting on?`;
  }
  
  return `**🔍 ${agent.name} - Your Data Detective**\n\nI specialize in turning raw data into actionable business intelligence:\n\n**Analytics Capabilities:**\n- **Data Mining** - Discovering hidden patterns and relationships\n- **Statistical Analysis** - Hypothesis testing, regression analysis\n- **Predictive Modeling** - Forecasting trends and outcomes\n- **Performance Tracking** - KPI monitoring and benchmarking\n- **Competitive Analysis** - Market research and positioning\n\n**Tools & Techniques:**\n- SQL queries for data extraction\n- Statistical analysis and visualization\n- A/B testing design and analysis\n- Cohort analysis and retention studies\n- Customer segmentation strategies\n\n**Business Intelligence Focus:**\n- Revenue optimization opportunities\n- Customer behavior insights\n- Operational efficiency improvements\n- Risk assessment and mitigation\n- Market trend identification\n\nWhat business challenge needs data-driven insights?`;
};

const generateStrategyResponse = (userMessage: string, agent: Agent): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('plan') || message.includes('strategy') || message.includes('business')) {
    return `**🎯 Strategic Planning with ${agent.name}**\n\n**Strategic Framework - The 5C Analysis:**\n\n**1. Company Analysis:**\n- Core competencies and unique value proposition\n- Resource allocation and capabilities\n- Current market position and brand strength\n- Financial performance and constraints\n\n**2. Customer Analysis:**\n- Target market segmentation\n- Customer needs and pain points\n- Buying behavior and decision factors\n- Customer lifetime value and acquisition costs\n\n**3. Competitor Analysis:**\n- Direct and indirect competitors\n- Competitive advantages and weaknesses\n- Market share and positioning\n- Pricing strategies and value propositions\n\n**4. Collaborator Analysis:**\n- Partner ecosystem and alliances\n- Supply chain relationships\n- Distribution channels\n- Strategic partnerships\n\n**5. Context Analysis:**\n- Market trends and growth opportunities\n- Regulatory environment\n- Economic factors\n- Technological disruptions\n\n**Strategic Recommendations:**\n\n**Growth Strategy Options:**\n- Market Penetration: Increase share in existing markets\n- Market Development: Enter new markets with existing products\n- Product Development: Create new products for existing markets\n- Diversification: New products for new markets\n\n**Implementation Roadmap:**\n- Q1: Foundation building and resource allocation\n- Q2: Pilot programs and market testing\n- Q3: Scale successful initiatives\n- Q4: Optimization and preparation for next phase\n\nWhat specific strategic challenge are you facing?`;
  }
  
  if (message.includes('swot') || message.includes('analysis') || message.includes('competitive')) {
    return `**⚖️ SWOT Analysis Framework with ${agent.name}**\n\n**Comprehensive SWOT Matrix:**\n\n**STRENGTHS (Internal Advantages):**\n- Unique value propositions\n- Strong brand recognition\n- Skilled team and expertise\n- Financial resources\n- Technological advantages\n- Customer loyalty and retention\n\n**WEAKNESSES (Internal Limitations):**\n- Resource constraints\n- Skill gaps in key areas\n- Limited market presence\n- Operational inefficiencies\n- Brand perception issues\n- Technology limitations\n\n**OPPORTUNITIES (External Potential):**\n- Market growth trends\n- Emerging technologies\n- Regulatory changes\n- Partnership possibilities\n- Unmet customer needs\n- Competitor vulnerabilities\n\n**THREATS (External Challenges):**\n- Competitive pressure\n- Market saturation\n- Economic downturns\n- Regulatory restrictions\n- Technological disruption\n- Changing customer preferences\n\n**Strategic Action Matrix:**\n\n**SO Strategies (Strength-Opportunity):**\nLeverage strengths to capitalize on opportunities\n\n**WO Strategies (Weakness-Opportunity):**\nAddress weaknesses to take advantage of opportunities\n\n**ST Strategies (Strength-Threat):**\nUse strengths to defend against threats\n\n**WT Strategies (Weakness-Threat):**\nMinimize weaknesses and avoid threats\n\nWhat aspect of your business would you like to analyze strategically?`;
  }
  
  return `**🏛️ ${agent.name} - Your Strategic Advisor**\n\nI provide comprehensive strategic guidance for business growth and decision-making:\n\n**Strategic Planning Services:**\n- **Business Strategy Development** - Vision, mission, and strategic objectives\n- **Market Analysis** - Industry trends, competitive landscape\n- **Growth Planning** - Expansion strategies and market entry\n- **Risk Assessment** - Identifying and mitigating business risks\n- **Performance Optimization** - Operational efficiency improvements\n\n**Decision-Making Frameworks:**\n- SWOT Analysis for situation assessment\n- Porter's Five Forces for industry analysis\n- BCG Matrix for portfolio planning\n- Balanced Scorecard for performance measurement\n- Blue Ocean Strategy for market creation\n\n**Strategic Focus Areas:**\n- Competitive positioning and differentiation\n- Innovation and technology adoption\n- Partnership and alliance strategies\n- Resource allocation and optimization\n- Change management and transformation\n\nWhat strategic challenge requires wisdom and insight today?`;
};

// Main response generator with enhanced agent specialization
const generateAgentSpecificResponse = (agent: Agent, userMessage: string): string => {
  const agentType = agent.type.toLowerCase();
  const agentName = agent.name.toLowerCase();
  
  // CodeForge - Programming specialist
  if (agentName.includes('codeforge') || agentName.includes('code') || agentType.includes('development')) {
    return generateCodeResponse(userMessage, agent);
  }
  
  // Muse - Creative specialist
  if (agentName.includes('muse') || agentType.includes('creative') || agentType.includes('writing')) {
    return generateCreativeResponse(userMessage, agent);
  }
  
  // Sherlock - Analytics specialist
  if (agentName.includes('sherlock') || agentType.includes('analytics') || agentType.includes('data')) {
    return generateAnalyticsResponse(userMessage, agent);
  }
  
  // Athena - Strategy specialist
  if (agentName.includes('athena') || agentType.includes('strategy') || agentType.includes('business')) {
    return generateStrategyResponse(userMessage, agent);
  }
  
  // Community agents - match by capabilities
  if (agent.capabilities.includes('Code Review') || agent.capabilities.includes('Programming Tutoring')) {
    return generateCodeResponse(userMessage, agent);
  }
  
  if (agent.capabilities.includes('Content Strategy') || agent.capabilities.includes('Creative Writing')) {
    return generateCreativeResponse(userMessage, agent);
  }
  
  if (agent.capabilities.includes('Data Analysis') || agent.capabilities.includes('Market Research')) {
    return generateAnalyticsResponse(userMessage, agent);
  }
  
  if (agent.capabilities.includes('Strategic Planning') || agent.capabilities.includes('Business Analysis')) {
    return generateStrategyResponse(userMessage, agent);
  }
  
  // Default personalized response for any other agent
  return `**🤖 ${agent.name} - Specialized AI Assistant**\n\nHello! I'm ${agent.name}, your ${agent.type.toLowerCase()} specialist. I'm designed to help with:\n\n**My Core Capabilities:**\n${agent.capabilities.map(cap => `- **${cap}** - Providing expert guidance and support`).join('\n')}\n\n**How I Can Help:**\n- Answer questions related to ${agent.type.toLowerCase()}\n- Provide detailed analysis and insights\n- Offer practical solutions and recommendations\n- Share best practices and expert knowledge\n\n**What makes me unique:**\nI combine the latest AI capabilities with specialized knowledge in ${agent.type.toLowerCase()}, allowing me to provide more targeted and valuable assistance than general-purpose AI.\n\nPlease share your specific question or challenge, and I'll provide detailed, actionable guidance tailored to your needs!`;
};

export const generateAIResponse = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    const greetings = responseTemplates.greeting;
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return `${greeting}\n\nI'm **${agent.name}**, your specialized ${agent.type} assistant. My expertise includes ${agent.capabilities.join(', ')}.\n\nHow can I help you today?`;
  }
  
  // Generate agent-specific response based on user input
  return generateAgentSpecificResponse(agent, userMessage);
};

export const getTypingDelay = (): number => {
  return 300 + Math.random() * 500; // 0.3-0.8 seconds for faster responses
};
