
export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'automation' | 'social' | 'developer' | 'storage';
  isConnected: boolean;
  config?: Record<string, any>;
  authUrl?: string;
  webhooks?: string[];
}

export interface AutomationTrigger {
  id: string;
  name: string;
  description: string;
  integration: string;
  event: string;
  conditions?: Record<string, any>;
  actions: AutomationAction[];
  isActive: boolean;
}

export interface AutomationAction {
  id: string;
  type: 'webhook' | 'notification' | 'api_call' | 'email';
  config: Record<string, any>;
}

export interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
}
