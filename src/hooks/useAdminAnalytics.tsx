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

      // Fetch recent analytics data (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: recentAnalytics } = await supabase
        .from('tool_analytics')
        .select(`
          *,
          tools (name)
        `)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: false });

      // Calculate totals from recent analytics
      const totals = (recentAnalytics || []).reduce((acc, record) => {
        acc.views += record.views_count || 0;
        acc.clicks += record.clicks_count || 0;
        acc.bookmarks += record.bookmarks_count || 0;
        return acc;
      }, { views: 0, clicks: 0, bookmarks: 0 });

      // Get popular tools by aggregating last 7 days data
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: weeklyAnalytics } = await supabase
        .from('tool_analytics')
        .select(`
          tool_id,
          views_count,
          clicks_count,
          bookmarks_count,
          tools (name)
        `)
        .gte('date', sevenDaysAgo)
        .not('tools', 'is', null);

      // Aggregate data by tool_id
      const toolEngagement = new Map<string, {
        tool_id: string;
        tool_name: string;
        total_views: number;
        total_clicks: number;
        total_bookmarks: number;
        total_engagement: number;
      }>();

      (weeklyAnalytics || []).forEach(record => {
        const toolId = record.tool_id;
        const existing = toolEngagement.get(toolId) || {
          tool_id: toolId,
          tool_name: record.tools?.name || 'Unknown',
          total_views: 0,
          total_clicks: 0,
          total_bookmarks: 0,
          total_engagement: 0
        };

        existing.total_views += record.views_count || 0;
        existing.total_clicks += record.clicks_count || 0;
        existing.total_bookmarks += record.bookmarks_count || 0;
        existing.total_engagement = existing.total_views + existing.total_clicks + existing.total_bookmarks;

        toolEngagement.set(toolId, existing);
      });

      // Convert to array and sort by engagement
      const formattedPopularTools: ToolAnalytics[] = Array.from(toolEngagement.values())
        .sort((a, b) => b.total_engagement - a.total_engagement)
        .slice(0, 10)
        .map(tool => ({
          id: tool.tool_id,
          tool_id: tool.tool_id,
          date: '',
          views_count: tool.total_views,
          clicks_count: tool.total_clicks,
          bookmarks_count: tool.total_bookmarks,
          searches_count: 0,
          tool_name: tool.tool_name,
          total_engagement: tool.total_engagement
        }));

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
