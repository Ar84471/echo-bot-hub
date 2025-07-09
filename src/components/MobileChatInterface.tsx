import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Bot, Mic, MoreVertical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateAIResponse } from '@/utils/aiResponses';
import { validateMessage } from '@/utils/inputValidation';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { useToast } from '@/hooks/use-toast';
import APIKeyManager from './APIKeyManager';

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

interface MobileChatInterfaceProps {
  agent?: Agent;
  agents?: Agent[];
  messages?: Message[];
  onBack: () => void;
  onSwitchAgent: (agent: Agent) => void;
  onSendMessage: (message: string) => void;
}

const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({
  agent,
  agents = [],
  messages = [],
  onBack,
  onSwitchAgent,
  onSendMessage
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { hapticFeedback } = useMobileFeatures();
  const { toast } = useToast();

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (agent && localMessages.length === 0) {
      const initializeGreeting = async () => {
        try {
          const greetingText = await generateAIResponse(agent, '', true);
          const greetingMessage: Message = {
            id: '1',
            text: greetingText,
            sender: 'agent',
            timestamp: new Date(),
            agentId: agent.id
          };
          setLocalMessages([greetingMessage]);
        } catch (error) {
          console.error('Failed to generate greeting:', error);
          const fallbackMessage: Message = {
            id: '1',
            text: `Hello! I'm ${agent.name}. How can I help you today?`,
            sender: 'agent',
            timestamp: new Date(),
            agentId: agent.id
          };
          setLocalMessages([fallbackMessage]);
        }
      };

      initializeGreeting();
    }
  }, [agent, localMessages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !agent) return;
    
    const validation = validateMessage(inputMessage.trim());
    if (!validation.isValid) {
      toast({
        title: "Invalid Input",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: validation.sanitizedInput!,
      sender: 'user',
      timestamp: new Date(),
      agentId: agent.id
    };

    setLocalMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Haptic feedback
    await hapticFeedback();

    if (onSendMessage) {
      onSendMessage(validation.sanitizedInput!);
    } else {
      try {
        const aiResponseText = await generateAIResponse(agent, validation.sanitizedInput!);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'agent',
          timestamp: new Date(),
          agentId: agent.id
        };
        
        setLocalMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Failed to generate AI response:', error);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I'm having trouble processing your request right now. Please try again.",
          sender: 'agent',
          timestamp: new Date(),
          agentId: agent.id
        };
        
        setLocalMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Bot className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h2 className="text-xl font-semibold">No Agent Selected</h2>
          <p className="text-gray-400">Please select an agent to start chatting</p>
        </div>
      </div>
    );
  }

  const displayMessages = localMessages.length > 0 ? localMessages : messages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-300">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-xl">{agent.avatar}</div>
            <div>
              <h1 className="text-sm font-semibold text-white">{agent.name}</h1>
              <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300">
                {agent.type}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-purple-500/30">
                <DialogHeader>
                  <DialogTitle className="text-white">AI Configuration</DialogTitle>
                </DialogHeader>
                <APIKeyManager onKeysUpdated={() => setShowSettings(false)} />
              </DialogContent>
            </Dialog>
            
            <Button variant="ghost" size="sm" className="text-gray-400">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {displayMessages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">{agent.avatar}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Chat with {agent.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {agent.capabilities.slice(0, 2).map((capability, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="flex-shrink-0 mt-1">
                  {message.sender === 'agent' ? (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-medium">
                      U
                    </div>
                  )}
                </div>
                
                <Card className={`p-3 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' 
                    : 'bg-gray-800/70 backdrop-blur-sm border-purple-500/20 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </Card>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <Card className="p-3 bg-gray-800/70 backdrop-blur-sm border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {agent.name} is thinking...
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${agent.name}...`}
              className="pr-10 border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isTyping}
              maxLength={5000}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400"
              disabled
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatInterface;
