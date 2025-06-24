
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, MessageSquare, Zap, Settings } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to NeuralForge AI",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white">Your AI-Powered Assistant Hub</h3>
          <p className="text-gray-400">
            Create, customize, and deploy intelligent AI agents for any task. 
            From coding to creative writing, analytics to automation.
          </p>
        </div>
      )
    },
    {
      title: "Multiple AI Agents",
      content: (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <Brain className="w-16 h-16 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-white text-center">Specialized AI Agents</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">👨‍💻</div>
                <div className="text-sm text-white">CodeForge</div>
                <div className="text-xs text-gray-400">Development</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">🎨</div>
                <div className="text-sm text-white">Muse</div>
                <div className="text-xs text-gray-400">Creative</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">🔎</div>
                <div className="text-sm text-white">Sherlock</div>
                <div className="text-xs text-gray-400">Analytics</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">🦉</div>
                <div className="text-sm text-white">Athena</div>
                <div className="text-xs text-gray-400">Strategy</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Powerful Features",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">Everything You Need</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-white font-medium">Smart Conversations</div>
                <div className="text-sm text-gray-400">Context-aware chat with memory</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-white font-medium">Integrations</div>
                <div className="text-sm text-gray-400">Connect with your favorite tools</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-white font-medium">Customization</div>
                <div className="text-sm text-gray-400">Tailor agents to your needs</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {steps[currentStep].content}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="border-gray-600 text-gray-300">
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
