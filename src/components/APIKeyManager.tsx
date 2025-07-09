
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, Check, X } from 'lucide-react';
import { setAPIKey, getAvailableProviders } from '@/utils/aiProviders';
import { useToast } from '@/hooks/use-toast';

interface APIKeyManagerProps {
  onKeysUpdated?: () => void;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ onKeysUpdated }) => {
  const [keys, setKeys] = useState({
    claude: '',
    openai: '',
    gemini: ''
  });
  const [showKeys, setShowKeys] = useState({
    claude: false,
    openai: false,
    gemini: false
  });
  const { toast } = useToast();

  const providers = [
    { name: 'claude', label: 'Claude (Anthropic)', placeholder: 'sk-ant-...' },
    { name: 'openai', label: 'OpenAI GPT', placeholder: 'sk-...' },
    { name: 'gemini', label: 'Google Gemini', placeholder: 'AIza...' }
  ];

  const handleSaveKey = (provider: string) => {
    const key = keys[provider as keyof typeof keys];
    if (!key.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    setAPIKey(provider, key);
    toast({
      title: "Success",
      description: `${provider} API key saved successfully`,
    });
    
    if (onKeysUpdated) onKeysUpdated();
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider as keyof typeof prev]
    }));
  };

  const availableProviders = getAvailableProviders();

  return (
    <Card className="bg-gray-800/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Key className="w-5 h-5" />
          AI Provider Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-400">Active providers:</span>
          {availableProviders.length > 0 ? (
            availableProviders.map(provider => (
              <Badge key={provider} className="bg-green-900/50 text-green-300">
                <Check className="w-3 h-3 mr-1" />
                {provider}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
              <X className="w-3 h-3 mr-1" />
              No providers configured
            </Badge>
          )}
        </div>

        {providers.map(provider => (
          <div key={provider.name} className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {provider.label}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKeys[provider.name as keyof typeof showKeys] ? "text" : "password"}
                  placeholder={provider.placeholder}
                  value={keys[provider.name as keyof typeof keys]}
                  onChange={(e) => setKeys(prev => ({
                    ...prev,
                    [provider.name]: e.target.value
                  }))}
                  className="border-purple-500/30 bg-gray-800 text-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => toggleShowKey(provider.name)}
                >
                  {showKeys[provider.name as keyof typeof showKeys] ? 
                    <EyeOff className="w-4 h-4" /> : 
                    <Eye className="w-4 h-4" />
                  }
                </Button>
              </div>
              <Button
                onClick={() => handleSaveKey(provider.name)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Save
              </Button>
            </div>
          </div>
        ))}

        <div className="text-xs text-gray-400 space-y-1">
          <p>• API keys are stored locally in your browser</p>
          <p>• Multiple providers ensure reliability and fallback options</p>
          <p>• Configure at least one provider for AI responses</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyManager;
