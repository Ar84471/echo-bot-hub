import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Agent {
  name: string;
  description: string;
  type: string;
  avatar: string;
  isActive: boolean;
  capabilities: string[];
}

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agent: Agent) => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ isOpen, onClose, onCreateAgent }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    avatar: '🤖'
  });
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapability, setNewCapability] = useState('');

  const agentTypes = [
    'Neural Assistant',
    'Code Architect',
    'Creative Synthesizer',
    'Data Analyst',
    'Research Engine',
    'Support Vector',
    'Logic Processor',
    'Content Generator'
  ];

  const avatarOptions = ['🤖', '🧠', '💻', '✍️', '📊', '🎯', '🔍', '💡', '🎨', '📚'];
  const suggestedCapabilities = [
    'Text Generation', 'Code Review', 'Data Analysis', 'Creative Writing', 
    'Problem Solving', 'Research', 'Translation', 'Summarization',
    'Email Writing', 'Planning', 'Brainstorming', 'Debugging'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCapability = (capability: string) => {
    if (capability && !capabilities.includes(capability)) {
      setCapabilities([...capabilities, capability]);
      setNewCapability('');
    }
  };

  const removeCapability = (capability: string) => {
    setCapabilities(capabilities.filter(c => c !== capability));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.type) {
      onCreateAgent({
        ...formData,
        capabilities,
        isActive: true
      });
      // Reset form
      setFormData({ name: '', description: '', type: '', avatar: '🤖' });
      setCapabilities([]);
      setNewCapability('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-purple-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Deploy New AI Agent</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-gray-800">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Agent Designation</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter agent designation"
                className="border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-300">Agent Classification</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)} required>
                <SelectTrigger className="border-purple-500/30 bg-gray-800 text-white">
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  {agentTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Neural Configuration</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Define the agent's specialized neural pathways and capabilities..."
              className="border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Avatar Interface</Label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => handleInputChange('avatar', avatar)}
                  className={`w-12 h-12 rounded-lg border-2 text-xl hover:bg-gray-800 transition-colors ${
                    formData.avatar === avatar ? 'border-purple-500 bg-purple-900/50' : 'border-purple-500/30'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300">Neural Capabilities</Label>
            <div className="flex space-x-2">
              <Input
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                placeholder="Add neural capability"
                className="border-purple-500/30 bg-gray-800 text-white placeholder:text-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability(newCapability))}
              />
              <Button 
                type="button" 
                onClick={() => addCapability(newCapability)}
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Suggested neural pathways:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedCapabilities.map((capability) => (
                  <button
                    key={capability}
                    type="button"
                    onClick={() => addCapability(capability)}
                    className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-purple-300 rounded-md transition-colors border border-purple-500/20"
                    disabled={capabilities.includes(capability)}
                  >
                    {capability}
                  </button>
                ))}
              </div>
            </div>

            {capabilities.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">Active neural pathways:</p>
                <div className="flex flex-wrap gap-2">
                  {capabilities.map((capability) => (
                    <Badge key={capability} variant="secondary" className="cursor-pointer hover:bg-red-900/50 bg-purple-900/50 text-purple-300">
                      {capability}
                      <button
                        type="button"
                        onClick={() => removeCapability(capability)}
                        className="ml-1 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
            >
              Deploy Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentModal;
