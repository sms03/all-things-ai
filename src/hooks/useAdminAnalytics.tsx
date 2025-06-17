
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ToolAnalytics {
  id: string;
  tool_id: string;
  date: string;
  views_count: number;
  clicks_count: number;
  bookmarks_count: number;
  searches_count: number;
  tool_name?: string;
  total_engagement?: number;
}

export interface AnalyticsSummary {
  totalTools: number;
  activeTools: number;
  pendingTools: number;
  discontinuedTools: number;
  totalViews: number;
  totalClicks: number;
  totalBookmarks: number;
  popularTools: ToolAnalytics[];
  recentActivity: any[];
}

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch tool counts by status
      const { data: toolCounts } = await supabase
        .from('tools')
        .select('status');

      const statusCounts = (toolCounts || []).reduce((acc, tool) => {
        acc[tool.status] = (acc[tool.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Fetch recent analytics data
      const { data: recentAnalytics } = await supabase
        .from('tool_analytics')
        .select(`
          *,
          tools (name)
        `)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      // Calculate totals
      const totals = (recentAnalytics || []).reduce((acc, record) => {
        acc.views += record.views_count || 0;
        acc.clicks += record.clicks_count || 0;
        acc.bookmarks += record.bookmarks_count || 0;
        return acc;
      }, { views: 0, clicks: 0, bookmarks: 0 });

      // Get popular tools (last 7 days)
      const { data: popularTools } = await supabase
        .from('tool_analytics')
        .select(`
          tool_id,
          SUM(views_count) as total_views,
          SUM(clicks_count) as total_clicks,
          SUM(bookmarks_count) as total_bookmarks,
          tools (name)
        `)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .not('tools', 'is', null);

      // Format popular tools
      const formattedPopularTools = (popularTools || [])
        .map(tool => ({
          id: tool.tool_id,
          tool_id: tool.tool_id,
          date: '',
          views_count: tool.total_views || 0,
          clicks_count: tool.total_clicks || 0,
          bookmarks_count: tool.total_bookmarks || 0,
          searches_count: 0,
          tool_name: tool.tools?.name || 'Unknown',
          total_engagement: (tool.total_views || 0) + (tool.total_clicks || 0) + (tool.total_bookmarks || 0)
        }))
        .sort((a, b) => (b.total_engagement || 0) - (a.total_engagement || 0))
        .slice(0, 10);

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('analytics_events')
        .select(`
          *,
          tools (name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      setAnalytics({
        totalTools: toolCounts?.length || 0,
        activeTools: statusCounts.approved || 0,
        pendingTools: statusCounts.pending || 0,
        discontinuedTools: statusCounts.discontinued || 0,
        totalViews: totals.views,
        totalClicks: totals.clicks,
        totalBookmarks: totals.bookmarks,
        popularTools: formattedPopularTools,
        recentActivity: recentActivity || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateToolAnalytics = async () => {
    try {
      const { error } = await supabase.rpc('update_tool_analytics');
      if (error) throw error;
      await fetchAnalytics();
      return true;
    } catch (error) {
      console.error('Error updating tool analytics:', error);
      return false;
    }
  };

  return {
    analytics,
    loading,
    refetch: fetchAnalytics,
    updateToolAnalytics
  };
};
