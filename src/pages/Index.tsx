import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, Zap, Settings, Users, BarChart3, Smartphone, Plus } from "lucide-react";
import AgentSidebar from "@/components/AgentSidebar";
import SimpleChatInterface from "@/components/SimpleChatInterface";
import MobileChatInterface from "@/components/MobileChatInterface";
import MobileErrorBoundary from "@/components/MobileErrorBoundary";
import AgentSwitcher from "@/components/AgentSwitcher";
import IntegrationHub from "@/components/IntegrationHub";
import CreateAgentModal from "@/components/CreateAgentModal";
import OnboardingModal from "@/components/OnboardingModal";
import SettingsPanel from "@/components/SettingsPanel";
import HomePage from "@/components/HomePage";
import Marketplace from "@/components/Marketplace";
import { useCrossPlatform } from "@/hooks/useCrossPlatform";
import { type CommunityAgent } from "@/data/communityAgents";

// Mock data for agent templates
const agentTemplates = [
  {
    id: "1",
    name: "Code Assistant",
    description: "Helps with coding tasks and debugging",
    type: "Development",
    avatar: "👨‍💻",
    capabilities: ["Code Generation", "Debugging", "Code Review"],
    prompt: "You are a helpful coding assistant."
  },
  {
    id: "2",
    name: "Creative Writer",
    description: "Assists with creative writing and content creation",
    type: "Creative",
    avatar: "🎨",
    capabilities: ["Content Creation", "Copywriting", "Brainstorming"],
    prompt: "You are a creative writing assistant."
  },
  {
    id: "3",
    name: "Data Analyst",
    description: "Analyzes data and provides insights",
    type: "Analytics",
    avatar: "📊",
    capabilities: ["Data Analysis", "Reporting", "Visualization"],
    prompt: "You are a data analysis expert."
  }
];

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
  const { isMobile, isTablet, isNative, optimizeForPlatform } = useCrossPlatform();

  useEffect(() => {
    setAgents(mockAgents);

    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsOnboardingModalOpen(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleAgentSelect = (agent: Agent) => {
    setCurrentAgent(agent);
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

  const handleBackToAgents = () => {
    setActiveTab("agents");
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInstallCommunityAgent = (communityAgent: CommunityAgent) => {
    const newAgent: Agent = {
      id: communityAgent.id,
      name: communityAgent.name,
      description: communityAgent.description,
      type: communityAgent.type,
      avatar: communityAgent.avatar,
      isActive: true,
      lastUsed: new Date().toISOString(),
      capabilities: communityAgent.capabilities,
    };
    
    setAgents([...agents, newAgent]);
    setCurrentAgent(newAgent);
  };

  // Optimize layout for different platforms
  const tabsGridConfig = optimizeForPlatform(
    "grid-cols-3", // Mobile: 3 columns
    "grid-cols-4", // Tablet: 4 columns  
    "grid-cols-6"  // Desktop: 6 columns
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-accent">
      <header className="bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            {(isMobile || isNative) && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                <Brain className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            )}
            <CardTitle className="text-xl font-bold text-foreground">
              NeuralForge AI
            </CardTitle>
          </div>
          <div className="space-x-2 flex items-center">
            {!isMobile && (
              <AgentSwitcher
                agents={agents}
                currentAgent={currentAgent}
                onSwitchAgent={handleAgentSelect}
              />
            )}
            <Button onClick={() => setIsSettingsOpen(true)} size={isMobile ? "sm" : "default"}>
              <Settings className="w-4 h-4 mr-2" />
              {!isMobile && "Settings"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${tabsGridConfig} bg-card/50 border border-border`}>
            <TabsTrigger value="home" className="data-[state=active]:bg-primary">
              <Brain className="w-4 h-4 mr-2" />
              {!isMobile && "Home"}
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-primary">
              <Users className="w-4 h-4 mr-2" />
              {!isMobile && "Agents"}
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary">
              <MessageSquare className="w-4 h-4 mr-2" />
              {!isMobile && "Chat"}
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-primary">
              <Zap className="w-4 h-4 mr-2" />
              {!isMobile && "Integrations"}
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="data-[state=active]:bg-primary">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Marketplace
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="home">
            <HomePage 
              onNavigate={handleNavigateToTab}
              onCreateAgent={() => setIsCreateModalOpen(true)}
              agents={agents}
              currentAgent={currentAgent}
            />
          </TabsContent>

          <TabsContent value="agents">
            <div className="flex flex-col md:flex-row">
              {!isMobile && !isNative && isSidebarOpen && (
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
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Your Agents</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage and create AI Agents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`grid gap-4 ${optimizeForPlatform(
                      'grid-cols-1', 
                      'grid-cols-2', 
                      'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    )}`}>
                      {agents.map((agent) => (
                        <Card
                          key={agent.id}
                          className={`bg-card/50 border-border hover:border-primary/50 transition-colors cursor-pointer ${
                            currentAgent?.id === agent.id ? "border-2 border-primary" : ""
                          }`}
                          onClick={() => handleAgentSelect(agent)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{agent.avatar}</span>
                                <div>
                                  <CardTitle className="text-foreground text-sm">
                                    {agent.name}
                                  </CardTitle>
                                  <Badge
                                    variant={agent.isActive ? "default" : "secondary"}
                                  >
                                    {agent.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <CardDescription className="text-muted-foreground text-xs mb-4">
                              {agent.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      ))}
                      <Card
                        className="bg-card/50 border-border hover:bg-primary/20 transition-colors cursor-pointer"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        <CardContent className="flex flex-col items-center justify-center space-y-2 p-4 h-full">
                          <Plus className="w-6 h-6 text-primary" />
                          <p className="text-foreground text-sm">Create New Agent</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            {currentAgent ? (
              (isMobile || isNative) ? (
                <MobileErrorBoundary>
                  <MobileChatInterface 
                    agent={currentAgent}
                    agents={agents}
                    onBack={handleBackToAgents}
                    onSwitchAgent={handleAgentSelect}
                    onSendMessage={(message) => console.log("Sending message:", message)}
                  />
                </MobileErrorBoundary>
              ) : (
                <SimpleChatInterface agent={currentAgent} />
              )
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Agent Selected</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Choose an AI agent to start chatting
                  </p>
                  <Button onClick={() => setActiveTab("agents")} className="bg-primary hover:bg-primary/90">
                    Select Agent
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationHub />
          </TabsContent>

          <TabsContent value="dashboard">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Dashboard</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Overview of your AI Agents and activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  Welcome to your AI-powered dashboard!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Marketplace onInstallAgent={handleInstallCommunityAgent} />
          </TabsContent>
        </Tabs>
      </main>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAgent={handleCreateAgent}
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
