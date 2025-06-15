
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
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-black dark:border-white rounded-full animate-spin"></div>
            <div className="text-lg ibm-plex-serif-medium text-black dark:text-white">Loading AI tools...</div>
            <div className="text-sm ibm-plex-serif-regular text-gray-600 dark:text-gray-400 mt-2">Please wait</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-20">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8 animate-fade-in">
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
