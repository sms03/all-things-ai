import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  assigned_by: string | null;
  assigned_at: string;
}

export const useRoles = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCurrentUserRole();
      fetchUserRoles();
    }
  }, [user]);

  const fetchCurrentUserRole = async () => {
    if (!user) {
      setCurrentUserRole('user');
      setLoading(false);
      return;
    }

    try {
      // Use RLS-safe RPC to determine admin role
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });

      if (error) throw error;
      setCurrentUserRole(data ? 'admin' : 'user');
    } catch (error) {
      console.error('Error fetching current user role via RPC:', error);
      setCurrentUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const assignRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc('assign_user_role', {
        _user_id: userId,
        _role: role,
        _assigned_by: user.id,
      });

      if (error) throw error;
      
      await fetchUserRoles();
      // Refresh current user's role if they were affected
      if (userId === user.id) {
        await fetchCurrentUserRole();
      }
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      return false;
    }
  };

  const assignRoleByEmail = async (email: string, role: 'admin' | 'moderator' | 'user') => {
    if (!user) return false;

    try {
      // First, find the user by email in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (profileError) {
        console.error('Error finding user by email:', profileError);
        return false;
      }

      if (!profile) {
        console.error('User not found with email:', email);
        return false;
      }

      // Use RPC to assign role directly
      const { error: assignError } = await supabase.rpc('assign_user_role', {
        _user_id: profile.id,
        _role: role,
        _assigned_by: user.id,
      });

      if (assignError) {
        console.error('Error assigning role via RPC:', assignError);
        return false;
      }

      // Refresh data after successful assignment
      await fetchUserRoles();
      await fetchCurrentUserRole();
      return true;
    } catch (error) {
      console.error('Error assigning role by email:', error);
      return false;
    }
  };

  const isAdmin = () => currentUserRole === 'admin';
  const isModerator = () => currentUserRole === 'moderator' || currentUserRole === 'admin';

  return {
    userRoles,
    currentUserRole,
    loading,
    assignRole,
    assignRoleByEmail,
    isAdmin,
    isModerator,
    refetch: fetchUserRoles
  };
};
