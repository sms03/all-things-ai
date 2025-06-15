
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
    <div className="mb-16 space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search AI tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm"
        />
      </div>

      {/* Filter Buttons */}
      <div className="space-y-6">
        {/* Categories */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-2 transition-all duration-300 font-medium ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
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
                className={`rounded-full px-4 py-2 transition-all duration-300 font-medium ${
                  selectedPricing === pricing.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
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
