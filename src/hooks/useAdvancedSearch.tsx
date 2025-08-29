import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tool } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface SearchFilters {
  category: string;
  pricing: string;
  tags: string[];
  rating: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const useAdvancedSearch = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    pricing: 'all',
    tags: [],
    rating: 0,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const { trackSearch } = useAnalytics();

  useEffect(() => {
    fetchAllTools();
  }, []);

  const fetchAllTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .order('name');

      if (error) throw error;

      const formattedTools = data?.map(tool => ({
        ...tool,
        category: tool.categories?.slug || 'other'
      })) || [];

      setTools(formattedTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const performSearch = async (query: string, searchFilters: SearchFilters) => {
    setLoading(true);
    try {
      let dbQuery = supabase
        .from('tools')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `);

      // Text search using trigram similarity
      if (query.trim()) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // Category filter
      if (searchFilters.category !== 'all') {
        dbQuery = dbQuery.eq('categories.slug', searchFilters.category);
      }

      // Pricing filter
      if (searchFilters.pricing !== 'all') {
        dbQuery = dbQuery.eq('pricing', searchFilters.pricing);
      }

      // Rating filter
      if (searchFilters.rating > 0) {
        dbQuery = dbQuery.gte('rating', searchFilters.rating);
      }

      // Tags filter
      if (searchFilters.tags.length > 0) {
        dbQuery = dbQuery.overlaps('tags', searchFilters.tags);
      }

      // Sorting
      if (searchFilters.sortBy === 'rating') {
        dbQuery = dbQuery.order('rating', { ascending: searchFilters.sortOrder === 'asc' });
      } else if (searchFilters.sortBy === 'created_at') {
        dbQuery = dbQuery.order('created_at', { ascending: searchFilters.sortOrder === 'asc' });
      } else {
        dbQuery = dbQuery.order('name', { ascending: searchFilters.sortOrder === 'asc' });
      }

      const { data, error } = await dbQuery;

      if (error) throw error;

      const formattedResults = data?.map(tool => ({
        ...tool,
        category: tool.categories?.slug || 'other'
      })) || [];

      setSearchResults(formattedResults);

      // Track search analytics
      await trackSearch(query, searchFilters, formattedResults.length);

      return formattedResults;
    } catch (error) {
      console.error('Error performing search:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for real-time updates
  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        (tool.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    filtered = filtered.filter(tool => {
      const matchesCategory = filters.category === 'all' || tool.category === filters.category;
      const matchesPricing = filters.pricing === 'all' || tool.pricing === filters.pricing;
      const matchesRating = filters.rating === 0 || (tool.rating || 0) >= filters.rating;
      const matchesTags = filters.tags.length === 0 || filters.tags.some(tag => (tool.tags || []).includes(tag));

      return matchesCategory && matchesPricing && matchesRating && matchesTags;
    });

    // Sort results
    filtered = filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
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

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [tools, searchQuery, filters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      pricing: 'all',
      tags: [],
      rating: 0,
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setSearchQuery('');
  };

  return {
    tools: filteredTools,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    loading,
    performSearch,
    searchResults
  };
};
