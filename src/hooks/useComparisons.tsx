
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
  const [comparisons, setComparisons] = useState<Tool[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<ToolComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedComparisons();
    }
  }, [user]);

  const fetchSavedComparisons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tool_comparisons')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSavedComparisons(data || []);
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToComparison = (tool: Tool) => {
    if (comparisons.find(t => t.id === tool.id)) return;
    if (comparisons.length >= 3) return;
    setComparisons([...comparisons, tool]);
  };

  const removeFromComparison = (toolId: string) => {
    setComparisons(comparisons.filter(t => t.id !== toolId));
  };

  const clearComparisons = () => {
    setComparisons([]);
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
      await fetchSavedComparisons();
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
      await fetchSavedComparisons();
      return true;
    } catch (error) {
      console.error('Error deleting comparison:', error);
      return false;
    }
  };

  return {
    comparisons,
    savedComparisons,
    loading,
    addToComparison,
    removeFromComparison,
    clearComparisons,
    createComparison,
    deleteComparison,
    refetch: fetchSavedComparisons
  };
};
