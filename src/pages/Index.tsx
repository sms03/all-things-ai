
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-lg">Loading AI tools...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FilterBar
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPricing={selectedPricing}
          setSelectedPricing={setSelectedPricing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ToolsGrid tools={filteredTools} />
      </div>
    </div>
  );
};

export default Index;
