
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Zap, Settings, Users, BarChart3, Plus, ArrowRight, Sparkles, Download, FileText, Wallet } from 'lucide-react';
import { downloadReadmeFile, downloadSourceCode } from '@/utils/downloadUtils';
import { WalletConnection } from '@/components/WalletConnection';
import { EtherlinkNFTMinter } from '@/components/EtherlinkNFTMinter';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onCreateAgent: () => void;
  agents: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    avatar: string;
    isActive: boolean;
  }>;
  currentAgent?: {
    id: string;
    name: string;
    avatar: string;
  };
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onCreateAgent, agents, currentAgent }) => {
  const activeAgents = agents.filter(agent => agent.isActive);
  const featuredAgents = agents.slice(0, 3);

  const quickActions = [
    {
      title: 'Start Chatting',
      description: 'Begin a conversation with your AI agents',
      icon: MessageSquare,
      action: () => onNavigate('chat'),
      color: 'bg-blue-600 hover:bg-blue-700',
      disabled: !currentAgent
    },
    {
      title: 'Create New Agent',
      description: 'Build a custom AI agent for your needs',
      icon: Plus,
      action: onCreateAgent,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Manage Agents',
      description: 'View and organize your AI agents',
      icon: Brain,
      action: () => onNavigate('agents'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Explore Integrations',
      description: 'Connect with your favorite tools',
      icon: Zap,
      action: () => onNavigate('integrations'),
      color: 'bg-yellow-600 hover:bg-yellow-700'
    }
  ];

  const stats = [
    { label: 'Active Agents', value: activeAgents.length, icon: Brain },
    { label: 'Total Agents', value: agents.length, icon: Users },
    { label: 'Integrations', value: '12+', icon: Zap }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Brain className="w-8 h-8 text-purple-500" />
          <h1 className="text-4xl font-bold text-white">NeuralForge AI</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your AI-powered assistant hub. Create, customize, and deploy intelligent AI agents for any task.
        </p>
        {currentAgent && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <span className="text-gray-400">Currently active:</span>
            <Badge className="bg-purple-900/50 text-purple-300">
              {currentAgent.avatar} {currentAgent.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800/50 border-purple-500/30">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
              <stat.icon className="w-8 h-8 text-purple-500" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={action.disabled ? undefined : action.action}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-12 h-12 mx-auto rounded-full ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </div>
                {!action.disabled && (
                  <ArrowRight className="w-4 h-4 text-purple-500 mx-auto" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Agents */}
      {featuredAgents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-500" />
              Your AI Agents
            </h2>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('agents')}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredAgents.map((agent) => (
              <Card 
                key={agent.id} 
                className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105"
                onClick={() => onNavigate('chat')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{agent.avatar}</span>
                    <div>
                      <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                      <Badge 
                        variant={agent.isActive ? "default" : "secondary"}
                        className={agent.isActive ? "bg-green-900/50 text-green-300" : "bg-gray-700 text-gray-300"}
                      >
                        {agent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-400">
                    {agent.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Web3 & Download Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Web3 Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-purple-500" />
            Web3 Features
          </h2>
          <div className="space-y-6">
            <WalletConnection />
            <EtherlinkNFTMinter />
          </div>
        </div>

        {/* Download Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Download className="w-6 h-6 mr-2 text-purple-500" />
            Download Project Files
          </h2>
          <div className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">README.md</h3>
                    <p className="text-sm text-gray-400">Complete project documentation</p>
                  </div>
                </div>
                <Button 
                  onClick={downloadReadmeFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download README
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Source Code</h3>
                    <p className="text-sm text-gray-400">Main application files and structure</p>
                  </div>
                </div>
                <Button 
                  onClick={downloadSourceCode}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Preview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Explore More</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { tab: 'dashboard', icon: BarChart3, title: 'Dashboard', desc: 'Analytics & insights' },
            { tab: 'marketplace', icon: Users, title: 'Marketplace', desc: 'Community agents' },
            { tab: 'settings', icon: Settings, title: 'Settings', desc: 'Customize your experience' }
          ].map((item) => (
            <Card 
              key={item.tab}
              className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105"
              onClick={() => onNavigate(item.tab)}
            >
              <CardContent className="p-4 text-center space-y-3">
                <item.icon className="w-8 h-8 text-purple-500 mx-auto" />
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
