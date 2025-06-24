
import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AgentTemplateCard from '@/components/AgentTemplateCard';
import { agentTemplates, categories, AgentTemplate } from '@/data/agentTemplates';

interface MarketplaceProps {
  onBack: () => void;
  onCreateFromTemplate: (template: AgentTemplate) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onBack, onCreateFromTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const { toast } = useToast();

  const filteredTemplates = agentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularTemplates = agentTemplates.filter(t => t.isPopular).slice(0, 3);

  const handleUseTemplate = (template: AgentTemplate) => {
    onCreateFromTemplate(template);
    toast({
      title: "Template Selected",
      description: `Creating agent from ${template.name} template...`,
    });
  };

  const handlePreview = (template: AgentTemplate) => {
    setSelectedTemplate(template);
  };

  if (selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{selectedTemplate.avatar}</div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{selectedTemplate.name}</h1>
                  <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                    {selectedTemplate.type}
                  </Badge>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{selectedTemplate.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{selectedTemplate.rating}/5</span>
                  </div>
                  <div>{selectedTemplate.usageCount.toLocaleString()} uses</div>
                </div>
              </div>
            </div>

            <Card className="bg-gray-800/70 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Agent Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300">System Prompt</label>
                    <div className="mt-1 p-3 bg-gray-900/50 rounded-md text-sm text-gray-300">
                      {selectedTemplate.prompt}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={() => handleUseTemplate(selectedTemplate)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                    >
                      Use This Template
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Marketplace</h1>
              <p className="text-gray-400">Discover and deploy pre-built AI agents</p>
            </div>
          </div>
        </div>

        {/* Popular Templates */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Popular Templates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularTemplates.map((template) => (
              <AgentTemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-purple-500/30 bg-gray-800 text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "border-purple-500/30 text-purple-300 hover:bg-purple-900/50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <AgentTemplateCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
              onPreview={handlePreview}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
