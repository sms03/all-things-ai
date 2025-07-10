import { useState } from 'react';
import { X, Plus, Scale, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useComparisons } from '@/hooks/useComparisons';
import { useSupabaseData, type Tool } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

interface ToolComparisonProps {
  initialTools?: Tool[];
  onClose?: () => void;
}

const ToolComparison = ({ initialTools = [], onClose }: ToolComparisonProps) => {
  const { user } = useAuth();
  const { tools } = useSupabaseData();
  const { createComparison } = useComparisons();
  const [selectedTools, setSelectedTools] = useState<Tool[]>(initialTools);
  const [comparisonName, setComparisonName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [saving, setSaving] = useState(false);

  const addTool = (tool: Tool) => {
    if (selectedTools.find(t => t.id === tool.id)) return;
    if (selectedTools.length >= 4) {
      toast({
        title: "Limit reached",
        description: "You can compare up to 4 tools at once",
        variant: "destructive",
      });
      return;
    }
    setSelectedTools([...selectedTools, tool]);
  };

  const removeTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  const saveComparison = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save comparisons",
        variant: "destructive",
      });
      return;
    }

    if (selectedTools.length < 2) {
      toast({
        title: "More tools needed",
        description: "Select at least 2 tools to create a comparison",
        variant: "destructive",
      });
      return;
    }

    if (!comparisonName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this comparison",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const success = await createComparison(
      comparisonName.trim(),
      selectedTools.map(t => t.id)
    );

    if (success) {
      toast({
        title: "Comparison saved!",
        description: "Your tool comparison has been saved",
      });
      setComparisonName('');
      setShowNameInput(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to save comparison",
        variant: "destructive",
      });
    }
    setSaving(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Scale className="w-6 h-6 mr-2" />
          Tool Comparison
        </h2>
        <div className="flex items-center space-x-3">
          {selectedTools.length >= 2 && (
            <Button
              onClick={() => setShowNameInput(true)}
              disabled={showNameInput}
            >
              <Plus className="w-4 h-4 mr-2" />
              Save Comparison
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Save Comparison Form */}
      {showNameInput && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Input
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="Enter comparison name..."
                className="flex-1"
              />
              <Button
                onClick={saveComparison}
                disabled={saving || !comparisonName.trim()}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNameInput(false);
                  setComparisonName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tool Selection */}
      {selectedTools.length < 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Tools to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {tools
                .filter(tool => !selectedTools.find(t => t.id === tool.id))
                .slice(0, 12)
                .map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => addTool(tool)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-white dark:text-gray-900 text-sm font-bold">
                        {tool.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{tool.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{tool.pricing}</p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {selectedTools.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Feature
                    </th>
                    {selectedTools.map((tool) => (
                      <th key={tool.id} className="px-6 py-4 text-center min-w-48">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-white dark:text-gray-900 text-xs font-bold">
                                {tool.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {tool.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTool(tool.id)}
                            className="w-6 h-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Description */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      Description
                    </td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        <p className="line-clamp-3">{tool.description}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      Rating
                    </td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{tool.rating}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Pricing */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      Pricing
                    </td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="px-6 py-4 text-center">
                        <Badge 
                          variant="outline" 
                          className={`${getPricingColor(tool.pricing)}`}
                        >
                          {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Tags */}
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      Tags
                    </td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {tool.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {tool.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{tool.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      Website
                    </td>
                    {selectedTools.map((tool) => (
                      <td key={tool.id} className="px-6 py-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(tool.website, '_blank')}
                          className="w-full"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTools.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Scale className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
              Compare AI Tools
            </h3>
            <p className="text-gray-500 mb-6">
              Select tools from the list above to create a detailed comparison
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ToolComparison;
