
import { Integration } from '@/types/integrations';

export const availableIntegrations: Integration[] = [
  // Working Productivity Tools
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync with Notion databases and pages',
    icon: '📝',
    category: 'productivity',
    isConnected: false,
    authUrl: 'https://api.notion.com/v1/oauth/authorize'
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Connect to Airtable bases and tables',
    icon: '📊',
    category: 'productivity',
    isConnected: false,
    authUrl: 'https://airtable.com/oauth2/v1/authorize'
  },
  
  // Working Communication Tools
  {
    id: 'slack',
    name: 'Slack',
    description: 'Post messages and manage channels',
    icon: '💬',
    category: 'social',
    isConnected: false,
    authUrl: 'https://slack.com/oauth/v2/authorize'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send messages and manage servers',
    icon: '🎮',
    category: 'social',
    isConnected: false
  },
  
  // Automation Tools
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Trigger Zapier workflows via webhooks',
    icon: '⚡',
    category: 'automation',
    isConnected: false
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    description: 'Create automated workflows and scenarios',
    icon: '🔧',
    category: 'automation',
    isConnected: false
  }
];
