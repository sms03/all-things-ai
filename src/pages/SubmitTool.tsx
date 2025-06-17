
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="pt-24 pb-16">
          <div className="max-w-lg mx-auto px-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
              <CardContent className="pt-12 pb-8 px-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-2xl ibm-plex-serif-bold text-gray-900 dark:text-white mb-3">
                  Sign in required
                </h3>
                <p className="ibm-plex-serif-regular text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Please sign in to submit an AI tool to our directory
                </p>
                <Link to="/auth">
                  <Button className="ibm-plex-serif-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all duration-200 px-8 py-3 rounded-xl">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 ibm-plex-serif-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
            <CardHeader className="text-center pb-8 pt-12 px-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-10 h-10 text-white dark:text-gray-900" />
              </div>
              <CardTitle className="text-4xl ibm-plex-serif-bold text-gray-900 dark:text-white mb-4">
                Submit an AI Tool
              </CardTitle>
              <CardDescription className="ibm-plex-serif-regular text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                Share your favorite AI tool with the community. Help others discover amazing AI solutions!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-12 pb-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Tool Name */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="ibm-plex-serif-semibold text-gray-900 dark:text-white text-base">
                    Tool Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., ChatGPT, Midjourney, etc."
                    required
                    className="ibm-plex-serif-regular text-base py-3 px-4 border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 rounded-xl transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="ibm-plex-serif-semibold text-gray-900 dark:text-white text-base">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this tool does and its key features..."
                    rows={4}
                    required
                    className="ibm-plex-serif-regular text-base py-3 px-4 border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 rounded-xl transition-all duration-200 resize-none"
                  />
                </div>

                {/* Website URL */}
                <div className="space-y-3">
                  <Label htmlFor="website" className="ibm-plex-serif-semibold text-gray-900 dark:text-white text-base">
                    Website URL *
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    required
                    className="ibm-plex-serif-regular text-base py-3 px-4 border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 rounded-xl transition-all duration-200"
                  />
                </div>

                {/* Two Column Layout for Category and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-3">
                    <Label htmlFor="category" className="ibm-plex-serif-semibold text-gray-900 dark:text-white text-base">
                      Category *
                    </Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger className="ibm-plex-serif-regular text-base py-3 px-4 border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white rounded-xl transition-all duration-200">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="ibm-plex-serif-regular py-3">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3">
                    <Label htmlFor="pricing" className="ibm-plex-serif-semibold text-gray-900 dark:text-white text-base">
                      Pricing Model *
                    </Label>
                    <Select
                      value={formData.pricing}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, pricing: value }))}
                    >
                      <SelectTrigger className="ibm-plex-serif-regular text-base py-3 px-4 border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white rounded-xl transition-all duration-200">
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                        <SelectItem value="free" className="ibm-plex-serif-regular py-3">Free</SelectItem>
                        <SelectItem value="freemium" className="ibm-plex-serif-regular py-3">Freemium</SelectItem>
                        <SelectItem value="paid" className="ibm-plex-serif-regular py-3">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Use Case */}
                <div className="space-y-3">
                  <Label htmlFor="use_case" className="ibm-plex-serif-semibold text-gray-900 dark:text-white text-base">
                    Use Case
                  </Label>
                  <Textarea
                    id="use_case"
                    value={formData.use_case}
                    onChange={(e) => setFormData(prev => ({ ...prev, use_case: e.target.value }))}
                    placeholder="Describe the main use cases and who would benefit from this tool..."
                    rows={3}
                    className="ibm-plex-serif-regular text-base py-3 px-4 border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 rounded-xl transition-all duration-200 resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label htmlFor="tags" className="ibm-plex-serif-semibold text-gray-900 dark:text-white text-base">
                    Tags
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="tags"
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="ibm-plex-serif-regular text-base py-3 px-4 border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 rounded-xl transition-all duration-200"
                    />
                    <Button 
                      type="button" 
                      onClick={addTag} 
                      variant="outline"
                      className="ibm-plex-serif-medium px-6 py-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="ibm-plex-serif-regular bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-lg flex items-center gap-2">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full ibm-plex-serif-semibold bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all duration-200 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 mr-3 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-3" />
                        Submit Tool
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitTool;
