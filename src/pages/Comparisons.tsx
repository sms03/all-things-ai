
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { useComparisons } from '@/hooks/useComparisons';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';

const Comparisons = () => {
  const { comparisons, addToComparison, removeFromComparison, clearComparisons, createComparison, savedComparisons, deleteComparison } = useComparisons();
  const { tools, categories, loading } = useSupabaseData();
  const { trackEvent } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [comparisonName, setComparisonName] = useState('');

  useEffect(() => {
    trackEvent('page_view', { page: 'comparisons' });
  }, [trackEvent]);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToComparison = (tool: any) => {
    addToComparison(tool);
    trackEvent('tool_click', { tool_id: tool.id, source: 'comparison_add' });
  };

  const handleRemoveFromComparison = (toolId: string) => {
    removeFromComparison(toolId);
    trackEvent('tool_click', { tool_id: toolId, source: 'comparison_remove' });
  };

  const handleSaveComparison = async () => {
    if (comparisons.length >= 2 && comparisonName.trim()) {
      const success = await createComparison(comparisonName, comparisons.map(t => t.id));
      if (success) {
        clearComparisons();
        setComparisonName('');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center border border-gray-200 rounded-lg p-12 shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900 mb-2">Loading comparisons</div>
            <div className="text-gray-600 text-sm">Setting up your comparison tools</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Compare AI Tools
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compare features, pricing, and capabilities of different AI tools side by side
            </p>
          </div>

          {/* Active Comparison */}
          {comparisons.length > 0 && (
            <Card className="mb-8 border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-gray-900">Current Comparison</CardTitle>
                    <CardDescription>
                      {comparisons.length} tool{comparisons.length !== 1 ? 's' : ''} selected (max 3)
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={clearComparisons}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {comparisons.map((tool) => (
                    <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-900">{tool.name}</h3>
                        <Button
                          onClick={() => handleRemoveFromComparison(tool.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600"
                        >
                          <i className="ri-close-line"></i>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Pricing:</span>
                          <Badge variant="outline" className={`${
                            tool.pricing === 'free' ? 'bg-green-50 text-green-700 border-green-200' :
                            tool.pricing === 'freemium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                            {tool.pricing}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Rating:</span>
                          <div className="flex items-center">
                            <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                            <span className="text-gray-700">{tool.rating?.toFixed(1) || 'No rating'}</span>
                          </div>
                        </div>
                        
                        {tool.tags && tool.tags.length > 0 && (
                          <div>
                            <span className="text-gray-500 text-sm block mb-2">Tags:</span>
                            <div className="flex flex-wrap gap-1">
                              {tool.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <Button
                          asChild
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <a href={tool.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {comparisons.length >= 2 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Save this comparison
                        </label>
                        <Input
                          value={comparisonName}
                          onChange={(e) => setComparisonName(e.target.value)}
                          placeholder="Enter comparison name..."
                          className="border-gray-300"
                        />
                      </div>
                      <Button
                        onClick={handleSaveComparison}
                        disabled={!comparisonName.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save Comparison
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-8 border border-gray-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all" className="text-gray-900">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-gray-900">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Available Tools */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const isSelected = Boolean(comparisons.find(t => t.id === tool.id));
                return (
                  <Card key={tool.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900">{tool.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${
                          tool.pricing === 'free' ? 'bg-green-50 text-green-700 border-green-200' :
                          tool.pricing === 'freemium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {tool.pricing}
                        </Badge>
                        <div className="flex items-center">
                          <i className="ri-star-fill text-yellow-400 text-sm"></i>
                          <span className="ml-1 text-sm text-gray-600">
                            {tool.rating?.toFixed(1) || 'No rating'}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleAddToComparison(tool)}
                        disabled={isSelected || comparisons.length >= 3}
                        className={`w-full ${
                          isSelected 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isSelected ? 'Added to Comparison' : 'Add to Compare'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Saved Comparisons */}
          {savedComparisons.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Comparisons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedComparisons.map((comparison) => (
                  <Card key={comparison.id} className="border border-gray-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-gray-900">{comparison.name}</CardTitle>
                          <CardDescription>
                            {comparison.tool_ids.length} tools • Created {new Date(comparison.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => deleteComparison(comparison.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 mb-4">
                        Tool IDs: {comparison.tool_ids.join(', ')}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        View Comparison
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comparisons;
