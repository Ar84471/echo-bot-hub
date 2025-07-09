
interface AIProvider {
  name: string;
  endpoint: string;
  models: string[];
  priority: number;
}

interface AIResponse {
  text: string;
  provider: string;
  model: string;
  timestamp: Date;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    priority: 1
  },
  {
    name: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4', 'gpt-3.5-turbo'],
    priority: 2
  },
  {
    name: 'gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    models: ['gemini-pro'],
    priority: 3
  }
];

// Fallback to local responses if all providers fail
const FALLBACK_RESPONSES = [
  "I'm here to help! Could you please rephrase your question?",
  "That's an interesting question. Let me think about it...",
  "I'd be happy to assist you with that. Can you provide more details?",
  "I understand you're looking for help. What specific information do you need?",
  "Thanks for your question! I'm processing your request..."
];

export const generateAIResponse = async (
  userMessage: string,
  agent: any,
  isGreeting: boolean = false
): Promise<AIResponse> => {
  if (isGreeting) {
    return {
      text: `Hello! I'm ${agent.name}, your ${agent.type.toLowerCase()} assistant. How can I help you today?`,
      provider: 'local',
      model: 'greeting',
      timestamp: new Date()
    };
  }

  // Try each provider in priority order
  for (const provider of AI_PROVIDERS.sort((a, b) => a.priority - b.priority)) {
    try {
      const response = await callAIProvider(provider, userMessage, agent);
      if (response) {
        return {
          text: response,
          provider: provider.name,
          model: provider.models[0],
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.warn(`${provider.name} failed:`, error);
      continue;
    }
  }

  // Fallback to local response
  const fallbackText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  return {
    text: `${fallbackText}\n\nI'm ${agent.name}, specialized in ${agent.type.toLowerCase()}. ${agent.description}`,
    provider: 'fallback',
    model: 'local',
    timestamp: new Date()
  };
};

async function callAIProvider(provider: AIProvider, message: string, agent: any): Promise<string | null> {
  const apiKey = getAPIKey(provider.name);
  if (!apiKey) {
    console.warn(`No API key for ${provider.name}`);
    return null;
  }

  switch (provider.name) {
    case 'claude':
      return await callClaude(apiKey, message, agent);
    case 'openai':
      return await callOpenAI(apiKey, message, agent);
    case 'gemini':
      return await callGemini(apiKey, message, agent);
    default:
      return null;
  }
}

async function callClaude(apiKey: string, message: string, agent: any): Promise<string | null> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are ${agent.name}, a ${agent.type} specialist. ${agent.description}\n\nUser: ${message}`
        }]
      })
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
    
    const data = await response.json();
    return data.content[0]?.text || null;
  } catch (error) {
    console.error('Claude API error:', error);
    return null;
  }
}

async function callOpenAI(apiKey: string, message: string, agent: any): Promise<string | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are ${agent.name}, a ${agent.type} specialist. ${agent.description}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    
    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

async function callGemini(apiKey: string, message: string, agent: any): Promise<string | null> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are ${agent.name}, a ${agent.type} specialist. ${agent.description}\n\nUser: ${message}`
          }]
        }]
      })
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || null;
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}

function getAPIKey(provider: string): string | null {
  // Check localStorage first, then environment variables
  return localStorage.getItem(`${provider}_api_key`) || 
         (window as any)[`${provider.toUpperCase()}_API_KEY`] || 
         null;
}

export const setAPIKey = (provider: string, key: string) => {
  localStorage.setItem(`${provider}_api_key`, key);
};

export const getAvailableProviders = (): string[] => {
  return AI_PROVIDERS
    .filter(provider => getAPIKey(provider.name))
    .map(provider => provider.name);
};
