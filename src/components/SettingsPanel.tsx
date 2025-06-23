
import React, { useState } from 'react';
import { Settings, Sun, Moon, CreditCard, User, Bell, Palette, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { credits, subscriptionTier, upgradeSubscription } = useSubscription();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  if (!isOpen) return null;

  const subscriptionPlans = [
    {
      name: 'Basic',
      price: '$9.99/month',
      credits: '500 credits/month',
      features: ['Priority support', 'Advanced AI models', 'Chat history'],
      tier: 'basic' as const
    },
    {
      name: 'Premium',
      price: '$19.99/month',
      credits: '1500 credits/month',
      features: ['All Basic features', 'Custom AI agents', 'API access', 'Advanced analytics'],
      tier: 'premium' as const
    },
    {
      name: 'Enterprise',
      price: '$49.99/month',
      credits: '5000 credits/month',
      features: ['All Premium features', 'White-label solution', 'Priority processing', '24/7 support'],
      tier: 'enterprise' as const
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Settings
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="subscription">Credits</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      <span>Dark Mode</span>
                    </div>
                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-save Conversations</span>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Current Credits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{credits}</div>
                    <Badge variant="secondary" className="mt-2">
                      {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.name} className={`${subscriptionTier === plan.tier ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant={subscriptionTier === plan.tier ? "default" : "outline"}>
                          {subscriptionTier === plan.tier ? "Current" : plan.price}
                        </Badge>
                      </div>
                      <CardDescription>{plan.credits}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1 mb-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {subscriptionTier !== plan.tier && (
                        <Button 
                          className="w-full" 
                          onClick={() => upgradeSubscription(plan.tier)}
                        >
                          Upgrade to {plan.name}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Style</label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Technical</option>
                      <option>Creative</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Length</label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      <option>Concise</option>
                      <option>Detailed</option>
                      <option>Comprehensive</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips & Hints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>💡 Pro Tip:</strong> Use specific keywords to get better responses from specialized AI agents.</p>
                    <p><strong>🎯 Best Practice:</strong> Start conversations with clear context and objectives.</p>
                    <p><strong>⚡ Quick Tip:</strong> Switch between agents mid-conversation for different perspectives.</p>
                    <p><strong>🔄 Efficiency:</strong> Save frequently used prompts as templates.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
