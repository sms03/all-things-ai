
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'view_tool' | 'bookmark_tool' | 'review_tool' | 'compare_tools';
  tool_id?: string;
  metadata: any;
  created_at: string;
}

export const useUserActivity = () => {
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecentActivities();
    }
  }, [user]);

  const fetchRecentActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Cast the activity_type to the correct type
      const typedData = (data || []).map(activity => ({
        ...activity,
        activity_type: activity.activity_type as UserActivity['activity_type']
      }));
      
      setRecentActivities(typedData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackActivity = async (
    activityType: UserActivity['activity_type'],
    toolId?: string,
    metadata: any = {}
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          tool_id: toolId,
          metadata
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return {
    recentActivities,
    loading,
    trackActivity,
    refetch: fetchRecentActivities
  };
};
