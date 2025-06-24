
import React, { useState } from 'react';
import { Send, Copy, Code, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const APIPlayground: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const apiEndpoints = [
    { path: '/api/agents', method: 'GET', description: 'List all agents' },
    { path: '/api/agents/{id}', method: 'GET', description: 'Get agent details' },
    { path: '/api/agents', method: 'POST', description: 'Create new agent' },
    { path: '/api/chat', method: 'POST', description: 'Send chat message' },
    { path: '/api/webhooks', method: 'POST', description: 'Register webhook' },
  ];

  const executeRequest = async () => {
    if (!endpoint) {
      toast({
        title: "Error",
        description: "Please enter an API endpoint",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const parsedHeaders = JSON.parse(headers);
      const requestConfig: RequestInit = {
        method,
        headers: parsedHeaders,
      };

      if (method !== 'GET' && body) {
        requestConfig.body = body;
      }

      const res = await fetch(endpoint, requestConfig);
      const responseText = await res.text();
      
      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: responseText
      };

      setResponse(JSON.stringify(responseData, null, 2));
      
      toast({
        title: "Request Completed",
        description: `${method} ${endpoint} - ${res.status}`,
      });
    } catch (error) {
      const errorResponse = {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
      setResponse(JSON.stringify(errorResponse, null, 2));
      
      toast({
        title: "Request Failed",
        description: "Check the response panel for details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    toast({
      title: "Copied",
      description: "Response copied to clipboard",
    });
  };

  const generateCurlCommand = () => {
    let curl = `curl -X ${method}`;
    
    try {
      const parsedHeaders = JSON.parse(headers);
      Object.entries(parsedHeaders).forEach(([key, value]) => {
        curl += ` -H "${key}: ${value}"`;
      });
    } catch (error) {
      // Ignore header parsing errors
    }

    if (method !== 'GET' && body) {
      curl += ` -d '${body}'`;
    }

    curl += ` "${endpoint}"`;
    return curl;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">API Playground</h2>
        <p className="text-gray-400">Test and explore API endpoints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Builder */}
        <Card className="bg-gray-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5" />
              Request Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-white">Headers</Label>
              <Textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder="JSON headers"
                className="bg-gray-900 border-gray-600 text-white font-mono text-sm"
              />
            </div>

            {method !== 'GET' && (
              <div>
                <Label className="text-white">Request Body</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="JSON request body"
                  className="bg-gray-900 border-gray-600 text-white font-mono text-sm"
                />
              </div>
            )}

            <Button
              onClick={executeRequest}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Response Panel */}
        <Card className="bg-gray-800/50 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-5 h-5" />
                Response
              </CardTitle>
              {response && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyResponse}
                  className="border-gray-600 text-gray-300"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {response ? (
              <Textarea
                value={response}
                readOnly
                className="bg-gray-900 border-gray-600 text-white font-mono text-sm min-h-[300px]"
              />
            ) : (
              <div className="bg-gray-900 border border-gray-600 rounded-md p-4 min-h-[300px] flex items-center justify-center">
                <p className="text-gray-400">Response will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Documentation */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Available Endpoints</CardTitle>
          <CardDescription>Quick reference for API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiEndpoints.map((api, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500/30 cursor-pointer"
                onClick={() => setEndpoint(`/api${api.path}`)}
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${
                      api.method === 'GET' ? 'border-blue-500 text-blue-400' :
                      api.method === 'POST' ? 'border-green-500 text-green-400' :
                      api.method === 'PUT' ? 'border-yellow-500 text-yellow-400' :
                      'border-red-500 text-red-400'
                    }`}
                  >
                    {api.method}
                  </Badge>
                  <code className="text-white font-mono text-sm">{api.path}</code>
                </div>
                <p className="text-gray-400 text-sm">{api.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* cURL Command */}
      {endpoint && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">cURL Command</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 border border-gray-600 rounded-md p-4">
              <code className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {generateCurlCommand()}
              </code>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default APIPlayground;
