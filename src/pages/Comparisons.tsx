
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useComparisons } from '@/hooks/useComparisons';
import { useAnalytics } from '@/hooks/useAnalytics';

const Comparisons = () => {
  const { tools, categories } = useSupabaseData();
  const { comparisons, addToComparison, removeFromComparison, clearComparisons } = useComparisons();
  const { trackEvent } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent('page_view', { page: 'comparisons' });
  }, [trackEvent]);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category_id === selectedCategory;
    const notInComparison = !comparisons.some(comp => comp.id === tool.id);
    
    return matchesSearch && matchesCategory && notInComparison;
  });

  const handleAddToComparison = (tool: any) => {
    addToComparison(tool);
    trackEvent('tool_click', { tool_id: tool.id, action: 'add_to_comparison' });
  };

  const handleRemoveFromComparison = (toolId: string) => {
    removeFromComparison(toolId);
    trackEvent('tool_click', { tool_id: toolId, action: 'remove_from_comparison' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div ref={pageRef} className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Compare AI Tools
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select up to 3 AI tools to compare their features, pricing, and capabilities side by side
            </p>
          </div>

          {/* Comparison Section */}
          {comparisons.length > 0 && (
            <Card className="mb-12 border border-gray-200">
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">
                    Comparison ({comparisons.length}/3)
                  </CardTitle>
                  <Button
                    onClick={clearComparisons}
                    variant="outline"
                    className="text-gray-600 hover:text-gray-900 border-gray-300"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comparisons.map((tool) => (
                    <div key={tool.id} className="relative">
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg text-gray-900">{tool.name}</CardTitle>
                              <CardDescription className="text-sm text-gray-600 mt-1">
                                {tool.description?.substring(0, 100)}...
                              </CardDescription>
                            </div>
                            <Button
                              onClick={() => handleRemoveFromComparison(tool.id)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-red-600"
                            >
                              <i className="ri-close-line"></i>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Pricing</label>
                            <Badge variant="outline" className={`ml-2 ${
                              tool.pricing === 'free' ? 'bg-green-50 text-green-700 border-green-200' :
                              tool.pricing === 'freemium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {tool.pricing}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Rating</label>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`ri-star-${i < Math.floor(tool.rating || 0) ? 'fill' : 'line'} text-yellow-400`}
                                  ></i>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {tool.rating?.toFixed(1) || 'No rating'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Tags</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {tool.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full border-gray-300"
                          >
                            <a
                              href={tool.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center"
                            >
                              <i className="ri-external-link-line mr-2"></i>
                              Visit Tool
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filter */}
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
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Available Tools */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-100 bg-gray-50">
              <CardTitle className="text-xl text-gray-900">Available Tools</CardTitle>
              <CardDescription className="text-gray-600">
                Select tools to add to your comparison (maximum 3 tools)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900">{tool.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {tool.description?.substring(0, 100)}...
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
                        disabled={comparisons.length >= 3}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Add to Compare
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <i className="ri-search-line text-4xl text-gray-400 mb-4 block"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or category filter.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Comparisons;
