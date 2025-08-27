
import { useState } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Background } from '@/components/Background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Bookmark,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import ModerationPanel from '@/components/ModerationPanel';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import UserManagement from '@/components/UserManagement';

const AdminDashboard = () => {
  const { currentUserRole, loading: roleLoading, isAdmin } = useRoles();
  const { analytics, loading: analyticsLoading } = useAdminAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  if (roleLoading) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white/95 backdrop-blur-xl dark:bg-black/95 border border-gray-100/20 dark:border-white/10 rounded-3xl p-16 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-8 border-2 border-gray-900 dark:border-white rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900 dark:text-white">Checking permissions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Manage tools, users, and monitor platform analytics
            </p>
            <Badge variant="outline" className="mt-4">
              Role: {currentUserRole}
            </Badge>
          </div>

          {/* Overview Cards */}
          {!analyticsLoading && analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalTools}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.activeTools} active
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.pendingTools}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting moderation
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-900/80">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
                  <CardHeader>
                    <CardTitle>Popular Tools (Last 7 Days)</CardTitle>
                    <CardDescription>Most engaged tools by users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.popularTools.slice(0, 5).map((tool, index) => (
                        <div key={tool.tool_id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-white dark:text-gray-900 text-sm font-bold">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {tool.tool_name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {tool.total_engagement} total engagements
                              </p>
                            </div>
                          </div>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => setActiveTab('moderation')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Review Pending Tools ({analytics?.pendingTools || 0})
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('analytics')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('users')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage User Roles
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="moderation">
              <ModerationPanel />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
