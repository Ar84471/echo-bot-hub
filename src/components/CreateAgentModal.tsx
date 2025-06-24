
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  avatar: string;
  capabilities: string[];
  prompt: string;
}

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agent: Agent) => void;
  templates: AgentTemplate[];
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onCreateAgent,
  templates
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');

  const handleCreateAgent = () => {
    if (!selectedTemplate || !agentName.trim()) return;

    const newAgent: Agent = {
      id: Date.now().toString(),
      name: agentName.trim(),
      description: agentDescription.trim() || selectedTemplate.description,
      type: selectedTemplate.type,
      avatar: selectedTemplate.avatar,
      isActive: true,
      lastUsed: new Date().toISOString(),
      capabilities: selectedTemplate.capabilities,
    };

    onCreateAgent(newAgent);
    setSelectedTemplate(null);
    setAgentName('');
    setAgentDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-800 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-white">Create New AI Agent</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!selectedTemplate ? (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Choose a Template</h3>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{template.avatar}</span>
                        <div>
                          <h4 className="font-medium text-white">{template.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {template.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.capabilities.slice(0, 3).map((capability, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedTemplate(null)}
                className="text-purple-400 hover:text-purple-300"
              >
                ← Back to Templates
              </Button>
              
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{selectedTemplate.avatar}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedTemplate.name}</h3>
                  <Badge variant="secondary">{selectedTemplate.type}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Name *
                  </label>
                  <Input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter agent name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder={selectedTemplate.description}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Capabilities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAgent}
                  disabled={!agentName.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Agent
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentModal;
