
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ExternalLink, Star } from 'lucide-react';
import { Tool } from '@/types/tool';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'freemium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'paid': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card 
      className={`group card-hover bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-lg font-semibold text-white shadow-lg">
              {tool.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{tool.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-all duration-300 ${
              isBookmarked 
                ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400 dark:text-gray-500">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${getPricingColor(tool.pricing)} border-0 font-medium`}>
            {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
          </Badge>
          
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 transition-all duration-300 hover:scale-105 shadow-md"
            onClick={() => window.open(tool.website, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Try
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
