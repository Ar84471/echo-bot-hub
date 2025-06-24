
import React from 'react';
import { ExternalLink, CheckCircle, Settings, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Integration } from '@/types/integrations';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (integration: Integration) => void;
  onDisconnect: (integrationId: string) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect
}) => {
  const handleConnect = () => {
    if (integration.authUrl) {
      // Open OAuth flow in new window
      window.open(integration.authUrl, '_blank', 'width=600,height=600');
    }
    onConnect(integration);
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{integration.icon}</span>
            <div>
              <CardTitle className="text-white text-sm">{integration.name}</CardTitle>
              <Badge 
                variant={integration.isConnected ? "default" : "secondary"}
                className={integration.isConnected ? "bg-green-900/50 text-green-300" : "bg-gray-700 text-gray-300"}
              >
                {integration.isConnected ? 'Connected' : 'Available'}
              </Badge>
            </div>
          </div>
          {integration.isConnected && (
            <CheckCircle className="w-4 h-4 text-green-400" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-gray-400 text-xs mb-4">
          {integration.description}
        </CardDescription>
        <div className="flex gap-2">
          {integration.isConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Settings className="w-3 h-3 mr-1" />
                Configure
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDisconnect(integration.id)}
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                <Unplug className="w-3 h-3" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConnect}
              size="sm"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
