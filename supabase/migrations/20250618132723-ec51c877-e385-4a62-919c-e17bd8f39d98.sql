
-- Reset all tool ratings to 0
UPDATE public.tools SET rating = 0;

-- Create a function to calculate and update tool ratings in real-time
CREATE OR REPLACE FUNCTION update_tool_rating_realtime()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Drop the existing trigger if it exists and create a new one
DROP TRIGGER IF EXISTS update_tool_rating_trigger ON public.reviews;

CREATE TRIGGER update_tool_rating_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_rating_realtime();

-- Create a function to get top-rated tools
CREATE OR REPLACE FUNCTION get_top_rated_tools(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  website TEXT,
  pricing TEXT,
  rating NUMERIC,
  tags TEXT[],
  category_id UUID,
  featured BOOLEAN,
  trending BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  status tool_status
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.name, t.description, t.website, t.pricing, t.rating, t.tags, 
         t.category_id, t.featured, t.trending, t.created_at, t.updated_at, t.status
  FROM public.tools t
  WHERE t.status = 'approved'
  ORDER BY t.rating DESC NULLS LAST, t.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create a daily job function to update tool rankings (this can be called by a cron job)
CREATE OR REPLACE FUNCTION update_daily_tool_rankings()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql;
