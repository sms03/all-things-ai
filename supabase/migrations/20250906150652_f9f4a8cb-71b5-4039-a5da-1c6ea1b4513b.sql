-- Allow admins to view all profiles for user management
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update any profile for user management
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'));

-- Create index for better performance on email lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Ensure the assign_user_role function handles the unique constraint properly
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id uuid, _role app_role, _assigned_by uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update user role
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (_user_id, _role, _assigned_by)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = EXCLUDED.role,
    assigned_by = EXCLUDED.assigned_by,
    assigned_at = now();
    
  -- Also ensure this gets logged
  RAISE NOTICE 'Role % assigned to user % by %', _role, _user_id, _assigned_by;
END;
$$;