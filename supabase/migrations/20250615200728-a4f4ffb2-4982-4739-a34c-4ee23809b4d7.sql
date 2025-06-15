
-- Create reviews table for user reviews and ratings
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- Create review helpfulness tracking
CREATE TABLE public.review_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Create tool comparisons table
CREATE TABLE public.tool_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  tool_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user activity tracking
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('view_tool', 'bookmark_tool', 'review_tool', 'compare_tools')),
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own reviews" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for review votes
CREATE POLICY "Review votes are viewable by everyone" 
  ON public.review_votes FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own review votes" 
  ON public.review_votes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review votes" 
  ON public.review_votes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own review votes" 
  ON public.review_votes FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for tool comparisons
CREATE POLICY "Users can view their own comparisons" 
  ON public.tool_comparisons FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparisons" 
  ON public.tool_comparisons FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons" 
  ON public.tool_comparisons FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons" 
  ON public.tool_comparisons FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for user activities
CREATE POLICY "Users can view their own activities" 
  ON public.user_activities FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
  ON public.user_activities FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to update tool rating based on reviews
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tools 
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.reviews 
    WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
  )
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tool rating when reviews change
CREATE TRIGGER update_tool_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_rating();

-- Function to update review helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.reviews 
  SET helpful_count = (
    SELECT COUNT(*)
    FROM public.review_votes 
    WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) AND is_helpful = true
  )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update helpful count when votes change
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.review_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();
