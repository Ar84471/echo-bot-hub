
import { toast } from '@/hooks/use-toast';

export interface ErrorInfo {
  message: string;
  type: 'network' | 'validation' | 'ai' | 'generic';
  retry?: boolean;
}

export const handleError = (error: unknown, context?: string): ErrorInfo => {
  console.error(`Error in ${context || 'unknown context'}:`, error);

  let errorInfo: ErrorInfo = {
    message: "Something went wrong. Please try again.",
    type: 'generic',
    retry: true
  };

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      errorInfo = {
        message: "Connection error. Please check your internet connection and try again.",
        type: 'network',
        retry: true
      };
    }
    // AI service errors
    else if (error.message.includes('AI') || error.message.includes('response')) {
      errorInfo = {
        message: "AI service is temporarily unavailable. Please try again in a moment.",
        type: 'ai',
        retry: true
      };
    }
    // Validation errors
    else if (error.message.includes('validation') || error.message.includes('invalid')) {
      errorInfo = {
        message: error.message,
        type: 'validation',
        retry: false
      };
    }
    // Generic errors with custom message
    else {
      errorInfo = {
        message: error.message || "An unexpected error occurred. Please try again.",
        type: 'generic',
        retry: true
      };
    }
  }

  // Show toast notification
  toast({
    title: "Error",
    description: errorInfo.message,
    variant: "destructive",
  });

  return errorInfo;
};

export const createFallbackResponse = (agent: any, userMessage: string): string => {
  const agentName = agent?.name || 'AI Assistant';
  
  return `I apologize, but I'm having trouble processing your request right now. This might be due to a temporary service issue.

**What you can try:**
- Rephrase your question and try again
- Check your internet connection
- Wait a moment and retry

**Your original message:** "${userMessage.slice(0, 100)}${userMessage.length > 100 ? '...' : ''}"

I'm ${agentName}, and I'm here to help once the issue is resolved. Please try sending your message again.`;
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const errorInfo = handleError(error, context);
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw error;
  }
};
