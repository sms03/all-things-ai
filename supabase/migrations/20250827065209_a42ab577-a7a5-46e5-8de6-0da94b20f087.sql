-- Remove the overly permissive policy that allows users to view their own analytics events
DROP POLICY IF EXISTS "Analytics events are viewable by authenticated users for their" ON public.analytics_events;

-- The restrictive policy "Only admins and moderators can view analytics events" will remain active
-- This ensures only admins and moderators can access user tracking data