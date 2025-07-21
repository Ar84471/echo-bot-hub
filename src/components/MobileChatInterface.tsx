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
    if (agent && localMessages.length === 0 && messages.length === 0) {
      const initializeGreeting = async () => {
        try {
          const greetingText = await generateAIResponse(agent, '', true);
          const greetingMessage: Message = {
            id: 'greeting-' + agent.id,
            text: greetingText,
            sender: 'agent',
            timestamp: new Date(),
            agentId: agent.id
          };
          setLocalMessages([greetingMessage]);
        } catch (error) {
          console.error('Failed to generate greeting:', error);
          const fallbackMessage: Message = {
            id: 'greeting-' + agent.id,
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
  }, [agent?.id]); // Only depend on agent ID to prevent infinite loops

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
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-accent flex items-center justify-center">
      <div className="text-center text-foreground">
        <Bot className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold">No Agent Selected</h2>
        <p className="text-muted-foreground">Please select an agent to start chatting</p>
      </div>
    </div>
    );
  }

  const displayMessages = localMessages.length > 0 ? localMessages : messages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-accent flex flex-col">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-xl">{agent.avatar}</div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">{agent.name}</h1>
              <Badge variant="secondary" className="text-xs">
                {agent.type}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">AI Configuration</DialogTitle>
                </DialogHeader>
                <APIKeyManager onKeysUpdated={() => setShowSettings(false)} />
              </DialogContent>
            </Dialog>
            
            <Button variant="ghost" size="sm" className="text-muted-foreground">
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
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Chat with {agent.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {agent.capabilities.slice(0, 2).map((capability, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
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
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
                      U
                    </div>
                  )}
                </div>
                
                <Card className={`p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card/70 backdrop-blur-sm border-border text-foreground'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
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
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </div>
                <Card className="p-3 bg-card/70 backdrop-blur-sm border-border">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
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
      <div className="bg-card/90 backdrop-blur-sm border-t border-border p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${agent.name}...`}
              className="pr-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isTyping}
              maxLength={5000}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              disabled
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatInterface;
