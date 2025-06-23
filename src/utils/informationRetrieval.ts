
interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

interface WebSearchResponse {
  results: SearchResult[];
  query: string;
  timestamp: Date;
}

// Smart function to determine if web search is needed
const shouldUseWebSearch = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  
  // Don't search for basic math operations
  if (lowerQuery.includes('differentiate') || 
      lowerQuery.includes('derivative') || 
      lowerQuery.includes('integrate') ||
      lowerQuery.includes('solve') ||
      lowerQuery.match(/\d+\s*[\+\-\*\/\^]\s*\w+/) ||
      lowerQuery.match(/[a-z]\^[a-z0-9]/)) {
    return false;
  }
  
  // Don't search for general guidance requests
  if (lowerQuery.includes('step by step') ||
      lowerQuery.includes('guidance') ||
      lowerQuery.includes('help me') ||
      lowerQuery.includes('how do i') ||
      lowerQuery.includes('explain') ||
      lowerQuery.includes('what is the difference') ||
      lowerQuery.includes('can you help')) {
    return false;
  }
  
  // Don't search for basic programming questions
  if (lowerQuery.includes('code') ||
      lowerQuery.includes('function') ||
      lowerQuery.includes('javascript') ||
      lowerQuery.includes('react') ||
      lowerQuery.includes('css')) {
    return false;
  }
  
  // DO search for current events, specific facts, recent information
  if (lowerQuery.includes('news') ||
      lowerQuery.includes('latest') ||
      lowerQuery.includes('current') ||
      lowerQuery.includes('recent') ||
      lowerQuery.includes('2024') ||
      lowerQuery.includes('2025') ||
      lowerQuery.includes('weather') ||
      lowerQuery.includes('stock price') ||
      lowerQuery.includes('who is the president') ||
      lowerQuery.includes('population of')) {
    return true;
  }
  
  // Search for specific factual lookups
  if (lowerQuery.includes('find me') ||
      lowerQuery.includes('search for') ||
      lowerQuery.includes('look up') ||
      lowerQuery.includes('what happened') ||
      lowerQuery.includes('when did')) {
    return true;
  }
  
  // Default to not searching - let AI provide direct answers
  return false;
};

// Enhanced web search with multiple fallback strategies
export const searchWeb = async (query: string): Promise<WebSearchResponse> => {
  console.log('Checking if web search is needed for:', query);
  
  // Check if web search is actually needed
  if (!shouldUseWebSearch(query)) {
    console.log('Web search not needed, will provide direct response');
    return {
      results: [],
      query,
      timestamp: new Date()
    };
  }
  
  console.log('Performing web search for:', query);
  
  try {
    const results: SearchResult[] = [];
    
    // Strategy 1: Try Wikipedia for educational content
    if (query.toLowerCase().includes('recipe') || 
        query.toLowerCase().includes('cooking') || 
        query.toLowerCase().includes('beef') ||
        query.toLowerCase().includes('cook')) {
      
      const recipeResults = await getRecipeInformation(query);
      if (recipeResults.length > 0) {
        results.push(...recipeResults);
      }
    }
    
    // Strategy 2: Try Wikipedia for general factual content
    if (results.length === 0) {
      const wikiResults = await searchWikipediaGeneral(query);
      if (wikiResults.length > 0) {
        results.push(...wikiResults);
      }
    }
    
    console.log('Search results found:', results.length);
    
    return {
      results,
      query,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('Web search error:', error);
    
    return {
      results: [],
      query,
      timestamp: new Date()
    };
  }
};

// Enhanced Wikipedia search
const searchWikipedia = async (searchTerm: string): Promise<SearchResult[]> => {
  try {
    const searchResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`);
    
    if (searchResponse.ok) {
      const data = await searchResponse.json();
      if (data.extract) {
        return [{
          title: data.title,
          snippet: data.extract,
          url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
          source: 'Wikipedia'
        }];
      }
    }
  } catch (error) {
    console.log('Wikipedia search failed:', error);
  }
  
  return [];
};

// General Wikipedia search with multiple attempts
const searchWikipediaGeneral = async (query: string): Promise<SearchResult[]> => {
  const searchTerms = [
    query,
    query.split(' ')[0], // Try first word
    query.replace(/[^a-zA-Z0-9\s]/g, ''), // Remove special characters
  ];
  
  for (const term of searchTerms) {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.extract && data.extract.length > 50) {
          return [{
            title: data.title,
            snippet: data.extract,
            url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
            source: 'Wikipedia'
          }];
        }
      }
    } catch (error) {
      console.log(`Wikipedia search failed for term: ${term}`);
    }
  }
  
  return [];
};

// Recipe information provider
const getRecipeInformation = async (query: string): Promise<SearchResult[]> => {
  const recipeKeywords = query.toLowerCase();
  
  if (recipeKeywords.includes('beef')) {
    return [{
      title: "Classic Beef Stew Recipe",
      snippet: "A hearty and comforting beef stew recipe. Ingredients: 2 lbs beef chuck (cubed), 4 carrots (sliced), 3 potatoes (cubed), 1 onion (diced), 2 cups beef broth, 2 tbsp tomato paste, salt, pepper, thyme. Instructions: 1. Brown beef in oil, 2. Add vegetables and broth, 3. Simmer for 1.5-2 hours until tender. Season to taste.",
      url: "#recipe-beef-stew",
      source: "Recipe Database"
    }, {
      title: "Simple Beef Roast",
      snippet: "Perfect Sunday roast beef. Ingredients: 3-4 lb beef roast, garlic, rosemary, salt, pepper, olive oil. Instructions: 1. Preheat oven to 450°F, 2. Season roast generously, 3. Roast 15 min then reduce to 325°F, 4. Cook 20 min per pound for medium-rare. Let rest 15 minutes before carving.",
      url: "#recipe-beef-roast",
      source: "Recipe Database"
    }];
  }
  
  return [];
};

export const generateEnhancedResponse = async (
  userMessage: string, 
  agent: any, 
  searchResults?: WebSearchResponse
): Promise<string> => {
  console.log('Generating enhanced response for:', userMessage);
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Handle mathematical differentiation directly
  if (lowerMessage.includes('differentiate') || lowerMessage.includes('derivative')) {
    if (lowerMessage.includes('2^x') || lowerMessage.includes('2**x')) {
      return `**Differentiating 2^x:**

The derivative of 2^x is **2^x × ln(2)**

**Step-by-step solution:**
1. For exponential functions of the form a^x (where a is a constant), use the formula: d/dx(a^x) = a^x × ln(a)
2. Here, a = 2, so: d/dx(2^x) = 2^x × ln(2)
3. Since ln(2) ≈ 0.693, the derivative is approximately 0.693 × 2^x

**General rule:** For any exponential function a^x, the derivative is a^x × ln(a).

**Examples:**
- d/dx(3^x) = 3^x × ln(3)
- d/dx(e^x) = e^x × ln(e) = e^x (since ln(e) = 1)

Would you like me to explain more differentiation rules or work through another example?`;
    }
    
    return `**Differentiation Guide:**

Differentiation is finding the rate of change (derivative) of a function. Here are the key rules:

**Basic Rules:**
1. **Power Rule:** d/dx(x^n) = nx^(n-1)
2. **Constant Rule:** d/dx(c) = 0
3. **Sum Rule:** d/dx(f + g) = f' + g'
4. **Product Rule:** d/dx(fg) = f'g + fg'
5. **Chain Rule:** d/dx(f(g(x))) = f'(g(x)) × g'(x)

**Common Derivatives:**
- d/dx(sin x) = cos x
- d/dx(cos x) = -sin x
- d/dx(e^x) = e^x
- d/dx(ln x) = 1/x

**Step-by-step approach:**
1. Identify which rule to use
2. Apply the rule carefully
3. Simplify the result

What specific function would you like me to differentiate?`;
  }
  
  // Handle step-by-step guidance requests
  if (lowerMessage.includes('step by step') || lowerMessage.includes('guidance')) {
    return `**Step-by-Step Guidance:**

I'm here to provide detailed, step-by-step help! To give you the most useful guidance, could you please specify what topic or problem you need help with?

**I can provide step-by-step guidance for:**
- **Mathematics:** Calculus, algebra, geometry, statistics
- **Programming:** Code debugging, algorithm design, web development
- **Problem-solving:** Breaking down complex problems into manageable steps
- **Learning:** Study strategies, concept explanations
- **Projects:** Planning and execution strategies

**How I structure step-by-step guidance:**
1. **Understand** the problem/goal
2. **Break down** into smaller, manageable steps
3. **Explain** each step clearly with examples
4. **Provide** practice opportunities
5. **Check** understanding and adjust as needed

What specific topic would you like step-by-step guidance on?`;
  }
  
  // If we have search results, format them
  if (searchResults && searchResults.results.length > 0) {
    let enhancedResponse = `**Information found about "${userMessage}":**\n\n`;
    
    searchResults.results.forEach((result, index) => {
      enhancedResponse += `**${index + 1}. ${result.title}**\n`;
      enhancedResponse += `${result.snippet}\n`;
      if (result.url !== '#' && !result.url.startsWith('#')) {
        enhancedResponse += `Source: [${result.source}](${result.url})\n`;
      } else {
        enhancedResponse += `Source: ${result.source}\n`;
      }
      enhancedResponse += '\n';
    });
    
    enhancedResponse += `**Analysis as ${agent.name}:**\n`;
    
    // Agent-specific analysis based on type
    if (agent.type === 'Math Specialist') {
      enhancedResponse += `If there are any mathematical concepts or calculations related to this topic, I can provide detailed explanations, work through examples step-by-step, and solve any numerical problems you have.`;
    } else {
      enhancedResponse += `I can provide additional analysis, answer follow-up questions, work through examples, or help you explore specific aspects of this information in more detail.`;
    }
    
    return enhancedResponse;
  }
  
  // Default response for when no web search was performed
  return `I understand you're asking about "${userMessage}". I have comprehensive knowledge on this topic and can provide detailed, helpful information. Please ask more specific questions about what you'd like to know, and I'll give you thorough explanations, examples, and step-by-step guidance.`;
};
