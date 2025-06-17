
-- Create enum for tool status
CREATE TYPE public.tool_status AS ENUM ('pending', 'approved', 'rejected', 'discontinued');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create tool moderation table
CREATE TABLE public.tool_moderation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
  moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status tool_status NOT NULL DEFAULT 'pending',
  previous_status tool_status,
  notes TEXT,
  moderated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add status column to tools table
ALTER TABLE public.tools ADD COLUMN status tool_status NOT NULL DEFAULT 'approved';
ALTER TABLE public.tools ADD COLUMN last_checked TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create tool analytics summary table for better performance
CREATE TABLE public.tool_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  searches_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tool_id, date)
);

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_analytics ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
  ON public.user_roles FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tool_moderation
CREATE POLICY "Moderators and admins can view moderation data" 
  ON public.tool_moderation FOR SELECT 
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Moderators and admins can create moderation records" 
  ON public.tool_moderation FOR INSERT 
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Moderators and admins can update moderation records" 
  ON public.tool_moderation FOR UPDATE 
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

-- RLS Policies for tool_analytics
CREATE POLICY "Admins and moderators can view analytics" 
  ON public.tool_analytics FOR SELECT 
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "System can insert analytics" 
  ON public.tool_analytics FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update analytics" 
  ON public.tool_analytics FOR UPDATE 
  USING (true);

-- Update tools table RLS to respect moderation status
DROP POLICY IF EXISTS "Tools are viewable by everyone" ON public.tools;
CREATE POLICY "Approved tools are viewable by everyone" 
  ON public.tools FOR SELECT 
  USING (status = 'approved' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Function to update tool analytics daily
CREATE OR REPLACE FUNCTION update_tool_analytics()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update analytics for tools with recent activity
  INSERT INTO public.tool_analytics (tool_id, date, views_count, clicks_count, bookmarks_count, searches_count)
  SELECT 
    t.id,
    CURRENT_DATE,
    COALESCE(views.count, 0),
    COALESCE(clicks.count, 0),
    COALESCE(bookmarks.count, 0),
    COALESCE(searches.count, 0)
  FROM public.tools t
  LEFT JOIN (
    SELECT tool_id, COUNT(*) as count
    FROM public.analytics_events 
    WHERE event_type = 'page_view' 
    AND DATE(created_at) = CURRENT_DATE
    GROUP BY tool_id
  ) views ON t.id = views.tool_id
  LEFT JOIN (
    SELECT tool_id, COUNT(*) as count
    FROM public.analytics_events 
    WHERE event_type = 'tool_click' 
    AND DATE(created_at) = CURRENT_DATE
    GROUP BY tool_id
  ) clicks ON t.id = clicks.tool_id
  LEFT JOIN (
    SELECT tool_id, COUNT(*) as count
    FROM public.bookmarks 
    WHERE DATE(created_at) = CURRENT_DATE
    GROUP BY tool_id
  ) bookmarks ON t.id = bookmarks.tool_id
  LEFT JOIN (
    SELECT clicked_tool_id as tool_id, COUNT(*) as count
    FROM public.search_queries 
    WHERE clicked_tool_id IS NOT NULL 
    AND DATE(created_at) = CURRENT_DATE
    GROUP BY clicked_tool_id
  ) searches ON t.id = searches.tool_id
  ON CONFLICT (tool_id, date) 
  DO UPDATE SET 
    views_count = EXCLUDED.views_count,
    clicks_count = EXCLUDED.clicks_count,
    bookmarks_count = EXCLUDED.bookmarks_count,
    searches_count = EXCLUDED.searches_count,
    updated_at = now();
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_tool_moderation_tool_id ON public.tool_moderation(tool_id);
CREATE INDEX idx_tool_moderation_status ON public.tool_moderation(status);
CREATE INDEX idx_tool_moderation_moderator_id ON public.tool_moderation(moderator_id);
CREATE INDEX idx_tool_analytics_tool_id ON public.tool_analytics(tool_id);
CREATE INDEX idx_tool_analytics_date ON public.tool_analytics(date);
CREATE INDEX idx_tools_status ON public.tools(status);
