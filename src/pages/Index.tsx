
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import ToolsGrid from '@/components/ToolsGrid';
import FilterBar from '@/components/FilterBar';
import Navigation from '@/components/Navigation';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Background } from 'reactbits';

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
            />
          </div>
          <div className="animate-fade-in">
            <ToolsGrid tools={filteredTools} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
