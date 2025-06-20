import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, MoreVertical, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
}

interface ChatInterfaceProps {
  agent: Agent;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Neural connection established. I'm ${agent.name}. ${agent.description} How may I process your request?`,
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Processing your request through neural pathways. Analyzing optimal solution vectors...",
        "Neural networks activated. Cross-referencing data matrices for comprehensive response...",
        "Engaging advanced cognitive algorithms. Synthesizing multi-dimensional analysis...",
        "Quantum processing initiated. Generating optimal response framework...",
        "Neural interface synchronized. Deploying specialized knowledge matrices...",
        "Cognitive engines online. Processing through advanced neural architectures..."
      ];

      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-gray-800 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{agent.avatar}</div>
                <div>
                  <h1 className="text-lg font-semibold text-white">{agent.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300">
                      {agent.type}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      <span className="text-xs text-gray-400">
                        {agent.isActive ? 'Neural Link Active' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  {message.sender === 'agent' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center text-white text-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-sm font-medium">
                      U
                    </div>
                  )}
                </div>
                
                <Card className={`p-4 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-500/20' 
                    : 'bg-gray-800/70 backdrop-blur-sm border-purple-500/20 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-2 ${
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
              <div className="flex space-x-3 max-w-[70%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center text-white text-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <Card className="p-4 bg-gray-800/70 backdrop-blur-sm border-purple-500/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Transmit to ${agent.name}...`}
                  className="pr-12 border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500"
                  disabled={isTyping}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            
            <div className="flex items-center justify-center mt-3">
              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span>Neural capabilities:</span>
                {agent.capabilities.slice(0, 3).map((capability, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    {capability}
                  </Badge>
                ))}
                {agent.capabilities.length > 3 && (
                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    +{agent.capabilities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
