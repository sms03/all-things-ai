
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import ToolsGrid from '@/components/ToolsGrid';
import FilterBar from '@/components/FilterBar';
import Navigation from '@/components/Navigation';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const Index = () => {
  const { tools, categories, loading } = useSupabaseData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Update categories dynamically from Supabase
  const categoryOptions = [
    { id: 'all', name: 'All' },
    ...categories.map(cat => ({ id: cat.slug, name: cat.name }))
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesPricing = selectedPricing === 'all' || tool.pricing === selectedPricing;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPricing && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-12 shadow-2xl animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 border-4 border-gray-900 dark:border-white rounded-full animate-spin border-t-transparent"></div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Loading AI tools...</div>
            <div className="text-gray-600 dark:text-gray-400">Discovering the future of AI</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Navigation />
      <div className="pt-20">
        <Hero />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-white/60 backdrop-blur-xl dark:bg-gray-900/60 border border-gray-200/30 dark:border-gray-700/30 rounded-3xl shadow-xl animate-fade-in">
            <FilterBar
              categories={categoryOptions}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPricing={selectedPricing}
              setSelectedPricing={setSelectedPricing}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="mt-16 animate-fade-in">
            <ToolsGrid tools={filteredTools} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
