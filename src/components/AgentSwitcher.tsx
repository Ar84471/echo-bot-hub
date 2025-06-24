
import React from 'react';
import { ChevronDown, Smartphone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

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

interface AgentSwitcherProps {
  agents: Agent[];
  currentAgent?: Agent;
  onSwitchAgent: (agent: Agent) => void;
}

const AgentSwitcher: React.FC<AgentSwitcherProps> = ({
  agents,
  currentAgent,
  onSwitchAgent
}) => {
  const { isNative, hapticFeedback } = useMobileFeatures();

  const handleAgentSwitch = async (agent: Agent) => {
    if (isNative) {
      await hapticFeedback();
    }
    onSwitchAgent(agent);
  };

  const recentAgents = agents
    .filter(agent => agent.lastUsed !== 'Never')
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 3);

  const availableAgents = agents.filter(agent => agent.id !== currentAgent?.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-gray-800/50 border-purple-500/30 text-white hover:bg-gray-700/50"
        >
          <div className="flex items-center space-x-2">
            {currentAgent ? (
              <>
                <span className="text-lg">{currentAgent.avatar}</span>
                <div className="text-left">
                  <div className="font-medium">{currentAgent.name}</div>
                  <div className="text-xs text-gray-400">{currentAgent.type}</div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Select Agent</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isNative && (
              <Badge variant="secondary" className="text-xs bg-blue-900/50 text-blue-300">
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile
              </Badge>
            )}
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 bg-gray-800 border-purple-500/30">
        {recentAgents.length > 0 && (
          <>
            <DropdownMenuLabel className="text-gray-300">Recent Agents</DropdownMenuLabel>
            <DropdownMenuGroup>
              {recentAgents.map((agent) => (
                <DropdownMenuItem
                  key={agent.id}
                  onClick={() => handleAgentSwitch(agent)}
                  className="focus:bg-purple-900/50 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <span className="text-lg">{agent.avatar}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.type}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-purple-500/20" />
          </>
        )}
        
        <DropdownMenuLabel className="text-gray-300">All Agents</DropdownMenuLabel>
        <DropdownMenuGroup className="max-h-60 overflow-y-auto">
          {availableAgents.map((agent) => (
            <DropdownMenuItem
              key={agent.id}
              onClick={() => handleAgentSwitch(agent)}
              className="focus:bg-purple-900/50 cursor-pointer"
            >
              <div className="flex items-center space-x-3 w-full">
                <span className="text-lg">{agent.avatar}</span>
                <div className="flex-1">
                  <div className="font-medium text-white">{agent.name}</div>
                  <div className="text-xs text-gray-400 truncate">{agent.description}</div>
                  <div className="flex gap-1 mt-1">
                    {agent.capabilities.slice(0, 2).map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AgentSwitcher;
