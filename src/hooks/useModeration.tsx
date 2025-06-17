
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tool } from '@/hooks/useSupabaseData';

export interface ModerationRecord {
  id: string;
  tool_id: string;
  moderator_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'discontinued';
  previous_status: 'pending' | 'approved' | 'rejected' | 'discontinued' | null;
  notes: string | null;
  moderated_at: string;
  created_at: string;
  tool?: Tool;
}

export const useModeration = () => {
  const [moderationQueue, setModerationQueue] = useState<ModerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchModerationQueue();
  }, [user]);

  const fetchModerationQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_moderation')
        .select(`
          *,
          tools (
            id,
            name,
            description,
            website,
            pricing,
            rating,
            tags,
            category_id,
            featured,
            trending,
            submitted_by,
            created_at,
            updated_at,
            status,
            last_checked,
            categories (
              name,
              slug
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(record => ({
        ...record,
        tool: record.tools ? {
          ...record.tools,
          category: record.tools.categories?.slug || 'other'
        } : undefined
      })) || [];

      setModerationQueue(formattedData);
    } catch (error) {
      console.error('Error fetching moderation queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const moderateTool = async (
    toolId: string, 
    status: 'approved' | 'rejected' | 'discontinued',
    notes?: string
  ) => {
    if (!user) return false;

    try {
      // Get current tool status
      const { data: currentTool } = await supabase
        .from('tools')
        .select('status')
        .eq('id', toolId)
        .single();

      // Update tool status
      const { error: toolError } = await supabase
        .from('tools')
        .update({ 
          status,
          last_checked: new Date().toISOString()
        })
        .eq('id', toolId);

      if (toolError) throw toolError;

      // Create moderation record
      const { error: moderationError } = await supabase
        .from('tool_moderation')
        .insert({
          tool_id: toolId,
          moderator_id: user.id,
          status,
          previous_status: currentTool?.status || null,
          notes
        });

      if (moderationError) throw moderationError;

      await fetchModerationQueue();
      return true;
    } catch (error) {
      console.error('Error moderating tool:', error);
      return false;
    }
  };

  const bulkModerateTool = async (
    toolIds: string[], 
    status: 'approved' | 'rejected' | 'discontinued',
    notes?: string
  ) => {
    if (!user) return false;

    try {
      // Update all tools
      const { error: toolError } = await supabase
        .from('tools')
        .update({ 
          status,
          last_checked: new Date().toISOString()
        })
        .in('id', toolIds);

      if (toolError) throw toolError;

      // Create moderation records for each tool
      const moderationRecords = toolIds.map(toolId => ({
        tool_id: toolId,
        moderator_id: user.id,
        status,
        notes
      }));

      const { error: moderationError } = await supabase
        .from('tool_moderation')
        .insert(moderationRecords);

      if (moderationError) throw moderationError;

      await fetchModerationQueue();
      return true;
    } catch (error) {
      console.error('Error bulk moderating tools:', error);
      return false;
    }
  };

  return {
    moderationQueue,
    loading,
    moderateTool,
    bulkModerateTool,
    refetch: fetchModerationQueue
  };
};
