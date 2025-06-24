import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, Zap, Settings, Users, BarChart3, Smartphone, Plus } from "lucide-react";
import AgentSidebar from "@/components/AgentSidebar";
import ChatInterface from "@/components/ChatInterface";
import MobileChatInterface from "@/components/MobileChatInterface";
import AgentSwitcher from "@/components/AgentSwitcher";
import IntegrationHub from "@/components/IntegrationHub";
import CreateAgentModal from "@/components/CreateAgentModal";
import OnboardingModal from "@/components/OnboardingModal";
import SettingsPanel from "@/components/SettingsPanel";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import { agentTemplates } from "@/data/agentTemplates";

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

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Athena AI",
    description: "Your strategic planning assistant.",
    type: "Strategy",
    avatar: "🦉",
    isActive: true,
    lastUsed: new Date().toISOString(),
    capabilities: ["Market Analysis", "Competitor Research", "SWOT Analysis"],
  },
  {
    id: "2",
    name: "CodeForge",
    description: "Generates and debugs code in multiple languages.",
    type: "Development",
    avatar: "👨‍💻",
    isActive: false,
    lastUsed: "Never",
    capabilities: ["Code Generation", "Debugging", "Code Review"],
  },
  {
    id: "3",
    name: "Muse",
    description: "Crafts compelling content and creative copy.",
    type: "Creative",
    avatar: "🎨",
    isActive: true,
    lastUsed: new Date(Date.now() - 86400000).toISOString(),
    capabilities: ["Content Creation", "Copywriting", "Brainstorming"],
  },
  {
    id: "4",
    name: "Sherlock",
    description: "Uncovers insights with data analysis.",
    type: "Analytics",
    avatar: "🔎",
    isActive: false,
    lastUsed: "Never",
    capabilities: ["Data Analysis", "Reporting", "Visualization"],
  },
];

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [currentAgent, setCurrentAgent] = useState<Agent | undefined>(agents[0]);
  const [activeTab, setActiveTab] = useState("chat");
  const { isNative } = useMobileFeatures();

  useEffect(() => {
    // Simulate fetching agents from an API or local storage
    // For now, we'll use mockAgents
    // You can replace this with your actual data fetching logic
    setAgents(mockAgents);

    // Open onboarding modal on first visit
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsOnboardingModalOpen(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleAgentSelect = (agent: Agent) => {
    setCurrentAgent(agent);
    // Update lastUsed timestamp
    setAgents((prevAgents) =>
      prevAgents.map((a) =>
        a.id === agent.id ? { ...a, lastUsed: new Date().toISOString() } : a
      )
    );
  };

  const handleCreateAgent = (newAgent: Agent) => {
    setAgents([...agents, newAgent]);
    setCurrentAgent(newAgent);
    setIsCreateModalOpen(false);
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <header className="bg-gray-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            {isNative && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                <Brain className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            )}
            <CardTitle className="text-xl font-bold text-white">
              NeuralForge AI
            </CardTitle>
          </div>
          <div className="space-x-2 flex items-center">
            <AgentSwitcher
              agents={agents}
              currentAgent={currentAgent}
              onSwitchAgent={handleAgentSelect}
            />
            <Button onClick={() => setIsSettingsOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 border border-purple-500/30">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-2" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Dashboard</CardTitle>
                <CardDescription className="text-gray-400">
                  Overview of your AI Agents and activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white">
                  Welcome to your AI-powered dashboard!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <div className="flex flex-col md:flex-row">
              {isNative && isSidebarOpen && (
                <div className="w-full md:w-64 mr-4">
                  <AgentSidebar
                    agents={agents}
                    currentAgent={currentAgent}
                    onAgentSelect={handleAgentSelect}
                    onCreateAgent={() => setIsCreateModalOpen(true)}
                  />
                </div>
              )}
              <div className="flex-1">
                <Card className="bg-gray-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Your Agents</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage and create AI Agents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {agents.map((agent) => (
                        <Card
                          key={agent.id}
                          className={`bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors ${
                            currentAgent?.id === agent.id ? "border-2 border-purple-500" : ""
                          }`}
                          onClick={() => handleAgentSelect(agent)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{agent.avatar}</span>
                                <div>
                                  <CardTitle className="text-white text-sm">
                                    {agent.name}
                                  </CardTitle>
                                  <Badge
                                    variant={agent.isActive ? "default" : "secondary"}
                                    className={
                                      agent.isActive
                                        ? "bg-green-900/50 text-green-300"
                                        : "bg-gray-700 text-gray-300"
                                    }
                                  >
                                    {agent.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <CardDescription className="text-gray-400 text-xs mb-4">
                              {agent.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      ))}
                      <Card
                        className="bg-gray-800/50 border-purple-500/30 hover:bg-purple-700/20 transition-colors cursor-pointer"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        <CardContent className="flex flex-col items-center justify-center space-y-2 p-4 h-full">
                          <Plus className="w-6 h-6 text-purple-500" />
                          <p className="text-white text-sm">Create New Agent</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            {isNative ? (
              <MobileChatInterface agent={currentAgent} />
            ) : (
              <ChatInterface agent={currentAgent} />
            )}
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationHub />
          </TabsContent>

          <TabsContent value="marketplace">
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Agent Marketplace</CardTitle>
                <CardDescription className="text-gray-400">
                  Explore community-built AI Agents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white">
                  Discover and install new AI Agents from our community
                  marketplace.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account preferences and settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white">
                  Customize your experience and manage your account settings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateAgent}
        templates={agentTemplates}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={handleOnboardingComplete}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
