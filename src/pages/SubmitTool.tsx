
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
  category: z.string().min(1, 'Please select a category'),
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
      category: '',
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
        .from('ai_tools')
        .insert({
          name: values.name,
          description: values.description,
          website: values.website,
          category: values.category,
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
    <div className="min-h-screen">
      <Background variant="gradient" />
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div ref={pageRef} className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back
            </Button>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6 tracking-tight">
              <i className="ri-add-circle-line mr-4"></i>
              Submit AI Tool
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
              Share an amazing AI tool with the community and help others discover powerful solutions
            </p>
          </div>

          {/* Form */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-white flex items-center justify-center">
                <i className="ri-file-add-line mr-3 text-blue-400"></i>
                Tool Information
              </CardTitle>
              <CardDescription className="text-white/60 text-lg">
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
                        <FormLabel className="text-white font-medium flex items-center">
                          <i className="ri-apps-line mr-2 text-blue-400"></i>
                          Tool Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter the AI tool name" 
                            {...field} 
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-12"
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
                      <FormItem>
                        <FormLabel className="text-white font-medium flex items-center">
                          <i className="ri-file-text-line mr-2 text-purple-400"></i>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this AI tool does and its key features..." 
                            {...field} 
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl min-h-[120px] resize-none"
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
                      <FormItem>
                        <FormLabel className="text-white font-medium flex items-center">
                          <i className="ri-links-line mr-2 text-green-400"></i>
                          Website URL
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com" 
                            {...field} 
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-green-400 focus:ring-green-400/20 rounded-xl h-12"
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center">
                            <i className="ri-folder-line mr-2 text-yellow-400"></i>
                            Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-yellow-400 focus:ring-yellow-400/20 rounded-xl h-12">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 rounded-xl">
                              {categories.map((category) => (
                                <SelectItem 
                                  key={category.slug} 
                                  value={category.slug}
                                  className="text-white hover:bg-white/10"
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
                        <FormItem>
                          <FormLabel className="text-white font-medium flex items-center">
                            <i className="ri-price-tag-3-line mr-2 text-pink-400"></i>
                            Pricing Model
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-pink-400 focus:ring-pink-400/20 rounded-xl h-12">
                                <SelectValue placeholder="Select pricing model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 rounded-xl">
                              <SelectItem value="free" className="text-white hover:bg-white/10">Free</SelectItem>
                              <SelectItem value="freemium" className="text-white hover:bg-white/10">Freemium</SelectItem>
                              <SelectItem value="paid" className="text-white hover:bg-white/10">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tags */}
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center">
                      <i className="ri-hashtag mr-2 text-cyan-400"></i>
                      Tags
                    </FormLabel>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Enter a tag..."
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-xl px-6 transition-all duration-300"
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
                              className="bg-white/10 border-white/30 text-white px-3 py-1 rounded-full flex items-center gap-2"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-400 transition-colors"
                              >
                                <i className="ri-close-line text-sm"></i>
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription className="text-white/50">
                      Add relevant tags to help users discover your tool (e.g., "productivity", "writing", "image generation")
                    </FormDescription>
                  </FormItem>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-8">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 min-w-[200px]"
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
        </div>
      </div>
    </div>
  );
};

export default SubmitTool;
