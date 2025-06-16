
import { useState, useMemo, useEffect } from 'react';
import Hero from '@/components/Hero';
import ToolsGrid from '@/components/ToolsGrid';
import FilterBar from '@/components/FilterBar';
import Navigation from '@/components/Navigation';
import RecommendationsSection from '@/components/RecommendationsSection';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Background } from '@/components/Background';

const Index = () => {
  const { tools, categories, loading } = useSupabaseData();
  const { trackEvent } = useAnalytics();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Track page view
  useEffect(() => {
    trackEvent('page_view', { page: 'home' });
  }, [trackEvent]);

  // Track filter applications
  useEffect(() => {
    if (selectedCategory !== 'all' || selectedPricing !== 'all' || selectedTags.length > 0) {
      trackEvent('filter_applied', {
        category: selectedCategory,
        pricing: selectedPricing,
        tags: selectedTags,
        searchQuery
      });
    }
  }, [selectedCategory, selectedPricing, selectedTags, searchQuery, trackEvent]);

  // Update categories dynamically from Supabase
  const categoryOptions = [
    { id: 'all', name: 'All' },
    ...categories.map(cat => ({ id: cat.slug, name: cat.name }))
  ];

  // Get all available tags from tools
  const availableTags = useMemo(() => {
    const allTags = tools.flatMap(tool => tool.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Return tags sorted by frequency
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([tag]) => tag);
  }, [tools]);

  const filteredAndSortedTools = useMemo(() => {
    let filtered = tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === 'all' || tool.pricing === selectedPricing;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (tool.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => (tool.tags || []).includes(tag));
      
      return matchesCategory && matchesPricing && matchesSearch && matchesTags;
    });

    // Sort the filtered tools
    filtered = filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [tools, selectedCategory, selectedPricing, searchQuery, selectedTags, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white/95 backdrop-blur-xl dark:bg-black/95 border border-gray-100/20 dark:border-white/10 rounded-3xl p-16 shadow-2xl animate-fade-in max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-8 border-2 border-gray-900 dark:border-white rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900 dark:text-white mb-3 tracking-tight">Loading AI tools</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Discovering the future of AI</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      <div className="pt-20">
        <Hero />
        
        {/* Recommendations Section */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <RecommendationsSection />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-32">
          <div className="bg-white/80 backdrop-blur-xl dark:bg-black/80 border border-gray-100/30 dark:border-white/10 rounded-3xl shadow-2xl animate-fade-in mb-20">
            <FilterBar
              categories={categoryOptions}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPricing={selectedPricing}
              setSelectedPricing={setSelectedPricing}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              availableTags={availableTags}
            />
          </div>
          <div className="animate-fade-in">
            <ToolsGrid tools={filteredAndSortedTools} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
