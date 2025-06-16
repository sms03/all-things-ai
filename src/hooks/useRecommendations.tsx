
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tool } from '@/hooks/useSupabaseData';

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_categories: string[];
  preferred_pricing: string[];
  preferred_tags: string[];
  interaction_score: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Tool[]>([]);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPersonalizedRecommendations();
    } else {
      fetchTrendingTools();
    }
  }, [user]);

  const fetchPersonalizedRecommendations = async () => {
    if (!user) return;

    try {
      // Get user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferences) {
        // Get tools based on user preferences
        const { data: tools, error } = await supabase
          .from('tools')
          .select(`
            *,
            categories (
              name,
              slug
            )
          `)
          .overlaps('tags', preferences.preferred_tags.slice(0, 5))
          .limit(8);

        if (error) throw error;

        const formattedTools = tools?.map(tool => ({
          ...tool,
          category: tool.categories?.slug || 'other'
        })) || [];

        setRecommendations(formattedTools);
      } else {
        // Fallback to trending tools
        await fetchTrendingTools();
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      await fetchTrendingTools();
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTools = async () => {
    try {
      // Get most clicked tools from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: clickedTools } = await supabase
        .from('analytics_events')
        .select('tool_id')
        .eq('event_type', 'tool_click')
        .gte('created_at', sevenDaysAgo.toISOString())
        .not('tool_id', 'is', null);

      // Count clicks per tool
      const toolClicks = (clickedTools || []).reduce((acc, event) => {
        const toolId = event.tool_id;
        if (toolId) {
          acc[toolId] = (acc[toolId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Get top clicked tool IDs
      const topToolIds = Object.entries(toolClicks)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([toolId]) => toolId);

      if (topToolIds.length > 0) {
        const { data: tools, error } = await supabase
          .from('tools')
          .select(`
            *,
            categories (
              name,
              slug
            )
          `)
          .in('id', topToolIds);

        if (error) throw error;

        const formattedTools = tools?.map(tool => ({
          ...tool,
          category: tool.categories?.slug || 'other'
        })) || [];

        setTrendingTools(formattedTools);
        if (!user) {
          setRecommendations(formattedTools);
        }
      } else {
        // Fallback to newest tools
        const { data: tools, error } = await supabase
          .from('tools')
          .select(`
            *,
            categories (
              name,
              slug
            )
          `)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        const formattedTools = tools?.map(tool => ({
          ...tool,
          category: tool.categories?.slug || 'other'
        })) || [];

        setTrendingTools(formattedTools);
        if (!user) {
          setRecommendations(formattedTools);
        }
      }
    } catch (error) {
      console.error('Error fetching trending tools:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    trendingTools,
    loading,
    refetchRecommendations: user ? fetchPersonalizedRecommendations : fetchTrendingTools
  };
};
