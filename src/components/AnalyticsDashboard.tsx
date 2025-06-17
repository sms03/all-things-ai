
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { RefreshCw, TrendingUp, Eye, MousePointer, Bookmark, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AnalyticsDashboard = () => {
  const { analytics, loading, updateToolAnalytics } = useAdminAnalytics();

  const handleRefreshAnalytics = async () => {
    const success = await updateToolAnalytics();
    if (success) {
      toast({
        title: "Analytics updated",
        description: "Tool analytics have been refreshed",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update analytics",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-900 dark:border-white rounded-full animate-spin border-t-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor tool performance and user engagement</p>
        </div>
        <Button onClick={handleRefreshAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookmarks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeTools}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.activeTools / analytics.totalTools) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Tools */}
      <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle>Most Popular Tools (Last 7 Days)</CardTitle>
          <CardDescription>Tools ranked by total engagement (views + clicks + bookmarks)</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.popularTools.length > 0 ? (
            <div className="space-y-4">
              {analytics.popularTools.map((tool, index) => (
                <div key={tool.tool_id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-white dark:text-gray-900 text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {tool.tool_name}
                      </h4>
                      <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {tool.views_count} views
                        </span>
                        <span className="flex items-center">
                          <MousePointer className="h-3 w-3 mr-1" />
                          {tool.clicks_count} clicks
                        </span>
                        <span className="flex items-center">
                          <Bookmark className="h-3 w-3 mr-1" />
                          {tool.bookmarks_count} bookmarks
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {tool.total_engagement} total engagements
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No analytics data available yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest user interactions with tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentActivity.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {activity.event_type === 'tool_click' && 'Tool clicked'}
                    {activity.event_type === 'page_view' && 'Page viewed'}
                    {activity.event_type === 'search' && 'Search performed'}
                    {activity.event_type === 'bookmark_added' && 'Tool bookmarked'}
                  </span>
                  {activity.tools?.name && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      - {activity.tools.name}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
