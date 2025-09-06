-- Fix user_roles table to ensure one role per user
-- First, remove any duplicate roles for users (keep the most recent)
WITH ranked_roles AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY assigned_at DESC) as rn
  FROM public.user_roles
)
DELETE FROM public.user_roles 
WHERE id IN (
  SELECT id FROM ranked_roles WHERE rn > 1
);

-- Drop existing constraint if it exists
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Add unique constraint on user_id only (one role per user)
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Create function to assign role (replaces existing role if any)
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id uuid,
  _role app_role,
  _assigned_by uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (_user_id, _role, _assigned_by)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = EXCLUDED.role,
    assigned_by = EXCLUDED.assigned_by,
    assigned_at = now();
END;
$$;