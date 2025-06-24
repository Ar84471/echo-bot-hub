
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Bot, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to NeuralForge",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Welcome to the Future of AI</h3>
          <p className="text-gray-300">
            NeuralForge is your advanced AI agent development platform. Create, deploy, and manage 
            intelligent agents for any task or workflow.
          </p>
        </div>
      )
    },
    {
      title: "Create Your First Agent",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Deploy AI Agents</h3>
          <p className="text-gray-300">
            Start with pre-built templates for common tasks like customer service, content creation, 
            or research assistance. Or create custom agents from scratch.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-lg mb-1">🎧</div>
                <div className="text-xs text-gray-300">Customer Service</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-lg mb-1">✍️</div>
                <div className="text-xs text-gray-300">Content Creator</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Neural Link Interface",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Connect & Collaborate</h3>
          <p className="text-gray-300">
            Chat with your agents through our neural link interface. Each conversation uses credits 
            to maintain high-quality responses and advanced AI capabilities.
          </p>
          <div className="bg-purple-900/30 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Credits System</span>
            </div>
            <p className="text-xs text-gray-400">
              Each conversation costs 1 credit. Start with 100 free credits!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Begin",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">You're All Set!</h3>
          <p className="text-gray-300">
            Start by exploring our agent marketplace or create your first custom agent. 
            Welcome to the neural network!
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            >
              Explore Marketplace
            </Button>
            <Button
              variant="outline"
              onClick={onComplete}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
            >
              Create Agent
            </Button>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-purple-500/20 w-full max-w-md">
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-3">
            <div 
              className="bg-gradient-to-r from-purple-600 to-violet-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {steps[currentStep].content}
        </div>

        {currentStep < steps.length - 1 && (
          <div className="p-6 border-t border-purple-500/20 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
