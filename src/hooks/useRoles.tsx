
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setCurrentUserRole(data?.role || 'user');
    } catch (error) {
      console.error('Error fetching current user role:', error);
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
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role,
          assigned_by: user.id
        });

      if (error) throw error;
      
      await fetchUserRoles();
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
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
    isAdmin,
    isModerator,
    refetch: fetchUserRoles
  };
};
