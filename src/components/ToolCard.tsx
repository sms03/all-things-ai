
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ExternalLink, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';
import type { Tool } from '@/hooks/useSupabaseData';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const { user } = useAuth();
  const { bookmarkedToolIds, toggleBookmark } = useSupabaseData();
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  const isBookmarked = bookmarkedToolIds.has(tool.id);

  const handleBookmark = async (e: React.MouseEvent) => {
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

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'freemium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'paid': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Card 
      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-md flex items-center justify-center ibm-plex-serif-semibold text-white dark:text-black">
              {tool.name.charAt(0)}
            </div>
            <div>
              <h3 className="ibm-plex-serif-semibold text-lg text-black dark:text-white">
                {tool.name}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="ibm-plex-serif-regular text-sm text-gray-600 dark:text-gray-400">{tool.rating}</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            disabled={isTogglingBookmark}
            className={`w-8 h-8 p-0 rounded-md transition-colors ${
              isBookmarked 
                ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Description */}
        <p className="ibm-plex-serif-regular text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[28px] items-start">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center h-6 px-2 text-xs ibm-plex-serif-regular bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="inline-flex items-center h-6 px-2 text-xs ibm-plex-serif-regular text-gray-400 dark:text-gray-500">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`h-6 px-2 ibm-plex-serif-medium text-xs border rounded ${getPricingColor(tool.pricing)}`}
          >
            {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
          </Badge>
          
          <Button
            size="sm"
            className="h-8 px-4 ibm-plex-serif-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded border border-black dark:border-white transition-colors"
            onClick={() => window.open(tool.website, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Try
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
