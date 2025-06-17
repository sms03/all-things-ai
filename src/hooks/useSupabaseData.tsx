
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Tool {
  id: string;
  name: string;
  description: string;
  website: string;
  pricing: string;
  rating: number;
  tags: string[];
  category: string;
  featured?: boolean;
  trending?: boolean;
  submitted_by?: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'discontinued';
  last_checked?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const useSupabaseData = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedToolIds, setBookmarkedToolIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch tools with categories (only approved tools for regular users)
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .order('name');

      if (toolsError) throw toolsError;

      const formattedTools = toolsData?.map(tool => ({
        ...tool,
        category: tool.categories?.slug || 'other'
      })) || [];

      setTools(formattedTools);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data: bookmarks, error } = await supabase
        .from('bookmarks')
        .select('tool_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const bookmarkedIds = new Set(bookmarks?.map(b => b.tool_id) || []);
      setBookmarkedToolIds(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const toggleBookmark = async (toolId: string) => {
    if (!user) return false;

    try {
      if (bookmarkedToolIds.has(toolId)) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', toolId);

        if (error) throw error;

        setBookmarkedToolIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(toolId);
          return newSet;
        });
        return false;
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            tool_id: toolId
          });

        if (error) throw error;

        setBookmarkedToolIds(prev => new Set([...prev, toolId]));
        return true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return null;
    }
  };

  return {
    tools,
    categories,
    loading,
    bookmarkedToolIds,
    toggleBookmark,
    refetch: fetchData
  };
};
