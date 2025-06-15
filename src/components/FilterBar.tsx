
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPricing: string;
  setSelectedPricing: (pricing: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const categories = [
  { id: 'all', name: 'All Tools' },
  { id: 'image-art', name: 'Image & Art' },
  { id: 'text-copywriting', name: 'Text & Copy' },
  { id: 'video-audio', name: 'Video & Audio' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'developer', name: 'Developer' },
  { id: 'chatbots', name: 'Chatbots' },
  { id: 'research', name: 'Research' },
  { id: 'marketing', name: 'Marketing' },
];

const pricingOptions = [
  { id: 'all', name: 'All Pricing' },
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
];

const FilterBar = ({
  selectedCategory,
  setSelectedCategory,
  selectedPricing,
  setSelectedPricing,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) => {
  return (
    <div className="mb-12">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search AI tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-4 text-lg bg-white/5 border-white/10 backdrop-blur-sm rounded-full focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Categories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'border-white/20 text-gray-300 hover:bg-white/5 hover:border-white/30'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Pricing</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pricingOptions.map((pricing) => (
              <Button
                key={pricing.id}
                variant={selectedPricing === pricing.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPricing(pricing.id)}
                className={`rounded-full transition-all duration-300 ${
                  selectedPricing === pricing.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                    : 'border-white/20 text-gray-300 hover:bg-white/5 hover:border-white/30'
                }`}
              >
                {pricing.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
