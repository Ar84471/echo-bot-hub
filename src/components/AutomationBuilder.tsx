
import React, { useState } from 'react';
import { Plus, Play, Pause, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Integration, AutomationTrigger } from '@/types/integrations';
import { useToast } from '@/hooks/use-toast';

interface AutomationBuilderProps {
  connectedIntegrations: Integration[];
}

const AutomationBuilder: React.FC<AutomationBuilderProps> = ({ connectedIntegrations }) => {
  const [automations, setAutomations] = useState<AutomationTrigger[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  const createZapierAutomation = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    const newAutomation: AutomationTrigger = {
      id: Date.now().toString(),
      name: 'Zapier Webhook Trigger',
      description: 'Triggers your Zapier workflow when agent responds',
      integration: 'zapier',
      event: 'agent_response',
      actions: [{
        id: '1',
        type: 'webhook',
        config: { url: webhookUrl }
      }],
      isActive: true
    };

    setAutomations(prev => [...prev, newAutomation]);
    setWebhookUrl('');
    setShowCreateForm(false);
    
    toast({
      title: "Automation Created",
      description: "Your Zapier webhook automation is now active",
    });
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id ? { ...auto, isActive: !auto.isActive } : auto
    ));
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(auto => auto.id !== id));
  };

  const triggerWebhook = async (automation: AutomationTrigger) => {
    const webhookAction = automation.actions.find(action => action.type === 'webhook');
    if (!webhookAction) return;

    try {
      await fetch(webhookAction.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          trigger: automation.event,
          source: 'NeuralForge AI'
        }),
      });

      toast({
        title: "Webhook Triggered",
        description: "Your automation has been executed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger webhook automation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Automation Builder</h2>
          <p className="text-gray-400">Create Zapier-style automation workflows</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-gray-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Create Zapier Integration</CardTitle>
            <CardDescription>Connect your AI agent to Zapier workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhook-url" className="text-white">Zapier Webhook URL</Label>
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="bg-gray-900 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Create a webhook trigger in Zapier and paste the URL here
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={createZapierAutomation} className="bg-green-600 hover:bg-green-700">
                Create Automation
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {automations.length === 0 && !showCreateForm && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="py-8 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-medium text-white mb-2">No Automations Yet</h3>
            <p className="text-gray-400 mb-4">Create your first automation to get started</p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
              Create Your First Automation
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{automation.name}</CardTitle>
                  <CardDescription>{automation.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={automation.isActive ? "default" : "secondary"}
                    className={automation.isActive ? "bg-green-900/50 text-green-300" : "bg-gray-700 text-gray-300"}
                  >
                    {automation.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch
                    checked={automation.isActive}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">
                    Trigger: <span className="text-white">{automation.event}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Actions: <span className="text-white">{automation.actions.length}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => triggerWebhook(automation)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteAutomation(automation.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationBuilder;
