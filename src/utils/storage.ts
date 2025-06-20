
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

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId: string;
}

interface ChatSession {
  agentId: string;
  messages: Message[];
  lastUpdated: Date;
}

export const StorageKeys = {
  AGENTS: 'neuralforge_agents',
  CHAT_SESSIONS: 'neuralforge_chat_sessions',
  ACTIVE_SESSIONS: 'neuralforge_active_sessions'
};

export const saveAgents = (agents: Agent[]) => {
  localStorage.setItem(StorageKeys.AGENTS, JSON.stringify(agents));
};

export const loadAgents = (): Agent[] => {
  const stored = localStorage.getItem(StorageKeys.AGENTS);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return default agents if none exist
  return [
    {
      id: '1',
      name: 'Neural Assistant Pro',
      description: 'Advanced AI assistant specialized in general task processing and cognitive analysis',
      type: 'Neural Assistant',
      avatar: '🤖',
      isActive: true,
      lastUsed: '2 hours ago',
      capabilities: ['Text Generation', 'Data Analysis', 'Problem Solving', 'Research']
    },
    {
      id: '2',
      name: 'Code Architect',
      description: 'Elite programming AI with advanced code review and architecture design capabilities',
      type: 'Code Architect',
      avatar: '💻',
      isActive: true,
      lastUsed: '1 day ago',
      capabilities: ['Code Review', 'Debugging', 'Architecture Design', 'Optimization']
    },
    {
      id: '3',
      name: 'Creative Synthesizer',
      description: 'AI specialized in creative content generation and artistic collaboration',
      type: 'Creative Synthesizer',
      avatar: '✍️',
      isActive: false,
      lastUsed: '3 days ago',
      capabilities: ['Creative Writing', 'Content Creation', 'Storytelling', 'Brainstorming']
    }
  ];
};

export const saveChatSession = (session: ChatSession) => {
  const sessions = loadChatSessions();
  const existingIndex = sessions.findIndex(s => s.agentId === session.agentId);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(StorageKeys.CHAT_SESSIONS, JSON.stringify(sessions));
};

export const loadChatSessions = (): ChatSession[] => {
  const stored = localStorage.getItem(StorageKeys.CHAT_SESSIONS);
  return stored ? JSON.parse(stored) : [];
};

export const loadChatSession = (agentId: string): ChatSession | null => {
  const sessions = loadChatSessions();
  return sessions.find(s => s.agentId === agentId) || null;
};

export const updateAgentLastUsed = (agentId: string) => {
  const agents = loadAgents();
  const agent = agents.find(a => a.id === agentId);
  if (agent) {
    agent.lastUsed = 'Just now';
    agent.isActive = true;
    saveAgents(agents);
  }
};
