
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tool } from '@/hooks/useSupabaseData';

export interface ToolComparison {
  id: string;
  user_id: string;
  name: string;
  tool_ids: string[];
  created_at: string;
  updated_at: string;
}

export const useComparisons = () => {
  const [comparisons, setComparisons] = useState<ToolComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchComparisons();
    }
  }, [user]);

  const fetchComparisons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tool_comparisons')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setComparisons(data || []);
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    } finally {
      setLoading(false);
    }
  };

  const createComparison = async (name: string, toolIds: string[]) => {
    if (!user || toolIds.length < 2) return false;

    try {
      const { error } = await supabase
        .from('tool_comparisons')
        .insert({
          user_id: user.id,
          name,
          tool_ids: toolIds
        });

      if (error) throw error;
      await fetchComparisons();
      return true;
    } catch (error) {
      console.error('Error creating comparison:', error);
      return false;
    }
  };

  const deleteComparison = async (comparisonId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('tool_comparisons')
        .delete()
        .eq('id', comparisonId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchComparisons();
      return true;
    } catch (error) {
      console.error('Error deleting comparison:', error);
      return false;
    }
  };

  return {
    comparisons,
    loading,
    createComparison,
    deleteComparison,
    refetch: fetchComparisons
  };
};
