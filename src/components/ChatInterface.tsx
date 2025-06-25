
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, MoreVertical, Bot, Mic, MicOff, Search, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { saveChatSession, loadChatSession } from '@/utils/storage';
import { generateAIResponse } from '@/utils/aiResponses';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { searchWeb, generateEnhancedResponse } from '@/utils/informationRetrieval';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { validateMessage, validateAgent } from '@/utils/inputValidation';
import { handleError, createFallbackResponse, withErrorHandling } from '@/utils/errorHandler';
import MobileChatInterface from './MobileChatInterface';
import ErrorBoundary from './ErrorBoundary';

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
  hasError?: boolean;
}

interface ChatInterfaceProps {
  agent: Agent;
  agents?: Agent[];
  onBack: () => void;
  onSwitchAgent?: (agent: Agent) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  agent, 
  agents = [], 
  onBack, 
  onSwitchAgent 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isNative, isOffline, saveOfflineData } = useMobileFeatures();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const timer = setTimeout(() => setIsLoaded(true), 150);
        
        // Validate agent before proceeding
        if (!validateAgent(agent)) {
          throw new Error('Invalid agent configuration');
        }

        // Load existing session or create greeting
        const existingSession = await withErrorHandling(
          () => Promise.resolve(loadChatSession(agent.id)),
          'loading chat session',
          null
        );
        
        if (existingSession && existingSession.messages.length > 0) {
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
          
          await withErrorHandling(
            () => Promise.resolve(saveChatSession({
              agentId: agent.id,
              messages: [greetingMessage],
              lastUpdated: new Date()
            })),
            'saving initial chat session'
          );
        }

        clearTimeout(timer);
      } catch (error) {
        handleError(error, 'chat initialization');
        // Provide fallback greeting even if initialization fails
        const fallbackGreeting: Message = {
          id: '1',
          text: `Hello! I'm ${agent.name}. I'm here to help with ${agent.type.toLowerCase()} tasks. How can I assist you today?`,
          sender: 'agent',
          timestamp: new Date(),
          agentId: agent.id
        };
        setMessages([fallbackGreeting]);
      }
    };

    initializeChat();
  }, [agent]);

  const saveCurrentSession = async (newMessages: Message[]) => {
    await withErrorHandling(
      () => Promise.resolve(saveChatSession({
        agentId: agent.id,
        messages: newMessages,
        lastUpdated: new Date()
      })),
      'saving chat session'
    );
  };

  const [isSearching, setIsSearching] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false); // Disabled by default for reliability
  
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioUrl,
    duration,
    error: recordingError
  } = useAudioRecording();

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    
    // Validate input
    const validation = validateMessage(textToSend);
    if (!validation.isValid) {
      toast({
        title: "Invalid Input",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    if (isTyping) {
      return;
    }

    const sanitizedText = validation.sanitizedInput!;
    setLastError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: sanitizedText,
      sender: 'user',
      timestamp: new Date(),
      agentId: agent.id
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!messageText) setInputMessage('');
    setIsTyping(true);

    await saveCurrentSession(newMessages);

    // Handle offline mode
    if (isOffline) {
      try {
        await saveOfflineData(`pending_message_${Date.now()}`, {
          text: sanitizedText,
          agentId: agent.id,
          timestamp: new Date()
        });
        
        const offlineMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm currently offline, but I'll respond as soon as I'm back online. Your message has been saved.",
          sender: 'agent',
          timestamp: new Date(),
          agentId: agent.id
        };
        
        const finalMessages = [...newMessages, offlineMessage];
        setMessages(finalMessages);
        setIsTyping(false);
        await saveCurrentSession(finalMessages);
        return;
      } catch (error) {
        handleError(error, 'offline message handling');
      }
    }

    // Generate AI response with comprehensive error handling
    try {
      let aiResponseText: string;
      
      // Use basic response generation for reliability
      aiResponseText = generateAIResponse(agent, sanitizedText);

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
      setRetryCount(0); // Reset retry count on success
      
      await saveCurrentSession(finalMessages);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsTyping(false);
      setIsSearching(false);
      setRetryCount(prev => prev + 1);
      
      // Create fallback response
      const fallbackText = createFallbackResponse(agent, sanitizedText);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackText,
        sender: 'agent',
        timestamp: new Date(),
        agentId: agent.id,
        hasError: true
      };
      
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      await saveCurrentSession(finalMessages);
      setLastError("Failed to generate response. Please try again.");
    }
  };

  // Use mobile interface if on native platform or small screen
  if (isNative || window.innerWidth < 768) {
    return (
      <ErrorBoundary>
        <MobileChatInterface
          agent={agent}
          agents={agents}
          messages={messages}
          onBack={onBack}
          onSwitchAgent={onSwitchAgent || (() => {})}
          onSendMessage={handleSendMessage}
        />
      </ErrorBoundary>
    );
  }

  const handleVoiceRecording = async () => {
    try {
      if (isRecording) {
        const audioBlob = await stopRecording();
        if (audioBlob) {
          toast({
            title: "Recording Complete",
            description: "Voice message recorded successfully. Speech-to-text conversion would happen here.",
          });
        }
      } else {
        await startRecording();
      }
    } catch (error) {
      handleError(error, 'voice recording');
    }
  };

  const handleDownloadConversation = () => {
    try {
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
    } catch (error) {
      handleError(error, 'downloading conversation');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearChat = async () => {
    try {
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: generateAIResponse(agent, '', true),
        sender: 'agent',
        timestamp: new Date(),
        agentId: agent.id
      };
      
      setMessages([greetingMessage]);
      await saveCurrentSession([greetingMessage]);
      setLastError(null);
      setRetryCount(0);
      
      toast({
        title: "Chat Cleared",
        description: "Conversation history has been reset.",
      });
    } catch (error) {
      handleError(error, 'clearing chat');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSendMessage();
    } catch (error) {
      handleError(error, 'sending message');
    }
  };

  const handleRetryLastMessage = async () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.sender === 'user') {
        // Remove the last agent message and retry
        const messagesWithoutLastAgent = messages.slice(0, -1);
        setMessages(messagesWithoutLastAgent);
        await handleSendMessage(lastUserMessage.text);
      }
    }
  };

  return (
    <ErrorBoundary>
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
                          {agent.isActive ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      {lastError && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">Connection Issues</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">                
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
                {lastError && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRetryLastMessage}
                    className="text-yellow-400 hover:text-white hover:bg-yellow-800/30 transition-all duration-200"
                    title="Retry last message"
                  >
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {lastError && (
          <div className="bg-red-900/30 border-b border-red-500/30 p-3">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-sm">{lastError}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLastError(null)}
                className="text-red-300 hover:text-white"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${message.hasError ? 'bg-red-600' : 'bg-gradient-to-r from-purple-600 to-violet-600'}`}>
                        {message.hasError ? <AlertTriangle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
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
                      : message.hasError
                      ? 'bg-red-900/30 border-red-500/30 text-white'
                      : 'bg-gray-800/70 backdrop-blur-sm border-purple-500/20 text-white'
                  }`}>
                    <div className="flex items-start justify-between">
                      <p className="text-sm whitespace-pre-wrap flex-1">{message.text}</p>
                    </div>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-purple-100' : 
                      message.hasError ? 'text-red-300' : 'text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                      {message.hasError && (
                        <span className="ml-2 text-red-300">• Error occurred</span>
                      )}
                    </p>
                  </Card>
                </div>
              </div>
            ))}

            {isTyping && (
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
                        {agent.name} is thinking...
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

              <form onSubmit={handleFormSubmit} className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Ask ${agent.name} anything...`}
                    className="pr-20 border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500 transition-all duration-200 focus:ring-purple-500"
                    disabled={isTyping || isRecording}
                    maxLength={5000}
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
                  <span>Agent:</span>
                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    {agent.name}
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
    </ErrorBoundary>
  );
};

export default ChatInterface;
