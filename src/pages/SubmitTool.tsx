
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, User, LogIn, Brain } from 'lucide-react';

const SubmitTool = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    pricing: '',
    category_id: '',
    use_case: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a tool",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.description || !formData.website || !formData.pricing || !formData.category_id) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('tools')
        .insert({
          name: formData.name,
          description: formData.description,
          website: formData.website,
          pricing: formData.pricing,
          category_id: formData.category_id,
          tags: formData.tags,
          submitted_by: user.id,
          rating: 4.0
        });

      if (error) throw error;

      toast({
        title: "Tool submitted successfully!",
        description: "Thank you for contributing to our AI tools directory",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        website: '',
        pricing: '',
        category_id: '',
        use_case: '',
        tags: []
      });

      // Redirect to home page
      navigate('/');

    } catch (error) {
      console.error('Error submitting tool:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="pt-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg animate-fade-in">
              <div className="text-center py-12 px-6">
                <div className="w-20 h-20 mx-auto mb-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white dark:text-black" />
                </div>
                <h3 className="text-xl ibm-plex-serif-semibold text-black dark:text-white mb-2">
                  Sign in required
                </h3>
                <p className="ibm-plex-serif-regular text-gray-600 dark:text-gray-400 mb-6">
                  Please sign in to submit an AI tool to our directory
                </p>
                <Link to="/auth">
                  <Button className="ibm-plex-serif-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg animate-fade-in">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h1 className="text-3xl ibm-plex-serif-bold text-black dark:text-white mb-2">
                  Submit an AI Tool
                </h1>
                <p className="ibm-plex-serif-regular text-gray-600 dark:text-gray-400">
                  Share your favorite AI tool with the community. Help others discover amazing AI solutions!
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tool Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="ibm-plex-serif-medium text-black dark:text-white">Tool Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., ChatGPT, Midjourney, etc."
                    required
                    className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="ibm-plex-serif-medium text-black dark:text-white">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this tool does and its key features..."
                    rows={4}
                    required
                    className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                  />
                </div>

                {/* Website URL */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="ibm-plex-serif-medium text-black dark:text-white">Website URL *</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    required
                    className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="ibm-plex-serif-medium text-black dark:text-white">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-black border-gray-300 dark:border-gray-700">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="ibm-plex-serif-regular">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <Label htmlFor="pricing" className="ibm-plex-serif-medium text-black dark:text-white">Pricing Model *</Label>
                  <Select
                    value={formData.pricing}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, pricing: value }))}
                  >
                    <SelectTrigger className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white">
                      <SelectValue placeholder="Select pricing model" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-black border-gray-300 dark:border-gray-700">
                      <SelectItem value="free" className="ibm-plex-serif-regular">Free</SelectItem>
                      <SelectItem value="freemium" className="ibm-plex-serif-regular">Freemium</SelectItem>
                      <SelectItem value="paid" className="ibm-plex-serif-regular">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Use Case */}
                <div className="space-y-2">
                  <Label htmlFor="use_case" className="ibm-plex-serif-medium text-black dark:text-white">Use Case</Label>
                  <Textarea
                    id="use_case"
                    value={formData.use_case}
                    onChange={(e) => setFormData(prev => ({ ...prev, use_case: e.target.value }))}
                    placeholder="Describe the main use cases and who would benefit from this tool..."
                    rows={3}
                    className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="ibm-plex-serif-medium text-black dark:text-white">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                    />
                    <Button 
                      type="button" 
                      onClick={addTag} 
                      size="sm"
                      className="ibm-plex-serif-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="ibm-plex-serif-regular bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full ibm-plex-serif-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors py-3 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Submit Tool
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTool;
