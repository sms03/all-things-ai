
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Review {
  id: string;
  user_id: string;
  tool_id: string;
  rating: number;
  title?: string;
  content?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export interface ReviewVote {
  id: string;
  user_id: string;
  review_id: string;
  is_helpful: boolean;
}

export const useReviews = (toolId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    if (toolId) {
      fetchReviews();
      if (user) {
        fetchUserReview();
        fetchUserVotes();
      }
    }
  }, [toolId, user]);

  const fetchReviews = async () => {
    if (!toolId) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('tool_id', toolId)
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    if (!user || !toolId) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('tool_id', toolId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserReview(data || null);
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('review_votes')
        .select('review_id')
        .eq('user_id', user.id)
        .eq('is_helpful', true);

      if (error) throw error;
      setUserVotes(new Set(data?.map(v => v.review_id) || []));
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const submitReview = async (rating: number, title?: string, content?: string) => {
    if (!user || !toolId) return false;

    try {
      const reviewData = {
        user_id: user.id,
        tool_id: toolId,
        rating,
        title,
        content
      };

      if (userReview) {
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', userReview.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData);

        if (error) throw error;
      }

      await fetchReviews();
      await fetchUserReview();
      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      return false;
    }
  };

  const voteReview = async (reviewId: string, isHelpful: boolean) => {
    if (!user) return false;

    try {
      const isCurrentlyVoted = userVotes.has(reviewId);

      if (isCurrentlyVoted) {
        const { error } = await supabase
          .from('review_votes')
          .delete()
          .eq('user_id', user.id)
          .eq('review_id', reviewId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('review_votes')
          .upsert({
            user_id: user.id,
            review_id: reviewId,
            is_helpful: isHelpful
          });

        if (error) throw error;
      }

      await fetchReviews();
      await fetchUserVotes();
      return true;
    } catch (error) {
      console.error('Error voting on review:', error);
      return false;
    }
  };

  return {
    reviews,
    userReview,
    loading,
    userVotes,
    submitReview,
    voteReview,
    refetch: fetchReviews
  };
};
