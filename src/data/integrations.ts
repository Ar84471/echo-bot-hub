
import { Integration } from '@/types/integrations';

export const availableIntegrations: Integration[] = [
  // Productivity Tools
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Connect Gmail, Drive, Calendar, and Docs',
    icon: '📧',
    category: 'productivity',
    isConnected: false,
    authUrl: 'https://accounts.google.com/oauth/authorize'
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    description: 'Integrate with Outlook, OneDrive, and Teams',
    icon: '🏢',
    category: 'productivity',
    isConnected: false,
    authUrl: 'https://login.microsoftonline.com/oauth2/authorize'
  },
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
  
  // Automation
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Trigger Zapier workflows',
    icon: '⚡',
    category: 'automation',
    isConnected: false
  },
  
  // Social Media
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Post tweets and read mentions',
    icon: '🐦',
    category: 'social',
    isConnected: false,
    authUrl: 'https://api.twitter.com/oauth/authorize'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Share content and manage connections',
    icon: '💼',
    category: 'social',
    isConnected: false,
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send messages and manage servers',
    icon: '🎮',
    category: 'social',
    isConnected: false
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Post messages and manage channels',
    icon: '💬',
    category: 'social',
    isConnected: false,
    authUrl: 'https://slack.com/oauth/v2/authorize'
  }
];
