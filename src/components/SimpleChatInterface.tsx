
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateAIResponse, getAvailableProviders } from '@/utils/aiProviders';
import { validateMessage } from '@/utils/inputValidation';
import { useToast } from '@/hooks/use-toast';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import APIKeyManager from './APIKeyManager';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  provider?: string;
  model?: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  avatar: string;
  capabilities: string[];
}

interface SimpleChatInterfaceProps {
  agent: Agent;
}

const SimpleChatInterface: React.FC<SimpleChatInterfaceProps> = ({ agent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isNative, hapticFeedback } = useMobileFeatures();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with greeting
    const initializeChat = async () => {
      try {
        const greeting = await generateAIResponse('', agent, true);
        const greetingMessage: Message = {
          id: '1',
          text: greeting.text,
          sender: 'agent',
          timestamp: new Date(),
          provider: greeting.provider,
          model: greeting.model
        };
        setMessages([greetingMessage]);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        const fallbackMessage: Message = {
          id: '1',
          text: `Hello! I'm ${agent.name}, your ${agent.type.toLowerCase()} specialist. I'm here to provide expert assistance with ${agent.capabilities.join(', ')}. How can I help you today?`,
          sender: 'agent',
          timestamp: new Date(),
          provider: 'fallback'
        };
        setMessages([fallbackMessage]);
      }
    };

    initializeChat();
  }, [agent]);

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    
    const validation = validateMessage(trimmedMessage);
    if (!validation.isValid) {
      toast({
        title: "Invalid Input",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: validation.sanitizedInput!,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Haptic feedback on mobile
    if (isNative) {
      await hapticFeedback();
    }

    try {
      const aiResponse = await generateAIResponse(validation.sanitizedInput!, agent);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'agent',
        timestamp: new Date(),
        provider: aiResponse.provider,
        model: aiResponse.model
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again or check your AI provider configuration.",
        sender: 'agent',
        timestamp: new Date(),
        provider: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Response Error",
        description: "Failed to generate response. Please check your API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const availableProviders = getAvailableProviders();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{agent.avatar}</div>
            <div>
              <h1 className="text-lg font-semibold text-white">{agent.name}</h1>
              <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300">
                {agent.type}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {availableProviders.length > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">AI Ready</span>
              </div>
            )}
            
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
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  {message.sender === 'agent' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
                
                <Card className={`p-4 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' 
                    : 'bg-gray-800/70 backdrop-blur-sm border-purple-500/20 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.sender === 'user' ? 'text-purple-100' : 'text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                    {message.provider && message.sender === 'agent' && (
                      <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                        {message.provider}
                      </Badge>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <Card className="p-4 bg-gray-800/70 backdrop-blur-sm border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-sm text-gray-300">
                      {agent.name} is thinking...
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <div className="max-w-4xl mx-auto">
          {availableProviders.length === 0 && (
            <div className="mb-3 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⚠️ No AI providers configured. Click the settings button to add API keys for better responses.
              </p>
            </div>
          )}
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${agent.name}...`}
                className="border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500"
                disabled={isLoading}
                maxLength={5000}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatInterface;
