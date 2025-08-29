import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  event_type: 'page_view' | 'tool_click' | 'search' | 'filter_applied' | 'bookmark_added' | 'review_submitted';
  tool_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = async (
    eventType: AnalyticsEvent['event_type'],
    metadata: Record<string, any> = {},
    toolId?: string
  ) => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: user?.id || null,
          event_type: eventType,
          tool_id: toolId,
          metadata,
          ip_address: null, // Browser can't access IP
          user_agent: navigator.userAgent
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  };

  const trackSearch = async (query: string, filters: Record<string, any>, resultsCount: number) => {
    try {
      const { error } = await supabase
        .from('search_queries')
        .insert({
          user_id: user?.id || null,
          query,
          filters,
          results_count: resultsCount
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking search query:', error);
    }
  };

  const trackToolClick = async (toolId: string, searchQuery?: string) => {
    await trackEvent('tool_click', { search_query: searchQuery }, toolId);
    
    // Update the search query if it was from search results
    if (searchQuery) {
      try {
        const { error } = await supabase
          .from('search_queries')
          .update({ clicked_tool_id: toolId })
          .eq('user_id', user?.id)
          .eq('query', searchQuery)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating search query click:', error);
      }
    }
  };

  return {
    trackEvent,
    trackSearch,
    trackToolClick
  };
};
