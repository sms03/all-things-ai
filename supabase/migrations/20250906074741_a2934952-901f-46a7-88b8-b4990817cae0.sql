-- Fix security issues with contact_inquiries table RLS policies

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Users can create inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.contact_inquiries;

-- Create secure RLS policies for contact_inquiries table
-- Policy 1: Users can only create inquiries for themselves (and user_id must be set)
CREATE POLICY "Users can create their own inquiries" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id
);

-- Policy 2: Users can only view their own inquiries (excluding null user_id records)
CREATE POLICY "Users can view their own inquiries" 
ON public.contact_inquiries 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  user_id IS NOT NULL AND 
  auth.uid() = user_id
);

-- Policy 3: Admins and moderators can view all inquiries for management purposes
CREATE POLICY "Admins and moderators can view all inquiries" 
ON public.contact_inquiries 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

-- Policy 4: Admins and moderators can update inquiry status
CREATE POLICY "Admins and moderators can update inquiries" 
ON public.contact_inquiries 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

-- Policy 5: Only admins can delete inquiries (for data management)
CREATE POLICY "Admins can delete inquiries" 
ON public.contact_inquiries 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Make user_id NOT NULL to prevent security holes with null values
-- First, update any existing null user_id records (if any exist)
UPDATE public.contact_inquiries 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Now make the column NOT NULL
ALTER TABLE public.contact_inquiries 
ALTER COLUMN user_id SET NOT NULL;