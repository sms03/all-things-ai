-- Fix security issue: Restrict analytics_events access to admins only
-- Drop the current overly permissive SELECT policy
DROP POLICY IF EXISTS "Analytics events are viewable by authenticated users for their" ON public.analytics_events;

-- Create a new restrictive policy that only allows admins and moderators to view analytics
CREATE POLICY "Only admins and moderators can view analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Keep the INSERT policy as is for tracking functionality
-- The existing "Anyone can insert analytics events" policy remains unchanged

-- Also update the search_queries table to be more restrictive for consistency
DROP POLICY IF EXISTS "Users can view their own search queries" ON public.search_queries;

CREATE POLICY "Users can view their own search queries or admins can view all" 
ON public.search_queries 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND auth.uid() IS NOT NULL) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);