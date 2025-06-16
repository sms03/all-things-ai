
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Heart, Star, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';
import Navigation from '@/components/Navigation';
import { Background } from '@/components/Background';
import Reviews from '@/components/Reviews';
import { useUserActivity } from '@/hooks/useUserActivity';

interface ToolDetail {
  id: string;
  name: string;
  description: string;
  website: string;
  pricing: string;
  rating: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  category: {
    name: string;
    slug: string;
  };
  submitted_by?: string;
}

const ToolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarkedToolIds, toggleBookmark } = useSupabaseData();
  const { trackActivity } = useUserActivity();
  const { trackEvent, trackToolClick } = useAnalytics();
  const [tool, setTool] = useState<ToolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  useEffect(() => {
    if (id) {
      fetchToolDetail();
    }
  }, [id]);

  useEffect(() => {
    if (tool && user) {
      trackActivity('view_tool', tool.id, { tool_name: tool.name });
      trackEvent('page_view', { page: 'tool_detail', tool_id: tool.id, tool_name: tool.name });
    }
  }, [tool, user, trackActivity, trackEvent]);

  const fetchToolDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setTool({
        ...data,
        category: data.categories
      });
    } catch (error) {
      console.error('Error fetching tool:', error);
      toast({
        title: "Error",
        description: "Failed to load tool details",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark tools",
        variant: "destructive",
      });
      return;
    }

    if (!tool) return;

    setIsTogglingBookmark(true);
    const result = await toggleBookmark(tool.id);
    
    if (result !== null) {
      // Track bookmark activity
      await trackActivity('bookmark_tool', tool.id, { 
        tool_name: tool.name,
        bookmarked: result 
      });
      
      await trackEvent('bookmark_added', {
        tool_id: tool.id,
        tool_name: tool.name,
        bookmarked: result
      });
      
      toast({
        title: result ? "Bookmarked!" : "Bookmark removed",
        description: result ? "Tool added to your favorites" : "Tool removed from your favorites",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
    setIsTogglingBookmark(false);
  };

  const handleVisitWebsite = async () => {
    if (!tool) return;
    
    await trackToolClick(tool.id);
    window.open(tool.website, '_blank');
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'freemium': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'paid': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center bg-white/95 backdrop-blur-xl dark:bg-black/95 border border-gray-100/20 dark:border-white/10 rounded-3xl p-16 shadow-2xl animate-fade-in max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-8 border-2 border-gray-900 dark:border-white rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900 dark:text-white mb-3 tracking-tight">Loading tool details</div>
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isBookmarked = bookmarkedToolIds.has(tool.id);

  return (
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>

          {/* Tool Card */}
          <Card className="bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
            <CardContent className="p-12">
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-3xl flex items-center justify-center shadow-lg">
                    <span className="text-white dark:text-gray-900 text-3xl font-bold">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {tool.name}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-400">{tool.rating}</span>
                      </div>
                      <Badge variant="outline" className={`h-8 px-4 font-medium text-sm border rounded-full ${getPricingColor(tool.pricing)}`}>
                        {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="h-8 px-4">
                        {tool.category.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleBookmark}
                    disabled={isTogglingBookmark}
                    className={`w-12 h-12 p-0 rounded-full transition-all duration-300 ${
                      isBookmarked 
                        ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:scale-110' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    size="lg"
                    className="h-12 px-8 font-medium rounded-full transition-all duration-300 hover:scale-105"
                    onClick={handleVisitWebsite}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center h-8 px-4 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Added on</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(tool.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {tool.category.name}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Reviews toolId={tool.id} />
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
