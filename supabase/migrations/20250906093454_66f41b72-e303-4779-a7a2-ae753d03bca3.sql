-- Create initial admin user from the first registered user
-- This will assign admin role to the first user in the auth.users table

DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Get the first user from auth.users (if any exists)
    SELECT id INTO first_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- If a user exists and doesn't already have a role, assign admin
    IF first_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
        SELECT first_user_id, 'admin'::app_role, first_user_id, now()
        WHERE NOT EXISTS (
            SELECT 1 FROM public.user_roles WHERE user_id = first_user_id
        );
        
        RAISE NOTICE 'Admin role assigned to user: %', first_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users table';
    END IF;
END $$;