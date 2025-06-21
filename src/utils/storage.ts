
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
  
  // Return specialized default agents
  return [
    {
      id: '1',
      name: 'MathGenius Pro',
      description: 'Advanced mathematical computation engine specialized in algebra, calculus, statistics, and complex problem solving',
      type: 'Mathematics Specialist',
      avatar: '🧮',
      isActive: true,
      lastUsed: '2 hours ago',
      capabilities: ['Mathematics', 'Calculations', 'Statistics', 'Algebra', 'Geometry']
    },
    {
      id: '2',
      name: 'Code Architect',
      description: 'Elite programming AI with expertise in multiple languages, architecture design, and code optimization',
      type: 'Programming Specialist',
      avatar: '💻',
      isActive: true,
      lastUsed: '1 day ago',
      capabilities: ['Code Review', 'Programming', 'Debugging', 'Architecture Design', 'Web Development']
    },
    {
      id: '3',
      name: 'Creative Synthesizer',
      description: 'AI specialized in creative content generation, storytelling, and artistic collaboration',
      type: 'Creative Specialist',
      avatar: '✍️',
      isActive: true,
      lastUsed: '3 days ago',
      capabilities: ['Creative Writing', 'Storytelling', 'Content Creation', 'Poetry', 'Brainstorming']
    },
    {
      id: '4',
      name: 'Science Explorer',
      description: 'Comprehensive science AI covering physics, chemistry, biology, and earth sciences with detailed explanations',
      type: 'Science Specialist',
      avatar: '🔬',
      isActive: true,
      lastUsed: '5 hours ago',
      capabilities: ['Science', 'Physics', 'Chemistry', 'Biology', 'Research', 'Analysis']
    },
    {
      id: '5',
      name: 'Quran Bot',
      description: 'Specialized Islamic studies AI for Quranic verse analysis, Arabic linguistics, translations, and scholarly commentary',
      type: 'Islamic Studies Specialist',
      avatar: '📖',
      isActive: true,
      lastUsed: '30 minutes ago',
      capabilities: ['Quranic Analysis', 'Arabic Language', 'Islamic Studies', 'Translation', 'Tafsir', 'Etymology']
    },
    {
      id: '6',
      name: 'Universal Assistant',
      description: 'Versatile AI capable of handling any topic with comprehensive knowledge and adaptive responses',
      type: 'General Assistant',
      avatar: '🌟',
      isActive: false,
      lastUsed: '1 week ago',
      capabilities: ['General Knowledge', 'Problem Solving', 'Research', 'Analysis', 'Communication']
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
