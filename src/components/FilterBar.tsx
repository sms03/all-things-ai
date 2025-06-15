import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/Button';

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
    <div className="space-y-16 py-20">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-14 pr-6 text-lg bg-white/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-2xl focus:border-gray-300 dark:focus:border-white/20 transition-all duration-300 placeholder:text-gray-400 dark:bg-black/90 dark:text-white font-medium tracking-tight"
          />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-20">
        {/* Categories */}
        <div className="text-center space-y-10">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">Categories</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Explore tools by category</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "primary" : "ghost"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-12 px-6 text-sm font-medium rounded-full transition-all duration-300 tracking-tight ${
                  selectedCategory === category.id
                    ? 'scale-105'
                    : 'hover:scale-105'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-10">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">Pricing</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Filter by pricing model</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {pricingOptions.map((pricing) => (
              <Button
                key={pricing.id}
                variant={selectedPricing === pricing.id ? "primary" : "ghost"}
                onClick={() => setSelectedPricing(pricing.id)}
                className={`h-12 px-8 text-sm font-medium rounded-full transition-all duration-300 tracking-tight ${
                  selectedPricing === pricing.id
                    ? 'scale-105'
                    : 'hover:scale-105'
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
