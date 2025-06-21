
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

// Generate creative content based on user request
const generateCreativeContent = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Horror story generation
  if (message.includes('horror') && (message.includes('story') || message.includes('tale'))) {
    if (message.includes('dracula') || message.includes('vampire')) {
      return `**The Count's Return**

The ancient castle stood shrouded in perpetual darkness, its gothic spires piercing the blood-red sky. Count Dracula had awakened from his century-long slumber, his pale eyes gleaming with an insatiable hunger.

As the village below prepared for sleep, unaware of the terror that awaited them, the Count descended from his fortress like a shadow given form. His footsteps made no sound on the cobblestone streets, yet every dog in the village began to howl in unison.

Young Elena had always been drawn to the old stories, but tonight she would learn that some legends are terrifyingly real. The gentle tap at her window wasn't the wind—it was something far more sinister, something with fangs that gleamed like ivory daggers in the moonlight.

"Welcome to eternity," whispered the Count, his voice like silk wrapped around steel. And as the church bells struck midnight, Elena's screams were swallowed by the hungry darkness that had claimed another soul for its endless feast.

The next morning, the villagers would find only an empty room and two small puncture wounds on the windowsill—still dripping crimson.`;
    } else {
      return `**The Whispering House**

The old Victorian house at the end of Maple Street had been empty for decades, yet every night at 3:33 AM, neighbors reported seeing a single candle flickering in the attic window.

Sarah inherited the house from a great-aunt she'd never met, and despite the warnings from locals, she decided to spend her first night there. The floorboards creaked with memories of footsteps that were no longer there, and the walls seemed to breathe with a life of their own.

As midnight approached, she heard it—a soft whispering that seemed to come from within the very walls themselves. The voices grew louder, more insistent, speaking in a language that predated human speech.

In the basement, she discovered the truth: dozens of mirrors arranged in a perfect circle, each one reflecting not her image, but the faces of those who had vanished within these walls over the years. And now, as her own reflection began to fade, she realized she would soon join their eternal chorus of whispers.

The house had found its newest resident, and the candle in the attic would continue to burn for whoever dared to look too closely.`;
    }
  }
  
  // General story generation
  if (message.includes('story') || message.includes('tale')) {
    return `**The Unexpected Journey**

Once upon a time, in a world not so different from our own, there lived someone who believed that extraordinary things only happened to other people. Little did they know that their greatest adventure was about to begin with the most ordinary of moments—a wrong turn on a familiar street.

As they walked down the unfamiliar path, the world around them began to shimmer and change. The concrete sidewalk transformed into a cobblestone road, and the street lamps became glowing lanterns that seemed to float in mid-air.

They had stumbled into a realm where courage was the only currency that mattered, and kindness was the most powerful magic of all. Along the way, they met a wise old owl who spoke in riddles, a friendly dragon who was afraid of heights, and a mirror that showed not your reflection, but your true potential.

Through trials and triumphs, they learned that the greatest adventures aren't found in distant lands, but in the courage to be kind, the strength to help others, and the wisdom to believe in yourself.

And when they finally found their way back home, they carried with them the most precious treasure of all—the knowledge that magic exists wherever you choose to look for it.`;
  }
  
  // Poem generation
  if (message.includes('poem') || message.includes('poetry')) {
    return `**Whispers of the Heart**

In quiet moments when the world stands still,
And gentle breezes dance upon the hill,
I find within the silence something true—
A whispered song that speaks of me and you.

The stars above shine with ancient light,
Guardians watching through the peaceful night,
They've seen the rise and fall of countless dreams,
Yet still they sparkle with hope's golden beams.

Time flows like rivers to the endless sea,
Carrying stories of what used to be,
But in each moment, new tales are born,
Fresh as the dew that greets each breaking dawn.

So let us write our story on the wind,
With words of love and hearts that never sinned,
For in this dance of life we're meant to be
Connected souls, wild and forever free.`;
  }
  
  return null;
};

// Generate definitive responses for various request types
const generateDefinitiveResponse = (agent: Agent, userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  // Check for mathematical expressions first
  const mathResult = evaluateMathExpression(userMessage);
  if (mathResult !== null) {
    return `The answer is: ${userMessage} = ${mathResult}`;
  }
  
  // Generate creative content if requested
  const creativeContent = generateCreativeContent(userMessage);
  if (creativeContent) {
    return creativeContent;
  }
  
  // Handle coding questions with actual code examples
  if (message.includes('code') || message.includes('function') || message.includes('programming')) {
    if (message.includes('javascript') || message.includes('js')) {
      return `Here's a JavaScript example for you:

\`\`\`javascript
// Example function based on your request
function processData(input) {
  const result = input.map(item => {
    return {
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    };
  });
  
  return result.filter(item => item.isValid);
}

// Usage example
const data = [
  { id: 1, name: 'Example', isValid: true },
  { id: 2, name: 'Test', isValid: false }
];

console.log(processData(data));
\`\`\`

This function processes an array of objects, adds processing metadata, and filters for valid items. You can modify it based on your specific needs!`;
    } else {
      return `Here's a general programming solution:

**Key Principles:**
1. **Clean Code**: Write readable, maintainable code with clear variable names
2. **Error Handling**: Always anticipate and handle potential errors gracefully
3. **Modularity**: Break complex problems into smaller, reusable functions
4. **Testing**: Write tests to ensure your code works as expected

**Example Pattern:**
\`\`\`
function solveProblem(input) {
  // Validate input
  if (!input) throw new Error('Input is required');
  
  // Process the data
  const processed = processInput(input);
  
  // Return result
  return formatOutput(processed);
}
\`\`\`

What specific programming challenge are you working on? I can provide more targeted help!`;
    }
  }
  
  // Handle data/analysis requests with actual analysis
  if (message.includes('analyze') || message.includes('data') || message.includes('statistics')) {
    return `**Data Analysis Approach:**

Based on your request, here's a comprehensive analysis framework:

**1. Data Collection & Validation**
- Ensure data quality and completeness
- Identify outliers and anomalies
- Validate data sources and accuracy

**2. Exploratory Analysis**
- Statistical summaries (mean, median, mode, standard deviation)
- Distribution analysis and data visualization
- Correlation analysis between variables

**3. Key Insights**
- Trend identification and pattern recognition
- Comparative analysis across different segments
- Predictive indicators and forecasting opportunities

**4. Actionable Recommendations**
- Data-driven decision points
- Risk assessment and mitigation strategies
- Performance optimization opportunities

**Sample Metrics Dashboard:**
- Primary KPIs: Performance indicators most relevant to your goals
- Secondary Metrics: Supporting data points for context
- Trend Analysis: Historical patterns and future projections

Would you like me to dive deeper into any specific aspect of this analysis framework?`;
  }
  
  // Handle questions with informative responses
  if (message.includes('what') || message.includes('how') || message.includes('why') || message.includes('?')) {
    if (message.includes('ai') || message.includes('artificial intelligence')) {
      return `**Understanding Artificial Intelligence**

AI is a branch of computer science focused on creating systems that can perform tasks typically requiring human intelligence. Here's what you should know:

**Types of AI:**
- **Narrow AI**: Specialized systems (like recommendation engines, voice assistants)
- **General AI**: Human-level intelligence across all domains (still theoretical)
- **Superintelligence**: AI surpassing human intelligence (hypothetical future scenario)

**How AI Works:**
1. **Machine Learning**: Algorithms learn patterns from data
2. **Neural Networks**: Inspired by human brain structure
3. **Deep Learning**: Complex neural networks with multiple layers
4. **Training**: Systems improve through exposure to examples

**Real-World Applications:**
- Healthcare: Medical diagnosis and drug discovery
- Transportation: Autonomous vehicles and traffic optimization
- Finance: Fraud detection and algorithmic trading
- Entertainment: Content recommendation and game AI

**Current Limitations:**
- Requires large amounts of data
- Can exhibit bias from training data
- Lacks true understanding or consciousness
- Works best in well-defined problem domains

AI is rapidly evolving and becoming integrated into many aspects of daily life, from the apps on your phone to the systems that power modern businesses.`;
    } else {
      return `I'd be happy to provide you with detailed information! Based on your question about "${userMessage}", here's what I can tell you:

**Quick Answer:** Let me address your specific question directly with practical, actionable information.

**Detailed Explanation:**
Your question touches on an important topic that has several key aspects to consider. The most important thing to understand is the core concept and how it applies to your situation.

**Key Points:**
- **Context**: Understanding the background and why this matters
- **Application**: How this applies in real-world scenarios
- **Benefits**: What advantages or outcomes you can expect
- **Considerations**: Important factors to keep in mind

**Next Steps:**
If you'd like me to elaborate on any specific aspect or provide more detailed examples, just let me know what would be most helpful for your particular situation!`;
    }
  }
  
  // Default response with agent personality
  return `As ${agent.name}, I'm here to provide you with comprehensive assistance. Regarding "${userMessage}", I can offer you detailed insights and practical solutions.

**My Analysis:**
Based on your request, I can see you're looking for meaningful, actionable information. Let me provide you with a thorough response that addresses your needs directly.

**Key Information:**
- **Primary Focus**: Addressing your specific question or need
- **Practical Application**: How this applies to your situation
- **Additional Context**: Relevant background information that might be helpful

**Specific to Your Request:**
Given that you've asked about "${userMessage}", I want to ensure you get exactly what you're looking for. This topic is important because it relates to practical solutions and real-world applications.

**My Recommendation:**
Based on my capabilities in ${agent.capabilities.join(', ')}, I suggest we focus on the most actionable aspects of your request. This will give you the best results and most practical value.

Is there a specific aspect of this topic you'd like me to explore further or elaborate on?`;
};

export const generateAIResponse = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    const greetings = responseTemplates.greeting;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Always return a definitive response
  return generateDefinitiveResponse(agent, userMessage);
};

export const getTypingDelay = (): number => {
  return 500 + Math.random() * 800; // 0.5-1.3 seconds for faster responses
};
