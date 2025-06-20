
import React, { useState } from 'react';
import { Plus, MessageCircle, Settings, Trash2, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateAgentModal from '@/components/CreateAgentModal';
import ChatInterface from '@/components/ChatInterface';

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

const Index = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Assistant Pro',
      description: 'A versatile AI assistant for general tasks and productivity',
      type: 'General Assistant',
      avatar: '🤖',
      isActive: true,
      lastUsed: '2 hours ago',
      capabilities: ['Text Generation', 'Analysis', 'Problem Solving']
    },
    {
      id: '2',
      name: 'Code Mentor',
      description: 'Specialized AI for programming help and code review',
      type: 'Developer Assistant',
      avatar: '💻',
      isActive: true,
      lastUsed: '1 day ago',
      capabilities: ['Code Review', 'Debugging', 'Architecture']
    },
    {
      id: '3',
      name: 'Creative Writer',
      description: 'AI companion for creative writing and storytelling',
      type: 'Creative Assistant',
      avatar: '✍️',
      isActive: false,
      lastUsed: '3 days ago',
      capabilities: ['Creative Writing', 'Storytelling', 'Content Creation']
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleCreateAgent = (newAgent: Omit<Agent, 'id' | 'lastUsed'>) => {
    const agent: Agent = {
      ...newAgent,
      id: Date.now().toString(),
      lastUsed: 'Just created'
    };
    setAgents([...agents, agent]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter(agent => agent.id !== agentId));
  };

  const handleChatWithAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowChat(true);
  };

  const handleBackToDashboard = () => {
    setShowChat(false);
    setSelectedAgent(null);
  };

  if (showChat && selectedAgent) {
    return <ChatInterface agent={selectedAgent} onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                  NeuralForge
                </h1>
                <p className="text-gray-400 text-sm">Advanced AI Agent Development Platform</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Deploy Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Agents</p>
                  <p className="text-3xl font-bold text-white">{agents.length}</p>
                </div>
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Agents</p>
                  <p className="text-3xl font-bold text-green-400">{agents.filter(a => a.isActive).length}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Neural Sessions</p>
                  <p className="text-3xl font-bold text-violet-400">12</p>
                </div>
                <MessageCircle className="w-8 h-8 text-violet-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Deployed AI Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-gray-800/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{agent.avatar}</div>
                      <div>
                        <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300">
                          {agent.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      <span className="text-xs text-gray-400">{agent.isActive ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4">
                    {agent.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>Last active: {agent.lastUsed}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleChatWithAgent(agent)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteAgent(agent.id)}
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/30 text-red-400 hover:bg-red-900/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {agents.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No agents deployed</h3>
            <p className="text-gray-500 mb-6">Deploy your first AI agent to begin neural processing</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Deploy First Agent
            </Button>
          </div>
        )}
      </div>

      <CreateAgentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAgent={handleCreateAgent}
      />
    </div>
  );
};

export default Index;
