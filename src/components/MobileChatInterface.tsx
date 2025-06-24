
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, MoreVertical, Bot, Wifi, WifiOff, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import AgentSwitcher from './AgentSwitcher';

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
  agent: Agent;
  agents: Agent[];
  messages: Message[];
  onBack: () => void;
  onSwitchAgent: (agent: Agent) => void;
  onSendMessage: (message: string) => void;
}

const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({
  agent,
  agents,
  messages,
  onBack,
  onSwitchAgent,
  onSendMessage
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    isNative,
    isOffline,
    pushNotificationsEnabled,
    hapticFeedback,
    saveOfflineData,
    getOfflineData,
    requestPushNotifications,
    sendLocalNotification
  } = useMobileFeatures();

  const {
    isRecording,
    startRecording,
    stopRecording,
    duration,
    error: recordingError
  } = useAudioRecording();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages offline
  useEffect(() => {
    if (isNative && messages.length > 0) {
      saveOfflineData(`messages_${agent.id}`, messages);
    }
  }, [messages, agent.id, isNative, saveOfflineData]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    await hapticFeedback();
    
    // Save message offline if needed
    if (isOffline) {
      await saveOfflineData(`pending_message_${Date.now()}`, {
        text: inputMessage,
        agentId: agent.id,
        timestamp: new Date()
      });
      
      toast({
        title: "Message Saved Offline",
        description: "Your message will be sent when you're back online.",
      });
    } else {
      onSendMessage(inputMessage);
    }
    
    setInputMessage('');
  };

  const handleVoiceToggle = async () => {
    await hapticFeedback();
    
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        // In a real app, you'd convert speech to text here
        toast({
          title: "Voice Message Recorded",
          description: "Voice-to-text conversion would process this audio.",
        });
      }
    } else {
      setIsVoiceMode(!isVoiceMode);
      if (!isVoiceMode) {
        await startRecording();
      }
    }
  };

  const handleNotificationToggle = async () => {
    await hapticFeedback();
    
    if (!pushNotificationsEnabled) {
      const granted = await requestPushNotifications();
      if (granted) {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive updates about your agents.",
        });
      }
    } else {
      toast({
        title: "Notifications",
        description: "Push notifications are already enabled.",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-black/95 backdrop-blur-sm border-b border-purple-500/20 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-gray-800 text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotificationToggle}
              className={`${pushNotificationsEnabled ? 'text-green-400' : 'text-gray-400'}`}
            >
              {pushNotificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </Button>
            
            <div className="flex items-center space-x-1">
              {isOffline ? (
                <WifiOff className="w-4 h-4 text-red-400" />
              ) : (
                <Wifi className="w-4 h-4 text-green-400" />
              )}
            </div>
            
            <Button variant="ghost" size="sm" className="text-gray-400">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Agent Switcher */}
        <AgentSwitcher
          agents={agents}
          currentAgent={agent}
          onSwitchAgent={onSwitchAgent}
        />
        
        {isOffline && (
          <div className="mt-2 px-3 py-2 bg-yellow-900/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-300">Offline Mode - Messages will sync when online</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
                
                <Card className={`p-3 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' 
                    : 'bg-gray-800/70 text-white'
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Voice Mode Indicator */}
      {isVoiceMode && (
        <div className="px-4 py-2 bg-blue-900/50 border-t border-blue-500/20">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-300 text-sm">
              {isRecording ? `Recording... ${duration.toFixed(1)}s` : 'Voice mode active'}
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-black/95 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isVoiceMode ? "Tap mic to speak..." : `Message ${agent.name}...`}
              className="pr-12 border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500"
              disabled={isVoiceMode && isRecording}
              maxLength={500}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVoiceToggle}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                isVoiceMode || isRecording ? 'text-red-400 bg-red-900/30' : 'text-gray-400'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={!inputMessage.trim() || (isVoiceMode && !isRecording)}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {/* Mobile Features Status */}
        <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-400">
          {isNative && (
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              Native App
            </Badge>
          )}
          {isOffline ? (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
              Offline
            </Badge>
          ) : (
            <Badge variant="outline" className="border-green-500/30 text-green-300">
              Online
            </Badge>
          )}
          {pushNotificationsEnabled && (
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              Notifications ON
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileChatInterface;
