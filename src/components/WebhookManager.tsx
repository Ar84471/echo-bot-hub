
import React, { useState } from 'react';
import { Plus, Trash2, Copy, Webhook, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  createdAt: string;
  lastTriggered?: string;
}

const WebhookManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  const createWebhook = () => {
    if (!webhookName || !webhookUrl) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newWebhook: WebhookEndpoint = {
      id: Date.now().toString(),
      name: webhookName,
      url: webhookUrl,
      events: ['agent_response', 'user_message', 'automation_triggered'],
      createdAt: new Date().toISOString(),
    };

    setWebhooks(prev => [...prev, newWebhook]);
    setWebhookName('');
    setWebhookUrl('');
    setShowCreateForm(false);

    toast({
      title: "Webhook Created",
      description: `${webhookName} webhook has been registered`,
    });
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Webhook Deleted",
      description: "Webhook has been removed",
    });
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied",
      description: "Webhook URL copied to clipboard",
    });
  };

  const testWebhook = async (webhook: WebhookEndpoint) => {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          event: 'webhook_test',
          timestamp: new Date().toISOString(),
          data: {
            message: 'Test webhook from NeuralForge AI Platform'
          }
        }),
      });

      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id 
          ? { ...w, lastTriggered: new Date().toISOString() }
          : w
      ));

      toast({
        title: "Webhook Tested",
        description: "Test payload sent successfully",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not reach webhook endpoint",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Webhook Manager</h2>
          <p className="text-gray-400">Configure webhooks for real-time notifications</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-gray-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Create New Webhook</CardTitle>
            <CardDescription>Add a webhook endpoint to receive real-time notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhook-name" className="text-white">Webhook Name</Label>
              <Input
                id="webhook-name"
                value={webhookName}
                onChange={(e) => setWebhookName(e.target.value)}
                placeholder="My API Webhook"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="webhook-url" className="text-white">Endpoint URL</Label>
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-api.com/webhooks/neuralforge"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createWebhook} className="bg-green-600 hover:bg-green-700">
                Create Webhook
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

      {webhooks.length === 0 && !showCreateForm && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="py-8 text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-lg font-medium text-white mb-2">No Webhooks Configured</h3>
            <p className="text-gray-400 mb-4">Add webhooks to receive real-time notifications</p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
              Add Your First Webhook
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Webhook className="w-5 h-5" />
                    {webhook.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-sm">{webhook.url}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => testWebhook(webhook)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyWebhookUrl(webhook.url)}
                    className="border-gray-600 text-gray-300"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteWebhook(webhook.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="outline" className="border-purple-500/30 text-purple-300">
                      {event}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  {webhook.lastTriggered ? (
                    <>Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}</>
                  ) : (
                    <>Created: {new Date(webhook.createdAt).toLocaleDateString()}</>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Webhook Documentation */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Webhook Events</CardTitle>
          <CardDescription>Events that will trigger your webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { event: 'agent_response', description: 'Triggered when an AI agent responds to a user' },
              { event: 'user_message', description: 'Triggered when a user sends a message' },
              { event: 'automation_triggered', description: 'Triggered when an automation runs' },
              { event: 'agent_created', description: 'Triggered when a new agent is created' },
              { event: 'integration_connected', description: 'Triggered when an integration is connected' },
            ].map((item) => (
              <div key={item.event} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <div>
                  <code className="text-purple-400 font-mono text-sm">{item.event}</code>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookManager;
