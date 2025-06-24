
import React, { useState } from 'react';
import { Plus, Settings, Zap, Code, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { availableIntegrations } from '@/data/integrations';
import { Integration } from '@/types/integrations';
import IntegrationCard from './IntegrationCard';
import AutomationBuilder from './AutomationBuilder';
import APIPlayground from './APIPlayground';
import WebhookManager from './WebhookManager';

const IntegrationHub: React.FC = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([]);

  const handleConnect = (integration: Integration) => {
    console.log('Connecting to:', integration.name);
    // Update integration status
    const updatedIntegration = { ...integration, isConnected: true };
    setConnectedIntegrations(prev => [...prev.filter(i => i.id !== integration.id), updatedIntegration]);
  };

  const handleDisconnect = (integrationId: string) => {
    setConnectedIntegrations(prev => prev.filter(i => i.id !== integrationId));
  };

  const productivityIntegrations = availableIntegrations.filter(i => i.category === 'productivity');
  const automationIntegrations = availableIntegrations.filter(i => i.category === 'automation');
  const socialIntegrations = availableIntegrations.filter(i => i.category === 'social');

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Integration Hub</h1>
          <p className="text-gray-400 mt-2">Connect your favorite tools and automate workflows</p>
        </div>
        <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
          {connectedIntegrations.length} Connected
        </Badge>
      </div>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            API Playground
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="w-4 h-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* Connected Integrations */}
          {connectedIntegrations.length > 0 && (
            <Card className="bg-gray-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Connected Integrations
                </CardTitle>
                <CardDescription>Manage your active connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedIntegrations.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Productivity Tools */}
          <Card className="bg-gray-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Productivity Tools</CardTitle>
              <CardDescription>Connect to your essential work applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productivityIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Automation Tools */}
          <Card className="bg-gray-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Automation & Workflows</CardTitle>
              <CardDescription>Automate repetitive tasks and create workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automationIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="bg-gray-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Social Media & Communication</CardTitle>
              <CardDescription>Connect to social platforms and messaging tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <AutomationBuilder connectedIntegrations={connectedIntegrations} />
        </TabsContent>

        <TabsContent value="api">
          <APIPlayground />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;
