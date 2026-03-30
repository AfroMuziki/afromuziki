// frontend/src/hooks/realtime/useRealtimeNotifications.ts
import { useEffect } from 'react';
import { supabase } from '../../services/supabase/client';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../components/ui/Toast/Toast';

export const useRealtimeNotifications = () => {
  const { user } = useAuthStore();
  const { addNotification, setUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new;
          addNotification(notification);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for real-time notifications
          if (notification.type !== 'read') {
            showToast.info(notification.message);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
};
