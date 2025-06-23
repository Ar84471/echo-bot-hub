
import React from 'react';
import { Bot, MessageCircle, Star, Zap } from 'lucide-react';
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
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const activeAgents = agents.filter(agent => agent.isActive);
  const inactiveAgents = agents.filter(agent => !agent.isActive);

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose}>
      <div 
        className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Agents
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-4">
            {/* Active Agents */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-sm">Active Agents ({activeAgents.length})</h3>
              </div>
              <div className="space-y-2">
                {activeAgents.map((agent) => (
                  <Card 
                    key={agent.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedAgent?.id === agent.id 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : ''
                    }`}
                    onClick={() => onSelectAgent(agent)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{agent.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {agent.type}
                          </Badge>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {agent.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {agent.lastUsed}
                            </span>
                            {selectedAgent?.id === agent.id && (
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
                  <h3 className="font-semibold text-sm">Inactive Agents ({inactiveAgents.length})</h3>
                </div>
                <div className="space-y-2">
                  {inactiveAgents.map((agent) => (
                    <Card 
                      key={agent.id} 
                      className="cursor-pointer transition-all hover:shadow-md opacity-70"
                      onClick={() => onSelectAgent(agent)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="text-lg opacity-50">{agent.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                            <Badge variant="outline" className="text-xs mb-1">
                              {agent.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
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
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  New Conversation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  Create Custom Agent
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AgentSidebar;
