
import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, Settings, Trash2, Bot, Sparkles, Menu, Zap, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import CreateAgentModal from '@/components/CreateAgentModal';
import ChatInterface from '@/components/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import AgentSidebar from '@/components/AgentSidebar';
import { loadAgents, saveAgents, updateAgentLastUsed } from '@/utils/storage';

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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAgentSidebar, setShowAgentSidebar] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const { credits, subscriptionTier, useCredits } = useSubscription();

  useEffect(() => {
    const loadedAgents = loadAgents();
    setAgents(loadedAgents);
  }, []);

  const handleCreateAgent = (newAgent: Omit<Agent, 'id' | 'lastUsed'>) => {
    const agent: Agent = {
      ...newAgent,
      id: Date.now().toString(),
      lastUsed: 'Just created'
    };
    const updatedAgents = [...agents, agent];
    setAgents(updatedAgents);
    saveAgents(updatedAgents);
    setIsCreateModalOpen(false);
    
    toast({
      title: "Agent Deployed Successfully",
      description: `${agent.name} has been activated in the neural network.`,
    });
  };

  const handleDeleteAgent = (agentId: string) => {
    const agentToDelete = agents.find(a => a.id === agentId);
    const updatedAgents = agents.filter(agent => agent.id !== agentId);
    setAgents(updatedAgents);
    saveAgents(updatedAgents);
    
    if (agentToDelete) {
      toast({
        title: "Agent Decommissioned",
        description: `${agentToDelete.name} has been removed from the neural network.`,
        variant: "destructive",
      });
    }
  };

  const handleChatWithAgent = async (agent: Agent) => {
    // Check if user has enough credits
    if (!useCredits(1)) {
      toast({
        title: "Insufficient Credits",
        description: "You need more credits to start a conversation. Consider upgrading your plan.",
        variant: "destructive",
      });
      return;
    }

    setIsTransitioning(true);
    updateAgentLastUsed(agent.id);
    
    // Update local state immediately
    setAgents(prevAgents => 
      prevAgents.map(a => 
        a.id === agent.id 
          ? { ...a, lastUsed: 'Just now', isActive: true }
          : a
      )
    );
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSelectedAgent(agent);
    setShowChat(true);
    setIsTransitioning(false);
  };

  const handleBackToDashboard = async () => {
    setIsTransitioning(true);
    
    // Add transition delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setShowChat(false);
    setSelectedAgent(null);
    setIsTransitioning(false);
    
    // Reload agents to reflect any changes
    const updatedAgents = loadAgents();
    setAgents(updatedAgents);
  };

  const activeAgents = agents.filter(a => a.isActive).length;
  const totalSessions = agents.reduce((acc, agent) => acc + (agent.isActive ? 1 : 0), 0) * 3; // Simulate sessions

  if (showChat && selectedAgent) {
    return (
      <div className={`transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <ChatInterface agent={selectedAgent} onBack={handleBackToDashboard} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 dark:from-gray-900 dark:via-black dark:to-purple-900 light:from-gray-50 light:via-white light:to-purple-50 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header */}
      <div className="bg-black/90 dark:bg-black/90 light:bg-white/90 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAgentSidebar(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                  NeuralForge
                </h1>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">Advanced AI Agent Development Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Credits Display */}
              <div className="flex items-center space-x-2 bg-purple-900/50 dark:bg-purple-900/50 light:bg-purple-100 px-3 py-2 rounded-lg">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white dark:text-white light:text-gray-900 font-medium">{credits}</span>
                <Badge variant="secondary" className="text-xs">
                  {subscriptionTier}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="border-purple-500/30"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-5 h-5" />
              </Button>
              
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
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="bg-gray-800/70 dark:bg-gray-800/70 light:bg-white/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 dark:hover:bg-gray-800/80 light:hover:bg-white/80 transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600">Total Agents</p>
                  <p className="text-3xl font-bold text-white dark:text-white light:text-gray-900">{agents.length}</p>
                </div>
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/70 dark:bg-gray-800/70 light:bg-white/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 dark:hover:bg-gray-800/80 light:hover:bg-white/80 transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600">Active Agents</p>
                  <p className="text-3xl font-bold text-green-400">{activeAgents}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/70 dark:bg-gray-800/70 light:bg-white/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 dark:hover:bg-gray-800/80 light:hover:bg-white/80 transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600">Credits</p>
                  <p className="text-3xl font-bold text-yellow-400">{credits}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/70 dark:bg-gray-800/70 light:bg-white/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 dark:hover:bg-gray-800/80 light:hover:bg-white/80 transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600">Neural Sessions</p>
                  <p className="text-3xl font-bold text-violet-400">{totalSessions}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-violet-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white dark:text-white light:text-gray-900">Deployed AI Agents</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAgentSidebar(true)}
              className="lg:hidden border-purple-500/30"
            >
              <Menu className="w-4 h-4 mr-2" />
              Quick Select
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <Card 
                key={agent.id} 
                className="bg-gray-800/70 dark:bg-gray-800/70 light:bg-white/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 dark:hover:bg-gray-800/80 light:hover:bg-white/80 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{agent.avatar}</div>
                      <div>
                        <CardTitle className="text-lg text-white dark:text-white light:text-gray-900">{agent.name}</CardTitle>
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
                  <CardDescription className="text-gray-300 dark:text-gray-300 light:text-gray-600 mb-4">
                    {agent.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 mb-2">Neural Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 mb-4">
                    <span>Last neural sync: {agent.lastUsed}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleChatWithAgent(agent)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white transition-all duration-200 hover:scale-105"
                      size="sm"
                      disabled={isTransitioning}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Neural Link
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50 transition-all duration-200">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteAgent(agent.id)}
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/30 text-red-400 hover:bg-red-900/50 transition-all duration-200"
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
          <div className="text-center py-12 animate-fade-in">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700 mb-2">No agents deployed</h3>
            <p className="text-gray-500 dark:text-gray-500 light:text-gray-600 mb-6">Deploy your first AI agent to begin neural processing</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white transition-all duration-200 hover:scale-105"
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

      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <AgentSidebar
        agents={agents}
        selectedAgent={selectedAgent}
        onSelectAgent={(agent) => {
          setShowAgentSidebar(false);
          handleChatWithAgent(agent);
        }}
        isOpen={showAgentSidebar}
        onClose={() => setShowAgentSidebar(false)}
      />
    </div>
  );
};

export default Index;
