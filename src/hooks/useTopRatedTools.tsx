
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tool } from '@/hooks/useSupabaseData';

export const useTopRatedTools = (limit: number = 10) => {
  const [topRatedTools, setTopRatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopRatedTools();
    
    // Set up real-time subscription for tool rating updates
    const channel = supabase
      .channel('tool-ratings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tools'
        },
        () => {
          // Refetch top rated tools when any tool is updated
          fetchTopRatedTools();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  const fetchTopRatedTools = async () => {
    try {
      const { data, error } = await supabase.rpc('get_top_rated_tools', {
        limit_count: limit
      });

      if (error) throw error;

      // Format the data to match Tool interface
      const formattedTools = data?.map(tool => ({
        ...tool,
        category: tool.category_id || 'other'
      })) || [];

      setTopRatedTools(formattedTools);
    } catch (error) {
      console.error('Error fetching top rated tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDailyRankings = async () => {
    try {
      const { error } = await supabase.rpc('update_daily_tool_rankings');
      if (error) throw error;
      await fetchTopRatedTools();
    } catch (error) {
      console.error('Error updating daily rankings:', error);
    }
  };

  return {
    topRatedTools,
    loading,
    refetch: fetchTopRatedTools,
    updateDailyRankings
  };
};
