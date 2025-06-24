
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Moon, Sun, Bell, Shield, Database } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-purple-500/30 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Dark Mode</div>
                  <div className="text-sm text-gray-400">Use dark theme</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Compact Mode</div>
                  <div className="text-sm text-gray-400">Reduce spacing and padding</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-400">Receive notifications on mobile</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-400">Get updates via email</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Analytics</div>
                  <div className="text-sm text-gray-400">Help improve the app</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Data Encryption</div>
                  <div className="text-sm text-gray-400">Encrypt local data</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Data */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto-save Conversations</div>
                  <div className="text-sm text-gray-400">Automatically save chat history</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  Export Chat History
                </Button>
                <Button variant="outline" className="w-full border-red-600 text-red-400 hover:bg-red-900/20">
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-white font-semibold">NeuralForge AI</h3>
                <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                  Version 1.0.0
                </Badge>
                <p className="text-sm text-gray-400">
                  Your AI-powered assistant hub
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
