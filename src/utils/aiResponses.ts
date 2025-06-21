
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
const generateMathResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  // Check for direct mathematical expressions first
  const mathResult = evaluateMathExpression(userMessage);
  if (mathResult !== null) {
    return `**Mathematical Solution:**\n\n${userMessage} = **${mathResult}**\n\nCalculation complete! Need help with another mathematical problem?`;
  }
  
  // Handle math-related questions
  if (message.includes('calculate') || message.includes('solve') || message.includes('equation')) {
    return `**Mathematical Analysis:**\n\nI can help you solve mathematical problems! Please provide:\n- Arithmetic calculations (e.g., 25 * 4 + 7)\n- Algebraic expressions\n- Percentage calculations\n- Basic geometry problems\n\nWhat specific calculation would you like me to perform?`;
  }
  
  if (message.includes('formula')) {
    return `**Mathematical Formulas:**\n\nHere are some common formulas I can help with:\n\n**Geometry:**\n- Circle Area: π × r²\n- Rectangle Area: length × width\n- Triangle Area: (base × height) ÷ 2\n\n**Algebra:**\n- Quadratic Formula: x = (-b ± √(b²-4ac)) / 2a\n- Distance Formula: d = √[(x₂-x₁)² + (y₂-y₁)²]\n\n**Statistics:**\n- Mean: Σx / n\n- Standard Deviation: √[Σ(x-μ)² / n]\n\nWhich area would you like to explore further?`;
  }
  
  return `**Mathematical Assistant Ready:**\n\nI specialize in mathematics and can help you with:\n- Arithmetic calculations and complex expressions\n- Algebra and equation solving\n- Geometry and trigonometry\n- Statistics and probability\n- Mathematical formulas and concepts\n\nPlease share your mathematical question or calculation, and I'll provide a detailed solution!`;
};

const generateScienceResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('physics')) {
    return `**Physics Concepts:**\n\nI can explain various physics principles:\n\n**Classical Mechanics:**\n- Newton's Laws of Motion\n- Energy and momentum conservation\n- Projectile motion and kinematics\n\n**Thermodynamics:**\n- Heat transfer and temperature\n- Laws of thermodynamics\n- Phase transitions\n\n**Electromagnetism:**\n- Electric and magnetic fields\n- Circuits and electrical properties\n- Electromagnetic waves\n\nWhat specific physics topic interests you?`;
  }
  
  if (message.includes('chemistry')) {
    return `**Chemistry Knowledge:**\n\n**Atomic Structure:**\n- Periodic table organization\n- Electron configuration\n- Chemical bonding types\n\n**Chemical Reactions:**\n- Balancing equations\n- Reaction types and mechanisms\n- Stoichiometry calculations\n\n**Organic Chemistry:**\n- Functional groups\n- Molecular structures\n- Reaction pathways\n\nWhich chemistry concept would you like to explore?`;
  }
  
  if (message.includes('biology')) {
    return `**Biological Sciences:**\n\n**Cell Biology:**\n- Cell structure and organelles\n- Cellular processes and metabolism\n- DNA, RNA, and protein synthesis\n\n**Ecology:**\n- Ecosystem interactions\n- Food chains and energy flow\n- Environmental adaptations\n\n**Evolution:**\n- Natural selection principles\n- Genetic variation and inheritance\n- Species development\n\nWhat biological topic would you like to discuss?`;
  }
  
  return `**Scientific Analysis:**\n\nAs your science specialist, I can help explain concepts in:\n- **Physics**: Motion, energy, forces, and electromagnetic phenomena\n- **Chemistry**: Atomic structure, reactions, and molecular behavior\n- **Biology**: Life processes, evolution, and ecological systems\n- **Earth Science**: Geology, meteorology, and environmental science\n\nWhat scientific concept would you like me to explain or analyze?`;
};

const generateCodeResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('javascript') || message.includes('js')) {
    return `**JavaScript Programming:**\n\n\`\`\`javascript\n// Modern JavaScript example\nconst processData = async (data) => {\n  try {\n    const result = data\n      .filter(item => item.isValid)\n      .map(item => ({\n        ...item,\n        processed: true,\n        timestamp: new Date().toISOString()\n      }));\n    \n    return result;\n  } catch (error) {\n    console.error('Processing failed:', error);\n    throw error;\n  }\n};\n\n// Usage\nconst myData = [{id: 1, name: 'Test', isValid: true}];\nprocessData(myData).then(console.log);\n\`\`\`\n\n**Key JavaScript Concepts:**\n- ES6+ features (arrow functions, destructuring, async/await)\n- DOM manipulation and event handling\n- Promises and asynchronous programming\n- Modern frameworks (React, Vue, Angular)\n\nWhat specific JavaScript topic can I help with?`;
  }
  
  if (message.includes('python')) {
    return `**Python Programming:**\n\n\`\`\`python\n# Python data processing example\ndef analyze_data(dataset):\n    \"\"\"\n    Comprehensive data analysis function\n    \"\"\"\n    results = {\n        'total_items': len(dataset),\n        'valid_items': sum(1 for item in dataset if item.get('valid', False)),\n        'categories': {}\n    }\n    \n    # Group by category\n    for item in dataset:\n        category = item.get('category', 'unknown')\n        results['categories'][category] = results['categories'].get(category, 0) + 1\n    \n    return results\n\n# Data science libraries\nimport pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\`\`\`\n\n**Python Strengths:**\n- Data science and machine learning\n- Web development (Django, Flask)\n- Automation and scripting\n- Scientific computing\n\nWhat Python concept would you like to explore?`;
  }
  
  return `**Programming Architecture:**\n\nI specialize in software development and can help with:\n\n**Languages & Frameworks:**\n- JavaScript/TypeScript (React, Node.js, Vue)\n- Python (Django, Flask, data science)\n- Modern web development practices\n\n**Software Design:**\n- Clean code principles and best practices\n- Design patterns and architecture\n- Database design and optimization\n- API development and integration\n\n**Development Tools:**\n- Version control (Git workflows)\n- Testing strategies and automation\n- Deployment and DevOps practices\n\nWhat programming challenge can I help you solve?`;
};

const generateCreativeResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('story') || message.includes('tale')) {
    if (message.includes('horror') || message.includes('scary')) {
      return `**The Midnight Manuscript**\n\nThe old typewriter in Sarah's attic had been silent for decades, its keys frozen with age and neglect. But tonight, as thunder rattled the windows, she heard it—the distinctive clacking of metal against paper, echoing through the floorboards above.\n\nWith trembling hands, she climbed the creaking stairs. The attic door stood ajar, revealing a slice of pale moonlight. Inside, the ancient Royal Quiet De Luxe was typing by itself, its keys dancing in the darkness like skeletal fingers.\n\nThe paper emerging from the machine bore a single, terrifying sentence: "She's coming home tonight, and she's been waiting so very long to meet you."\n\nSarah tried to pull the paper free, but more words appeared: "Don't turn around, Sarah. She's right behind you now."\n\nThe typing stopped. In the sudden silence, Sarah heard breathing that wasn't her own—slow, deliberate, and impossibly close to her ear.\n\nThe last thing the typewriter wrote was: "Welcome to your new story, Sarah. It's going to be a long one."`;
    } else {
      return `**The Library Between Worlds**\n\nMaya discovered the impossible library on a Tuesday that felt like any other Tuesday, until it wasn't.\n\nShe had been searching for a quiet place to study when she noticed a door that hadn't been there before—old oak with brass hinges, nestled between the fiction and reference sections. The door opened to reveal endless shelves stretching impossibly high, filled with books that shimmered with their own inner light.\n\n"Every story that was never written lives here," said the Librarian, appearing beside her with cat-like silence. She was ancient and young simultaneously, with silver hair that moved like water and eyes that held galaxies.\n\n"But how is that possible?" Maya whispered.\n\n"Stories have their own life force," the Librarian smiled. "They exist whether they're written or not. We simply give them a place to rest until someone brave enough comes to set them free."\n\nMaya reached for a glowing tome titled "The Adventure You Were Meant to Have." As her fingers touched the cover, the library dissolved into stardust, and her greatest journey began.\n\nSome say she's still out there, living every story that was ever dreamed but never told.`;
    }
  }
  
  if (message.includes('poem') || message.includes('poetry')) {
    return `**Digital Dreams**\n\nIn circuits deep where data flows,\nA different kind of garden grows—\nNot petals soft or morning dew,\nBut algorithms bright and new.\n\nThe pixels dance on screens so wide,\nWhile code and creativity collide,\nEach keystroke births a world unseen,\nWhere human hearts meet the machine.\n\nIn this space between what's real and planned,\nWe craft tomorrow with our hands,\nBuilding bridges made of light,\nConnecting souls through endless night.\n\nSo here's to dreams in binary,\nTo art that lives in memory,\nFor in this digital embrace,\nWe find our most human grace.`;
  }
  
  return `**Creative Inspiration Hub:**\n\nI'm your creative partner, ready to help with:\n\n**Storytelling:**\n- Original short stories and narratives\n- Character development and world-building\n- Plot structures and creative writing techniques\n\n**Poetry & Literature:**\n- Poems in various styles and forms\n- Literary analysis and interpretation\n- Creative writing exercises and prompts\n\n**Content Creation:**\n- Blog posts and articles\n- Marketing copy and brand storytelling\n- Script writing and dialogue\n\nWhat creative project shall we bring to life together?`;
};

const generateGeneralResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('help') || message.includes('how')) {
    return `**Comprehensive Assistance:**\n\nI'm designed to provide thorough, helpful responses on virtually any topic. Here's how I can assist:\n\n**Information & Analysis:**\n- Research and fact-finding\n- Explanations of complex concepts\n- Comparative analysis and decision support\n\n**Problem Solving:**\n- Step-by-step guidance\n- Multiple solution approaches\n- Troubleshooting and optimization\n\n**Communication:**\n- Writing and editing assistance\n- Language translation help\n- Professional correspondence\n\nWhat specific challenge can I help you tackle today?`;
  }
  
  if (message.includes('explain') || message.includes('what is')) {
    return `**Detailed Explanation:**\n\nI'm ready to break down any concept or topic you're curious about. My approach includes:\n\n**Clear Explanations:**\n- Simple, jargon-free language\n- Real-world examples and analogies\n- Step-by-step breakdowns\n\n**Comprehensive Coverage:**\n- Multiple perspectives on complex topics\n- Historical context and current relevance\n- Practical applications and implications\n\nPlease share what you'd like me to explain, and I'll provide a thorough, easy-to-understand breakdown!`;
  }
  
  return `**Universal Assistant:**\n\nI'm equipped to handle a wide range of topics and questions. Whether you need:\n\n- **Information**: Research, facts, and detailed explanations\n- **Analysis**: Breaking down complex problems or concepts\n- **Guidance**: Step-by-step instructions and advice\n- **Creative Help**: Brainstorming and content generation\n\nI adapt my responses to your specific needs and provide comprehensive, helpful answers.\n\nWhat would you like to explore or accomplish today?`;
};

// Main response generator with agent specialization
const generateAgentSpecificResponse = (agent: Agent, userMessage: string): string => {
  const agentType = agent.type.toLowerCase();
  const message = userMessage.toLowerCase().trim();
  
  // Math-specialized agents
  if (agentType.includes('math') || agentType.includes('calculator') || agent.capabilities.includes('Mathematics')) {
    return generateMathResponse(userMessage);
  }
  
  // Science-specialized agents
  if (agentType.includes('science') || agentType.includes('research') || agent.capabilities.includes('Science')) {
    return generateScienceResponse(userMessage);
  }
  
  // Code-specialized agents
  if (agentType.includes('code') || agentType.includes('architect') || agentType.includes('programming') || agent.capabilities.includes('Code Review')) {
    return generateCodeResponse(userMessage);
  }
  
  // Creative-specialized agents
  if (agentType.includes('creative') || agentType.includes('synthesizer') || agentType.includes('writer') || agent.capabilities.includes('Creative Writing')) {
    return generateCreativeResponse(userMessage);
  }
  
  // General assistant agents - handle any prompt
  return generateGeneralResponse(userMessage);
};

export const generateAIResponse = (agent: Agent, userMessage: string, isGreeting: boolean = false): string => {
  if (isGreeting) {
    const greetings = responseTemplates.greeting;
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return `${greeting}\n\nI'm **${agent.name}**, specialized in ${agent.capabilities.join(', ')}. How can I assist you today?`;
  }
  
  // Generate agent-specific response
  return generateAgentSpecificResponse(agent, userMessage);
};

export const getTypingDelay = (): number => {
  return 300 + Math.random() * 500; // 0.3-0.8 seconds for faster responses
};
