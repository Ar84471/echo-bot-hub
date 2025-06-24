
import React from 'react';
import { Star, Users, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AgentTemplate } from '@/data/agentTemplates';

interface AgentTemplateCardProps {
  template: AgentTemplate;
  onUseTemplate: (template: AgentTemplate) => void;
  onPreview: (template: AgentTemplate) => void;
}

const AgentTemplateCard: React.FC<AgentTemplateCardProps> = ({
  template,
  onUseTemplate,
  onPreview
}) => {
  return (
    <Card className="bg-gray-800/70 backdrop-blur-sm border-purple-500/20 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{template.avatar}</div>
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {template.name}
                {template.isPopular && (
                  <Badge variant="secondary" className="text-xs bg-yellow-900/50 text-yellow-300">
                    Popular
                  </Badge>
                )}
              </CardTitle>
              <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-300">
                {template.type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs">{template.rating}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="text-gray-300 mb-4">
          {template.description}
        </CardDescription>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {template.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                {capability}
              </Badge>
            ))}
            {template.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                +{template.capabilities.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{template.usageCount.toLocaleString()} uses</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>{template.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => onUseTemplate(template)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
            size="sm"
          >
            Use Template
          </Button>
          <Button 
            onClick={() => onPreview(template)}
            variant="outline" 
            size="sm" 
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
          >
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentTemplateCard;
