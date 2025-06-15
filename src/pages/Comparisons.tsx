
import { useState } from 'react';
import { Scale, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { Background } from '@/components/Background';
import ToolComparison from '@/components/ToolComparison';
import { useAuth } from '@/hooks/useAuth';
import { useComparisons } from '@/hooks/useComparisons';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

const Comparisons = () => {
  const { user } = useAuth();
  const { tools } = useSupabaseData();
  const { comparisons, loading, deleteComparison } = useComparisons();
  const [selectedComparison, setSelectedComparison] = useState<string | null>(null);
  const [showNewComparison, setShowNewComparison] = useState(false);

  const handleDeleteComparison = async (comparisonId: string) => {
    const success = await deleteComparison(comparisonId);
    if (success) {
      toast({
        title: "Comparison deleted",
        description: "Your comparison has been removed",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete comparison",
        variant: "destructive",
      });
    }
  };

  const getComparisonTools = (toolIds: string[]) => {
    return tools.filter(tool => toolIds.includes(tool.id));
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <Card className="bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl">
              <CardContent className="p-12">
                <Scale className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Tool Comparisons
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Please sign in to view and manage your tool comparisons
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (selectedComparison || showNewComparison) {
    const comparison = comparisons.find(c => c.id === selectedComparison);
    const comparisonTools = comparison ? getComparisonTools(comparison.tool_ids) : [];

    return (
      <div className="min-h-screen">
        <Background variant="gradient" />
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <ToolComparison
              initialTools={comparisonTools}
              onClose={() => {
                setSelectedComparison(null);
                setShowNewComparison(false);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Scale className="w-8 h-8 mr-3" />
                My Comparisons
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your saved tool comparisons
              </p>
            </div>
            <Button
              onClick={() => setShowNewComparison(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Comparison</span>
            </Button>
          </div>

          {loading ? (
            <Card className="bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-900 dark:border-white rounded-full animate-spin border-t-transparent"></div>
                <p className="text-gray-500">Loading comparisons...</p>
              </CardContent>
            </Card>
          ) : comparisons.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl">
              <CardContent className="p-12 text-center">
                <Scale className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  No comparisons yet
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Create your first tool comparison to get started
                </p>
                <Button
                  onClick={() => setShowNewComparison(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Comparison</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {comparisons.map((comparison) => {
                const comparisonTools = getComparisonTools(comparison.tool_ids);
                
                return (
                  <Card
                    key={comparison.id}
                    className="bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                            {comparison.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Created {new Date(comparison.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedComparison(comparison.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComparison(comparison.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Comparing:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {comparisonTools.map((tool) => (
                            <Badge
                              key={tool.id}
                              variant="outline"
                              className="flex items-center space-x-1"
                            >
                              <div className="w-4 h-4 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded flex items-center justify-center">
                                <span className="text-white dark:text-gray-900 text-xs font-bold">
                                  {tool.name.charAt(0)}
                                </span>
                              </div>
                              <span>{tool.name}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comparisons;
