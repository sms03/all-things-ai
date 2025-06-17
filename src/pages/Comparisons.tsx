
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
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
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current.children, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

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
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
              <CardContent className="p-16">
                <i className="ri-scales-3-line text-6xl text-white/60 mb-8"></i>
                <h1 className="text-4xl font-bold text-white mb-6">
                  Tool Comparisons
                </h1>
                <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                  Please sign in to view and manage your tool comparisons
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                  <i className="ri-login-box-line mr-2"></i>
                  Sign In to Continue
                </Button>
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
        <div ref={pageRef} className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6 tracking-tight">
              <i className="ri-scales-3-line mr-4"></i>
              My Comparisons
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light mb-8">
              Manage your saved tool comparisons and create new ones
            </p>
            <Button
              onClick={() => setShowNewComparison(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
            >
              <i className="ri-add-line mr-2"></i>
              New Comparison
            </Button>
          </div>

          {loading ? (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
              <CardContent className="p-16 text-center">
                <div className="w-12 h-12 mx-auto mb-6 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                <p className="text-white/70 text-lg">Loading comparisons...</p>
              </CardContent>
            </Card>
          ) : comparisons.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
              <CardContent className="p-16 text-center">
                <i className="ri-scales-3-line text-6xl text-white/40 mb-8"></i>
                <h2 className="text-3xl font-semibold text-white mb-4">
                  No comparisons yet
                </h2>
                <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                  Create your first tool comparison to get started analyzing and comparing AI tools
                </p>
                <Button
                  onClick={() => setShowNewComparison(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                >
                  <i className="ri-add-line mr-2"></i>
                  Create Comparison
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {comparisons.map((comparison) => {
                const comparisonTools = getComparisonTools(comparison.tool_ids);
                
                return (
                  <Card
                    key={comparison.id}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-semibold text-white flex items-center">
                            <i className="ri-file-list-3-line mr-3 text-blue-400"></i>
                            {comparison.name}
                          </CardTitle>
                          <p className="text-white/60 mt-2 flex items-center">
                            <i className="ri-calendar-line mr-2"></i>
                            Created {new Date(comparison.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedComparison(comparison.id)}
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
                          >
                            <i className="ri-eye-line mr-2"></i>
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComparison(comparison.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full p-3 transition-all duration-300 hover:scale-105"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <span className="text-white/80 font-medium flex items-center">
                          <i className="ri-apps-line mr-2"></i>
                          Comparing:
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {comparisonTools.map((tool) => (
                            <Badge
                              key={tool.id}
                              variant="outline"
                              className="bg-white/10 border-white/30 text-white flex items-center space-x-2 px-3 py-1 rounded-full"
                            >
                              <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
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
