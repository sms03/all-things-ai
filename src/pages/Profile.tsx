
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Heart, Plus, ExternalLink, Star, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface Tool {
  id: string;
  name: string;
  description: string;
  website: string;
  pricing: string;
  rating: number;
  tags: string[];
  category: {
    name: string;
    slug: string;
  };
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookmarkedTools, setBookmarkedTools] = useState<Tool[]>([]);
  const [submittedTools, setSubmittedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch bookmarked tools
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select(`
          tool_id,
          tools (
            id,
            name,
            description,
            website,
            pricing,
            rating,
            tags,
            categories (
              name,
              slug
            )
          )
        `)
        .eq('user_id', user.id);

      if (bookmarksError) throw bookmarksError;
      
      const bookmarked = bookmarksData?.map(bookmark => ({
        ...bookmark.tools,
        category: bookmark.tools.categories
      })) || [];
      setBookmarkedTools(bookmarked);

      // Fetch submitted tools
      const { data: submittedData, error: submittedError } = await supabase
        .from('tools')
        .select(`
          id,
          name,
          description,
          website,
          pricing,
          rating,
          tags,
          categories (
            name,
            slug
          )
        `)
        .eq('submitted_by', user.id);

      if (submittedError) throw submittedError;
      
      const submitted = submittedData?.map(tool => ({
        ...tool,
        category: tool.categories
      })) || [];
      setSubmittedTools(submitted);

    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const removeBookmark = async (toolId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId);

      if (error) throw error;

      setBookmarkedTools(prev => prev.filter(tool => tool.id !== toolId));
      toast({
        title: "Bookmark removed",
        description: "Tool removed from your favorites.",
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'freemium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'paid': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/" className="text-2xl font-bold text-blue-600">
                A2Z AI Tools
              </Link>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {profile?.full_name || 'User'}
                  </CardTitle>
                  <CardDescription>{profile?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="bookmarks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookmarks">
              <Heart className="w-4 h-4 mr-2" />
              Bookmarked Tools ({bookmarkedTools.length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              <Plus className="w-4 h-4 mr-2" />
              Submitted Tools ({submittedTools.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="mt-6">
            {bookmarkedTools.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No bookmarked tools yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Start exploring and bookmark your favorite AI tools
                  </p>
                  <Link to="/">
                    <Button>Explore Tools</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedTools.map((tool) => (
                  <Card key={tool.id} className="group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {tool.name}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500">{tool.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBookmark(tool.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${getPricingColor(tool.pricing)} border-0`}>
                          {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => window.open(tool.website, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="submitted" className="mt-6">
            {submittedTools.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Plus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No submitted tools yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Share your favorite AI tools with the community
                  </p>
                  <Link to="/submit-tool">
                    <Button>Submit a Tool</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submittedTools.map((tool) => (
                  <Card key={tool.id} className="group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {tool.name}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500">{tool.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${getPricingColor(tool.pricing)} border-0`}>
                          {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => window.open(tool.website, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
