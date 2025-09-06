import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const Explore = () => {
  const [searchParams] = useSearchParams();
  const { tools, categories, loading, bookmarkedToolIds, toggleBookmark } = useSupabaseData();
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedPricing, setSelectedPricing] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent('page_view', { page: 'explore' });
  }, [trackEvent]);

  useEffect(() => {
    if (!loading && pageRef.current) {
      gsap.fromTo(pageRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || selectedCategory === 'all_categories' || tool.category === selectedCategory;
      const matchesPricing = !selectedPricing || selectedPricing === 'all_pricing' || tool.pricing === selectedPricing;
      
      return matchesSearch && matchesCategory && matchesPricing;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const handleToolClick = (tool: any) => {
    trackEvent('tool_click', { tool_id: tool.id, source: 'explore' });
  };

  const handleBookmark = async (toolId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to bookmark tools.',
      });
      return;
    }
    const result = await toggleBookmark(toolId);
    if (result === true) {
      toast({ title: 'Bookmarked', description: 'Tool added to your bookmarks.' });
      trackEvent('bookmark_added', { tool_id: toolId });
    } else if (result === false) {
      toast({ title: 'Removed', description: 'Tool removed from your bookmarks.' });
      // reuse generic event type if no specific remove event exists
      trackEvent('filter_applied', { action: 'bookmark_removed', tool_id: toolId });
    } else {
      toast({ title: 'Error', description: 'Could not update bookmark.', variant: 'destructive' });
    }
  };

  const getCategoryName = (slug: string | undefined | null) => {
    if (!slug) return '—';
    return categories.find(c => c.slug === slug)?.name || slug;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center border border-gray-200 rounded-lg p-12 shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900 mb-2">Loading AI tools</div>
            <div className="text-gray-600 text-sm">Discovering amazing tools for you</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div ref={pageRef} className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore AI Tools
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover and explore our comprehensive collection of AI tools across various categories, now sorted by user ratings
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 border border-gray-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 bg-white border-gray-300 rounded-lg">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all_categories" className="text-gray-900">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug} className="text-gray-900">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                  <SelectTrigger className="h-12 bg-white border-gray-300 rounded-lg">
                    <SelectValue placeholder="All Pricing" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all_pricing" className="text-gray-900">All Pricing</SelectItem>
                    <SelectItem value="free" className="text-gray-900">Free</SelectItem>
                    <SelectItem value="freemium" className="text-gray-900">Freemium</SelectItem>
                    <SelectItem value="paid" className="text-gray-900">Paid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 bg-white border-gray-300 rounded-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                     <SelectItem value="name" className="text-gray-900">Name (A-Z)</SelectItem>
                     <SelectItem value="rating" className="text-gray-900">Highest Rated</SelectItem>
                    <SelectItem value="newest" className="text-gray-900">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredAndSortedTools.length} of {tools.length} tools
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTools.map((tool) => {
              const isBookmarked = bookmarkedToolIds.has(tool.id);
              return (
              <Card key={tool.id} className="relative border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 mb-2">{tool.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    </div>
                    <button
                      type="button"
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      aria-pressed={isBookmarked}
                      onClick={(e) => { e.stopPropagation(); handleBookmark(tool.id); }}
                      className={`ml-3 h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${isBookmarked ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                      <i className={isBookmarked ? 'ri-bookmark-fill text-base' : 'ri-bookmark-line text-base'}></i>
                    </button>
                  </div>
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
                        {tool.rating ? Number(tool.rating).toFixed(1) : '0.0'}
                      </span>
                    </div>
                  </div>

                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {tag}
                        </Badge>
                      ))}
                      {tool.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                          +{tool.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleToolClick(tool)}
                    >
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <i className="ri-external-link-line mr-2"></i>
                        Visit
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredToolId(tool.id)}
                        onMouseLeave={() => setHoveredToolId(prev => prev === tool.id ? null : prev)}
                      >
                        <i className="ri-information-line"></i>
                        {hoveredToolId === tool.id && (
                          <div className="absolute right-0 top-full mt-2 w-80 z-40 p-4 rounded-lg border border-gray-200 bg-white shadow-lg text-left animate-in fade-in-0 zoom-in-95">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">{tool.name}</h4>
                            {tool.description && (
                              <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-none">
                                {tool.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {tool.tags?.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 px-1.5 py-0.5 font-medium">
                                  {tag}
                                </Badge>
                              ))}
                              {(!tool.tags || tool.tags.length === 0) && (
                                <span className="text-[10px] text-gray-400">No tags</span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-500 mb-2">
                              <span className="font-medium text-gray-700">Category:</span>
                              <span>{getCategoryName(tool.category)}</span>
                              <span className="font-medium text-gray-700">Pricing:</span>
                              <span className="capitalize">{tool.pricing || '—'}</span>
                              <span className="font-medium text-gray-700">Rating:</span>
                              <span>{tool.rating ? Number(tool.rating).toFixed(1) : '0.0'}</span>
                              {tool.created_at && (
                                <>
                                  <span className="font-medium text-gray-700">Added:</span>
                                  <span>{new Date(tool.created_at).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                            {tool.website && (
                              <a
                                href={tool.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-[11px] text-blue-600 hover:underline font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToolClick(tool);
                                }}
                              >
                                Visit website <i className="ri-external-link-line ml-1 text-xs"></i>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );})}
          </div>

          {/* No Results */}
          {filteredAndSortedTools.length === 0 && (
            <div className="text-center py-16">
              <i className="ri-search-line text-6xl text-gray-400 mb-4 block"></i>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all categories.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedPricing('');
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
