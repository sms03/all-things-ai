import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_time: string;
  ai_tools_used: string[];
  tech_stack: string[];
  business_potential: 'High' | 'Medium' | 'Low';
  market_size?: string;
  target_audience?: string;
  monetization_ideas?: string[];
  similar_successful_companies?: string[];
  required_skills: string[];
  learning_resources?: string[];
  featured: boolean;
  trending: boolean;
  category: string;
  tags: string[];
  upvotes_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ProjectIdeaCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export const useProjectIdeas = () => {
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [categories, setCategories] = useState<ProjectIdeaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotedIdeas, setUpvotedIdeas] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
    if (user) {
      fetchUserUpvotes();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch project ideas
      const { data: ideasData, error: ideasError } = await supabase
        .from('project_ideas')
        .select('*')
        .order('featured', { ascending: false })
        .order('trending', { ascending: false })
        .order('upvotes_count', { ascending: false });

      if (ideasError) throw ideasError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('project_idea_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      setProjectIdeas((ideasData as ProjectIdea[]) || []);
      setCategories((categoriesData as ProjectIdeaCategory[]) || []);
    } catch (error) {
      console.error('Error fetching project ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserUpvotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('project_idea_upvotes')
        .select('project_idea_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setUpvotedIdeas(new Set(data?.map(upvote => upvote.project_idea_id) || []));
    } catch (error) {
      console.error('Error fetching user upvotes:', error);
    }
  };

  const upvoteIdea = async (ideaId: string) => {
    if (!user) return;

    try {
      const isCurrentlyUpvoted = upvotedIdeas.has(ideaId);

      if (isCurrentlyUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('project_idea_upvotes')
          .delete()
          .eq('user_id', user.id)
          .eq('project_idea_id', ideaId);

        if (error) throw error;

        setUpvotedIdeas(prev => {
          const newSet = new Set(prev);
          newSet.delete(ideaId);
          return newSet;
        });

        // Update local state
        setProjectIdeas(prev => prev.map(idea => 
          idea.id === ideaId 
            ? { ...idea, upvotes_count: Math.max(0, idea.upvotes_count - 1) }
            : idea
        ));
      } else {
        // Add upvote
        const { error } = await supabase
          .from('project_idea_upvotes')
          .insert({
            user_id: user.id,
            project_idea_id: ideaId
          });

        if (error) throw error;

        setUpvotedIdeas(prev => new Set([...prev, ideaId]));

        // Update local state
        setProjectIdeas(prev => prev.map(idea => 
          idea.id === ideaId 
            ? { ...idea, upvotes_count: idea.upvotes_count + 1 }
            : idea
        ));
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  const isUpvoted = (ideaId: string) => {
    return upvotedIdeas.has(ideaId);
  };

  const getIdeasByCategory = (categoryName: string) => {
    return projectIdeas.filter(idea => idea.category === categoryName);
  };

  const getFeaturedIdeas = () => {
    return projectIdeas.filter(idea => idea.featured);
  };

  const getTrendingIdeas = () => {
    return projectIdeas.filter(idea => idea.trending);
  };

  return {
    projectIdeas,
    categories,
    loading,
    upvoteIdea,
    isUpvoted,
    getIdeasByCategory,
    getFeaturedIdeas,
    getTrendingIdeas,
    refetch: fetchData
  };
};