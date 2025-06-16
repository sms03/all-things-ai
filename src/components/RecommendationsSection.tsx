
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/Button';
import { Star, ExternalLink, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useAuth } from '@/hooks/useAuth';

const RecommendationsSection = () => {
  const { recommendations, trendingTools, loading } = useRecommendations();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'freemium': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'paid': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-16">
      {/* Personalized Recommendations */}
      {user && recommendations.length > 0 && (
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-500 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Recommended for You
              </h2>
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Personalized AI tools based on your interests and activity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((tool, index) => (
              <Link key={tool.id} to={`/tool/${tool.id}`}>
                <Card className="group bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-bold">
                          {tool.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {tool.rating}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tool.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${getPricingColor(tool.pricing)}`}
                      >
                        {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(tool.website, '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Try
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trending Tools */}
      {trendingTools.length > 0 && (
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Trending This Week
              </h2>
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Most popular AI tools discovered by our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingTools.map((tool, index) => (
              <Link key={tool.id} to={`/tool/${tool.id}`}>
                <Card className="group bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-bold">
                          {tool.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {tool.rating}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tool.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${getPricingColor(tool.pricing)}`}
                      >
                        {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(tool.website, '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Try
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection;
