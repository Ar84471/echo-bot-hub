
import React from 'react';
import { Bot, MessageCircle, Star, Zap, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface AgentSidebarProps {
  agents: Agent[];
  currentAgent?: Agent;
  onAgentSelect: (agent: Agent) => void;
  onCreateAgent: () => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({
  agents,
  currentAgent,
  onAgentSelect,
  onCreateAgent
}) => {
  const activeAgents = agents.filter(agent => agent.isActive);
  const inactiveAgents = agents.filter(agent => !agent.isActive);

  return (
    <div className="bg-gray-800/50 border-r border-purple-500/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Bot className="w-5 h-5" />
          AI Agents
        </h2>
        <Button onClick={onCreateAgent} size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {/* Active Agents */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-sm text-white">Active Agents ({activeAgents.length})</h3>
            </div>
            <div className="space-y-2">
              {activeAgents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className={`cursor-pointer transition-all hover:shadow-md bg-gray-900/50 border-gray-700 hover:border-purple-500/50 ${
                    currentAgent?.id === agent.id 
                      ? 'border-2 border-purple-500' 
                      : ''
                  }`}
                  onClick={() => onAgentSelect(agent)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="text-xl">{agent.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate text-white">{agent.name}</h4>
                        <Badge variant="secondary" className="text-xs mb-2 bg-green-900/50 text-green-300">
                          {agent.type}
                        </Badge>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                          {agent.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {agent.lastUsed === 'Never' ? 'Never' : 'Recently used'}
                          </span>
                          {currentAgent?.id === agent.id && (
                            <Star className="w-3 h-3 text-purple-500 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Inactive Agents */}
          {inactiveAgents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-sm text-white">Inactive Agents ({inactiveAgents.length})</h3>
              </div>
              <div className="space-y-2">
                {inactiveAgents.map((agent) => (
                  <Card 
                    key={agent.id} 
                    className="cursor-pointer transition-all hover:shadow-md opacity-70 bg-gray-900/50 border-gray-700"
                    onClick={() => onAgentSelect(agent)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="text-lg opacity-50">{agent.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate text-white">{agent.name}</h4>
                          <Badge variant="outline" className="text-xs mb-1 border-gray-600 text-gray-300">
                            {agent.type}
                          </Badge>
                          <p className="text-xs text-gray-400">
                            Last used: {agent.lastUsed}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-700">
            <h3 className="font-semibold text-sm mb-3 text-white">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700" onClick={onCreateAgent}>
                <Bot className="w-4 h-4 mr-2" />
                Create Custom Agent
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AgentSidebar;
