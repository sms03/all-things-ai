
import { Input } from '@/components/ui/input';
import { Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: string[];
}

const pricingOptions = [
  { id: 'all', name: 'All' },
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
];

const sortOptions = [
  { id: 'name', name: 'Name' },
  { id: 'rating', name: 'Rating' },
  { id: 'created_at', name: 'Newest' },
];

const FilterBar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPricing,
  setSelectedPricing,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedTags,
  setSelectedTags,
  availableTags,
}: FilterBarProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedPricing !== 'all' || searchQuery !== '' || selectedTags.length > 0;

  return (
    <div className="space-y-16 py-20">
      {/* Search and Sort Row */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Bar */}
          <div className="md:col-span-2">
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

          {/* Sort Controls */}
          <div className="flex items-center space-x-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-16 bg-white/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-lg dark:bg-black/90">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-16 w-16 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg dark:bg-black/90"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </Button>
          </div>
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

        {/* Tags */}
        {availableTags.length > 0 && (
          <div className="text-center space-y-10">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">Popular Tags</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Filter by specific features</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto">
              {availableTags.slice(0, 20).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "primary" : "ghost"}
                  onClick={() => toggleTag(tag)}
                  size="sm"
                  className={`h-10 px-4 text-sm font-medium rounded-full transition-all duration-300 tracking-tight ${
                    selectedTags.includes(tag)
                      ? 'scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="h-12 px-8 text-sm font-medium rounded-full hover:scale-105 transition-all duration-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
