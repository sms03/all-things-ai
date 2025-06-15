
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
    <div className="space-y-12 py-16">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-6 text-lg bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg focus:border-gray-300 transition-all duration-300 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-16">
        {/* Categories */}
        <div className="text-center space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Categories</h3>
            <p className="text-gray-600 dark:text-gray-400">Explore tools by category</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => setSelectedCategory(category.id)}
                className={`h-12 px-6 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-black text-white hover:bg-gray-800 shadow-lg scale-105 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                    : 'bg-gray-50/80 text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-105 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-white'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Pricing</h3>
            <p className="text-gray-600 dark:text-gray-400">Filter by pricing model</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {pricingOptions.map((pricing) => (
              <Button
                key={pricing.id}
                variant="ghost"
                onClick={() => setSelectedPricing(pricing.id)}
                className={`h-12 px-8 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedPricing === pricing.id
                    ? 'bg-black text-white hover:bg-gray-800 shadow-lg scale-105 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                    : 'bg-gray-50/80 text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-105 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-white'
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
