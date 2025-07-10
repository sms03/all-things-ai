import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Search, MousePointer, Calendar, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Background } from '@/components/Background';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsData {
  totalEvents: number;
  totalSearches: number;
  totalClicks: number;
  topTools: Array<{ name: string; clicks: number; id: string }>;
  eventsByType: Array<{ type: string; count: number }>;
  dailyActivity: Array<{ date: string; events: number; searches: number; clicks: number }>;
  topSearchQueries: Array<{ query: string; count: number; results: number }>;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch analytics events
      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Fetch search queries
      const { data: searches } = await supabase
        .from('search_queries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Process data
      const totalEvents = events?.length || 0;
      const totalSearches = searches?.length || 0;
      const totalClicks = events?.filter(e => e.event_type === 'tool_click').length || 0;

      // Top tools by clicks
      const toolClicks = (events || [])
        .filter(e => e.event_type === 'tool_click' && e.tool_id)
        .reduce((acc, event) => {
          const toolId = event.tool_id!;
          acc[toolId] = (acc[toolId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topToolIds = Object.entries(toolClicks)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([toolId]) => toolId);

      let topTools: Array<{ name: string; clicks: number; id: string }> = [];
      if (topToolIds.length > 0) {
        const { data: toolsData } = await supabase
          .from('tools')
          .select('id, name')
          .in('id', topToolIds);

        topTools = (toolsData || []).map(tool => ({
          ...tool,
          clicks: toolClicks[tool.id] || 0
        })).sort((a, b) => b.clicks - a.clicks);
      }

      // Events by type
      const eventTypes = (events || []).reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const eventsByType = Object.entries(eventTypes).map(([type, count]) => ({
        type: type.replace('_', ' '),
        count
      }));

      // Daily activity
      const dailyData = {} as Record<string, { events: number; searches: number; clicks: number }>;
      
      (events || []).forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = { events: 0, searches: 0, clicks: 0 };
        }
        dailyData[date].events++;
        if (event.event_type === 'tool_click') {
          dailyData[date].clicks++;
        }
      });

      (searches || []).forEach(search => {
        const date = new Date(search.created_at).toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = { events: 0, searches: 0, clicks: 0 };
        }
        dailyData[date].searches++;
      });

      const dailyActivity = Object.entries(dailyData)
        .map(([date, activity]) => ({ date, ...activity }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Top search queries
      const searchCounts = (searches || []).reduce((acc, search) => {
        const query = search.query.toLowerCase();
        if (!acc[query]) {
          acc[query] = { count: 0, totalResults: 0 };
        }
        acc[query].count++;
        acc[query].totalResults += search.results_count || 0;
        return acc;
      }, {} as Record<string, { count: number; totalResults: number }>);

      const topSearchQueries = Object.entries(searchCounts)
        .map(([query, data]) => ({
          query,
          count: data.count,
          results: Math.round(data.totalResults / data.count) || 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setData({
        totalEvents,
        totalSearches,
        totalClicks,
        topTools,
        eventsByType,
        dailyActivity,
        topSearchQueries
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Please sign in to view your analytics data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Track your AI tool discovery journey
            </p>

            {/* Time Range Selector */}
            <div className="flex justify-center space-x-2">
              {[
                { key: '7d', label: '7 Days' },
                { key: '30d', label: '30 Days' },
                { key: '90d', label: '90 Days' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-xl animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {data.totalEvents}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Searches</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {data.totalSearches}
                        </p>
                      </div>
                      <Search className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tool Clicks</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {data.totalClicks}
                        </p>
                      </div>
                      <MousePointer className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Daily</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {Math.round(data.totalEvents / parseInt(timeRange))}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Activity */}
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardHeader>
                    <CardTitle>Daily Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data.dailyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="events" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="searches" stroke="#06B6D4" strokeWidth={2} />
                        <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Event Types */}
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardHeader>
                    <CardTitle>Activity Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.eventsByType}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.eventsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Tools */}
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardHeader>
                    <CardTitle>Most Clicked Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.topTools.map((tool, index) => (
                        <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="font-medium">{tool.name}</span>
                          </div>
                          <Badge variant="secondary">
                            {tool.clicks} clicks
                          </Badge>
                        </div>
                      ))}
                      {data.topTools.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No tool clicks yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Search Queries */}
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50">
                  <CardHeader>
                    <CardTitle>Top Search Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.topSearchQueries.map((search, index) => (
                        <div key={search.query} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="font-medium">{search.query}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{search.count} searches</div>
                            <div className="text-xs text-gray-500">{search.results} avg results</div>
                          </div>
                        </div>
                      ))}
                      {data.topSearchQueries.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No searches yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No analytics data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
