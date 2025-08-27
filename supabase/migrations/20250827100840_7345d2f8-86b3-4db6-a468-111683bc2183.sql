-- Phase 1: Create Initial Admin User
-- Insert admin role for existing user (Shivam Salunkhe)
INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
VALUES ('724d79ff-4fb1-463b-b06a-2420b02e8b82', 'admin', '724d79ff-4fb1-463b-b06a-2420b02e8b82', now())
ON CONFLICT (user_id, role) DO NOTHING;

-- Phase 2: Secure Database Functions - Add SET search_path = '' to prevent schema poisoning
CREATE OR REPLACE FUNCTION public.update_tool_rating_realtime()
RETURNS trigger
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Calculate the new average rating for the tool
  UPDATE public.tools 
  SET rating = (
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
    FROM public.reviews 
    WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_preferences()
RETURNS trigger
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_tool_rating()
RETURNS trigger
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
language sql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_top_rated_tools(limit_count integer DEFAULT 10)
RETURNS TABLE(id uuid, name text, description text, website text, pricing text, rating numeric, tags text[], category_id uuid, featured boolean, trending boolean, created_at timestamp with time zone, updated_at timestamp with time zone, status tool_status)
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT t.id, t.name, t.description, t.website, t.pricing, t.rating, t.tags, 
         t.category_id, t.featured, t.trending, t.created_at, t.updated_at, t.status
  FROM public.tools t
  WHERE t.status = 'approved' AND t.rating > 0
  ORDER BY t.rating DESC NULLS LAST, t.created_at DESC
  LIMIT limit_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_daily_tool_rankings()
RETURNS void
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Update trending status based on recent ratings and activity
  UPDATE public.tools 
  SET trending = (
    rating >= 4.0 AND 
    updated_at >= NOW() - INTERVAL '7 days' AND
    (SELECT COUNT(*) FROM public.reviews WHERE tool_id = tools.id AND created_at >= NOW() - INTERVAL '7 days') >= 3
  );
  
  -- Update featured status for top-rated tools
  UPDATE public.tools 
  SET featured = (
    rating >= 4.5 AND 
    (SELECT COUNT(*) FROM public.reviews WHERE tool_id = tools.id) >= 5
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS trigger
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_tool_analytics()
RETURNS void
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
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
$function$;