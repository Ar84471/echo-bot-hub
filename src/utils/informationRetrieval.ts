
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

// Enhanced web search using DuckDuckGo Instant Answer API
export const searchWeb = async (query: string): Promise<WebSearchResponse> => {
  try {
    // Use DuckDuckGo Instant Answer API for real search results
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`);
    
    if (!response.ok) {
      throw new Error('Search API request failed');
    }
    
    const data = await response.json();
    
    const results: SearchResult[] = [];
    
    // Process instant answer
    if (data.Abstract) {
      results.push({
        title: data.Heading || query,
        snippet: data.Abstract,
        url: data.AbstractURL || '#',
        source: data.AbstractSource || 'DuckDuckGo'
      });
    }
    
    // Process related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
        if (topic.Text) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Information',
            snippet: topic.Text,
            url: topic.FirstURL || '#',
            source: 'DuckDuckGo'
          });
        }
      });
    }
    
    // If no results from DuckDuckGo, try alternative approach
    if (results.length === 0) {
      // Fallback to Wikipedia API for educational content
      try {
        const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`);
        if (wikiResponse.ok) {
          const wikiData = await wikiResponse.json();
          results.push({
            title: wikiData.title,
            snippet: wikiData.extract,
            url: wikiData.content_urls?.desktop?.page || '#',
            source: 'Wikipedia'
          });
        }
      } catch (wikiError) {
        console.log('Wikipedia fallback failed:', wikiError);
      }
    }
    
    return {
      results,
      query,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('Web search error:', error);
    
    // Return a more helpful fallback response
    return {
      results: [{
        title: `Information about ${query}`,
        snippet: `I'm currently unable to search the web for real-time information about "${query}". This could be due to network restrictions or API limitations. Please try rephrasing your question or ask for general knowledge on this topic.`,
        url: '#',
        source: 'System Message'
      }],
      query,
      timestamp: new Date()
    };
  }
};

export const generateEnhancedResponse = async (
  userMessage: string, 
  agent: any, 
  searchResults?: WebSearchResponse
): Promise<string> => {
  let enhancedResponse = '';
  
  if (searchResults && searchResults.results.length > 0) {
    enhancedResponse += `**Information found about "${userMessage}":**\n\n`;
    
    searchResults.results.forEach((result, index) => {
      enhancedResponse += `**${index + 1}. ${result.title}**\n`;
      enhancedResponse += `${result.snippet}\n`;
      if (result.url !== '#') {
        enhancedResponse += `Source: [${result.source}](${result.url})\n`;
      } else {
        enhancedResponse += `Source: ${result.source}\n`;
      }
      enhancedResponse += '\n';
    });
    
    enhancedResponse += `**Analysis as ${agent.name}:**\n`;
    
    // Agent-specific analysis based on type
    if (agent.type === 'Islamic Studies Specialist') {
      enhancedResponse += `From an Islamic perspective, I can provide additional context and scholarly commentary on this topic. The information above should be verified against authentic Islamic sources like the Quran and Sunnah.`;
    } else if (agent.type === 'Code Assistant') {
      enhancedResponse += `As a programming specialist, I can help you implement any technical solutions related to this information. Let me know if you need code examples or technical implementation details.`;
    } else if (agent.type === 'Research Assistant') {
      enhancedResponse += `Based on the research above, I can help you dive deeper into specific aspects, provide academic citations, or assist with further analysis of this topic.`;
    } else if (agent.type === 'Math Specialist') {
      enhancedResponse += `If there are any mathematical concepts or calculations related to this topic, I can provide detailed explanations and solve any numerical problems.`;
    } else if (agent.type === 'Science Specialist') {
      enhancedResponse += `From a scientific standpoint, I can explain the underlying principles, mechanisms, and provide evidence-based analysis of this information.`;
    } else {
      enhancedResponse += `I can provide additional analysis, answer follow-up questions, or help you explore specific aspects of this information in more detail.`;
    }
    
  } else {
    enhancedResponse = `I apologize, but I wasn't able to find current web information about "${userMessage}". However, I can still help you with general knowledge or guide you to reliable sources for this topic.`;
  }
  
  return enhancedResponse;
};
