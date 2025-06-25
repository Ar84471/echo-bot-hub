
import React, { useState } from 'react';
import { FileText, Database, Link2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface NotionIntegrationProps {
  onConnect: () => void;
  isConnected: boolean;
}

const NotionIntegration: React.FC<NotionIntegrationProps> = ({ onConnect, isConnected }) => {
  const [notionToken, setNotionToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [databases, setDatabases] = useState<any[]>([]);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!notionToken.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter your Notion integration token.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate API call to Notion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      setDatabases([
        {
          id: 'db1',
          title: 'Project Tasks',
          type: 'database',
          properties: ['Name', 'Status', 'Due Date', 'Priority']
        },
        {
          id: 'db2',
          title: 'Meeting Notes',
          type: 'database',
          properties: ['Title', 'Date', 'Attendees', 'Action Items']
        },
        {
          id: 'db3',
          title: 'Knowledge Base',
          type: 'database',
          properties: ['Topic', 'Category', 'Tags', 'Last Updated']
        }
      ]);
      
      onConnect();
      
      toast({
        title: "Connected to Notion!",
        description: "Successfully connected to your Notion workspace. You can now sync data and create pages.",
      });
      
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Notion. Please check your token and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreatePage = async (databaseId: string) => {
    try {
      // Simulate creating a new page
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Page Created",
        description: "New page created successfully in your Notion database.",
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create page in Notion.",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gray-800/50 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Connect to Notion</CardTitle>
              <CardDescription>
                Sync your AI agents with Notion databases and pages
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Notion Integration Token
            </label>
            <Input
              type="password"
              placeholder="secret_..."
              value={notionToken}
              onChange={(e) => setNotionToken(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              Create an integration at notion.so/my-integrations and copy the token
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleConnect}
              disabled={isConnecting || !notionToken.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isConnecting ? 'Connecting...' : 'Connect to Notion'}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://notion.so/my-integrations', '_blank')}
              className="border-gray-600 text-gray-300"
            >
              Get Token
            </Button>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">What you can do with Notion:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Create and update pages automatically</li>
              <li>• Sync AI insights to your databases</li>
              <li>• Generate content based on Notion data</li>
              <li>• Automate workflows between AI and Notion</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-white">Notion Connected</CardTitle>
                <CardDescription>
                  Successfully connected to your Notion workspace
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-900/50 text-green-300">
              Active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gray-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Available Databases
          </CardTitle>
          <CardDescription>
            Databases you can sync with your AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {databases.map((db) => (
              <div
                key={db.id}
                className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="font-medium text-white">{db.title}</h4>
                    <p className="text-sm text-gray-400">
                      {db.properties.length} properties: {db.properties.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreatePage(db.id)}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-900/30"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Page
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    <Link2 className="w-4 h-4 mr-1" />
                    Sync
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you can perform with your connected Notion workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 border-purple-500/30 text-left"
              onClick={() => toast({ title: "Feature Coming Soon", description: "AI-powered page generation will be available soon!" })}
            >
              <div>
                <h4 className="font-medium text-white">Generate Page from Chat</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Create Notion pages from your AI conversations
                </p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 border-purple-500/30 text-left"
              onClick={() => toast({ title: "Feature Coming Soon", description: "Database sync will be available soon!" })}
            >
              <div>
                <h4 className="font-medium text-white">Sync Database</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Keep your Notion data in sync with AI insights
                </p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 border-purple-500/30 text-left"
              onClick={() => toast({ title: "Feature Coming Soon", description: "Template automation will be available soon!" })}
            >
              <div>
                <h4 className="font-medium text-white">Create Template</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Generate page templates based on AI analysis
                </p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 border-purple-500/30 text-left"
              onClick={() => toast({ title: "Feature Coming Soon", description: "Workflow automation will be available soon!" })}
            >
              <div>
                <h4 className="font-medium text-white">Setup Automation</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Automate workflows between AI and Notion
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotionIntegration;
