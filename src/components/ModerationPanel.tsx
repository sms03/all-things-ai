
import { useState } from 'react';
import { useModeration } from '@/hooks/useModeration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  Star,
  Calendar,
  User
} from 'lucide-react';

const ModerationPanel = () => {
  const { moderationQueue, loading, moderateTool, bulkModerateTool } = useModeration();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [moderationNotes, setModerationNotes] = useState<Record<string, string>>({});
  const [bulkNotes, setBulkNotes] = useState('');

  const handleSingleModeration = async (toolId: string, status: 'approved' | 'rejected' | 'discontinued') => {
    const notes = moderationNotes[toolId];
    const success = await moderateTool(toolId, status, notes);
    
    if (success) {
      toast({
        title: "Tool moderated successfully",
        description: `Tool has been ${status}`,
      });
      setModerationNotes(prev => ({ ...prev, [toolId]: '' }));
    } else {
      toast({
        title: "Error",
        description: "Failed to moderate tool",
        variant: "destructive",
      });
    }
  };

  const handleBulkModeration = async (status: 'approved' | 'rejected' | 'discontinued') => {
    if (selectedTools.length === 0) {
      toast({
        title: "No tools selected",
        description: "Please select tools to moderate",
        variant: "destructive",
      });
      return;
    }

    const success = await bulkModerateTool(selectedTools, status, bulkNotes);
    
    if (success) {
      toast({
        title: "Bulk moderation successful",
        description: `${selectedTools.length} tools have been ${status}`,
      });
      setSelectedTools([]);
      setBulkNotes('');
    } else {
      toast({
        title: "Error",
        description: "Failed to bulk moderate tools",
        variant: "destructive",
      });
    }
  };

  const toggleToolSelection = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      approved: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      discontinued: 'bg-gray-50 text-gray-700 border-gray-200'
    };

    const statusIcons = {
      pending: AlertTriangle,
      approved: CheckCircle,
      rejected: XCircle,
      discontinued: AlertTriangle
    };

    const Icon = statusIcons[status as keyof typeof statusIcons] || AlertTriangle;

    return (
      <Badge variant="outline" className={statusColors[status as keyof typeof statusColors]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-900 dark:border-white rounded-full animate-spin border-t-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading moderation queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bulk Actions */}
      {selectedTools.length > 0 && (
        <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle>Bulk Actions ({selectedTools.length} selected)</CardTitle>
            <CardDescription>Moderate multiple tools at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add notes for bulk moderation (optional)"
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
            />
            <div className="flex gap-4">
              <Button
                onClick={() => handleBulkModeration('approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All
              </Button>
              <Button
                onClick={() => handleBulkModeration('rejected')}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject All
              </Button>
              <Button
                onClick={() => handleBulkModeration('discontinued')}
                variant="outline"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Mark as Discontinued
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderation Queue */}
      <div className="grid gap-6">
        {moderationQueue.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
              <p className="text-gray-600 dark:text-gray-400">No tools pending moderation</p>
            </CardContent>
          </Card>
        ) : (
          moderationQueue.map((record) => (
            <Card key={record.id} className="bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedTools.includes(record.tool_id)}
                      onCheckedChange={() => toggleToolSelection(record.tool_id)}
                    />
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {record.tool?.name || 'Unknown Tool'}
                        {getStatusBadge(record.tool?.status || 'pending')}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {record.tool?.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {record.tool?.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{record.tool.rating}</span>
                      </div>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={record.tool?.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Submitted: {new Date(record.tool?.created_at || '').toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Pricing: {record.tool?.pricing}</span>
                  </div>
                </div>

                {record.tool?.tags && record.tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {record.tool.tags.slice(0, 5).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {record.tool.tags.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{record.tool.tags.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}

                <Textarea
                  placeholder="Add moderation notes..."
                  value={moderationNotes[record.tool_id] || ''}
                  onChange={(e) => setModerationNotes(prev => ({
                    ...prev,
                    [record.tool_id]: e.target.value
                  }))}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSingleModeration(record.tool_id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleSingleModeration(record.tool_id, 'rejected')}
                    variant="destructive"
                    size="sm"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleSingleModeration(record.tool_id, 'discontinued')}
                    variant="outline"
                    size="sm"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Discontinued
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ModerationPanel;
