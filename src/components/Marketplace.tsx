
import React, { useState } from 'react';
import { Search, Star, Download, Filter, Grid, List, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { communityAgents, getFeaturedAgents, searchAgents, type CommunityAgent } from '@/data/communityAgents';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceProps {
  onInstallAgent: (agent: CommunityAgent) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onInstallAgent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'design', label: 'Design' },
    { value: 'education', label: 'Education' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const getFilteredAgents = () => {
    let filtered = searchQuery ? searchAgents(searchQuery) : communityAgents;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(agent => 
        agent.type.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort agents
    switch (sortBy) {
      case 'featured':
        return filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'downloads':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  };

  const handleInstallAgent = (agent: CommunityAgent) => {
    onInstallAgent(agent);
    toast({
      title: "Agent Installed!",
      description: `${agent.name} has been added to your agents. You can now start chatting with it.`,
    });
  };

  const renderAgentCard = (agent: CommunityAgent) => (
    <Card key={agent.id} className="bg-gray-800/50 border-purple-500/30 hover:border-purple-500/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{agent.avatar}</span>
            <div>
              <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {agent.type}
                </Badge>
                <Badge 
                  variant={agent.price === 'free' ? 'default' : 'secondary'}
                  className={agent.price === 'free' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}
                >
                  {agent.price === 'free' ? 'Free' : 'Premium'}
                </Badge>
                {agent.featured && (
                  <Badge className="bg-purple-900/50 text-purple-300">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-gray-400 mb-4">
          {agent.description}
        </CardDescription>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{agent.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{agent.downloads.toLocaleString()}</span>
          </div>
          <span>by {agent.author}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
              {capability}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
              +{agent.capabilities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => handleInstallAgent(agent)}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const filteredAgents = getFilteredAgents();
  const featuredAgents = getFeaturedAgents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agent Marketplace</h1>
          <p className="text-gray-400 mt-2">Discover and install community-created AI agents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-purple-500/30 text-white"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 bg-gray-800 border-purple-500/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 bg-gray-800 border-purple-500/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured First</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="downloads">Most Downloaded</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-800/50">
          <TabsTrigger value="all">All Agents ({filteredAgents.length})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({featuredAgents.length})</TabsTrigger>
          <TabsTrigger value="new">New & Updated</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredAgents.map(renderAgentCard)}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {featuredAgents.map(renderAgentCard)}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">New Agents Coming Soon</h3>
            <p className="text-gray-400">We're constantly adding new agents. Check back soon!</p>
          </div>
        </TabsContent>
      </Tabs>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Agents Found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
