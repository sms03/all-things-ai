
import { useState } from 'react';
import Hero from '@/components/Hero';
import ToolsGrid from '@/components/ToolsGrid';
import FilterBar from '@/components/FilterBar';
import { mockTools } from '@/data/mockTools';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = mockTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesPricing = selectedPricing === 'all' || tool.pricing === selectedPricing;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPricing && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FilterBar
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
