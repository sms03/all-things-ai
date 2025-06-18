
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  website: z.string().url('Please enter a valid URL'),
  category_id: z.string().min(1, 'Please select a category'),
  pricing: z.enum(['free', 'freemium', 'paid']),
  tags: z.string().optional(),
});

const SubmitTool = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useSupabaseData();
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      category_id: '',
      pricing: 'free',
      tags: '',
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a tool",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('tools')
        .insert({
          name: values.name,
          description: values.description,
          website: values.website,
          category_id: values.category_id,
          pricing: values.pricing,
          tags: tags,
          submitted_by: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Tool submitted successfully!",
        description: "Your tool submission is being reviewed and will be published soon.",
      });

      form.reset();
      setTags([]);
      navigate('/');
    } catch (error) {
      console.error('Error submitting tool:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div ref={pageRef} className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Submit AI Tool
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Share an amazing AI tool with the community and help others discover powerful solutions
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="text-center border-b border-gray-100 pb-6">
              <CardTitle className="text-2xl text-gray-900 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-file-add-line text-white text-lg"></i>
                </div>
                Tool Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill out the details below to submit your AI tool for review
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Tool Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium flex items-center">
                          <i className="ri-apps-line mr-2 text-blue-600"></i>
                          Tool Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter the AI tool name (e.g., ChatGPT, Midjourney)" 
                            {...field} 
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium flex items-center">
                          <i className="ri-file-text-line mr-2 text-blue-600"></i>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this AI tool does, its key features, and how it helps users..." 
                            {...field} 
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 min-h-[120px] resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Website URL */}
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium flex items-center">
                          <i className="ri-links-line mr-2 text-blue-600"></i>
                          Website URL
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            {...field} 
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  {/* Category and Pricing Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-medium flex items-center">
                            <i className="ri-folder-line mr-2 text-blue-600"></i>
                            Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600/20 h-12">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200">
                              {categories.map((category) => (
                                <SelectItem 
                                  key={category.id} 
                                  value={category.id}
                                  className="text-gray-900 hover:bg-gray-50"
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    {/* Pricing */}
                    <FormField
                      control={form.control}
                      name="pricing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-medium flex items-center">
                            <i className="ri-price-tag-3-line mr-2 text-blue-600"></i>
                            Pricing Model
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600/20 h-12">
                                <SelectValue placeholder="Select pricing model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="free" className="text-gray-900 hover:bg-gray-50">
                                <div className="flex items-center">
                                  <i className="ri-gift-line mr-2 text-green-600"></i>
                                  Free
                                </div>
                              </SelectItem>
                              <SelectItem value="freemium" className="text-gray-900 hover:bg-gray-50">
                                <div className="flex items-center">
                                  <i className="ri-star-half-line mr-2 text-yellow-600"></i>
                                  Freemium
                                </div>
                              </SelectItem>
                              <SelectItem value="paid" className="text-gray-900 hover:bg-gray-50">
                                <div className="flex items-center">
                                  <i className="ri-vip-crown-line mr-2 text-purple-600"></i>
                                  Paid
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tags */}
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium flex items-center">
                      <i className="ri-hashtag mr-2 text-blue-600"></i>
                      Tags
                    </FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Enter a tag (e.g., productivity, writing, AI agent)..."
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 h-12"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                          className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 h-12 px-6"
                        >
                          <i className="ri-add-line"></i>
                        </Button>
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-blue-50 border-blue-200 text-blue-800 px-3 py-1 flex items-center gap-2"
                            >
                              <i className="ri-hashtag text-xs"></i>
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-600 transition-colors ml-1"
                              >
                                <i className="ri-close-line text-sm"></i>
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription className="text-gray-500">
                      Add relevant tags to help users discover your tool. Popular tags include: productivity, writing, image generation, AI agent, MCP server, automation
                    </FormDescription>
                  </FormItem>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg h-12 min-w-[200px]"
                    >
                      {submitting ? (
                        <>
                          <i className="ri-loader-4-line mr-2 animate-spin"></i>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-line mr-2"></i>
                          Submit Tool
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <div className="mt-12">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="ri-information-line mr-3 text-blue-600"></i>
                  Submission Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Ensure your tool is functional and accessible</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Provide a clear and detailed description</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Include relevant tags for better discoverability</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>All submissions are reviewed within 24-48 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTool;
