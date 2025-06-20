
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
    'General Assistant',
    'Developer Assistant',
    'Creative Assistant',
    'Business Assistant',
    'Research Assistant',
    'Customer Support',
    'Data Analyst',
    'Content Creator'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Create New AI Agent</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter agent name"
                className="border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Agent Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)} required>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this agent specializes in..."
              className="border-gray-300 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => handleInputChange('avatar', avatar)}
                  className={`w-12 h-12 rounded-lg border-2 text-xl hover:bg-gray-50 transition-colors ${
                    formData.avatar === avatar ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Capabilities</Label>
            <div className="flex space-x-2">
              <Input
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                placeholder="Add a capability"
                className="border-gray-300"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability(newCapability))}
              />
              <Button 
                type="button" 
                onClick={() => addCapability(newCapability)}
                variant="outline"
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Suggested capabilities:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedCapabilities.map((capability) => (
                  <button
                    key={capability}
                    type="button"
                    onClick={() => addCapability(capability)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    disabled={capabilities.includes(capability)}
                  >
                    {capability}
                  </button>
                ))}
              </div>
            </div>

            {capabilities.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected capabilities:</p>
                <div className="flex flex-wrap gap-2">
                  {capabilities.map((capability) => (
                    <Badge key={capability} variant="secondary" className="cursor-pointer hover:bg-red-100">
                      {capability}
                      <button
                        type="button"
                        onClick={() => removeCapability(capability)}
                        className="ml-1 text-red-500 hover:text-red-700"
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
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Create Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentModal;
