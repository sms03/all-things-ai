
import { useState, useMemo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ToolsGrid from '@/components/ToolsGrid';
import FilterBar from '@/components/FilterBar';
import Navigation from '@/components/Navigation';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Background } from '@/components/Background';

gsap.registerPlugin(ScrollTrigger);

const Explore = () => {
  const { tools, categories, loading } = useSupabaseData();
  const { trackEvent } = useAnalytics();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track page view
  useEffect(() => {
    trackEvent('page_view', { page: 'explore' });
  }, [trackEvent]);

  // GSAP animations
  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline();
      
      tl.fromTo(headerRef.current, 
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(contentRef.current?.children || [], 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, [loading]);

  // Update categories dynamically from Supabase
  const categoryOptions = [
    { id: 'all', name: 'All Categories' },
    ...categories.map(cat => ({ id: cat.slug, name: cat.name }))
  ];

  // Get all available tags from tools
  const availableTags = useMemo(() => {
    const allTags = tools.flatMap(tool => tool.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([tag]) => tag);
  }, [tools]);

  const filteredAndSortedTools = useMemo(() => {
    let filtered = tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === 'all' || tool.pricing === selectedPricing;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (tool.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => (tool.tags || []).includes(tag));
      
      return matchesCategory && matchesPricing && matchesSearch && matchesTags;
    });

    // Sort the filtered tools
    filtered = filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [tools, selectedCategory, selectedPricing, searchQuery, selectedTags, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16 shadow-2xl animate-fade-in max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-8 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-white mb-3 tracking-tight">Loading AI tools</div>
            <div className="text-white/70 text-sm">Discovering the future of AI</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      
      <div className="pt-32 pb-20">
        {/* Header */}
        <div ref={headerRef} className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6 tracking-tight">
              <i className="ri-compass-3-line mr-4"></i>
              Explore AI Tools
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              Discover {tools.length} cutting-edge AI tools across all categories. Find the perfect solution for your needs.
            </p>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl mb-12">
            <FilterBar
              categories={categoryOptions}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPricing={selectedPricing}
              setSelectedPricing={setSelectedPricing}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              availableTags={availableTags}
            />
          </div>
          
          <ToolsGrid tools={filteredAndSortedTools} />
        </div>
      </div>
    </div>
  );
};

export default Explore;
