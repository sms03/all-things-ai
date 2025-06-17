
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
import { Background } from '@/components/Background';
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
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
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
    <div className="min-h-screen relative overflow-hidden">
      <Background variant="gradient" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Navigation />
      
      <div className="pt-32 pb-20 relative z-10">
        <div ref={pageRef} className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 backdrop-blur-xl border border-white/20 group"
            >
              <i className="ri-arrow-left-line mr-2 group-hover:-translate-x-1 transition-transform duration-300"></i>
              Back
            </Button>
            
            <div className="relative">
              <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight">
                Submit AI Tool
              </h1>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
            </div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
              Share an amazing AI tool with the community and help others discover powerful solutions that shape the future
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
            
            <CardHeader className="text-center pb-8 relative z-10">
              <CardTitle className="text-3xl text-white flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <i className="ri-file-add-line text-white text-xl"></i>
                </div>
                Tool Information
              </CardTitle>
              <CardDescription className="text-white/60 text-lg">
                Fill out the details below to submit your AI tool for review by our community
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 relative z-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Tool Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-white font-medium flex items-center text-lg">
                          <i className="ri-apps-line mr-3 text-blue-400 text-xl"></i>
                          Tool Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter the AI tool name (e.g., ChatGPT, Midjourney)" 
                            {...field} 
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-14 text-lg transition-all duration-300 group-hover:bg-white/10"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-white font-medium flex items-center text-lg">
                          <i className="ri-file-text-line mr-3 text-purple-400 text-xl"></i>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this AI tool does, its key features, and how it helps users..." 
                            {...field} 
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl min-h-[140px] resize-none text-lg transition-all duration-300 group-hover:bg-white/10"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Website URL */}
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-white font-medium flex items-center text-lg">
                          <i className="ri-links-line mr-3 text-green-400 text-xl"></i>
                          Website URL
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            {...field} 
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-green-400 focus:ring-green-400/20 rounded-xl h-14 text-lg transition-all duration-300 group-hover:bg-white/10"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Category and Pricing Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="text-white font-medium flex items-center text-lg">
                            <i className="ri-folder-line mr-3 text-yellow-400 text-xl"></i>
                            Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-yellow-400 focus:ring-yellow-400/20 rounded-xl h-14 text-lg transition-all duration-300 group-hover:bg-white/10">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 rounded-xl">
                              {categories.map((category) => (
                                <SelectItem 
                                  key={category.id} 
                                  value={category.id}
                                  className="text-white hover:bg-white/10 text-lg py-3"
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Pricing */}
                    <FormField
                      control={form.control}
                      name="pricing"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="text-white font-medium flex items-center text-lg">
                            <i className="ri-price-tag-3-line mr-3 text-pink-400 text-xl"></i>
                            Pricing Model
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-pink-400 focus:ring-pink-400/20 rounded-xl h-14 text-lg transition-all duration-300 group-hover:bg-white/10">
                                <SelectValue placeholder="Select pricing model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 rounded-xl">
                              <SelectItem value="free" className="text-white hover:bg-white/10 text-lg py-3">
                                <div className="flex items-center">
                                  <i className="ri-gift-line mr-2 text-green-400"></i>
                                  Free
                                </div>
                              </SelectItem>
                              <SelectItem value="freemium" className="text-white hover:bg-white/10 text-lg py-3">
                                <div className="flex items-center">
                                  <i className="ri-star-half-line mr-2 text-yellow-400"></i>
                                  Freemium
                                </div>
                              </SelectItem>
                              <SelectItem value="paid" className="text-white hover:bg-white/10 text-lg py-3">
                                <div className="flex items-center">
                                  <i className="ri-vip-crown-line mr-2 text-purple-400"></i>
                                  Paid
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tags */}
                  <FormItem className="group">
                    <FormLabel className="text-white font-medium flex items-center text-lg">
                      <i className="ri-hashtag mr-3 text-cyan-400 text-xl"></i>
                      Tags
                    </FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Enter a tag (e.g., productivity, writing, AI agent)..."
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-14 text-lg transition-all duration-300 group-hover:bg-white/10"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                          className="bg-white/5 border-white/20 text-white hover:bg-white/20 hover:border-white/40 rounded-xl px-6 h-14 transition-all duration-300 hover:scale-105"
                        >
                          <i className="ri-add-line text-xl"></i>
                        </Button>
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-white/10 border-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 text-base hover:bg-white/20 transition-all duration-300"
                            >
                              <i className="ri-hashtag text-cyan-400"></i>
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-400 transition-colors ml-2"
                              >
                                <i className="ri-close-line text-lg"></i>
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription className="text-white/50 text-base">
                      Add relevant tags to help users discover your tool. Popular tags include: productivity, writing, image generation, AI agent, MCP server, automation
                    </FormDescription>
                  </FormItem>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-8">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-16 py-4 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0 min-w-[280px] relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center">
                        {submitting ? (
                          <>
                            <i className="ri-loader-4-line mr-3 animate-spin text-2xl"></i>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="ri-send-plane-line mr-3 text-2xl group-hover:translate-x-1 transition-transform duration-300"></i>
                            Submit Tool
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                <i className="ri-information-line mr-3 text-blue-400"></i>
                Submission Guidelines
              </h3>
              <div className="text-white/70 space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <i className="ri-check-line text-green-400 mt-1"></i>
                  <span>Ensure your tool is functional and accessible</span>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-check-line text-green-400 mt-1"></i>
                  <span>Provide a clear and detailed description</span>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-check-line text-green-400 mt-1"></i>
                  <span>Include relevant tags for better discoverability</span>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-check-line text-green-400 mt-1"></i>
                  <span>All submissions are reviewed within 24-48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTool;
