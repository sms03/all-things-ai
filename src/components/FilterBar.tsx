
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPricing: string;
  setSelectedPricing: (pricing: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const pricingOptions = [
  { id: 'all', name: 'All' },
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
];

const FilterBar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPricing,
  setSelectedPricing,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) => {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search AI tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 ibm-plex-serif-regular bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
        />
      </div>

      {/* Filter Buttons */}
      <div className="space-y-4">
        {/* Categories */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`h-8 px-4 ibm-plex-serif-medium rounded-md border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-black text-white border-black hover:bg-gray-800 dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-200'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-900 dark:hover:border-gray-600'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {pricingOptions.map((pricing) => (
              <Button
                key={pricing.id}
                variant={selectedPricing === pricing.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPricing(pricing.id)}
                className={`h-8 px-4 ibm-plex-serif-medium rounded-md border transition-colors ${
                  selectedPricing === pricing.id
                    ? 'bg-black text-white border-black hover:bg-gray-800 dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-200'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-900 dark:hover:border-gray-600'
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
