import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, MoreVertical, Bot, Mic, MicOff, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { saveChatSession, loadChatSession } from '@/utils/storage';
import { generateAIResponse, getTypingDelay } from '@/utils/aiResponses';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { searchWeb, generateEnhancedResponse } from '@/utils/informationRetrieval';

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

interface ChatInterfaceProps {
  agent: Agent;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add entrance animation delay
    const timer = setTimeout(() => setIsLoaded(true), 150);
    
    // Load existing chat session or create initial greeting
    const existingSession = loadChatSession(agent.id);
    
    if (existingSession && existingSession.messages.length > 0) {
      // Convert string dates back to Date objects
      const messagesWithDates = existingSession.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithDates);
    } else {
      // Create initial greeting message
      const greetingMessage: Message = {
        id: '1',
        text: generateAIResponse(agent, '', true),
        sender: 'agent',
        timestamp: new Date(),
        agentId: agent.id
      };
      setMessages([greetingMessage]);
      
      // Save initial session
      saveChatSession({
        agentId: agent.id,
        messages: [greetingMessage],
        lastUpdated: new Date()
      });
    }

    return () => clearTimeout(timer);
  }, [agent]);

  const saveCurrentSession = (newMessages: Message[]) => {
    saveChatSession({
      agentId: agent.id,
      messages: newMessages,
      lastUpdated: new Date()
    });
  };

  const [isSearching, setIsSearching] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(true); // Default to true for web search
  
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioUrl,
    duration,
    error: recordingError
  } = useAudioRecording();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      agentId: agent.id
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    // Save user message immediately
    saveCurrentSession(newMessages);

    try {
      let aiResponseText: string;
      
      // Always search web for real information
      setIsSearching(true);
      const searchResults = await searchWeb(userMessage.text);
      setIsSearching(false);
      aiResponseText = await generateEnhancedResponse(userMessage.text, agent, searchResults);

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'agent',
        timestamp: new Date(),
        agentId: agent.id
      };

      const finalMessages = [...newMessages, agentMessage];
      setMessages(finalMessages);
      setIsTyping(false);
      
      // Save complete conversation
      saveCurrentSession(finalMessages);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsTyping(false);
      setIsSearching(false);
      
      // Provide fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again with a different question or check your internet connection.",
        sender: 'agent',
        timestamp: new Date(),
        agentId: agent.id
      };
      
      const finalMessages = [...newMessages, fallbackMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);
      
      toast({
        title: "Connection Issue",
        description: "There was a problem generating the response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        // In a real implementation, you'd convert speech to text here
        toast({
          title: "Recording Complete",
          description: "Voice message recorded successfully. Speech-to-text conversion would happen here.",
        });
      }
    } else {
      await startRecording();
    }
  };

  const handleDownloadConversation = () => {
    const conversationText = messages.map(msg => 
      `[${formatTime(msg.timestamp)}] ${msg.sender === 'user' ? 'You' : agent.name}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${agent.name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Conversation Downloaded",
      description: "Your conversation has been saved as a text file.",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearChat = () => {
    const greetingMessage: Message = {
      id: Date.now().toString(),
      text: generateAIResponse(agent, '', true),
      sender: 'agent',
      timestamp: new Date(),
      agentId: agent.id
    };
    
    setMessages([greetingMessage]);
    saveCurrentSession([greetingMessage]);
    
    toast({
      title: "Chat Cleared",
      description: "Conversation history has been reset.",
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex flex-col transition-all duration-500 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-gray-800 text-gray-300 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="text-2xl animate-pulse">{agent.avatar}</div>
                <div>
                  <h1 className="text-lg font-semibold text-white">{agent.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300">
                      {agent.type}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                      <span className="text-xs text-gray-400">
                        {agent.isActive ? 'Web Search Enabled' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Enhanced Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUseWebSearch(!useWebSearch)}
                className={`transition-all duration-200 ${useWebSearch ? 'text-blue-400 bg-blue-900/30' : 'text-gray-400 hover:text-white'}`}
                title="Toggle web search"
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownloadConversation}
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                title="Download conversation"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearChat}
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
              >
                Clear
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex animate-fade-in ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
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
                
                <Card className={`p-4 transition-all duration-200 hover:scale-105 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-500/20' 
                    : 'bg-gray-800/70 backdrop-blur-sm border-purple-500/20 text-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <p className="text-sm whitespace-pre-wrap flex-1">{message.text}</p>
                  </div>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </Card>
              </div>
            </div>
          ))}

          {(isTyping || isSearching) && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex space-x-3 max-w-[70%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center text-white text-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <Card className="p-4 bg-gray-800/70 backdrop-blur-sm border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {isSearching ? 'Searching the web...' : 'Analyzing information...'}
                    </span>
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
            {/* Recording Status */}
            {isRecording && (
              <div className="mb-3 flex items-center justify-center space-x-2 text-red-400">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording... {duration.toFixed(1)}s</span>
              </div>
            )}
            
            {recordingError && (
              <div className="mb-3 text-center text-red-400 text-sm">
                {recordingError}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask ${agent.name} anything... (Web search enabled for real-time information)`}
                  className="pr-20 border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500 transition-all duration-200 focus:ring-purple-500"
                  disabled={isTyping || isRecording}
                  maxLength={500}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className={`transition-all duration-200 ${isRecording ? 'text-red-400 bg-red-900/30' : 'text-gray-400 hover:text-white'}`}
                    title={isRecording ? 'Stop recording' : 'Start voice recording'}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    disabled
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || isRecording}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 transition-all duration-200 hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            
            <div className="flex items-center justify-center mt-3">
              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span>Features:</span>
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                  Web Search ACTIVE
                </Badge>
                <span>|</span>
                <span>Capabilities:</span>
                {agent.capabilities.slice(0, 2).map((capability, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    {capability}
                  </Badge>
                ))}
                {agent.capabilities.length > 2 && (
                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    +{agent.capabilities.length - 2} more
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
