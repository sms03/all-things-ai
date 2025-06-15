
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
      <div className="min-h-screen neural-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center glass-card rounded-2xl p-8 animate-pulse-glow">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin"></div>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading AI tools...</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Initializing neural networks</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen neural-bg">
      <Navigation />
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-24">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-down">
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
          <div className="animate-slide-up">
            <ToolsGrid tools={filteredTools} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
