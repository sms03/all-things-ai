
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ExternalLink, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/Button';
import { Link } from 'react-router-dom';
import type { Tool } from '@/hooks/useSupabaseData';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const { user } = useAuth();
  const { bookmarkedToolIds, toggleBookmark } = useSupabaseData();
  const { trackEvent, trackToolClick } = useAnalytics();
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  const isBookmarked = bookmarkedToolIds.has(tool.id);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark tools",
        variant: "destructive",
      });
      return;
    }

    setIsTogglingBookmark(true);
    const result = await toggleBookmark(tool.id);
    
    if (result !== null) {
      // Track bookmark event
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

  const handleVisitWebsite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Track tool click
    await trackToolClick(tool.id);
    
    window.open(tool.website, '_blank');
  };

  const handleCardClick = async () => {
    // Track tool view
    await trackToolClick(tool.id);
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'freemium': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'paid': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Link to={`/tool/${tool.id}`} className="block" onClick={handleCardClick}>
      <Card 
        className="group bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-500 hover:scale-[1.02] animate-fade-in overflow-hidden cursor-pointer"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white dark:text-gray-900 text-xl font-bold">
                  {tool.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {tool.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{tool.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              disabled={isTogglingBookmark}
              className={`w-10 h-10 p-0 rounded-full transition-all duration-300 ${
                isBookmarked 
                  ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:scale-110' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110'
              }`}
            >
              <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-base mb-6 leading-relaxed line-clamp-3">
            {tool.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 min-h-[32px] items-start">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center h-7 px-3 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700"
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="inline-flex items-center h-7 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                +{tool.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Footer - Aligned pricing and button */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`h-8 px-4 font-medium text-sm border rounded-full ${getPricingColor(tool.pricing)}`}
            >
              {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
            </Badge>
            
            <Button
              variant="primary"
              size="sm"
              className="h-8 px-4 font-medium rounded-full transition-all duration-300 hover:scale-105 group-hover:shadow-lg text-sm"
              onClick={handleVisitWebsite}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Try Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
