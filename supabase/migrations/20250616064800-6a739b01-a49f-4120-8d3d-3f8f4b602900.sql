
-- Enable trigram extension first
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create analytics tracking table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'tool_click', 'search', 'filter_applied', 'bookmark_added', 'review_submitted')),
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table for recommendations
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferred_categories UUID[] DEFAULT '{}',
  preferred_pricing TEXT[] DEFAULT '{}',
  preferred_tags TEXT[] DEFAULT '{}',
  interaction_score JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create search queries table for analytics
CREATE TABLE public.search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  clicked_tool_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analytics tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_events
CREATE POLICY "Analytics events are viewable by authenticated users for their own data" 
  ON public.analytics_events FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert analytics events" 
  ON public.analytics_events FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for search_queries
CREATE POLICY "Users can view their own search queries" 
  ON public.search_queries FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert search queries" 
  ON public.search_queries FOR INSERT 
  WITH CHECK (true);

-- Function to update user preferences based on interactions
CREATE OR REPLACE FUNCTION update_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user preferences based on tool interactions
  IF NEW.tool_id IS NOT NULL AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.user_preferences (user_id, interaction_score)
    VALUES (NEW.user_id, jsonb_build_object(NEW.tool_id::text, 1))
    ON CONFLICT (user_id)
    DO UPDATE SET 
      interaction_score = COALESCE(user_preferences.interaction_score, '{}'::jsonb) || 
                         jsonb_build_object(NEW.tool_id::text, 
                           COALESCE((user_preferences.interaction_score->>NEW.tool_id::text)::integer, 0) + 1),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update preferences on user activities
CREATE TRIGGER update_user_preferences_trigger
  AFTER INSERT ON public.user_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences();

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_tool_id ON public.analytics_events(tool_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_search_queries_user_id ON public.search_queries(user_id);
CREATE INDEX idx_search_queries_created_at ON public.search_queries(created_at);
CREATE INDEX idx_tools_name_trgm ON public.tools USING gin(name gin_trgm_ops);
CREATE INDEX idx_tools_description_trgm ON public.tools USING gin(description gin_trgm_ops);
CREATE INDEX idx_tools_tags_gin ON public.tools USING gin(tags);
