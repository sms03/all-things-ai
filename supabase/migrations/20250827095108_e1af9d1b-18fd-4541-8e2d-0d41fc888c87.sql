-- Remove duplicate tools, keeping the first one of each duplicate
WITH duplicates AS (
  SELECT name, MIN(created_at) as first_created
  FROM tools
  GROUP BY name
  HAVING COUNT(*) > 1
),
tools_to_keep AS (
  SELECT t.id
  FROM tools t
  INNER JOIN duplicates d ON t.name = d.name AND t.created_at = d.first_created
),
tools_to_delete AS (
  SELECT t.id
  FROM tools t
  INNER JOIN duplicates d ON t.name = d.name
  WHERE t.id NOT IN (SELECT id FROM tools_to_keep)
)
DELETE FROM tools WHERE id IN (SELECT id FROM tools_to_delete);

-- Reset all tool ratings to 0
UPDATE tools SET rating = 0;

-- Update the get_top_rated_tools function to only return tools with ratings > 0
CREATE OR REPLACE FUNCTION public.get_top_rated_tools(limit_count integer DEFAULT 10)
RETURNS TABLE(id uuid, name text, description text, website text, pricing text, rating numeric, tags text[], category_id uuid, featured boolean, trending boolean, created_at timestamp with time zone, updated_at timestamp with time zone, status tool_status)
LANGUAGE plpgsql
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