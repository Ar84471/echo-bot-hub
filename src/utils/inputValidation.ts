
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedInput?: string;
}

export const validateMessage = (message: string): ValidationResult => {
  try {
    // Check if message is empty or only whitespace
    if (!message || !message.trim()) {
      return {
        isValid: false,
        error: "Please enter a message before sending."
      };
    }

    // Check message length
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 5000) {
      return {
        isValid: false,
        error: "Message is too long. Please keep it under 5000 characters."
      };
    }

    if (trimmedMessage.length < 1) {
      return {
        isValid: false,
        error: "Message cannot be empty."
      };
    }

    // Basic sanitization - remove potentially harmful characters
    const sanitizedInput = trimmedMessage
      .replace(/[<>]/g, '') // Remove basic HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, ''); // Remove event handlers

    return {
      isValid: true,
      sanitizedInput
    };
  } catch (error) {
    console.error('Error validating message:', error);
    return {
      isValid: false,
      error: "Unable to validate message. Please try again."
    };
  }
};

export const validateAgent = (agent: any): boolean => {
  try {
    return (
      agent &&
      typeof agent === 'object' &&
      typeof agent.id === 'string' &&
      typeof agent.name === 'string' &&
      typeof agent.type === 'string' &&
      Array.isArray(agent.capabilities)
    );
  } catch (error) {
    console.error('Error validating agent:', error);
    return false;
  }
};
